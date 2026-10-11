'use client';

import { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Lab', href: '#lab' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Subtle acoustic micro-tone via Web Audio API
  const playFeedbackSound = useCallback((freq = 440, type: OscillatorType = 'sine', duration = 0.05) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio context unavailable
    }
  }, [soundEnabled]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['work', 'about', 'skills', 'lab', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = useCallback((_href?: string) => {
    playFeedbackSound(580, 'sine', 0.08);
    setMenuOpen(false);
  }, [playFeedbackSound]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#030408]/85 backdrop-blur-xl border-b border-white/[0.08]'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-18 md:h-22">
          {/* Brand Wordmark & Telemetry Status */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              onClick={() => playFeedbackSound(440)}
              className="font-[family-name:var(--font-space-grotesk)] text-sm tracking-[0.3em] uppercase font-extrabold text-[#fafafa] hover:text-[#38bdf8] transition-colors duration-300"
              aria-label="Home"
            >
              {siteConfig.name}
            </a>
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] tracking-widest uppercase text-[#a1a1aa] font-mono">
                ONLINE
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links & Audio Synthesizer Toggle */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    onMouseEnter={() => playFeedbackSound(330, 'triangle', 0.03)}
                    className={`relative text-xs tracking-[0.2em] uppercase transition-colors duration-300 font-[family-name:var(--font-space-grotesk)] font-medium py-1 ${
                      isActive ? 'text-[#38bdf8]' : 'text-[#71717a] hover:text-[#fafafa]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#38bdf8] rounded-full shadow-[0_0_8px_#38bdf8]" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Audio Feedback Controller */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) {
                  try {
                    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.frequency.setValueAtTime(520, ctx.currentTime);
                    gain.gain.setValueAtTime(0.04, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.12);
                  } catch {}
                }
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-mono text-[#71717a] hover:text-[#fafafa] border border-white/[0.08] hover:border-white/[0.22] bg-white/[0.03] rounded-full transition-all duration-300"
              title={soundEnabled ? 'Mute sound synthesis' : 'Enable audio feedback'}
              aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span className="text-[10px] text-[#38bdf8]">AUDIO_ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#52525b]" />
                  <span className="text-[10px] text-[#52525b]">AUDIO_MUTED</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Controller */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-[#71717a] border border-white/[0.08] rounded-full bg-white/[0.03]"
              aria-label="Toggle audio"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#38bdf8]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-[#52525b]" />
              )}
            </button>

            {/* Mobile Drawer Trigger */}
            <button
              className="relative w-9 h-9 flex items-center justify-center focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span
                className={`block absolute h-[1.5px] w-5 bg-[#fafafa] transition-all duration-300 ${
                  menuOpen ? 'rotate-45 top-[17px]' : 'top-[13px]'
                }`}
              />
              <span
                className={`block absolute h-[1.5px] w-5 bg-[#fafafa] transition-all duration-300 ${
                  menuOpen ? '-rotate-45 top-[17px]' : 'top-[21px]'
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#030408]/95 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col items-center justify-center ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className="font-[family-name:var(--font-space-grotesk)] text-3xl font-light text-[#fafafa] hover:text-[#38bdf8] transition-colors duration-300 tracking-wider"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.4s, transform 0.4s, color 0.3s',
              }}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-8 pt-8 border-t border-white/[0.08] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-[#71717a] font-mono tracking-widest uppercase">
              AVAILABLE FOR NEW VENTURES
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
