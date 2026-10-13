export const fmt = n => new Intl.NumberFormat('id-ID').format(n || 0);
export const statusClass = s => `pill pill-${String(s).toLowerCase().replaceAll(' ', '-')}`;
