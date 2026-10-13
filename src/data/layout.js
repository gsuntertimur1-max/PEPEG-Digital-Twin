// Metres. MP1 rear doors at x=-115, front doors at x=115.
export const MP1_LAYOUT = { width: 230, depth: 30, x: 0, z: 0 };
export const WAREHOUSES = Array.from({ length: 8 }, (_, i) => ({
  number: 17 + i, name: `GBB ${17 + i}`, x: [-84, -28, 28, 84][i % 4],
  z: i < 4 ? 30 : -30, frontSign: i < 4 ? 1 : -1, width: 50, depth: 30
}));
export const OFFICES = [{ name: 'KANTOR GST I', x: 0, z: 39 }, { name: 'KANTOR GST II', x: 0, z: -39 }];
export function stackLayout(warehouse, zone, slot) {
  if (warehouse === 'MP1') return { position: [-92 + (slot - 1) * 26.3, 1.7, zone === 'A' ? -7 : 7], size: [18, 3.1, 8.5] };
  const w = WAREHOUSES.find(w => w.name === warehouse);
  return { position: [('ABC'.indexOf(zone) - 1) * 15 * w.frontSign, 1.7, (slot - 2.5) * -6 * w.frontSign], size: [9, 3.1, zone === 'B' ? 5.2 : 3.9] };
}
export const CAMERA_PRESETS = {
  OVERVIEW: { pos: [165, 155, 190], target: [0, 0, 0] },
  'GST I': { pos: [110, 105, 140], target: [0, 2, 30] },
  'GST II': { pos: [110, 105, -140], target: [0, 2, -30] },
  MP1: { pos: [125, 100, 90], target: [0, 3, 0] },
  ...Object.fromEntries(WAREHOUSES.map(w => [w.name, { pos: [w.x + 32, 56, w.z + w.frontSign * 58], target: [w.x, 2, w.z] }]))
};
