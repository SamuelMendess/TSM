import React from 'react';

const points = [
  {
    title: 'Conversa direta',
    description: 'Você fala com quem entende e executa o projeto, do primeiro briefing às decisões de entrega.',
  },
  {
    title: 'Escopo combinado',
    description: 'Objetivo, etapas e entregáveis definidos antes de começar, de acordo com a necessidade do negócio.',
  },
  {
    title: 'Olhar para aquisição',
    description: 'A criação considera desde cedo como o público vai chegar, navegar e entrar em contato.',
  },
];

export default function DifferentialsSection() {
  return (
    <section id="differentials" className="py-24 sm:py-28 relative border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs uppercase tracking-[0.18em] font-medium text-neutral-400">Como trabalho</p>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">Um projeto claro, do começo à publicação.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {points.map((point) => (
            <article key={point.title} className="bento-card p-7 sm:p-8">
              <div className="w-8 h-px bg-white/50 mb-8" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-white">{point.title}</h3>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{point.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
