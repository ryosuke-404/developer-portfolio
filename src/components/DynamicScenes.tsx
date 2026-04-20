'use client';

import dynamic from 'next/dynamic';

export const ThreeBackground = dynamic(
  () => import('./ThreeBackground'),
  { ssr: false },
);

export const CareerScene3D = dynamic(
  () => import('./CareerScene3D'),
  { ssr: false },
);
