export const shortage = (expected, actual) => Math.max(0, expected - actual);
export function claimSummary(claim) {
  const fulfilled = claim.fulfillments.reduce((s, f) => s + f.kg, 0);
  const remaining = Math.max(0, claim.total - fulfilled);
  return { fulfilled, remaining, status: remaining === 0 ? 'SETTLED' : fulfilled > 0 ? 'PARTIAL' : 'OPEN' };
}
export function fulfill(claim, kg, time) {
  const remaining = claimSummary(claim).remaining;
  if (!Number.isFinite(kg) || kg <= 0 || kg > remaining) throw new Error('Jumlah harus positif dan tidak melebihi sisa klaim.');
  return { ...claim, fulfillments: [...claim.fulfillments, { kg, time }] };
}
export function nextVehicle(vehicle, time) {
  const order = vehicle.flow === 'INBOUND' ? ['MENUNGGU BONGKAR', 'SEDANG BONGKAR', 'SELESAI'] : ['MENUNGGU', 'SEDANG DIMUAT', 'SELESAI'];
  const index = order.indexOf(vehicle.status);
  if (index < 0 || index === 2) return vehicle;
  return { ...vehicle, status: order[index + 1], ...(index === 0 ? { startedAt: time } : { finishedAt: time }) };
}
export function kpis(stacks, vehicles, claims) {
  return {
    physical: stacks.reduce((n, s) => n + s.physical, 0), active: vehicles.filter(v => v.status !== 'SELESAI').length,
    waitIn: vehicles.filter(v => v.status === 'MENUNGGU BONGKAR').length,
    waitOut: vehicles.filter(v => v.status === 'MENUNGGU').length,
    fefo: stacks.filter(s => s.fefo === 'PRIORITAS KELUAR').length,
    claims: claims.reduce((n, c) => n + claimSummary(c).remaining, 0)
  };
}
