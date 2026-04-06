"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import {
  createParticlePositions,
  DEFAULT_PARTICLE_CONFIG,
} from "@/lib/three-scenes";

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const { positions, basePositions } = useMemo(() => {
    const cfg = DEFAULT_PARTICLE_CONFIG;
    const base = createParticlePositions(cfg.count, cfg.spread);
    return {
      positions: new Float32Array(base),
      basePositions: base,
    };
  }, []);

  useFrame(({ pointer, clock }) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();

    mouseRef.current.x +=
      (pointer.x * viewport.width * 0.5 - mouseRef.current.x) * 0.05;
    mouseRef.current.y +=
      (pointer.y * viewport.height * 0.5 - mouseRef.current.y) * 0.05;

    for (let i = 0; i < DEFAULT_PARTICLE_CONFIG.count; i++) {
      const i3 = i * 3;
      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];

      pos[i3] = bx + Math.sin(t * 0.3 + by * 0.5) * 0.3;
      pos[i3 + 1] = by + Math.cos(t * 0.2 + bx * 0.5) * 0.3;
      pos[i3 + 2] = bz + Math.sin(t * 0.4 + bx * by * 0.1) * 0.2;

      const dx = pos[i3] - mouseRef.current.x;
      const dy = pos[i3 + 1] - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = DEFAULT_PARTICLE_CONFIG.mouseInfluence;

      if (dist < influence) {
        const force = (1 - dist / influence) * 0.8;
        pos[i3] += dx * force * 0.3;
        pos[i3 + 1] += dy * force * 0.3;
      }
    }

    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={DEFAULT_PARTICLE_CONFIG.count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={DEFAULT_PARTICLE_CONFIG.color}
        transparent
        opacity={0.12}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

export default function Hero3D() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!hasWebGL()) setSupported(false);
  }, []);

  if (!supported) {
    return (
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#3B82F6]/5 to-transparent" />
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
