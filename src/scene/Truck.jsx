import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimStore } from '../stores/simulationStore.js';

export default function Truck({ vehicle }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    const done = vehicle.status === 'SELESAI';
    const processing = vehicle.status.startsWith('SEDANG');
    const side = Math.sign(vehicle.position[2]);
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, vehicle.position[0] + (done ? 36 : 0), 2, dt);
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, side * (processing ? 51 : 65), 2, dt);
  });
  const select = useSimStore((s) => s.select);
  const color = vehicle.flow === 'INBOUND' ? '#12b981' : '#3b82f6';
  const done = vehicle.status === 'SELESAI';
  return <group ref={ref} position={vehicle.position} rotation={[0, vehicle.position[2] < 0 ? Math.PI : 0, 0]} onClick={(e) => { e.stopPropagation(); select('vehicle', vehicle.id); }}>
    <mesh position={[0,1.1,0]} castShadow><boxGeometry args={[9,2.4,3.4]} /><meshStandardMaterial color={done ? '#637083' : '#dbe4ea'} /></mesh>
    <mesh position={[5.5,.85,0]} castShadow><boxGeometry args={[3.2,2.8,3.3]} /><meshStandardMaterial color={done ? '#637083' : color} /></mesh>
    {[[-2.8,-1.2],[2.6,-1.2],[5.6,-1.2]].map(([x,z],i)=><React.Fragment key={i}><mesh position={[x,-.15,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.75,.75,.45,16]} /><meshStandardMaterial color="#151b23" /></mesh><mesh position={[x,-.15,-z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.75,.75,.45,16]} /><meshStandardMaterial color="#151b23" /></mesh></React.Fragment>)}
    <Html center position={[1.5,4.3,0]}><button onClick={() => select('vehicle', vehicle.id)} className={`vehicle-tag ${vehicle.flow.toLowerCase()}`}><b>{vehicle.plate}</b><span>{vehicle.status}</span></button></Html>
  </group>;
}
