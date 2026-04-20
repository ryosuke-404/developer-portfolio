'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { profile } from '@/data/profile';

/* ─── Camera path (6 stations: 0=intro, 1-5=career) ─────── */

const CAM_STOPS: Array<{ pos: THREE.Vector3; look: THREE.Vector3 }> = [
  { pos: new THREE.Vector3( 0,    0.8,  14),   look: new THREE.Vector3( 0,    0,    0)   },
  { pos: new THREE.Vector3(-0.5,  0.6,  11),   look: new THREE.Vector3(-0.3,  0.2,  0)   },
  { pos: new THREE.Vector3(-3,    0.5,   8),   look: new THREE.Vector3(-1.8,  0.2,  0)   },
  { pos: new THREE.Vector3( 3,   -0.4,   5),   look: new THREE.Vector3( 1.8, -0.3,  0)   },
  { pos: new THREE.Vector3(-1,    0.3,   2),   look: new THREE.Vector3( 0,    0,   -2)   },
  { pos: new THREE.Vector3( 0,    0.2,  -0.5), look: new THREE.Vector3( 0,    0,   -5)   },
];

// Objects correspond to stations 1-5
const OBJ_POS: Array<[number, number, number]> = [
  [-0.5,  0.4,  10],
  [-3.2,  0.6,   7],
  [ 3.5, -0.3,   4],
  [-1.2,  0.4,   1],
  [ 0,    0.2,  -2.5],
];

const OBJ_COLORS = ['#4f8c62', '#6db89a', '#8b7ec8', '#c4956a', '#4f8c62'];

/* ─── Journey object shader ─────────────────────────────── */

const OBJ_VERT = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform float uPhase;
  uniform float uActive;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    vec3 pos = position;
    pos *= 1.0 + uActive * 0.12;
    pos.y += sin(uTime * 0.6 + uPhase) * 0.06 * (1.0 + uActive);
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vNormal  = normalize(normalMatrix * normal);
    vViewPos = mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const OBJ_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3  uColor;
  uniform float uTime;
  uniform float uPhase;
  uniform float uActive;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    vec3  viewDir = normalize(-vViewPos);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 1.8);
    float pulse   = 0.8 + 0.2 * sin(uTime * 1.4 + uPhase);
    float glow    = fresnel * (0.55 + 0.45 * uActive) * pulse;
    vec3  rimCol  = vec3(0.94, 0.92, 0.89);
    vec3  color   = mix(uColor * 0.4, rimCol, glow);
    float alpha   = glow * 0.80 + 0.06 * uActive;
    gl_FragColor  = vec4(color, alpha);
  }
