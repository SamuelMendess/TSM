import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const steps = [
  { number: '01', title: 'Entender o negócio', description: 'Conversamos sobre público, oferta, canais atuais e o resultado que o projeto precisa apoiar.' },
  { number: '02', title: 'Definir o caminho', description: 'Organizo prioridades, escopo e entregáveis para você saber o que será criado e por quê.' },
  { number: '03', title: 'Criar e publicar', description: 'Desenvolvo as peças combinadas, reviso com você e preparo a publicação ou ativação.' },
  { number: '04', title: 'Medir e evoluir', description: 'Acompanhamos o que acontece depois da entrega para orientar os próximos ajustes.' },
];

export default function WorkflowSection({ onOpenModal }) {
  return (
    <section id="workflow" className="py-24 sm:py-28 relative border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.18em] font-medium text-neutral-400">Processo</p>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">Um caminho simples para tirar a ideia do papel.</h2>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <li key={step.number} className="bento-card p-7 sm:p-8 min-h-[235px]">
              <span className="font-mono text-2xl text-neutral-500">{step.number}</span>
              <h3 className="mt-9 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 p-8 sm:p-10 bento-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">Qual é o próximo projeto da sua empresa?</h3>
            <p className="mt-2 text-sm text-neutral-400 leading-relaxed">Landing pages de página única podem ser entregues em até 3 dias úteis após o início combinado, com escopo e materiais aprovados. Os demais serviços têm prazo definido na proposta.</p>
          </div>
          <button type="button" onClick={onOpenModal} className="min-h-11 px-6 py-3 rounded-full text-sm font-semibold text-black bg-white hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-2 flex-shrink-0">
            Falar sobre o projeto <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
