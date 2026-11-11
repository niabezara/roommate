"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars, Text, useCursor } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import * as THREE from "three";
import { AudioLines, RotateCcw, Volume2, VolumeX } from "lucide-react";

type ScenePhase = "intro" | "reveal" | "celebration";

const palette = {
  gold: "#f4d7a1",
  cream: "#fff4df",
  lilac: "#bca8ff",
  rose: "#f5a9c5",
};

function Dust() {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const { pointer } = useThree();
  const count = 1800;
  const positions = useRef<Float32Array>();

  if (!positions.current) {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 2.2 + Math.random() * 11;
      const angle = Math.random() * Math.PI * 2;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = (Math.random() - 0.5) * 9;
      values[i * 3 + 2] = Math.sin(angle) * radius - 4;
    }
    positions.current = values;
  }

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.012;
    points.current.scale.setScalar(1.65 - Math.min(state.clock.elapsedTime / 2.8, 0.65));
    points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, pointer.y * 0.025, 0.02);
    points.current.position.x = THREE.MathUtils.lerp(points.current.position.x, pointer.x * 0.15, 0.02);
    if (material.current) material.current.opacity = 0.43 + Math.sin(state.clock.elapsedTime * 0.65) * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={material} color="#d9c9ff" size={0.018} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[
        [-0.5, 0, 0, 0.68],
        [0, 0.16, 0.02, 0.82],
        [0.55, -0.02, 0, 0.58],
        [0.08, -0.17, 0.08, 0.72],
      ].map(([x, y, z, s], index) => (
        <mesh key={index} position={[x, y, z]} scale={s}>
          <sphereGeometry args={[0.55, 24, 20]} />
          <meshStandardMaterial color="#e8e2fa" roughness={0.8} transparent opacity={0.84} />
        </mesh>
      ))}
    </group>
  );
}

function Window({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[0.22, 0.32, 0.035]} />
        <meshStandardMaterial color="#ffe7ad" emissive="#ffc966" emissiveIntensity={2.2} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <boxGeometry args={[0.025, 0.34, 0.02]} />
        <meshStandardMaterial color="#8f6e5f" />
      </mesh>
      <mesh position={[0, 0, 0.026]}>
        <boxGeometry args={[0.24, 0.025, 0.02]} />
        <meshStandardMaterial color="#8f6e5f" />
      </mesh>
    </group>
  );
}

