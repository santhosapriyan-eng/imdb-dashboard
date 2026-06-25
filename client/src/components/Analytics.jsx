import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts';
import { parseGross } from '../utils/helpers';

const COLORS = ['#F5C518', '#FF6B2B', '#A855F7', '#06B6D4', '#10B981', '#F43F5E', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 border border-white/10 text-xs">
      <div className="font-semibold text-white mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-white/50">{p.name}:</span>
          <span className="text-white font-mono">${p.value.toFixed(1)}M</span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics({ movies }) {
  const data = movies.slice(0, 8).map(m => ({
    name: m.title.length > 14 ? m.title.slice(0, 12) + '…' : m.title,
    fullName: m.title,
    weekend: parseGross(m.weekendGross) / 1_000_000,
    total: parseGross(m.totalGross) / 1_000_000,
    rank: m.rank,
  }));

  return (
    <div className="space-y-6">
      {/* Weekend Gross Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 border border-white/5"
      >
        <div className="mb-6">
          <h3 className="font-bold text-white">Weekend Gross Comparison</h3>
          <p className="text-xs text-white/30 mt-1">Top movies by weekend box office ($M)</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="weekend" name="Weekend Gross" radius={[6, 6, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.85}
                    style={{ filter: `drop-shadow(0 0 8px ${COLORS[i % COLORS.length]}40)` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Total Gross Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/5"
      >
        <div className="mb-6">
          <h3 className="font-bold text-white">Total Gross Comparison</h3>
          <p className="text-xs text-white/30 mt-1">Cumulative earnings per movie ($M)</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="weekendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5C518" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F5C518" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" name="Total Gross" stroke="#A855F7" fill="url(#totalGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="weekend" name="Weekend Gross" stroke="#F5C518" fill="url(#weekendGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Horizontal ranking bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/5"
      >
        <div className="mb-6">
          <h3 className="font-bold text-white">Gross Breakdown</h3>
          <p className="text-xs text-white/30 mt-1">Visual comparison relative to #1</p>
        </div>
        <div className="space-y-4">
          {data.map((m, i) => {
            const maxTotal = data[0]?.total || 1;
            const pctTotal = (m.total / maxTotal) * 100;
            const pctWeekend = (m.weekend / maxTotal) * 100;
            return (
              <div key={m.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white/30 w-4">#{m.rank}</span>
                    <span className="text-sm text-white font-medium">{m.fullName.length > 25 ? m.fullName.slice(0, 22) + '…' : m.fullName}</span>
                  </div>
                  <span className="text-xs font-mono text-white/40">${m.total.toFixed(1)}M</span>
                </div>
                <div className="relative h-5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pctTotal}%` }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0 rounded-full opacity-30"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pctWeekend}%` }}
                    transition={{ delay: 0.5 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-3 h-1.5 rounded-full bg-neon-yellow" />
            Weekend Gross
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-3 h-1.5 rounded-full bg-neon-purple/60" />
            Total Gross
          </div>
        </div>
      </motion.div>
    </div>
  );
}
