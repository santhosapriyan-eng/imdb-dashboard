import { motion } from 'framer-motion';
import { Database, Server, HardDrive, Clock, RefreshCw } from 'lucide-react';
import { timeAgo } from '../utils/helpers';

export default function DatabaseView({ movies, lastUpdated, onRefresh, refreshing }) {
  const totalRecords = movies.length;
  const dbSize = (JSON.stringify(movies).length / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      {/* DB Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Database, label: 'Total Records', value: totalRecords, sub: 'Movies in DB', color: '#F5C518' },
          { icon: HardDrive, label: 'Data Size', value: `~${dbSize} KB`, sub: 'Estimated size', color: '#A855F7' },
          { icon: Clock, label: 'Last Sync', value: timeAgo(lastUpdated), sub: lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never', color: '#06B6D4' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="stat-card" style={{ borderColor: `${item.color}15` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)` }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">{item.label}</div>
            <div className="font-bold text-xl text-white">{item.value}</div>
            <div className="text-xs text-white/30 mt-1 truncate">{item.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Schema */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-neon-yellow/60" />
              Schema: movies
            </h3>
            <p className="text-xs text-white/30 mt-1">MongoDB / Mongoose document structure</p>
          </div>
        </div>
        <div className="bg-dark-900 rounded-xl p-5 font-mono text-sm border border-white/5 overflow-x-auto">
          <pre className="text-white/70 leading-relaxed">{`{
  <span style="color:#F5C518">_id</span>: <span style="color:#06B6D4">ObjectId</span>,         <span style="color:#444">// MongoDB document ID</span>
  <span style="color:#F5C518">rank</span>: <span style="color:#A855F7">Number</span>,          <span style="color:#444">// 1–10 box office position</span>
  <span style="color:#F5C518">title</span>: <span style="color:#A855F7">String</span>,         <span style="color:#444">// Movie title</span>
  <span style="color:#F5C518">weekendGross</span>: <span style="color:#A855F7">String</span>,  <span style="color:#444">// e.g. "$154.2M"</span>
  <span style="color:#F5C518">totalGross</span>: <span style="color:#A855F7">String</span>,    <span style="color:#444">// e.g. "$498.9M"</span>
  <span style="color:#F5C518">weeks</span>: <span style="color:#A855F7">Number</span>,          <span style="color:#444">// Weeks in release</span>
  <span style="color:#F5C518">imdbUrl</span>: <span style="color:#A855F7">String</span>,       <span style="color:#444">// IMDb movie URL</span>
  <span style="color:#F5C518">poster</span>: <span style="color:#A855F7">String</span>,         <span style="color:#444">// Poster image URL</span>
  <span style="color:#F5C518">createdAt</span>: <span style="color:#06B6D4">Date</span>,       <span style="color:#444">// First scraped</span>
  <span style="color:#F5C518">updatedAt</span>: <span style="color:#06B6D4">Date</span>        <span style="color:#444">// Last updated</span>
}`}</pre>
        </div>
      </motion.div>

      {/* API Endpoints */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-bold text-white mb-5">API Endpoints</h3>
        <div className="space-y-3">
          {[
            { method: 'GET', path: '/api/movies', desc: 'Fetch all movies from DB', color: '#10B981' },
            { method: 'GET', path: '/api/movies/scrape', desc: 'Scrape IMDb and save to DB', color: '#F5C518' },
            { method: 'POST', path: '/api/movies/refresh', desc: 'Clear DB and re-scrape all', color: '#FF6B2B' },
            { method: 'GET', path: '/api/movies/:id', desc: 'Fetch single movie by ID', color: '#10B981' },
            { method: 'GET', path: '/api/health', desc: 'Server + DB health check', color: '#06B6D4' },
          ].map(ep => (
            <div key={ep.path} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xs font-bold font-mono px-2 py-1 rounded-md min-w-[44px] text-center"
                style={{ background: `${ep.color}15`, color: ep.color, border: `1px solid ${ep.color}30` }}>
                {ep.method}
              </span>
              <span className="font-mono text-sm text-white/80 flex-1">{ep.path}</span>
              <span className="text-xs text-white/30 hidden sm:block">{ep.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Raw data preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white">Raw Data Preview</h3>
          <button onClick={onRefresh} disabled={refreshing} className="btn-secondary text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Re-scrape
          </button>
        </div>
        <div className="bg-dark-900 rounded-xl p-5 font-mono text-xs border border-white/5 max-h-64 overflow-y-auto">
          <pre className="text-white/50 leading-relaxed">
            {JSON.stringify(movies.slice(0, 2), null, 2)}
          </pre>
        </div>
      </motion.div>
    </div>
  );
}
