import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const capabilities = [
  'Sites e landing pages',
  'Marketing local',
  'Google Ads e Meta Ads',
  'Programação sob medida',
];

export default function HeroSection({ onOpenModal }) {
  return (
    <section id="hero" className="relative min-h-[88vh] pt-36 pb-20 flex items-center overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.18em] font-medium text-neutral-400">
            Velox Tech Studio · Sites, marketing e programação
          </p>

          <h1 className="mt-7 text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.08] max-w-4xl">
            Sua landing page pronta em até 3 dias úteis.
          </h1>

          <p className="mt-7 text-base sm:text-xl text-neutral-300 max-w-2xl leading-relaxed">
            Uma página profissional para apresentar seu negócio e receber contatos. Também cuido da sua presença no Google, de campanhas e de soluções sob medida para sua empresa.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenModal('Site ou landing page')}
              className="w-full sm:w-auto min-h-11 px-7 py-3 rounded-full text-sm font-semibold text-black bg-white hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-2"
            >
              Quero minha landing page <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href="#portfolio"
              className="w-full sm:w-auto min-h-11 px-5 py-3 rounded-full text-sm font-medium text-neutral-200 hover:text-white border border-white/15 hover:border-white/30 transition-colors inline-flex items-center justify-center"
            >
              Ver projetos realizados
            </a>
          </div>
          <p className="mt-5 max-w-xl text-xs text-neutral-400 leading-relaxed">
            Prazo para projetos de página única, a partir da aprovação do escopo e do recebimento dos materiais. A data de início é combinada conforme a agenda.
          </p>
        </div>

        <div className="mt-20 pt-7 border-t border-white/[0.1] grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 max-w-4xl">
          {capabilities.map((item) => (
            <div key={item} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
