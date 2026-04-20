'use client';

/**
 * HeroScene — Two-layer Three.js Canvas for the Hero section.
 *
 * Layer 1 – ParticleField (original):
 *   1800 soft circular particles with organic drift + mouse pull.
 *
 * Layer 2 – FloatingObjects (new):
 *   3 glass-like geometric meshes (icosahedron, torus, octahedron).
 *   Fresnel shader gives them a holographic rim glow.
 *   They float independently and follow the mouse with a soft lag.
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Particle shader (unchanged) ───────────────────────── */

const VERT = /* glsl */ `
  precision mediump float;

  attribute float aSize;
  attribute float aAlpha;
  attribute float aType;

  uniform float uTime;
  uniform vec2  uMouse;

  varying float vAlpha;
  varying float vType;

  void main() {
    vec3 pos = position;

    float phase = pos.x * 0.38 + pos.y * 0.27 + pos.z * 0.19;
    pos.y += sin(uTime * 0.36 + phase) * 0.11;
    pos.x += cos(uTime * 0.27 + phase) * 0.09;
    pos.z += sin(uTime * 0.19 + phase * 0.5) * 0.07;

    vec2 mWorld = uMouse * 11.5;
    float mDist = distance(pos.xy, mWorld);
    float pull  = smoothstep(9.0, 0.0, mDist) * 0.20;
    pos.xy     += (mWorld - pos.xy) * pull;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = clamp(aSize * (290.0 / -mvPos.z), 0.4, 7.0);

    float radial = 1.0 - smoothstep(0.0, 13.0, length(pos.xy));
    vAlpha = aAlpha * radial;
    vType  = aType;

    gl_Position = projectionMatrix * mvPos;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;

  varying float vAlpha;
  varying float vType;

  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float r    = length(uv) * 2.0;
    float disc = 1.0 - smoothstep(0.60, 1.0, r);

    vec3 col;
    if      (vType < 0.72) col = vec3(0.941, 0.925, 0.894);
    else if (vType < 0.91) col = vec3(0.427, 0.722, 0.604);
    else                   col = vec3(0.545, 0.494, 0.784);

    gl_FragColor = vec4(col, disc * vAlpha * 0.75);
  }
`;

/* ─── Glass geometry shader ──────────────────────────────── */

const GLASS_VERT = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uPhase;

  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vec3 pos = position;

    // Per-object floating animation driven by phase offset
    pos.y += sin(uTime * 0.52 + uPhase) * 0.10;
    pos.x += cos(uTime * 0.41 + uPhase * 0.75) * 0.055;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vNormal  = normalize(normalMatrix * normal);
    vViewPos = mvPos.xyz;

    gl_Position = projectionMatrix * mvPos;
  }
`;

const GLASS_FRAG = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform float uTime;
  uniform float uPhase;

  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vec3  viewDir = normalize(-vViewPos);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.2);

    // Slow pulse on the rim intensity
    float pulse = 0.85 + 0.15 * sin(uTime * 0.9 + uPhase);

    vec3 rimColor = vec3(0.54, 0.49, 0.78); // accent-2 violet
    vec3 color    = mix(uColor * 0.35, rimColor, fresnel);
    float alpha   = fresnel * 0.72 * pulse + 0.04;

    gl_FragColor = vec4(color, alpha);
  }
`;

/* ─── Particle geometry builder ─────────────────────────── */

const COUNT = 1800;

function buildParticleScene() {
  const pos    = new Float32Array(COUNT * 3);
  const sizes  = new Float32Array(COUNT);
  const alphas = new Float32Array(COUNT);
  const types  = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 13;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    sizes[i]  = Math.random() * 1.3 + 0.4;
    alphas[i] = Math.random() * 0.40 + 0.10;
    types[i]  = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pos,    3));
  geometry.setAttribute('aSize',    new THREE.BufferAttribute(sizes,  1));
  geometry.setAttribute('aAlpha',   new THREE.BufferAttribute(alphas, 1));
  geometry.setAttribute('aType',    new THREE.BufferAttribute(types,  1));

  const material = new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime:  { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    },
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });

  return { geometry, material };
}

