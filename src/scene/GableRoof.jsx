
export default function GableRoof({ width, depth, y, visible, faded }) {
  if (!visible) return null;
  const half = depth / 2;
  const rise = 4.5;
  const slope = Math.atan2(rise, half);
  const panelLen = Math.sqrt(half * half + rise * rise);
  return <group>
    <mesh position={[0, y + 2.2, -depth / 4]} rotation={[-slope, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[width + 1, 0.55, panelLen + .8]} />
      <meshStandardMaterial color="#7c8793" roughness={0.85} transparent={faded} opacity={faded ? .16 : 1} />
    </mesh>
    <mesh position={[0, y + 2.2, depth / 4]} rotation={[slope, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[width + 1, 0.55, panelLen + .8]} />
      <meshStandardMaterial color="#737f8a" roughness={0.85} transparent={faded} opacity={faded ? .16 : 1} />
    </mesh>
  </group>;
}
