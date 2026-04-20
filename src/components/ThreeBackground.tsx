'use client';

/**
 * ThreeBackground — fixed full-screen Three.js scene.
 * Provides two visual layers across the entire site:
 *   1. GLSL FBM smoke plane (additive, very subtle)
 *   2. Wireframe geometric shapes at varying z-depths
 *
 * Reacts to scroll (shapes shift downward) and mouse (subtle tilt).
 * Replaces the CSS-only BackgroundDepth component.
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── GLSL: Domain-warped FBM smoke ─────────────────────── */

const SMOKE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SMOKE_FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),               hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p  = p * 2.0 + vec2(1.7, 9.2);
      a *= 0.48;
    }
    return v;
  }

  void main() {
    vec2 st = vUv * 2.8;
    float t  = uTime * 0.055;

    // Two-level domain warping for organic turbulence
    vec2 q = vec2(fbm(st + t), fbm(st + vec2(5.2, 1.3) + t * 0.8));
    vec2 r = vec2(fbm(st + 1.2 * q + vec2(1.7, 9.2)),
                  fbm(st + 1.2 * q + vec2(8.3, 2.8) + t * 0.4));
    float f = fbm(st + 1.4 * r);

    // Low-opacity smoke
    float intensity = smoothstep(0.38, 0.78, f) * 0.065;

    // Shift colour accent-green → accent-violet with scroll
    vec3 col1 = vec3(0.31, 0.55, 0.38);
    vec3 col2 = vec3(0.54, 0.49, 0.78);
    float blend = clamp(uScroll * 1.6 + sin(uTime * 0.07) * 0.18, 0.0, 1.0);
    vec3 color  = mix(col1, col2, blend);

    gl_FragColor = vec4(color, intensity);
  }
`;

/* ─── Smoke plane ────────────────────────────────────────── */

type State = { scroll: number; mx: number; my: number };

function SmokePlane({ stateRef }: { stateRef: React.MutableRefObject<State> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScroll: { value: 0 } }),
    [],
  );

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value   = clock.elapsedTime;
    matRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uScroll.value,
      stateRef.current.scroll,
      0.014,
    );
  });

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[42, 32, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={SMOKE_VERT}
        fragmentShader={SMOKE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─── Wireframe shapes at 3 depth layers ─────────────────── */

function WireframeShapes({ stateRef }: { stateRef: React.MutableRefObject<State> }) {
  const groupRef    = useRef<THREE.Group>(null);
  const smoothState = useRef<State>({ scroll: 0, mx: 0, my: 0 });

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const s = stateRef.current;

    smoothState.current.scroll = THREE.MathUtils.lerp(smoothState.current.scroll, s.scroll, 0.018);
    smoothState.current.mx     = THREE.MathUtils.lerp(smoothState.current.mx,     s.mx,     0.028);
    smoothState.current.my     = THREE.MathUtils.lerp(smoothState.current.my,     s.my,     0.028);

    const { scroll, mx, my } = smoothState.current;
    groupRef.current.position.y = -scroll * 6;
    groupRef.current.rotation.y = t * 0.03  + mx * 0.12;
    groupRef.current.rotation.x = my * 0.08 + Math.sin(t * 0.02) * 0.04;
  });

  return (
    <group ref={groupRef}>
      {/* ── Far layer (blur-like via opacity) ── */}
      <mesh position={[6, 2.5, -8]} rotation={[0.4, 0, 0.3]}>
        <torusGeometry args={[3.2, 0.45, 8, 48]} />
        <meshBasicMaterial color="#4f8c62" wireframe transparent opacity={0.045} />
      </mesh>
      <mesh position={[-7, -3.5, -10]} rotation={[0.2, 0.5, 0.1]}>
        <torusGeometry args={[4.2, 0.5, 8, 48]} />
        <meshBasicMaterial color="#8b7ec8" wireframe transparent opacity={0.035} />
      </mesh>

      {/* ── Mid layer ── */}
      <mesh position={[8.5, 4.5, -5]} rotation={[0.6, 0.3, 0.1]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#6db89a" wireframe transparent opacity={0.055} />
      </mesh>
      <mesh position={[-8, -5.5, -5]} rotation={[0.2, 0.7, 0.1]}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial color="#4f8c62" wireframe transparent opacity={0.045} />
      </mesh>
      <mesh position={[0, 7, -6]} rotation={[0.1, 0.4, 0]}>
        <octahedronGeometry args={[2.2, 0]} />
        <meshBasicMaterial color="#8b7ec8" wireframe transparent opacity={0.04} />
      </mesh>

      {/* ── Near layer ── */}
      <mesh position={[3.5, -7, -3]} rotation={[0, 0.3, 0.5]}>
        <octahedronGeometry args={[1.3, 0]} />
        <meshBasicMaterial color="#8b7ec8" wireframe transparent opacity={0.07} />
      </mesh>
      <mesh position={[-4, 6, -2.5]} rotation={[0.8, 0, 0.2]}>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshBasicMaterial color="#6db89a" wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/* ─── Scene ──────────────────────────────────────────────── */

function Scene({ stateRef }: { stateRef: React.MutableRefObject<State> }) {
  return (
    <>
      <SmokePlane    stateRef={stateRef} />
      <WireframeShapes stateRef={stateRef} />
    </>
  );
}

/* ─── Exported component ─────────────────────────────────── */

export default function ThreeBackground() {
  const stateRef = useRef<State>({ scroll: 0, mx: 0, my: 0 });

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      stateRef.current.scroll = max > 0 ? window.scrollY / max : 0;
    };
    const onMove = (e: MouseEvent) => {
      stateRef.current.mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      stateRef.current.my = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll',    onScroll, { passive: true });
    window.addEventListener('mousemove', onMove,   { passive: true });
    return () => {
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{
          antialias:       false,
          alpha:           true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.2]}
      >
        <Scene stateRef={stateRef} />
      </Canvas>
    </div>
  );
}
