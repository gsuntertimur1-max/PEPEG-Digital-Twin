import { Html } from '@react-three/drei';
import { useSimStore } from '../stores/simulationStore.js';
import { STATUS } from '../data/status.js';

export default function StackBlock({ stack, pos, size }) {
  const select = useSimStore((s) => s.select);
  const selected = useSimStore((s) => s.selected);
  const isSelected = selected.type === 'stack' && selected.id === stack.id;
  const color = STATUS[stack.status] || STATUS.NORMAL;
  return <group position={pos} onClick={(e) => { e.stopPropagation(); select('stack', stack.id); }}>
    <mesh position={[0, -size[1]/2, 0]}><boxGeometry args={[size[0]+.3,.25,size[2]+.3]} /><meshStandardMaterial color="#99774c" /></mesh>
    <mesh castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={isSelected ? color : '#000000'} emissiveIntensity={isSelected ? .5 : 0.04} roughness={0.72} />
    </mesh>
    {[.22, .48, .74].map((f) => <mesh key={f} position={[0, size[1] * (f - .5), size[2] / 2 + .01]}>
      <boxGeometry args={[size[0] * .94, .05, .03]} /><meshBasicMaterial color="#e5e7eb" transparent opacity={.42} />
    </mesh>)}
    {isSelected && <Html center position={[0, size[1] + 2.2, 0]}>
      <div className="scene-tag selected-tag">{stack.id}<span>{stack.status}</span></div>
    </Html>}
  </group>;
}
