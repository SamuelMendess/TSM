import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '#services', label: 'Serviços' },
  { href: '#portfolio', label: 'Projetos' },
  { href: '#approach', label: 'Abordagem' },
  { href: '#workflow', label: 'Processo' },
];

export default function Navbar({ onOpenModal }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled || mobileOpen ? 'bg-black/90 backdrop-blur-md border-b border-white/[0.1]' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" className="flex items-center gap-2.5 group" aria-label="Velox Tech Studio, voltar ao início">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/[0.12] bg-neutral-950 flex items-center justify-center">
              <img src="/logo-velox-prism.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-base tracking-tight text-white">Velox <span className="text-neutral-400 font-normal">Studio</span></span>
          </a>

          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-7 text-sm">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="text-neutral-300 hover:text-white transition-colors">{link.label}</a>
            ))}
          </nav>

          <button type="button" onClick={onOpenModal} className="hidden sm:inline-flex min-h-11 items-center px-5 rounded-full text-sm font-semibold text-black bg-white hover:bg-neutral-200 transition-colors">
            Falar sobre um projeto
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden min-w-11 min-h-11 flex items-center justify-center text-neutral-200"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-nav" aria-label="Navegação móvel" className="md:hidden bg-black/95 border-t border-white/[0.08] px-6 py-5 space-y-1 backdrop-blur-2xl">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block min-h-11 py-3 text-sm text-neutral-200 hover:text-white">{link.label}</a>
          ))}
          <button type="button" onClick={() => { setMobileOpen(false); onOpenModal(); }} className="w-full min-h-11 mt-3 rounded-full text-sm font-semibold text-black bg-white">
            Falar sobre um projeto
          </button>
        </nav>
      )}
    </header>
  );
}
