'use client';

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-20 pointer-events-none">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#222] bg-[#0c0c10]/80 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff] animate-ping" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#aaa] font-mono">
          SCROLL TO EXPLODE 3D RIG
        </span>
      </div>
      <div className="w-[1px] h-7 bg-gradient-to-b from-[#4a9eff] to-transparent animate-pulse" />
    </div>
  );
}