function House({ onEnter, phase }: { onEnter: () => void; phase: ScenePhase }) {
  const door = useRef<THREE.Group>(null);
  const wholeHouse = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [keyHovered, setKeyHovered] = useState(false);
  const keyGroup = useRef<THREE.Group>(null);
  useCursor(hovered || keyHovered);

  useEffect(() => {
    if (phase === "celebration" && door.current) {
      gsap.to(door.current.rotation, { y: -1.5, duration: 1.35, ease: "power3.inOut" });
      gsap.to(door.current.position, { x: -0.46, duration: 1.35, ease: "power3.inOut" });
      if (wholeHouse.current) gsap.to(wholeHouse.current.scale, { x: 1.035, y: 1.035, z: 1.035, duration: 1.2, ease: "power2.out" });
    } else if (door.current) {
      gsap.to(door.current.rotation, { y: 0, duration: 0.7, ease: "power2.out" });
      gsap.to(door.current.position, { x: 0, duration: 0.7 });
    }
  }, [phase]);

  useFrame((state) => {
    if (keyGroup.current) {
      keyGroup.current.position.y = 1.15 + Math.sin(state.clock.elapsedTime * 1.7) * 0.12;
      keyGroup.current.rotation.y += 0.009;
    }
    if (wholeHouse.current) {
      wholeHouse.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.13) * 0.025;
    }
  });

  return (
    <group ref={wholeHouse} position={[0, -0.48, 0]}>
      <mesh position={[0, -0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.25, 2.5, 0.34, 7]} />
        <meshStandardMaterial color="#b9a2c2" roughness={0.66} />
      </mesh>
      <mesh position={[-0.875, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 1.72, 1.75]} />
        <meshStandardMaterial color="#f4e9e1" roughness={0.82} />
      </mesh>
      <mesh position={[0.875, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 1.72, 1.75]} />
        <meshStandardMaterial color="#f4e9e1" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.42, 1.75]} />
        <meshStandardMaterial color="#f4e9e1" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.03, -0.835]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.72, 0.08]} />
        <meshStandardMaterial color="#f4e9e1" roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.78, 0]} receiveShadow>
        <boxGeometry args={[2.7, 0.07, 1.66]} />
        <meshStandardMaterial color="#cdb7b0" roughness={0.9} />
      </mesh>
      <group>
        <mesh position={[0, -0.39, -0.48]} castShadow>
          <boxGeometry args={[1.22, 0.4, 0.48]} />
          <meshStandardMaterial color="#aa7e8d" roughness={0.68} />
        </mesh>
        <mesh position={[0, -0.02, -0.66]} castShadow>
          <boxGeometry args={[1.22, 0.48, 0.18]} />
          <meshStandardMaterial color="#b9919e" roughness={0.68} />
        </mesh>
        {[-0.36, 0.36].map((x) => (
          <mesh key={x} position={[x, -0.12, -0.54]} rotation={[0, 0, x < 0 ? 0.1 : -0.1]}>
            <boxGeometry args={[0.34, 0.28, 0.12]} />
            <meshStandardMaterial color="#e3c2c0" roughness={0.86} />
          </mesh>
        ))}
        <mesh position={[0.94, -0.44, -0.43]} castShadow>
          <cylinderGeometry args={[0.2, 0.22, 0.35, 20]} />
          <meshStandardMaterial color="#b89f9e" roughness={0.56} />
        </mesh>
        <mesh position={[0.94, -0.25, -0.43]} castShadow>
          <cylinderGeometry args={[0.23, 0.23, 0.06, 20]} />
          <meshStandardMaterial color="#dbc5b4" roughness={0.42} />
        </mesh>
        <mesh position={[-0.93, -0.43, -0.48]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.32, 18]} />
          <meshStandardMaterial color="#c4a8a4" roughness={0.62} />
        </mesh>
      </group>
      <mesh position={[0, 1.02, 0]} castShadow>
        <coneGeometry args={[2.05, 1.6, 4]} />
        <meshStandardMaterial color="#76677f" roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.02, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.08, 1.61, 4]} />
        <meshStandardMaterial color="#8d7a91" roughness={0.63} />
      </mesh>
      <mesh position={[0.84, 1.8, 0.15]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.72, 8]} />
        <meshStandardMaterial color="#d5c2ae" roughness={0.7} />
      </mesh>
      <mesh position={[0.84, 2.2, 0.15]}>
        <cylinderGeometry args={[0.25, 0.31, 0.11, 8]} />
        <meshStandardMaterial color="#a28ca4" />
      </mesh>

      <Window position={[-0.86, 0.2, 0.895]} />
      <Window position={[0.86, 0.2, 0.895]} />
      <Window position={[1.405, 0.2, 0.36]} scale={0.88} />
      <Window position={[-1.405, 0.2, 0.36]} scale={0.88} />

      <group
        ref={door}
        position={[0, -0.39, 0.91]}
        onClick={(event) => {
          event.stopPropagation();
          onEnter();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, 0.43, 0]} castShadow>
          <boxGeometry args={[0.58, 0.86, 0.1]} />
          <meshStandardMaterial color={hovered ? "#a77a89" : "#896b79"} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0.43, 0.058]}>
          <boxGeometry args={[0.42, 0.66, 0.025]} />
          <meshStandardMaterial color="#987d88" roughness={0.5} />
        </mesh>
        <mesh position={[0.18, 0.42, 0.09]} castShadow>
          <sphereGeometry args={[0.045, 16, 12]} />
          <meshStandardMaterial color={palette.gold} metalness={0.6} roughness={0.24} />
        </mesh>
      </group>

      <mesh position={[0, -0.37, 1.15]} rotation={[-0.19, 0, 0]}>
        <boxGeometry args={[0.92, 0.18, 0.5]} />
        <meshStandardMaterial color="#d7beb1" roughness={0.78} />
      </mesh>
      {[[-1.08, -0.1, 0.99], [1.08, -0.1, 0.99]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.025, 0.035, 0.42, 7]} />
            <meshStandardMaterial color="#876e71" />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <coneGeometry args={[0.22, 0.55, 7]} />
            <meshStandardMaterial color={i ? "#778777" : "#829184"} />
          </mesh>
          <mesh position={[0.12, 0.13, 0.03]}>
            <sphereGeometry args={[0.08, 12, 10]} />
            <meshStandardMaterial color="#e9aabe" />
          </mesh>
        </group>
      ))}

      <group
        ref={keyGroup}
        position={[2.35, 1.15, 0.25]}
        onClick={(event) => {
          event.stopPropagation();
          onEnter();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setKeyHovered(true);
        }}
        onPointerOut={() => setKeyHovered(false)}
      >
        <Float speed={2.4} rotationIntensity={0.35} floatIntensity={0.18}>
          <mesh rotation={[0.1, 0, -0.3]} castShadow>
            <torusGeometry args={[0.18, 0.045, 12, 32]} />
            <meshStandardMaterial color={palette.gold} metalness={0.78} roughness={0.2} emissive="#8a6030" emissiveIntensity={keyHovered ? 0.8 : 0.25} />
          </mesh>
          <mesh position={[0.24, -0.15, 0]} rotation={[0, 0, -0.75]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.44, 12]} />
            <meshStandardMaterial color={palette.gold} metalness={0.78} roughness={0.2} />
          </mesh>
          <mesh position={[0.34, -0.31, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.11, 0.06, 0.06]} />
            <meshStandardMaterial color={palette.gold} metalness={0.78} roughness={0.2} />
          </mesh>
          <mesh position={[0.24, -0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.1, 0.055, 0.055]} />
            <meshStandardMaterial color={palette.gold} metalness={0.78} roughness={0.2} />
          </mesh>
        </Float>
        {keyHovered && <Sparkles count={14} scale={0.8} size={3} color={palette.gold} speed={0.6} />}
      </group>

      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.08}>
        <group position={[-2.25, 0.9, 0.22]}>
          <mesh rotation={[0.2, 0.4, -0.2]}>
            <torusGeometry args={[0.2, 0.055, 12, 28]} />
            <meshStandardMaterial color="#f2d5a5" metalness={0.35} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.32, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.56, 16]} />
            <meshStandardMaterial color="#f2d5a5" metalness={0.35} roughness={0.25} />
          </mesh>
        </group>
      </Float>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.1}>
        <group position={[1.72, 1.28, 1.28]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.105, 0.035, 10, 20]} />
            <meshStandardMaterial color="#e5aabc" roughness={0.34} />
          </mesh>
          <mesh position={[-0.1, 0.06, 0]}>
            <sphereGeometry args={[0.105, 14, 12]} />
            <meshStandardMaterial color="#e5aabc" roughness={0.34} />
          </mesh>
          <mesh position={[0.1, 0.06, 0]}>
            <sphereGeometry args={[0.105, 14, 12]} />
            <meshStandardMaterial color="#e5aabc" roughness={0.34} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function OrbitingBits() {
  return (
    <>
      {[
        { position: [-3.1, 0.65, -0.7] as [number, number, number], color: "#f6d794", symbol: "✦", size: 0.23 },
        { position: [3.05, -0.1, -0.25] as [number, number, number], color: "#f2b4cc", symbol: "✧", size: 0.28 },
        { position: [-2.9, -1.05, 0.4] as [number, number, number], color: "#d0baff", symbol: "✦", size: 0.18 },
        { position: [1.7, 2.2, -0.6] as [number, number, number], color: "#f4d7a1", symbol: "·", size: 0.5 },
      ].map((item, index) => (
        <Float key={index} speed={1.2 + index * 0.16} rotationIntensity={0.3} floatIntensity={0.2}>
          <Text position={item.position} fontSize={item.size} color={item.color} anchorX="center" anchorY="middle">
            {item.symbol}
          </Text>
        </Float>
      ))}
    </>
  );
}

