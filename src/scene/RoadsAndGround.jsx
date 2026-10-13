import React from 'react';
export default function RoadsAndGround() {
  return <group>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.05,0]} receiveShadow><planeGeometry args={[310,180]} /><meshStandardMaterial color="#25313a" /></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.01,60]}><planeGeometry args={[270,27]} /><meshStandardMaterial color="#4b5156" /></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.01,-60]}><planeGeometry args={[270,27]} /><meshStandardMaterial color="#4b5156" /></mesh>
    {[-92,-46,0,46,92].map(x=><React.Fragment key={x}><mesh rotation={[-Math.PI/2,0,0]} position={[x,.025,60]}><planeGeometry args={[18,.45]} /><meshBasicMaterial color="#d5b84a" /></mesh><mesh rotation={[-Math.PI/2,0,0]} position={[x,.025,-60]}><planeGeometry args={[18,.45]} /><meshBasicMaterial color="#d5b84a" /></mesh></React.Fragment>)}
  </group>;
}
