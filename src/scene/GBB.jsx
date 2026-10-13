import { Html } from '@react-three/drei';
import { useSimStore } from '../stores/simulationStore.js';
import { stackLayout } from '../data/layout.js';
import { STATUS } from '../data/status.js';
import StackBlock from './StackBlock.jsx';
import Door from './Door.jsx';
import GableRoof from './GableRoof.jsx';

export default function Warehouse({ number, x, z, frontSign }) {
  const stacks = useSimStore((s) => s.stacks);
  const select = useSimStore((s) => s.select);
  const setFocus = useSimStore((s) => s.setFocus);
  const roofsVisible = useSimStore((s) => s.roofsVisible);
  const warehouseName = `GBB ${number}`;
  const focused = useSimStore((s) => s.focus) === warehouseName;
  const own = stacks.filter((s) => s.warehouse === warehouseName);
  const worst = ['BARANG RUSAK', 'FEFO', 'PERHATIAN', 'RESERVASI', 'NORMAL'].find((st) => own.some((s) => s.status === st)) || 'NORMAL';
  const shellOpacity = focused || !roofsVisible ? .08 : .93;

  const slots = own.map(stack => {
    const layout = stackLayout(warehouseName, stack.zone, stack.slot);
    return <StackBlock key={stack.id} stack={stack} pos={layout.position} size={layout.size} />;
  });

  return <group position={[x, 0, z]} onClick={(e) => { e.stopPropagation(); select('warehouse', warehouseName); setFocus(warehouseName); }}>
    {[-25,25].map(xx => <mesh key={xx} raycast={!roofsVisible ? () => null : undefined} position={[xx,4.4,0]}><boxGeometry args={[.35,8.8,30]} /><meshStandardMaterial color="#a9b0b6" transparent opacity={shellOpacity} /></mesh>)}
    {[-1,1].map(sign => <group key={sign}>
      <mesh raycast={!roofsVisible ? () => null : undefined} position={[0,7.6,sign*15]}><boxGeometry args={[50,2.4,.35]} /><meshStandardMaterial color="#a9b0b6" transparent opacity={shellOpacity} /></mesh>
      {[-21.5,0,21.5].map(xx => <mesh key={xx} raycast={!roofsVisible ? () => null : undefined} position={[xx,3.2,sign*15]}><boxGeometry args={[xx===0?18:7,6.4,.35]} /><meshStandardMaterial color="#a9b0b6" transparent opacity={shellOpacity} /></mesh>)}
    </group>)}
    {[-25,25].flatMap(xx=>[-14,0,14].map(zz=><mesh key={`${xx}:${zz}`} position={[xx,4.5,zz]}><boxGeometry args={[.5,9,.5]}/><meshStandardMaterial color="#235789"/></mesh>))}
    <mesh raycast={!roofsVisible ? () => null : undefined} position={[0, 1.15, frontSign * 15.15]}>
      <boxGeometry args={[50.2, 2.3, .45]} /><meshStandardMaterial color="#235789" transparent opacity={focused || !roofsVisible ? .12 : 1} />
    </mesh>
    <Door open={!roofsVisible} x={-13} z={frontSign * 15.38} rot={0} /><Door open={!roofsVisible} x={13} z={frontSign * 15.38} rot={0} />
    <Door open={!roofsVisible} x={-13} z={-frontSign * 15.38} rot={0} /><Door open={!roofsVisible} x={13} z={-frontSign * 15.38} rot={0} />
    <GableRoof width={50} depth={30} y={8.8} visible={roofsVisible} faded={false} />
    {slots}
    <mesh position={[0, .12, 0]} receiveShadow><boxGeometry args={[49, .22, 29]} /><meshStandardMaterial color="#5d6166" /></mesh>
    <mesh position={[0, 10.9, 0]}><sphereGeometry args={[.9, 18, 18]} /><meshStandardMaterial color={STATUS[worst]} emissive={STATUS[worst]} emissiveIntensity={.8} /></mesh>
    <Html center position={[0, 13.5, 0]}>
      <button onClick={() => {select('warehouse',warehouseName);setFocus(warehouseName);}} className={`scene-tag ${focused ? 'focused' : ''}`}>GBB {number}<span>{worst}</span></button>
    </Html>
  </group>;
}
