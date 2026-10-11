'use client';

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-20 pointer-events-none">
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-[#08090e]/80 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff] animate-pulse" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#a1a1aa] font-mono">
          SCROLL TO EXPLORE
        </span>
      </div>
      <div className="w-[1px] h-6 bg-gradient-to-b from-[#4a9eff]/80 to-transparent" />
    </div>
  );
}
