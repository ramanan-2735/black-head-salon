"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MODEL_URL = "/three/razor.glb";

/*
 * Art direction from planning/02: polished steel blade, dark horn handle. The model
 * is CC BY 4.0 (Cajetan, Sketchfab). Colours are set here in code, so the licensed
 * file itself stays unchanged.
 */
const STEEL = { color: "#c9d0d6", metalness: 1, roughness: 0.22 };
const HORN = { color: "#1a1512", metalness: 0.1, roughness: 0.35 };

/** Builds the razor at a fixed orientation and size, centred on the origin. */
function buildRazor(source: THREE.Group): THREE.Group {
  const model = source.clone(true);
  model.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    const finish = mesh.name.startsWith("ruchka") ? HORN : STEEL;
    mesh.material = new THREE.MeshStandardMaterial(finish);
  });

  const root = new THREE.Group();
  root.add(model);
  root.rotation.set(-1.25, 0.1, 0.55);
  root.updateMatrixWorld(true);

  const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  root.scale.setScalar(3.2 / Math.max(size.x, size.y, size.z));
  root.updateMatrixWorld(true);

  const center = new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3());
  root.position.sub(center);
  return root;
}

function Razor({ onReady }: { onReady: () => void }) {
  const gltf = useLoader(GLTFLoader, MODEL_URL, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const gl = useThree((state) => state.gl);
  const razor = useMemo(() => buildRazor(gltf.scene), [gltf.scene]);
  const pivot = useRef<THREE.Group>(null);

  // Soft studio reflections for the steel. Attached to the scene declaratively.
  const environment = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);

  useEffect(() => () => environment.dispose(), [environment]);

  useEffect(() => {
    onReady();
    return () => {
      razor.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) (mesh.material as THREE.Material).dispose();
      });
    };
  }, [onReady, razor]);

  // Subtle idle float and pointer tilt. Both are off when reduced motion is requested,
  // because the gate never mounts this component in that case.
  useFrame((state) => {
    const group = pivot.current;
    if (!group) return;
    group.rotation.y = state.pointer.x * 0.15;
    group.rotation.x = -state.pointer.y * 0.08;
    group.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.05;
  });

  return (
    <>
      <primitive attach="environment" object={environment} />
      <group ref={pivot}>
        <primitive object={razor} />
      </group>
    </>
  );
}

export default function RazorCanvas({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.2], fov: 28 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.2} />
      <spotLight position={[3, 5, 6]} intensity={80} angle={0.6} penumbra={0.5} color="#ffe2b0" />
      <Razor onReady={onReady} />
    </Canvas>
  );
}
