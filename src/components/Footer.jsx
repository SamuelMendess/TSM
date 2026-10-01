import React from 'react';

export default function Footer({ onOpenModal }) {
  return (
    <footer className="relative bg-black/70 border-t border-white/[0.08] pt-16 pb-10 text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-12 border-b border-white/[0.08]">
          <div>
            <h2 className="text-white font-semibold text-lg">Velox Tech Studio</h2>
            <p className="mt-3 text-sm leading-relaxed max-w-xs">Sites e landing pages, marketing local, campanhas e programação para colocar seu negócio em movimento.</p>
          </div>
          <nav aria-label="Serviços no rodapé">
            <h3 className="text-white font-medium text-sm">Serviços</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#services" className="hover:text-white transition-colors">Sites e landing pages</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Perfil da Empresa no Google</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Google Ads e Meta Ads</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Programação e automações</a></li>
            </ul>
          </nav>
          <div>
            <h3 className="text-white font-medium text-sm">Vamos conversar</h3>
            <p className="mt-4 text-sm leading-relaxed">Explique sua ideia ou o desafio do seu negócio.</p>
            <button type="button" onClick={onOpenModal} className="mt-4 min-h-11 text-sm font-medium text-white hover:text-neutral-300 transition-colors">Falar sobre um projeto →</button>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <span>© {new Date().getFullYear()} Velox Tech Studio. Todos os direitos reservados.</span>
          <a href="#hero" className="min-h-11 inline-flex items-center hover:text-white transition-colors">Voltar ao topo ↑</a>
        </div>
      </div>
    </footer>
  );
}