function Portal() {
  return (
    <group position={[0, 0.1, -1.8]}>
      <mesh>
        <torusGeometry args={[2.83, 0.022, 10, 112]} />
        <meshStandardMaterial color="#d5b9ef" emissive="#a782e8" emissiveIntensity={2.2} transparent opacity={0.78} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[2.97, 0.012, 8, 112]} />
        <meshStandardMaterial color="#edc994" emissive="#d4a967" emissiveIntensity={1.7} transparent opacity={0.66} />
      </mesh>
      <mesh>
        <torusGeometry args={[2.72, 0.008, 8, 112]} />
        <meshBasicMaterial color="#efc7db" transparent opacity={0.35} />
      </mesh>
      <Sparkles count={90} scale={[6.2, 6.2, 0.7]} size={2.5} speed={0.3} color="#f0d7a6" opacity={0.72} />
    </group>
  );
}

function LittleCoffee() {
  return (
    <Float speed={1.6} rotationIntensity={0.14} floatIntensity={0.12}>
      <group position={[-2.25, -0.72, 0.72]}>
        <mesh position={[0, -0.13, 0]}>
          <cylinderGeometry args={[0.22, 0.25, 0.045, 28]} />
          <meshStandardMaterial color="#d9c2c2" roughness={0.36} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.145, 0.19, 0.25, 28]} />
          <meshStandardMaterial color="#fff0df" roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.117, 0]}>
          <cylinderGeometry args={[0.133, 0.133, 0.012, 28]} />
          <meshStandardMaterial color="#704c4b" roughness={0.28} />
        </mesh>
        <mesh position={[0.19, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.095, 0.025, 10, 22]} />
          <meshStandardMaterial color="#e5d0c3" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.14, 0]}>
          <torusGeometry args={[0.12, 0.012, 8, 24]} />
          <meshStandardMaterial color="#c6a9a8" roughness={0.34} />
        </mesh>
        <Sparkles count={8} scale={[0.38, 0.35, 0.3]} position={[0, 0.37, 0]} size={2} speed={0.35} color="#f4d7a1" opacity={0.48} />
      </group>
    </Float>
  );
}

