import { motion } from 'framer-motion';
import { Film, Trophy, TrendingUp, Clock } from 'lucide-react';
import { timeAgo } from '../utils/helpers';

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  return (
    <span className="font-bold text-2xl text-white">
      {prefix}{value}{suffix}
    </span>
  );
}

export default function StatsCards({ movies, lastUpdated }) {
  const topMovie = movies[0];
  const highestWeekend = movies.reduce((max, m) => {
    const v = parseFloat((m.weekendGross || '0').replace(/[$M,]/g, ''));
    const maxV = parseFloat((max?.weekendGross || '0').replace(/[$M,]/g, ''));
    return v > maxV ? m : max;
  }, movies[0]);

  const cards = [
    {
      icon: Film,
      label: 'Total Movies',
      value: movies.length,
      sub: 'In database',
      color: '#F5C518',
      gradient: 'from-yellow-500/10 to-transparent',
    },
    {
      icon: Trophy,
      label: '#1 Movie',
      value: topMovie ? topMovie.title.split(' ').slice(0, 2).join(' ') : '—',
      sub: topMovie ? `Weekend: ${topMovie.weekendGross}` : 'No data',
      color: '#FF6B2B',
      gradient: 'from-orange-500/10 to-transparent',
    },
    {
      icon: TrendingUp,
      label: 'Top Weekend Gross',
      value: highestWeekend ? highestWeekend.weekendGross : '—',
      sub: highestWeekend ? highestWeekend.title : 'No data',
      color: '#A855F7',
      gradient: 'from-purple-500/10 to-transparent',
    },
    {
      icon: Clock,
      label: 'Last Updated',
      value: timeAgo(lastUpdated),
      sub: lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never',
      color: '#06B6D4',
      gradient: 'from-cyan-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="stat-card group cursor-default"
          style={{ borderColor: `${card.color}15` }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${card.color}40, transparent)` }} />
          
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div className="w-2 h-2 rounded-full animate-pulse-slow"
                style={{ background: card.color, boxShadow: `0 0 8px ${card.color}` }} />
            </div>
            
            <div className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-1">{card.label}</div>
            <div className="font-bold text-xl text-white leading-tight truncate">{card.value}</div>
            <div className="text-xs text-white/30 mt-1 truncate">{card.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
