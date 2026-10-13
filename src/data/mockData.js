const PRODUCTS = [
  ['Beras SPHP 5 kg', 'BR-SPHP-5KG', 'pack'],
  ['Beras Setra Ramos 5 kg', 'BR-SR-5KG', 'pack'],
  ['Beras Medium 50 kg', 'BR-MED-50KG', 'karung'],
  ['Minyak Goreng 2 L', 'MG-2L', 'dus'],
  ['Gula Kristal Putih 1 kg', 'GKP-1KG', 'pack'],
  ['Beras Premium 5 kg', 'BR-PRM-5KG', 'pack'],
  ['Kopi Kapal Api 350 g', 'KOPI-KA-350G', 'dus']
];

const STATUS_SEED = {
  '18/A02': 'FEFO',
  '19/A01': 'RESERVASI',
  '20/B03': 'BARANG RUSAK',
  '21/C02': 'PERHATIAN',
  '22/B04': 'RESERVASI',
  '23/A03': 'FEFO',
  '24/B01': 'PERHATIAN',
  'MP1/A03': 'FEFO',
  'MP1/B06': 'RESERVASI'
};

const lotFor = (idx) => `LOT-${String(260900 + idx).padStart(6, '0')}`;
const expiryFor = (idx, status) => {
  if (status === 'FEFO') return `2026-${idx % 2 ? '11' : '12'}-${String(5 + (idx % 20)).padStart(2, '0')}`;
  return `2027-${String(1 + (idx % 8)).padStart(2, '0')}-${String(5 + (idx % 20)).padStart(2, '0')}`;
};

export function makeStacks() {
  const stacks = [];
  let idx = 0;
  for (let g = 17; g <= 24; g += 1) {
    for (const zone of ['A', 'B', 'C']) {
      for (let n = 1; n <= 4; n += 1) {
        const id = `${g}/${zone}${String(n).padStart(2, '0')}`;
        const [product, sku, unit] = PRODUCTS[idx % PRODUCTS.length];
        const status = STATUS_SEED[id] || (idx % 17 === 0 ? 'PERHATIAN' : 'NORMAL');
        const physical = 3200 + ((idx * 811) % 24500);
        const reserved = status === 'RESERVASI' ? 800 + ((idx * 37) % 1400) : (idx % 13 === 0 ? 300 : 0);
        stacks.push({
          id, warehouse: `GBB ${g}`, zone, slot: n, product, sku, unit, weightKg: unit === 'karung' ? 50 : unit === 'dus' ? 12 : 5,
          physical, reserved, available: Math.max(0, physical - reserved),
          lot: lotFor(idx), expiry: expiryFor(idx, status),
          fefo: status === 'FEFO' ? 'PRIORITAS KELUAR' : 'NORMAL', status
        });
        idx += 1;
      }
    }
  }
  for (const zone of ['A', 'B']) {
    for (let n = 1; n <= 8; n += 1) {
      const id = `MP1/${zone}${String(n).padStart(2, '0')}`;
      const [product, sku, unit] = PRODUCTS[idx % PRODUCTS.length];
      const status = STATUS_SEED[id] || 'NORMAL';
      const physical = 6200 + ((idx * 977) % 31000);
      const reserved = status === 'RESERVASI' ? 2250 : 0;
      stacks.push({
        id, warehouse: 'MP1', zone, slot: n, product, sku, unit, weightKg: unit === 'karung' ? 50 : unit === 'dus' ? 12 : 5,
        physical, reserved, available: physical - reserved,
        lot: lotFor(idx), expiry: expiryFor(idx, status),
        fefo: status === 'FEFO' ? 'PRIORITAS KELUAR' : 'NORMAL', status
      });
      idx += 1;
    }
  }
  return stacks;
}

export const initialVehicles = [
  { id: 'IN-01', flow: 'INBOUND', plate: 'B 9123 UQ', document: 'TM/PO-2026-1008', product: 'Beras Medium 50 kg', partner: 'PT Pangan Nusantara', qty: '500 karung', warehouse: 'GBB 19', time: '14:28', status: 'MENUNGGU BONGKAR', position: [28, 1.4, 65] },
  { id: 'IN-02', flow: 'INBOUND', plate: 'B 9344 TYY', document: 'TM/PO-2026-1011', product: 'Minyak Goreng 2 L', partner: 'PT Minyak Sejahtera', qty: '2.000 dus', warehouse: 'GBB 20', time: '15:12', status: 'SEDANG BONGKAR', position: [84, 1.4, 51] },
  { id: 'OUT-01', flow: 'OUTBOUND', plate: 'B 8765 KAB', document: 'SO/09100/202610/0142', product: 'Beras SPHP 5 kg', partner: 'Distribusi Wilayah Jakarta', qty: '4.000 pack', warehouse: 'GBB 22', time: '15:05', status: 'MENUNGGU', position: [-28, 1.4, -65] },
  { id: 'OUT-02', flow: 'OUTBOUND', plate: 'B 7012 PX', document: 'SO/09100/202610/0143', product: 'Beras Setra Ramos 5 kg', partner: 'Bazar', qty: '1.200 pack', warehouse: 'GBB 24', time: '15:31', status: 'SEDANG DIMUAT', position: [84, 1.4, -51] }
];

export const initialClaims = [
  { id: 'CLM-001', tm: 'TM/PO-2026-1008', product: 'Beras Medium 50 kg', expected: 25000, actual: 24994, total: 6, fulfilled: 0, remaining: 6, note: '500 karung × 50 kg' },
  { id: 'CLM-002', tm: 'TM/PO-2026-0996', product: 'Beras Premium 5 kg', expected: 35000, actual: 34965, total: 35, fulfilled: 10, remaining: 25, note: 'Pemenuhan tahap 1 sudah 10 kg' }
];

export const initialTimeline = [
  { time: '15:31', type: 'OUTBOUND', text: 'B 7012 PX mulai pemuatan di GBB 24.' },
  { time: '15:12', type: 'INBOUND', text: 'B 9344 TYY mulai bongkar 2.000 dus minyak di GBB 20.' },
  { time: '14:47', type: 'CLAIM', text: 'Kekurangan timbang TM/PO-2026-1008 terdeteksi 6 kg.' },
  { time: '14:28', type: 'INBOUND', text: 'B 9123 UQ masuk antrean bongkar menuju GBB 19.' },
  { time: '13:55', type: 'FEFO', text: '18/A02 masuk prioritas FEFO.' }
];
