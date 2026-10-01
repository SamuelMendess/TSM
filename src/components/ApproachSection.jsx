import React from 'react';
import { ArrowUpRight, MousePointerClick, Search, Layers3 } from 'lucide-react';

const steps = [
  {
    icon: Layers3,
    title: 'Uma marca reconhecível',
    description: 'Identidade e mensagem coerentes para que o cliente entenda quem você é e por que escolher sua empresa.',
  },
  {
    icon: MousePointerClick,
    title: 'Uma experiência que orienta',
    description: 'Landing page, site ou loja com conteúdo claro, navegação simples e caminhos visíveis para pedir uma proposta ou comprar.',
  },
  {
    icon: Search,
    title: 'Presença e tráfego com intenção',
    description: 'Perfil da Empresa no Google e campanhas alinhados ao que seu público procura, levando as pessoas até uma página preparada para receber contatos.',
  },
];

export default function ApproachSection({ onOpenModal }) {
  return (
    <section id="approach" className="py-24 sm:py-28 relative border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-medium text-neutral-400">Abordagem</p>
            <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              As partes do seu digital devem trabalhar juntas.
            </h2>
            <p className="mt-5 text-base text-neutral-400 leading-relaxed">
              Uma campanha atrai a pessoa. A marca e a experiência do site ajudam a transformar esse interesse em contato. Planejo cada etapa a partir do objetivo do projeto.
            </p>
            <button type="button" onClick={onOpenModal} className="mt-7 min-h-11 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-neutral-300 transition-colors">
              Conversar sobre uma oportunidade <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="py-6 flex gap-5">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-neutral-200" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
