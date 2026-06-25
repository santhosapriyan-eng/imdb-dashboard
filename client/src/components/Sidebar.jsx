import { motion } from 'framer-motion';
import { Film, BarChart2, Database, RefreshCw, Settings, TrendingUp, Home, X } from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'movies', icon: Film, label: 'Top Movies' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'database', icon: Database, label: 'Database' },
];

export default function Sidebar({ activeSection, onNavigate, onRefresh, refreshing, mobileOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <motion.aside
        initial={false}
        className={`
          fixed top-0 left-0 h-full z-50 w-64
          flex flex-col
          glass-strong border-r border-white/5
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F5C518, #FF6B2B)' }}>
                <Film className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">BoxOffice</div>
                <div className="text-xs text-white/30 font-mono">IMDb Dashboard</div>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-white/20 uppercase tracking-widest px-4 mb-3">Menu</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose(); }}
              className={`sidebar-item w-full ${activeSection === item.id ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Refresh */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="btn-primary w-full justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <div className="text-xs text-white/20 text-center">Auto-refresh every 30 min</div>
        </div>
      </motion.aside>
    </>
  );
}