/* ─── ParticleField ──────────────────────────────────────── */

function ParticleField({ mouseRef }: { mouseRef: { current: THREE.Vector2 } }) {
  const smoothMouse = useRef(new THREE.Vector2(0, 0));
  const { geometry, material } = useMemo(() => buildParticleScene(), []);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame(({ clock }) => {
    smoothMouse.current.lerp(mouseRef.current, 0.035);
    if (material.uniforms) {
      material.uniforms.uTime.value  = clock.elapsedTime;
      material.uniforms.uMouse.value = smoothMouse.current;
    }
  });

  return <points geometry={geometry} material={material} />;
}

/* ─── Single floating glass mesh ─────────────────────────── */

interface FloatingMeshProps {
  mouseRef:  { current: THREE.Vector2 };
  geometry:  THREE.BufferGeometry;
  basePos:   [number, number, number];
  color:     string;
  phase:     number;
  rotSpeed:  [number, number, number];
}

function FloatingMesh({ mouseRef, geometry, basePos, color, phase, rotSpeed }: FloatingMeshProps) {
  const meshRef     = useRef<THREE.Mesh>(null);
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   GLASS_VERT,
    fragmentShader: GLASS_FRAG,
    uniforms: {
      uTime:  { value: 0 },
      uPhase: { value: phase },
      uColor: { value: new THREE.Color(color) },
    },
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
    side:        THREE.DoubleSide,
  }), [color, phase]);

  const matRef = useRef(material);
  matRef.current = material;

  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    smoothMouse.current.lerp(mouseRef.current, 0.022);

    const t  = clock.elapsedTime;
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
    }

    // Continuous rotation
    meshRef.current.rotation.x += rotSpeed[0] * 0.008;
    meshRef.current.rotation.y += rotSpeed[1] * 0.008;
    meshRef.current.rotation.z += rotSpeed[2] * 0.008;

    // Soft mouse-driven displacement
    meshRef.current.position.x = basePos[0] + smoothMouse.current.x * 0.45;
    meshRef.current.position.y =
      basePos[1] + smoothMouse.current.y * 0.28 + Math.sin(t * 0.5 + phase) * 0.08;
    meshRef.current.position.z = basePos[2];
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} position={basePos} />;
}

/* ─── FloatingObjects layer ─────────────────────────────── */

function FloatingObjects({ mouseRef }: { mouseRef: { current: THREE.Vector2 } }) {
  const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(0.88, 0), []);
  const torGeo = useMemo(() => new THREE.TorusGeometry(0.62, 0.22, 8, 32), []);
  const octGeo = useMemo(() => new THREE.OctahedronGeometry(0.82, 0), []);

  useEffect(() => () => {
    icoGeo.dispose();
    torGeo.dispose();
    octGeo.dispose();
  }, [icoGeo, torGeo, octGeo]);

  return (
    <>
      {/* Icosahedron — bottom-left */}
      <FloatingMesh
        mouseRef={mouseRef}
        geometry={icoGeo}
        basePos={[-4.6, -1.8, 1.2]}
        color="#4f8c62"
        phase={0}
        rotSpeed={[0.3, 0.5, 0.1]}
      />
      {/* Torus — right side */}
      <FloatingMesh
        mouseRef={mouseRef}
        geometry={torGeo}
        basePos={[4.8, 1.2, 0.6]}
        color="#8b7ec8"
        phase={2.1}
        rotSpeed={[0.55, 0.28, 0.18]}
      />
      {/* Octahedron — upper-centre-right */}
      <FloatingMesh
        mouseRef={mouseRef}
        geometry={octGeo}
        basePos={[1.5, 3.8, -0.8]}
        color="#6db89a"
        phase={4.2}
        rotSpeed={[0.18, 0.42, 0.32]}
      />
    </>
  );
}

/* ─── Exported component ─────────────────────────────────── */

export default function HeroScene() {
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current.set(
        (e.clientX / window.innerWidth)  *  2 - 1,
        -((e.clientY / window.innerHeight) *  2 - 1),
      );
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{
          antialias:       false,
          alpha:           true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        <ParticleField    mouseRef={mouseRef} />
        <FloatingObjects  mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
