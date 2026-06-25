import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Copy, Check, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportToCSV } from '../utils/helpers';

function SkeletonRow() {
  return (
    <tr>
      {[40, 48, 180, 100, 100, 60].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className="skeleton h-4 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

function RankBadge({ rank }) {
  const colors = {
    1: { bg: 'rgba(245,197,24,0.15)', text: '#F5C518', border: 'rgba(245,197,24,0.3)' },
    2: { bg: 'rgba(192,192,192,0.15)', text: '#C0C0C0', border: 'rgba(192,192,192,0.3)' },
    3: { bg: 'rgba(205,127,50,0.15)', text: '#CD7F32', border: 'rgba(205,127,50,0.3)' },
  };
  const c = colors[rank] || { bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' };
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {rank}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-white/70">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

const PAGE_SIZE = 10;

export default function MoviesTable({ movies, loading }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('rank');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = [...movies];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(m => m.title.toLowerCase().includes(q) || String(m.rank).includes(q));
    }
    data.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey.includes('Gross')) {
        av = parseFloat((av || '0').replace(/[$M,K]/g, '')) || 0;
        bv = parseFloat((bv || '0').replace(/[$M,K]/g, '')) || 0;
      }
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [movies, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  function SortIcon({ col }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-neon-yellow" /> : <ChevronDown className="w-3 h-3 text-neon-yellow" />;
  }

  const cols = [
    { key: 'rank', label: 'Rank', w: 'w-16' },
    { key: null, label: 'Poster', w: 'w-16' },
    { key: 'title', label: 'Movie', w: '' },
    { key: 'weekendGross', label: 'Weekend', w: 'w-32' },
    { key: 'totalGross', label: 'Total Gross', w: 'w-32' },
    { key: 'weeks', label: 'Weeks', w: 'w-20' },
    { key: null, label: 'Links', w: 'w-24' },
  ];

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/5">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-bold text-white">Box Office Rankings</h2>
          <p className="text-xs text-white/30 mt-0.5">{filtered.length} movies</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search movies..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder-white/30 focus:outline-none focus:border-neon-yellow/30 transition-colors"
            />
          </div>
          <button onClick={() => exportToCSV(movies)} className="btn-secondary text-xs whitespace-nowrap">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {cols.map(col => (
                <th key={col.label}
                  onClick={() => col.key && toggleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider ${col.w} ${col.key ? 'cursor-pointer hover:text-white/60 select-none' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key && <SortIcon col={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(8).fill(0).map((_, i) => <SkeletonRow key={i} />)
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-white/30">
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  No movies found
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="wait">
                {paginated.map((movie, i) => (
                  <motion.tr
                    key={movie._id || movie.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row-hover border-b border-white/[0.03] last:border-0"
                  >
                    <td className="px-4 py-4">
                      <RankBadge rank={movie.rank} />
                    </td>
                    <td className="px-4 py-4">
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title}
                          className="w-10 h-14 object-cover rounded-lg border border-white/10"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-14 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                          <span className="text-white/20 text-xs">?</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white text-sm leading-tight">{movie.title}</div>
                      <div className="text-xs text-white/30 mt-0.5 font-mono">#{movie.rank} this week</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-neon-yellow font-mono font-semibold text-sm">{movie.weekendGross}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-white/70 font-mono text-sm">{movie.totalGross}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 text-white/50 border border-white/8">
                        {movie.weeks}w
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {movie.imdbUrl && (
                          <a href={movie.imdbUrl} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-neon-yellow">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {movie.imdbUrl && <CopyButton text={movie.imdbUrl} />}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-white/30">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg glass hover:bg-white/10 disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === page ? 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30' : 'glass hover:bg-white/10 text-white/50'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg glass hover:bg-white/10 disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
