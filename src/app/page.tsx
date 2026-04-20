import SmoothScroll from '@/components/SmoothScroll';
import Grain from '@/components/Grain';
import CustomCursor from '@/components/CustomCursor';
import PageLoader from '@/components/PageLoader';
import ScrollProgress from '@/components/ScrollProgress';
import MotionProvider from '@/components/MotionProvider';
import CursorSpotlight from '@/components/CursorSpotlight';
import Statement from '@/components/sections/Statement';
import Nav from '@/components/Nav';
import Marquee from '@/components/Marquee';
import Hero from '@/components/sections/Hero';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Works from '@/components/sections/Works';
import Values from '@/components/sections/Values';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
// Three.js scenes — ssr:false dynamic imports must live in a client component
import { ThreeBackground, CareerScene3D } from '@/components/DynamicScenes';

const marqueeItems = [
  'React', 'Next.js', 'TypeScript', 'Figma', 'Motion', 'GSAP',
  'UI Design', 'Creative Dev', 'Node.js', 'Tailwind', 'Supabase', 'Vercel',
];

const marqueeItems2 = [
  '日常の驚きをデザインに変える', 'Creative Developer', '丁寧なものづくり',
  'Open to Work', 'Based in Japan', 'Yoshioka Ryosuke',
];

export default function Home() {
  return (
    <MotionProvider>
    <SmoothScroll>
      <ThreeBackground />
      <CursorSpotlight />
      <ScrollProgress />
      <PageLoader />
      <Grain />
      <CustomCursor />
      <Nav />
      <main>
        <Hero />

        {/* ── Marquee strip 1 ── */}
        <div className="marquee-strip">
          <Marquee items={marqueeItems} speed={30} />
        </div>

        <Statement />

        {/* ── About + 3D scroll-driven career story ── */}
        <CareerScene3D />

        <Works />

        {/* ── Marquee strip 2 (reverse) ── */}
        <div className="marquee-strip">
          <Marquee items={marqueeItems2} speed={24} reverse />
        </div>

        <Skills />
        <Experience />
        <Values />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </SmoothScroll>
    </MotionProvider>
  );
}
