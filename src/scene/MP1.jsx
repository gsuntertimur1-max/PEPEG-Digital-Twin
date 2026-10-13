import { Html } from '@react-three/drei';
import { useSimStore } from '../stores/simulationStore.js';
import { stackLayout, MP1_LAYOUT, WAREHOUSES } from '../data/layout.js';
import StackBlock from './StackBlock.jsx';
import Door from './Door.jsx';
import GableRoof from './GableRoof.jsx';

export default function MP1() {
  const stacks = useSimStore((s) => s.stacks).filter((s) => s.warehouse === 'MP1');
  const select = useSimStore((s) => s.select);
  const setFocus = useSimStore((s) => s.setFocus);
  const focused = useSimStore((s) => s.focus) === 'MP1';
  const roofsVisible = useSimStore((s) => s.roofsVisible);
  const wallSections = [-1,1].map(side => {
    const doors = WAREHOUSES.filter(w=>Math.sign(w.z)===side).flatMap(w=>[w.x-13,w.x+13]).sort((a,b)=>a-b);
    const spans=[]; let edge=-115;
    for(const door of doors){spans.push([edge,door-4]);edge=door+4;}spans.push([edge,115]);
    return <group key={side}>
      <mesh raycast={!roofsVisible?()=>null:undefined} position={[0,7.9,side*15]}><boxGeometry args={[230,3.4,.3]}/><meshStandardMaterial color="#9fa8b1" transparent opacity={focused||!roofsVisible?.08:.95}/></mesh>
      {spans.map(([a,b],i)=><mesh key={i} raycast={!roofsVisible?()=>null:undefined} position={[(a+b)/2,3.1,side*15]}><boxGeometry args={[b-a,6.2,.3]}/><meshStandardMaterial color="#9fa8b1" transparent opacity={focused||!roofsVisible?.08:.95}/></mesh>)}
    </group>;
  });
  return <group onClick={(e) => { e.stopPropagation(); select('warehouse', 'MP1'); setFocus('MP1'); }}>
    {wallSections}
    {[-1,1].map(side=><group key={side}>
      <mesh raycast={!roofsVisible?()=>null:undefined} position={[side*115,7.9,0]}><boxGeometry args={[.3,3.4,30]}/><meshStandardMaterial color="#9fa8b1" transparent opacity={focused||!roofsVisible?.08:.95}/></mesh>
      {[-1,1].map(end=><mesh key={end} raycast={!roofsVisible?()=>null:undefined} position={[side*115,3.1,end*9.5]}><boxGeometry args={[.3,6.2,11]}/><meshStandardMaterial color="#9fa8b1" transparent opacity={focused||!roofsVisible?.08:.95}/></mesh>)}
    </group>)}
    <mesh position={[0, .12, 0]} receiveShadow><boxGeometry args={[229, .22, 29]} /><meshStandardMaterial color="#5c6064" /></mesh>
    <GableRoof width={230} depth={MP1_LAYOUT.depth} y={9.6} visible={roofsVisible} faded={false} />
    <Door open={!roofsVisible} x={115.1} z={0} rot={Math.PI/2} /><Door open={!roofsVisible} x={-115.1} z={0} rot={Math.PI/2} />
    {stacks.map(s => { const layout = stackLayout('MP1',s.zone,s.slot); return <StackBlock key={s.id} stack={s} pos={layout.position} size={layout.size} />; })}
    <Html center position={[0, 14, 0]}><button onClick={() => {select('warehouse','MP1');setFocus('MP1');}} className={`scene-tag mp1 ${focused ? 'focused' : ''}`}>MP1<span>230 m × 30 m</span></button></Html>
    <Html center position={[111, 8, 12]}><div className="orientation-tag">PINTU DEPAN MP1 →</div></Html>
    <Html center position={[-111, 8, -12]}><div className="orientation-tag">← PINTU BELAKANG MP1</div></Html>
  </group>;
}
