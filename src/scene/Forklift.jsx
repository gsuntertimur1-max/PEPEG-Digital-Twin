
export default function Forklift({ position, rotation = 0 }) {
  return <group position={position} rotation={[0,rotation,0]}>
    <mesh position={[0,.7,0]} castShadow><boxGeometry args={[2.2,1.2,2.7]} /><meshStandardMaterial color="#f6c744" /></mesh>
    <mesh position={[0,2.25,-1.2]}><boxGeometry args={[2,.15,.15]} /><meshStandardMaterial color="#303842" /></mesh>
    <mesh position={[-.8,1.8,-1.2]}><boxGeometry args={[.16,3.1,.16]} /><meshStandardMaterial color="#303842" /></mesh>
    <mesh position={[.8,1.8,-1.2]}><boxGeometry args={[.16,3.1,.16]} /><meshStandardMaterial color="#303842" /></mesh>
    <mesh position={[-.6,.15,-2.3]}><boxGeometry args={[.24,.16,2.7]} /><meshStandardMaterial color="#303842" /></mesh>
    <mesh position={[.6,.15,-2.3]}><boxGeometry args={[.24,.16,2.7]} /><meshStandardMaterial color="#303842" /></mesh>
  </group>;
}
