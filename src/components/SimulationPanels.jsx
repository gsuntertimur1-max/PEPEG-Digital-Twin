import { useState } from 'react';
import { Scale } from 'lucide-react';
import { useSimStore } from '../stores/simulationStore.js';
import { claimSummary } from '../utils/simulation.js';
import { fmt, statusClass } from '../utils/format.js';

export function Kpi({ icon: Icon, label, value, hint }) {
  return <div className="kpi-card"><div className="kpi-icon"><Icon size={18}/></div><div><span>{label}</span><b>{value}</b>{hint && <small>{hint}</small>}</div></div>;
}

export function StackPanel({ stack }) {
  const reserve = useSimStore(s=>s.reserveStack);
  const flag = useSimStore(s=>s.flagFefo);
  const [error, setError] = useState('');
  if (!stack) return null;
  return <div className="details-card">
    <div className="detail-head"><div><small>TUMPUKAN</small><h2>{stack.id}</h2></div><span className={statusClass(stack.status)}>{stack.status}</span></div>
    <div className="product-name">{stack.product}</div>
    <div className="detail-grid">
      <div><span>SKU</span><b>{stack.sku}</b></div><div><span>Lot</span><b>{stack.lot}</b></div>
      <div><span>Stok fisik</span><b>{fmt(stack.physical)} {stack.unit}</b></div><div><span>Reservasi</span><b>{fmt(stack.reserved)} {stack.unit}</b></div>
      <div><span>Stok tersedia</span><b>{fmt(stack.available)} {stack.unit}</b></div><div><span>Expired</span><b>{stack.expiry}</b></div>
    </div>
    <div className="detail-grid"><div><span>Kemasan</span><b>{stack.unit}</b></div><div><span>Berat per kemasan</span><b>{stack.weightKg} kg</b></div></div>
    <div className="fefo-box"><span>FEFO</span><b>{stack.fefo}</b></div>
    <form onSubmit={e=>{e.preventDefault();try{reserve(stack.id,Number(new FormData(e.currentTarget).get('quantity')));setError('');}catch(err){setError(err.message);}}}>
      <label className="input-label">Reservasi mock ({stack.unit})<input key={stack.id+stack.reserved} aria-label="Jumlah reservasi" name="quantity" type="number" min="0" max={stack.physical} step="1" required defaultValue={stack.reserved}/></label>
      <button className="mini-action">SIMPAN RESERVASI</button>
    </form>{error && <p role="alert">{error}</p>}
    <button className="mini-action" disabled={stack.fefo==='PRIORITAS KELUAR'} onClick={()=>flag(stack.id)}>TANDAI PRIORITAS FEFO</button>
  </div>;
}

export function VehiclePanel({ vehicle, advance }) {
  if (!vehicle) return null;
  const done = vehicle.status === 'SELESAI';
  return <div className="details-card">
    <div className="detail-head"><div><small>{vehicle.flow === 'INBOUND' ? 'MOBIL PENERIMAAN' : 'MOBIL PEMUATAN'}</small><h2>{vehicle.plate}</h2></div><span className={statusClass(vehicle.status)}>{vehicle.status}</span></div>
    <div className="detail-grid single">
      <div><span>TM / PO / SO</span><b>{vehicle.document}</b></div><div><span>Produk</span><b>{vehicle.product}</b></div>
      <div><span>{vehicle.flow === 'INBOUND' ? 'Supplier' : 'Tujuan'}</span><b>{vehicle.partner}</b></div><div><span>Jumlah</span><b>{vehicle.qty}</b></div>
      <div><span>Lokasi</span><b>{vehicle.warehouse}</b></div><div><span>Jam datang</span><b>{vehicle.time}</b></div><div><span>Mulai proses</span><b>{vehicle.startedAt || '—'}</b></div><div><span>Selesai</span><b>{vehicle.finishedAt || '—'}</b></div>
    </div>
    <button className="primary-action" disabled={done} onClick={() => advance(vehicle.id)}>{done ? 'PROSES SELESAI' : 'LANJUTKAN STATUS →'}</button>
  </div>;
}