`;

/* ─── Connection lines ───────────────────────────────────── */

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const { geometry, material } = useMemo(() => {
    const pts: number[] = [];
    OBJ_POS.forEach((a, i) => {
      if (i < OBJ_POS.length - 1) pts.push(...a, ...OBJ_POS[i + 1]);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0x4f8c62, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useFrame(({ clock }) => {
    if (linesRef.current)
      (linesRef.current.material as THREE.LineBasicMaterial).opacity =
        0.08 + Math.sin(clock.elapsedTime * 0.4) * 0.04;
  });
  return <lineSegments ref={linesRef} geometry={geometry} material={material} />;
}

/* ─── Single journey object ──────────────────────────────── */

function JourneyObject({
  progressRef, stationIdx, position, color, phase,
}: {
  progressRef: React.MutableRefObject<number>;
  stationIdx:  number;
  position:    [number, number, number];
  color:       string;
  phase:       number;
}) {
  const meshRef   = useRef<THREE.Mesh>(null);
  const activeRef = useRef(0);
  const N         = CAM_STOPS.length - 1; // 4

  const geos = useMemo(() => [
    new THREE.OctahedronGeometry(0.7, 0),
    new THREE.SphereGeometry(0.6, 12, 8),
    new THREE.TorusGeometry(0.55, 0.2, 8, 32),
    new THREE.IcosahedronGeometry(0.65, 0),
    new THREE.TetrahedronGeometry(0.7, 0),
  ], []);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: OBJ_VERT, fragmentShader: OBJ_FRAG,
    uniforms: {
      uTime:   { value: 0 },
      uPhase:  { value: phase },
      uActive: { value: 0 },
      uColor:  { value: new THREE.Color(color) },
    },
    transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  }), [color, phase]);

  useEffect(() => () => { geos.forEach(g => g.dispose()); material.dispose(); }, [geos, material]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t       = clock.elapsedTime;
    const p       = progressRef.current;
    const stationP = stationIdx / N;
    const dist    = Math.abs(p - stationP);
    const target  = Math.max(0, 1 - dist / 0.28);
    activeRef.current = THREE.MathUtils.lerp(activeRef.current, target, 0.06);
    material.uniforms.uTime.value   = t;
    material.uniforms.uActive.value = activeRef.current;
    const speed = 0.004 + activeRef.current * 0.012;
    meshRef.current.rotation.x += speed * 0.7;
    meshRef.current.rotation.y += speed;
  });

  // Object index 0→stationIdx 1, object 1→stationIdx 2, …
  return (
    <mesh
      ref={meshRef}
      geometry={geos[stationIdx - 1]}
      material={material}
      position={position}
    />
  );
}

/* ─── Travelling camera ──────────────────────────────────── */

function TravelCamera({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const smoothP    = useRef(0);
  const lookTarget = useRef(new THREE.Vector3());
  useFrame(() => {
    smoothP.current = THREE.MathUtils.lerp(smoothP.current, progressRef.current, 0.09);
    const N   = CAM_STOPS.length - 1;
    const raw = smoothP.current * N;
    const lo  = Math.floor(raw);
    const hi  = Math.min(lo + 1, N);
    const t   = raw - lo;
    const ease = t * t * (3 - 2 * t);
    camera.position.lerpVectors(CAM_STOPS[lo].pos, CAM_STOPS[hi].pos, ease);
    lookTarget.current.lerpVectors(CAM_STOPS[lo].look, CAM_STOPS[hi].look, ease);
    camera.lookAt(lookTarget.current);
  });
  return null;
}

/* ─── Ambient particles ──────────────────────────────────── */

function createAmbientParticles() {
  const ACOUNT = 320;
  const pos   = new Float32Array(ACOUNT * 3);
  const alpha = new Float32Array(ACOUNT);
  for (let i = 0; i < ACOUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 18;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    alpha[i]        = Math.random() * 0.35 + 0.05;
  }
  return { pos, alpha };
}

function AmbientParticles() {
  const { geometry, material } = useMemo(() => {
    const { pos, alpha } = createAmbientParticles();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,   3));
    geo.setAttribute('aAlpha',   new THREE.BufferAttribute(alpha, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        attribute float aAlpha; varying float vAlpha;
        void main() {
          vAlpha = aAlpha;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.0 * (280.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */`
        precision mediump float; varying float vAlpha;
        void main() {
          vec2  uv   = gl_PointCoord - 0.5;
          float disc = 1.0 - smoothstep(0.3, 0.5, length(uv) * 2.0);
          gl_FragColor = vec4(0.941, 0.925, 0.894, disc * vAlpha * 0.5);
        }
      `,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <points geometry={geometry} material={material} />;
}

/* ─── R3F scene ──────────────────────────────────────────── */

function Scene3D({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      <TravelCamera progressRef={progressRef} />
      <AmbientParticles />
      <ConnectionLines />
      {OBJ_POS.map((pos, i) => (
        <JourneyObject
          key={i}
          progressRef={progressRef}
          stationIdx={i + 1}
          position={pos}
          color={OBJ_COLORS[i]}
          phase={i * Math.PI * 0.5}
        />
      ))}
    </>
  );
}

/* ─── Station 0: profile intro card ─────────────────────── */

function IntroCard() {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex items-center px-8 md:px-16"
      style={{ zIndex: 10 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 max-w-xl">

        {/* Profile image */}
        <div className="relative shrink-0">
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden"
            style={{
              border:     '1px solid rgba(79,140,98,0.35)',
              boxShadow:  '0 0 48px rgba(79,140,98,0.18)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          {profile.now.available && (
            <span
              className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[var(--accent)] block"
              style={{ boxShadow: '0 0 8px var(--accent)' }}
            />
          )}
        </div>

        {/* Text */}
        <div>
          <p className="section-label mb-3">
            <span className="font-mono opacity-40 mr-2">01 —</span>About
          </p>
          <h2
            className="font-display font-extrabold tracking-tight text-[var(--text)] leading-[1.05] mb-3"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
          >
            Profile
          </h2>
          <motion.div
            className="w-8 h-px bg-[var(--accent)] mb-4 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-6 max-w-[34ch]">
            {profile.about.intro}
          </p>
          <div className="flex gap-8">
            {profile.skills.stats.map((s, i) => (
              <div key={i}>
                <p
                  className="font-display font-extrabold text-2xl"
                  style={{ color: i === 0 ? 'var(--accent)' : 'var(--accent-2)' }}
                >
                  {s.value}
                </p>
                <p className="font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Stations 1-4: story card ───────────────────────────── */

function StoryCard({ station }: { station: number }) {
  const item = profile.about.story[station - 1];
  if (!item) return null;
  return (
    <motion.div
      key={`story-${station}`}
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-8 right-8 md:left-16 md:right-auto md:max-w-sm top-1/2 -translate-y-1/2"
      style={{ zIndex: 10 }}
    >
      <div
        className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(79,140,98,0.12)', border: '1px solid rgba(79,140,98,0.25)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
        <span className="font-mono text-[11px] tracking-widest text-[var(--accent)]">
          {item.year}
        </span>
      </div>
      <h3
        className="font-display font-extrabold tracking-tight text-[var(--text)] leading-[1.1] mb-4 break-keep"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
      >
        {item.title}
      </h3>
      <motion.div
        className="w-8 h-px bg-[var(--accent)] mb-4 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      />
      <p className="text-[var(--muted)] text-sm leading-relaxed max-w-[28ch]">
        {item.text}
      </p>
    </motion.div>
  );
}

/* ─── Station dots ───────────────────────────────────────── */

const TOTAL_STATIONS = CAM_STOPS.length; // 5

function StationDots({ active }: { active: number }) {
  return (
    <div
      className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3"
      style={{ zIndex: 10 }}
    >
      {Array.from({ length: TOTAL_STATIONS }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={{
            width:      i === active ? 6 : 4,
            height:     i === active ? 6 : 4,
            opacity:    i === active ? 1 : 0.3,
            background: i === active ? 'var(--accent)' : 'var(--muted)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

/* ─── Exported component ─────────────────────────────────── */

export default function CareerScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef  = useRef(0);
  const [station, setStation] = useState(0);

  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset:  ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', v => {
      progressRef.current = v;
      setStation(Math.round(v * (TOTAL_STATIONS - 1)));
    });
  }, [scrollYProgress]);

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.04, 0.94, 1], [0, 1, 1, 0]);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      ref={containerRef}
      id="about"
      aria-label="About & Career Journey"
      style={{ height: '650vh', position: 'relative' }}
    >
      <motion.div
        className="sticky top-0 overflow-hidden bg-[var(--bg)]"
        style={{ height: '100svh', opacity: sectionOpacity }}
      >
        {/* Section label */}
        <div className="absolute top-8 left-8 md:left-16 z-20" style={{ opacity: 0.5 }}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">
            — Journey
          </p>
        </div>

        {/* Three.js canvas */}
        {!reduced && (
          <Canvas
            camera={{ position: [0, 0.8, 12], fov: 58 }}
            gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.3]}
            className="absolute inset-0"
          >
            <Scene3D progressRef={progressRef} />
          </Canvas>
        )}

        {/* HTML overlay */}
        <AnimatePresence mode="wait">
          {station === 0
            ? <IntroCard key="intro" />
            : <StoryCard key={station} station={station} />
          }
        </AnimatePresence>

        {/* Station dots */}
        <StationDots active={station} />

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
        >
          <motion.div
            className="w-px h-8 bg-[var(--accent)] origin-top"
            animate={{ scaleY: [0.2, 1, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--muted)]">
            scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
