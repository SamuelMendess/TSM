import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { portfolioCategories, portfolioItems } from '../data/portfolio';
import { getCardAccent } from '../config/cardAccents';

export default function PortfolioShowcase({ onOpenModal }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 sm:py-28 relative border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-9">
          <p className="text-xs uppercase tracking-[0.18em] font-medium text-neutral-400">Projetos selecionados</p>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">Trabalho aplicado a negócios diferentes.</h2>
          <p className="mt-5 text-base text-neutral-400 leading-relaxed">Lojas, portais e software mostram como a solução muda conforme o objetivo de cada projeto.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-9" aria-label="Filtrar projetos">
          {portfolioCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={activeCategory === category.id}
              className={`min-h-11 px-4 rounded-full text-sm font-medium transition-colors border ${activeCategory === category.id ? 'bg-white text-black border-white' : 'bg-white/[0.04] text-neutral-300 hover:text-white border-white/[0.1] hover:border-white/[0.25]'}`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <article key={item.id} className="bento-card accent-card flex flex-col min-h-[410px]" style={getCardAccent(item.id)}>
              <div className="relative h-48 p-6 flex flex-col justify-between bg-gradient-to-br from-neutral-800/70 via-neutral-950 to-black border-b border-white/[0.08] overflow-hidden">
                <div className="absolute -right-14 -bottom-20 w-56 h-56 rounded-full border border-white/[0.08]" aria-hidden="true" />
                <div className="absolute -right-4 -bottom-12 w-40 h-40 rounded-full border border-white/[0.08]" aria-hidden="true" />
                <span className="relative text-xs text-neutral-300">{item.categoryLabel}</span>
                <span className="relative text-2xl font-semibold text-white tracking-tight max-w-[85%]">{item.client}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-white leading-snug">{item.title}</h3>
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed flex-1">{item.summary}</p>
                <p className="mt-5 pt-4 border-t border-white/[0.08] text-xs text-neutral-400">{item.contribution}</p>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 min-h-11 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-neutral-300 transition-colors">
                    Acessar projeto <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                ) : (
                  <button type="button" onClick={onOpenModal} className="mt-4 min-h-11 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-neutral-300 transition-colors text-left">
                    Conversar sobre projeto semelhante <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
