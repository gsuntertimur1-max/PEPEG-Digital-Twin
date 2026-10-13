import { Html, RoundedBox } from '@react-three/drei';

export default function Office({ x, z, name }) {
  return <group position={[x,0,z]}>
    <RoundedBox args={[5, 5.5, 11]} radius={.8} smoothness={3} position={[0, 2.75, 0]} castShadow>
      <meshStandardMaterial color="#e7e8ea" roughness={.75} />
    </RoundedBox>
    <mesh position={[0, .7, 5.55]}><boxGeometry args={[2.4, 1.4, .2]} /><meshStandardMaterial color="#244d78" /></mesh>
    <Html center position={[0,7,0]}><div className="office-tag">{name}</div></Html>
  </group>;
}