function CameraRig({ phase }: { phase: ScenePhase }) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.08, 8.6));
  const base = useRef(new THREE.Vector3(0, 0.08, 8.6));
  const look = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    let position: [number, number, number];
    let focus: [number, number, number];
    if (phase === "intro") {
      position = [0, 0.08, 11];
      focus = [0, 0, 0];
    } else if (phase === "reveal") {
      position = [0, 0.2, 8.6];
      focus = [0, 0.06, 0];
    } else {
      position = [0, -0.15, 1.55];
      focus = [0, -0.18, -1.1];
    }
    const transition = gsap.timeline();
    transition.to(base.current, { x: position[0], y: position[1], z: position[2], duration: 2.1, ease: "power3.inOut" }, 0);
    transition.to(look.current, { x: focus[0], y: focus[1], z: focus[2], duration: 2.1, ease: "power3.inOut" }, 0);
    return () => { transition.kill(); };
  }, [phase]);

  useFrame(() => {
    target.current.set(base.current.x + pointer.x * 0.18, base.current.y + pointer.y * 0.1, base.current.z);
    camera.position.lerp(target.current, 0.035);
    const aim = new THREE.Vector3(look.current.x + pointer.x * 0.07, look.current.y + pointer.y * 0.05, look.current.z);
    camera.lookAt(aim);
  });

  return null;
}

