'use client';

import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => null,
});

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <HeroScene />
    </div>
  );
}
