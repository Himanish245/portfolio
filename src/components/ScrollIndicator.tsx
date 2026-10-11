'use client';

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
      <span className="text-xs tracking-[0.2em] uppercase text-[#888] font-[family-name:var(--font-inter)]">
        Scroll
      </span>
      <div className="w-[1px] h-8 bg-gradient-to-b from-[#888] to-transparent animate-pulse" />
    </div>
  );
}
