import { motion } from 'framer-motion';
import { RefreshCw, Database, Zap, Clock } from 'lucide-react';
import { timeAgo } from '../utils/helpers';

export default function Hero({ onRefresh, refreshing, lastUpdated, onViewDB }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl glass border border-white/5 p-8 md:p-10"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #F5C518 0%, transparent 70%)' }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #A855F7 0%, transparent 70%)' }} />
      </div>

      <div className="relative">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live Box Office Data
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
          IMDb US{' '}
          <span style={{
            background: 'linear-gradient(135deg, #F5C518, #FF6B2B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Top 10
          </span>{' '}
          Movies
        </h1>
        <p className="text-white/50 text-base md:text-lg max-w-xl mb-8">
          Real-time box office data scraped from IMDb. Updated every 30 minutes with weekend gross, total earnings, and rankings.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="btn-primary"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button onClick={onViewDB} className="btn-secondary">
            <Database className="w-4 h-4" />
            View Database
          </button>
          <div className="flex items-center gap-2 text-xs text-white/30 ml-2">
            <Clock className="w-3.5 h-3.5" />
            Last updated: {timeAgo(lastUpdated)}
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/5">
          {[
            { label: 'Data Source', value: 'IMDb.com', icon: Zap },
            { label: 'Update Frequency', value: 'Every 30 min', icon: Clock },
            { label: 'Tech Stack', value: 'React + Node + MongoDB', icon: Database },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <item.icon className="w-3.5 h-3.5 text-neon-yellow/60" />
              <span className="text-xs text-white/30">{item.label}:</span>
              <span className="text-xs text-white/60 font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
