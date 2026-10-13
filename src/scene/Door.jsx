
export default function Door({ x, z, rot = 0, open = false }) {
  if (open) return null;
  return <mesh position={[x, 3.1, z]} rotation={[0, rot, 0]}>
    <boxGeometry args={[8, 6.2, .38]} />
    <meshStandardMaterial color="#235789" roughness={0.75} />
  </mesh>;
}
