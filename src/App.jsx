import React from 'react';
import { Boxes, CircleAlert, ClipboardCheck, RotateCcw, Truck, Eye, EyeOff, Gauge, Clock3, Scale, Layers3 } from 'lucide-react';
import DigitalTwinScene from './scene/WarehouseComplex.jsx';
import { useSimStore } from './stores/simulationStore.js';

import { useKPIs } from './hooks/useKPIs.js';
import { Kpi, StackPanel, VehiclePanel, WarehousePanel, Claims } from './components/SimulationPanels.jsx';
import { fmt } from './utils/format.js';
import { CAMERA_PRESETS } from './data/layout.js';

function App() {
  const { stacks, vehicles, claims, timeline, selected, focus, roofsVisible, setFocus, toggleRoofs, advanceVehicle, fulfillClaim, resetSimulation } = useSimStore();
  const selectedStack = selected.type === 'stack' ? stacks.find(s=>s.id===selected.id) : null;
  const selectedVehicle = selected.type === 'vehicle' ? vehicles.find(v=>v.id===selected.id) : null;
  const selectedWarehouse = selected.type === 'warehouse' ? selected.id : null;
  const kpis = useKPIs(stacks,vehicles,claims);
  const select = useSimStore(s=>s.select);

  return <div className="app-shell">
    <header className="topbar"><div className="brand"><div className="brand-mark"><Layers3 size={22}/></div><div><span>PEPEG DIGITAL TWIN</span><b>GST I & II <small className="brand-sub">OPERATIONS CONTROL ROOM</small></b></div></div><div className="top-actions"><span className="simulation-badge">● MOCK DATA · ISOLATED</span><button onClick={toggleRoofs}>{roofsVisible?<EyeOff size={16}/>:<Eye size={16}/>} {roofsVisible?'Buka atap':'Tampilkan atap'}</button><button onClick={resetSimulation}><RotateCcw size={16}/> RESET SIMULATION</button></div></header>
    <div className="kpi-strip">
      <Kpi icon={Boxes} label="Stok fisik" value={fmt(kpis.physical)} hint="unit simulasi"/><Kpi icon={Truck} label="Kendaraan aktif" value={kpis.active}/><Kpi icon={Clock3} label="Menunggu bongkar" value={kpis.waitIn}/><Kpi icon={ClipboardCheck} label="Menunggu muat" value={kpis.waitOut}/><Kpi icon={CircleAlert} label="FEFO alert" value={kpis.fefo}/><Kpi icon={Scale} label="Sisa klaim" value={`${kpis.claims} kg`}/>
    </div>
    <main className="workspace">
      <section className="scene-wrap">
        <div className="scene-toolbar"><span>VIEW</span>{['OVERVIEW','GST I','GST II','MP1'].map(v=><button key={v} className={focus===v?'active':''} onClick={()=>setFocus(v)}>{v}</button>)}<select aria-label="Camera preset" value={focus} onChange={e=>{setFocus(e.target.value);if(e.target.value.startsWith('GBB')||e.target.value==='MP1')select('warehouse',e.target.value);}}>{Object.keys(CAMERA_PRESETS).map(p=><option key={p}>{p}</option>)}</select></div>
        <div className="orientation-note"><b>↑ SISI DEPAN GBB 21–24</b><span>MP1: belakang ← · → depan</span><b>↓ SISI DEPAN GBB 17–20</b></div>
        <DigitalTwinScene />
        <div className="legend"><span><i className="dot normal"/>NORMAL</span><span><i className="dot perhatian"/>PERHATIAN</span><span><i className="dot fefo"/>FEFO</span><span><i className="dot reservasi"/>RESERVASI</span><span><i className="dot rusak"/>BARANG RUSAK</span></div>
        <div className="scene-help">Drag = rotate · Scroll = zoom · Shift/Right drag = pan · Klik GBB/tumpukan/truk = detail</div>
      </section>
      <aside className="side-panel">
        {selectedStack && <StackPanel stack={selectedStack}/>} {selectedVehicle && <VehiclePanel vehicle={selectedVehicle} advance={advanceVehicle}/>} {selectedWarehouse && <WarehousePanel name={selectedWarehouse} stacks={stacks}/>} {!selectedStack&&!selectedVehicle&&!selectedWarehouse&&<WarehousePanel name="GBB 18" stacks={stacks}/>}
        <section className="side-section"><div className="section-title"><Truck size={16}/><span>Kendaraan · inbound / outbound</span></div>{vehicles.map(v=><button className="vehicle-row" key={v.id} onClick={()=>select('vehicle',v.id)}><b>{v.plate}</b><span>{v.flow} · {v.status}</span></button>)}</section>
        <section className="side-section"><div className="section-title"><CircleAlert size={16}/><span>FEFO · prioritas keluar</span></div>{stacks.filter(s=>s.fefo==='PRIORITAS KELUAR').sort((a,b)=>a.expiry.localeCompare(b.expiry)).map(s=><button className="vehicle-row" key={s.id} onClick={()=>{select('stack',s.id);setFocus(s.warehouse);}}><b>{s.id}</b><span>{s.expiry} · {s.product}</span></button>)}</section>
        <Claims claims={claims} fulfill={fulfillClaim}/>
        <section className="side-section"><div className="section-title"><Gauge size={16}/><span>Aktivitas hari ini · {timeline.length}</span></div><div className="timeline">{timeline.slice(0,20).map((e,i)=><div className="timeline-row" key={`${e.time}-${i}`}><time>{e.time}</time><i className={e.type.toLowerCase()}/><p>{e.text}</p></div>)}</div></section>
      </aside>
    </main>
    <footer><span>SIMULATION MODE · frontend-only · localStorage</span><span>Tidak terhubung ke MongoDB / API PEPEG produksi</span></footer>
  </div>;
}

export default App;
