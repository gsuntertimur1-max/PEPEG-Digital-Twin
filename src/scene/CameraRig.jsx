import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_PRESETS } from '../data/layout.js';
import { useSimStore } from '../stores/simulationStore.js';

export default function CameraRig({ controls, transition }) {
  const focus = useSimStore(s => s.focus);
  const revision = useSimStore(s => s.cameraRevision);
  useEffect(() => { transition.current = true; }, [focus, revision, transition]);
  useFrame(({ camera }, dt) => {
    if (!transition.current || !controls.current) return;
    const target = CAMERA_PRESETS[focus] || CAMERA_PRESETS.OVERVIEW;
    const pos = new THREE.Vector3(...target.pos);
    const look = new THREE.Vector3(...target.target);
    const k = 1 - Math.exp(-dt * 4);
    camera.position.lerp(pos, k);
    controls.current.target.lerp(look, k);
    controls.current.update();
    if (camera.position.distanceTo(pos) < .15 && controls.current.target.distanceTo(look) < .15) transition.current = false;
  });
  return null;
}