function Burst({ phase }: { phase: ScenePhase }) {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useEffect(() => {
    if (phase === "celebration" && ref.current) {
      ref.current.visible = true;
      ref.current.scale.setScalar(0.1);
      gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: "expo.out" });
      gsap.fromTo(ref.current.rotation, { y: -1 }, { y: 1.4, duration: 5, ease: "power1.out" });
    } else if (ref.current) ref.current.visible = false;
  }, [phase]);

  return (
    <group ref={ref} visible={false} position={[0, 0, 0]}>
      <Sparkles count={280} scale={[13, 8, 7]} size={4.5} speed={1.1} color="#ffe5ae" opacity={0.95} />
      <Sparkles count={190} scale={[12, 7, 6]} size={3.5} speed={0.8} color="#f2aad0" opacity={0.9} />
      <Sparkles count={140} scale={[10, 6, 6]} size={3} speed={0.65} color="#c6b7ff" opacity={0.88} />
    </group>
  );
}

function DreamWorld({ phase, onEnter }: { phase: ScenePhase; onEnter: () => void }) {
  const { scene } = useThree();
  useEffect(() => {
    const color = phase === "celebration" ? new THREE.Color("#413a52") : new THREE.Color("#171527");
    gsap.to(scene.background as THREE.Color, {
      r: color.r,
      g: color.g,
      b: color.b,
      duration: 1.8,
      ease: "power2.inOut",
    });
  }, [phase, scene]);

  return (
    <>
      <color attach="background" args={["#171527"]} />
      <fog attach="fog" args={["#171527", 11, 27]} />
      <ambientLight intensity={0.55} color="#c9baff" />
      <hemisphereLight intensity={0.8} color="#fff4e8" groundColor="#554767" />
      <directionalLight position={[-4, 7, 5]} intensity={3.2} color="#ffe6c3" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 1.2, 2.8]} intensity={40} distance={9} color="#ffd18d" />
      <pointLight position={[-4, 2, -2]} intensity={22} distance={10} color="#aa8cff" />
      <pointLight position={[4, -1, 1]} intensity={12} distance={8} color="#e39dc0" />
      <Stars radius={85} depth={45} count={1500} factor={3} saturation={0.35} fade speed={0.15} />
      <Dust />
      <Cloud position={[-5.7, -1.5, -2.6]} scale={1.8} />
      <Cloud position={[5.2, -0.8, -3.4]} scale={2.2} />
      <Cloud position={[-4.5, 2.6, -5.2]} scale={1.4} />
      <Cloud position={[4.7, 2.4, -6.5]} scale={1.55} />
      <Portal />
      <mesh position={[0, -1.32, -0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.55, 64]} />
        <meshBasicMaterial color="#d4b6de" transparent opacity={0.1} />
      </mesh>
      <House onEnter={onEnter} phase={phase} />
      <OrbitingBits />
      <LittleCoffee />
      <Burst phase={phase} />
      <CameraRig phase={phase} />
    </>
  );
}