export function WarehousePanel({ name, stacks }) {
  const {select,setFocus,toggleRoofs,roofsVisible,vehicles} = useSimStore();
  const own = stacks.filter(s => s.warehouse === name);
  const physical = own.reduce((a,s)=>a+s.physical,0);
  const reserved = own.reduce((a,s)=>a+s.reserved,0);
  const alerts = own.filter(s=>s.status !== 'NORMAL').length;
  return <div className="details-card"><div className="detail-head"><div><small>AREA GUDANG</small><h2>{name}</h2></div><span className="pill pill-normal">SIMULASI</span></div>
    <div className="detail-grid"><div><span>Total slot</span><b>{own.length}</b></div><div><span>Alert</span><b>{alerts}</b></div><div><span>Occupancy slot</span><b>{Math.round(own.filter(s=>s.physical>0).length/own.length*100)}%</b></div><div><span>FEFO</span><b>{own.filter(s=>s.fefo==='PRIORITAS KELUAR').length}</b></div><div><span>Kendaraan aktif</span><b>{vehicles.filter(v=>v.warehouse===name&&v.status!=='SELESAI').length}</b></div><div><span>Fisik</span><b>{fmt(physical)}</b></div><div><span>Reservasi</span><b>{fmt(reserved)}</b></div></div>
    <button className="mini-action" onClick={toggleRoofs}>{roofsVisible?'OPEN ROOF':'CLOSE ROOF'}</button>
    <button className="mini-action" onClick={()=>setFocus('OVERVIEW')}>BACK TO OVERVIEW</button>
    <div className="slot-grid">{own.map(s=><button key={s.id} className={statusClass(s.status)} onClick={()=>{select('stack',s.id);setFocus(name);}}>{s.zone}{String(s.slot).padStart(2,'0')}</button>)}</div>
    <p className="helper">Klik blok tumpukan di scene untuk melihat SKU, lot, expired, FEFO dan reservasi.</p>
  </div>;
}

function ClaimCard({ claim, fulfill }) {
  const c = { ...claim, ...claimSummary(claim) };
  const [amount,setAmount] = useState(10);
  const [error,setError] = useState('');
  return <div className="claim-card" data-testid={c.id}>
    <div className="claim-top"><b>{c.id}</b><span>{c.status}</span></div><div className="claim-product">{c.product}</div><small>{c.tm}</small>
    <div className="claim-math"><span>Seharusnya <b>{fmt(c.expected)} kg</b></span><span>Aktual <b>{fmt(c.actual)} kg</b></span><span className="loss">Klaim <b>{c.total} kg</b></span></div>
    <div className="progress"><i style={{width:`${Math.min(100,c.fulfilled/c.total*100)}%`}}/></div>
    <div className="claim-bottom"><span>Terpenuhi <b>{c.fulfilled} kg</b></span><span>Sisa <b data-testid="claim-remaining">{c.remaining} kg</b></span></div>
    <form onSubmit={e=>{e.preventDefault();try{fulfill(c.id,Number(new FormData(e.currentTarget).get('amount')));setError('');}catch(err){setError(err.message);}}}>
      <label className="input-label">Pemenuhan (kg)<input aria-label={`Pemenuhan ${c.id}`} name="amount" type="number" step="0.1" min="0.1" max={c.remaining} disabled={!c.remaining} value={Math.min(amount,c.remaining)} onChange={e=>setAmount(e.target.value)}/></label>
      <button className="mini-action" disabled={!c.remaining}>{c.remaining?'PENUHI KLAIM':'SETTLED'}</button>
    </form>{error&&<p role="alert">{error}</p>}
    <details><summary>Riwayat pemenuhan ({c.fulfillments.length})</summary>{c.fulfillments.map((f,i)=><p key={i}>{f.time} · {f.kg} kg</p>)}</details>
  </div>;
}
export function Claims({ claims, fulfill }) {
  return <section className="side-section"><div className="section-title"><Scale size={16}/><span>Klaim kekurangan timbang</span></div>{claims.map(c=><ClaimCard key={c.id} claim={c} fulfill={fulfill}/>)}</section>;
}
