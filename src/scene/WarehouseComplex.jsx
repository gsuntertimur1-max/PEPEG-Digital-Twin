import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { WAREHOUSES, OFFICES, CAMERA_PRESETS } from '../data/layout.js';
import { useSimStore } from '../stores/simulationStore.js';
import CameraRig from './CameraRig.jsx';
import MP1 from './MP1.jsx';
import Office from './Office.jsx';
import Truck from './Truck.jsx';
import Forklift from './Forklift.jsx';
import RoadsAndGround from './RoadsAndGround.jsx';
import Warehouse from './GBB.jsx';

export default function DigitalTwinScene() {
  const controls = useRef();
  const transition = useRef(true);
  const vehicles = useSimStore((s) => s.vehicles);
  return <Canvas shadows camera={{ position: CAMERA_PRESETS.OVERVIEW.pos, fov: 42, near: .1, far: 1000 }} dpr={[1,1.65]} gl={{ antialias: true }}>
    <color attach="background" args={['#07111f']} />

    <ambientLight intensity={1.25} />
    <hemisphereLight intensity={.65} color="#dcecff" groundColor="#1b2630" />
    <directionalLight position={[90,130,70]} intensity={2.1} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-160} shadow-camera-right={160} shadow-camera-top={110} shadow-camera-bottom={-110} />
    <RoadsAndGround />
    {WAREHOUSES.filter(w=>w.number>=21).map(w=><Warehouse key={w.number} {...w} />)}
    <MP1 />
    {WAREHOUSES.filter(w=>w.number<21).map(w=><Warehouse key={w.number} {...w} />)}
    {OFFICES.map(o=><Office key={o.name} {...o} />)}
    {vehicles.map(v=><Truck key={v.id} vehicle={v} />)}
    <Forklift position={[-8,1.1,8]} rotation={Math.PI/2} />
    <Forklift position={[66,1.1,-8]} rotation={-Math.PI/2} />
    <gridHelper args={[300,60,'#27445c','#14283b']} position={[0,.04,0]} />
    <OrbitControls ref={controls} makeDefault minDistance={28} maxDistance={440} onStart={() => { transition.current = false; }} maxPolarAngle={Math.PI/2.03} enableDamping dampingFactor={.08} />
    <CameraRig controls={controls} transition={transition} />
  </Canvas>;
}