function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button className="sound-toggle" onClick={onToggle} aria-label={enabled ? "Turn sound off" : "Turn sound on"} title={enabled ? "Sound on" : "Sound off"}>
      {enabled ? <Volume2 size={15} strokeWidth={1.7} /> : <VolumeX size={15} strokeWidth={1.7} />}
      <span>{enabled ? "SOUND ON" : "SOUND OFF"}</span>
      {enabled && <AudioLines className="sound-wave" size={14} />}
    </button>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<ScenePhase>("intro");
  const [loaded, setLoaded] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const audio = useRef<AudioContext | null>(null);
  const oscillators = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const value = Math.min(100, ((now - start) / 1450) * 100);
      setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setLoaded(true), 320);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!loaded || phase !== "intro") return;
    const timer = window.setTimeout(() => setPhase("reveal"), 3900);
    return () => window.clearTimeout(timer);
  }, [loaded, phase]);

  useEffect(() => () => {
    oscillators.current.forEach((oscillator) => oscillator.stop());
    void audio.current?.close();
  }, []);

  const enter = useCallback(() => {
    if (phase !== "reveal") return;
    setPhase("celebration");
  }, [phase]);

  const replay = useCallback(() => {
    setPhase("intro");
    setLoaded(false);
    setProgress(0);
    window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const value = Math.min(100, ((now - start) / 1050) * 100);
        setProgress(value);
        if (value < 100) requestAnimationFrame(tick);
        else window.setTimeout(() => setLoaded(true), 260);
      };
      requestAnimationFrame(tick);
    }, 0);
  }, []);

  const toggleSound = useCallback(async () => {
    if (soundOn) {
      oscillators.current.forEach((oscillator) => oscillator.stop());
      oscillators.current = [];
      await audio.current?.close();
      audio.current = null;
      setSoundOn(false);
      return;
    }
    const context = new window.AudioContext();
    audio.current = context;
    const master = context.createGain();
    master.gain.value = 0.012;
    master.connect(context.destination);
    [174.61, 261.63, 349.23].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 1 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.55 : 0.18;
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();
      oscillators.current.push(oscillator);
    });
    setSoundOn(true);
  }, [soundOn]);

  return (
    <main className={`experience ${phase === "celebration" ? "is-celebrating" : ""}`}>
      <div className="ambient-wash" aria-hidden="true" />
      <Canvas
        className="dream-canvas"
        dpr={[1, 1.65]}
        shadows
        camera={{ position: [0, 0.08, 11], fov: 40 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.12;
        }}
      >
        <DreamWorld phase={phase} onEnter={enter} />
      </Canvas>

      <AnimatePresence>
        {!loaded && (
          <motion.div className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
            <div className="loader-orbit"><span /><i /><b /></div>
            <p className="loader-kicker">A LITTLE PLACE FOR US</p>
            <div className="loader-track"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
            <p className="loader-percent">{Math.round(progress).toString().padStart(2, "0")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {loaded && (
        <>
          <header className="topbar">
            <a className="wordmark" href="#" onClick={(event) => event.preventDefault()}>
              <span className="wordmark-mark">✳</span> THE LITTLE HOUSE
            </a>
            <div className="topbar-right">
              <span className="chapter-label"><i /> AN IMPORTANT QUESTION</span>
              <SoundToggle enabled={soundOn} onToggle={() => void toggleSound()} />
            </div>
          </header>

          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.section
                key="intro"
                className="intro-copy"
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="eyebrow"><span /> A NOTE FOR YOU <span /></p>
                <h1>Hey, <em>Irinka...</em></h1>
                <p className="intro-subtitle">I have something important<br />to ask you.</p>
                <div className="intro-rule" />
                <p className="scroll-hint">A LITTLE WORLD IS UNFOLDING <span>↓</span></p>
              </motion.section>
            )}
            {phase === "reveal" && (
              <motion.section
                key="reveal"
                className="reveal-copy"
                initial={{ opacity: 0, y: 22, filter: "blur(9px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="eyebrow reveal-eyebrow"><span /> THE BIG QUESTION <span /></p>
                <h1>IRINKA,<br /><span>WILL YOU BE</span><br /><em>MY ROOMMATE?</em></h1>
                <p className="reveal-subtitle">I think we&apos;d make a pretty iconic team.</p>
                <div className="interaction-hint">
                  <span className="hint-icon">↗</span>
                  <span>THE KEY IS YOURS<br /><small>Tap the little gold key or front door</small></span>
                </div>
              </motion.section>
            )}
            {phase === "celebration" && (
              <motion.section
                key="celebration"
                className="celebration-copy"
                initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="celebrate-seal">✳</div>
                <p className="eyebrow celebrate-eyebrow"><span /> THE BEST ANSWER <span /></p>
                <h1>SHE SAID <em>YES!</em></h1>
                <p className="celebration-subtitle">Welcome to our little chaos, Irinka.</p>
                <div className="approved-stamp"><span>✦</span> ROOMMATE APPLICATION: APPROVED <span>✓</span></div>
                <button className="replay-button" onClick={replay}><RotateCcw size={13} /> LIVE THIS LITTLE MOMENT AGAIN</button>
              </motion.section>
            )}
          </AnimatePresence>

          <footer className="bottom-bar">
            <span>MADE WITH <i>♥</i> & A SPARE KEY</span>
            <span className="bottom-center"><i /> YOUR NEXT CHAPTER STARTS HERE</span>
            <span>EST. WHENEVER YOU SAY YES</span>
          </footer>
        </>
      )}
    </main>
  );
}
