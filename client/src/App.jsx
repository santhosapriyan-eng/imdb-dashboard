import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Sun, Moon, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import StatsCards from './components/StatsCards';
import MoviesTable from './components/MoviesTable';
import Analytics from './components/Analytics';
import DatabaseView from './components/DatabaseView';
import { fetchMovies, refreshMovies } from './utils/api';

const AUTO_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 min

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const autoRefreshTimer = useRef(null);

  const loadMovies = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const res = await fetchMovies();
      const data = res.data.data || [];
      setMovies(data);
      if (data.length > 0) {
        setLastUpdated(data[0].updatedAt || data[0].createdAt || new Date().toISOString());
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load movies. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await refreshMovies();
      setMovies(res.data.data || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Refresh failed. Check server connection.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Auto-refresh
  useEffect(() => {
    autoRefreshTimer.current = setInterval(() => {
      if (!refreshing) handleRefresh();
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(autoRefreshTimer.current);
  }, [handleRefresh, refreshing]);

  // Online/offline detection
  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, []);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.style.background = darkMode ? '#080811' : '#f1f5f9';
  }, [darkMode]);

  const sections = {
    dashboard: (
      <div className="space-y-6">
        <Hero onRefresh={handleRefresh} refreshing={refreshing} lastUpdated={lastUpdated} onViewDB={() => setActiveSection('database')} />
        <StatsCards movies={movies} lastUpdated={lastUpdated} />
        <MoviesTable movies={movies} loading={loading} />
      </div>
    ),
    movies: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Top Movies</h2>
          <p className="text-white/40 text-sm">Current US box office rankings</p>
        </div>
        <MoviesTable movies={movies} loading={loading} />
      </div>
    ),
    analytics: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Analytics</h2>
          <p className="text-white/40 text-sm">Box office performance visualized</p>
        </div>
        <Analytics movies={movies} />
      </div>
    ),
    database: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Database</h2>
          <p className="text-white/40 text-sm">MongoDB schema, API endpoints, and raw data</p>
        </div>
        <DatabaseView movies={movies} lastUpdated={lastUpdated} onRefresh={handleRefresh} refreshing={refreshing} />
      </div>
    ),
  };

  return (
    <div className={`min-h-screen aurora-bg ${darkMode ? '' : 'light'}`}>
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-white/5 px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block">
            <span className="text-sm text-white/40 font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Connection status */}
            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
              isOnline
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              className="p-2 rounded-xl glass hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-6 mt-4 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-400 text-xs">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {sections[activeSection]}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-white/20">
          <span>IMDb Box Office Dashboard</span>
          <span className="font-mono">Data from imdb.com</span>
        </footer>
      </div>
    </div>
  );
}
