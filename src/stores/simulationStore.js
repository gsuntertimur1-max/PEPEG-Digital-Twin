import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialClaims, initialTimeline, initialVehicles, makeStacks } from '../data/mockData.js';
import { claimSummary, fulfill, nextVehicle } from '../utils/simulation.js';
const now = () => new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
const baseState = () => ({
  stacks: makeStacks(), vehicles: structuredClone(initialVehicles).map(v => ({ ...v, startedAt: v.status.startsWith('SEDANG') ? v.time : null, finishedAt: null })),
  claims: initialClaims.map(c => ({ ...c, fulfillments: c.fulfilled ? [{ kg: c.fulfilled, time: 'Tahap awal mock' }] : [] })),
  timeline: structuredClone(initialTimeline), selected: { type: 'warehouse', id: 'GBB 18' }, focus: 'OVERVIEW', cameraRevision: 0, roofsVisible: true
});
const event = (state, type, text) => [{ time: now(), type, text }, ...state.timeline].slice(0, 100);
export const useSimStore = create(persist((set) => ({
  ...baseState(), select: (type, id) => set({ selected: { type, id } }),
  setFocus: focus => set(s=>({ focus, cameraRevision:s.cameraRevision+1 })), toggleRoofs: () => set(s => ({ roofsVisible: !s.roofsVisible })),
  advanceVehicle: id => set(s => {
    const old = s.vehicles.find(v => v.id === id);
    if (!old || old.status === 'SELESAI') return {};
    const vehicle = nextVehicle(old, now());
    return { vehicles: s.vehicles.map(v => v.id === id ? vehicle : v), timeline: event(s, vehicle.flow, `${vehicle.plate} → ${vehicle.status}`) };
  }),
  fulfillClaim: (id, kg = 10) => set(s => {
    const old = s.claims.find(c => c.id === id);
    if (!old || claimSummary(old).remaining === 0) return {};
    const claim = fulfill(old, kg, now());
    return { claims: s.claims.map(c => c.id === id ? claim : c), timeline: event(s, 'CLAIM', `${id} dipenuhi ${kg} kg; sisa ${claimSummary(claim).remaining} kg`) };
  }),
  reserveStack: (id, qty) => set(s => {
    const old = s.stacks.find(x => x.id === id);
    if (!old || !Number.isInteger(qty) || qty < 0 || qty > old.physical) throw new Error('Reservasi harus 0 sampai stok fisik.');
    if (qty === old.reserved) return {};
    return { stacks: s.stacks.map(x => x.id === id ? { ...x, reserved: qty, available: x.physical - qty, status: ['FEFO', 'BARANG RUSAK'].includes(x.status) ? x.status : qty > 0 ? 'RESERVASI' : 'NORMAL' } : x), timeline: event(s, 'RESERVASI', `${id} reservasi ${qty} ${old.unit}`) };
  }),
  flagFefo: id => set(s => {
    const old = s.stacks.find(x => x.id === id);
    if (!old || old.fefo === 'PRIORITAS KELUAR') return {};
    return { stacks: s.stacks.map(x => x.id === id ? { ...x, fefo: 'PRIORITAS KELUAR', status: x.status === 'BARANG RUSAK' ? x.status : 'FEFO' } : x), timeline: event(s, 'FEFO', `${id} masuk prioritas FEFO`) };
  }),
  resetSimulation: () => set(baseState())
}), { name: 'pepeg-digital-twin-sim-v2', version: 2, partialize: s => ({ stacks: s.stacks, vehicles: s.vehicles, claims: s.claims, timeline: s.timeline }) }));
