export function parseGross(grossStr) {
  if (!grossStr || grossStr === 'N/A') return 0;
  const cleaned = grossStr.replace(/[$,\s]/g, '');
  if (cleaned.endsWith('M')) return parseFloat(cleaned) * 1_000_000;
  if (cleaned.endsWith('K')) return parseFloat(cleaned) * 1_000;
  return parseFloat(cleaned) || 0;
}

export function formatGross(amount) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export function exportToCSV(movies) {
  const headers = ['Rank', 'Title', 'Weekend Gross', 'Total Gross', 'Weeks', 'IMDb URL'];
  const rows = movies.map(m => [m.rank, m.title, m.weekendGross, m.totalGross, m.weeks, m.imdbUrl]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `imdb-boxoffice-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function timeAgo(date) {
  if (!date) return 'Never';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
