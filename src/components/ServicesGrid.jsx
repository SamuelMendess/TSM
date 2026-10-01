import React from 'react';
import { ArrowUpRight, Globe2, MapPin, Palette, Megaphone, Code2 } from 'lucide-react';
import { getCardAccent } from '../config/cardAccents';

const services = [
  {
    id: 'site',
    icon: Globe2,
    number: '02',
    title: 'Sites e lojas virtuais',
    description: 'Projetos com mais páginas ou uma estrutura de venda online, de acordo com o que sua operação precisa.',
    deliverables: ['Site institucional', 'E-commerce', 'Escopo e prazo próprios'],
    interest: 'Site ou landing page',
  },
  {
    id: 'google-local',
    accent: 'google',
    icon: MapPin,
    number: '03',
    title: 'Seu negócio no Google',
    description: 'Criação e organização do Perfil da Empresa no Google, conhecido como Google Meu Negócio, para apresentar seu estabelecimento nas buscas e no Maps.',
    deliverables: ['Cadastro e informações', 'Categorias e fotos', 'Orientação para verificação'],
    interest: 'Perfil da Empresa no Google',
  },
  {
    id: 'ads',
    icon: Megaphone,
    number: '04',
    title: 'Google Ads e Meta Ads',
    description: 'Campanhas planejadas com páginas adequadas, criativos e acompanhamento dos contatos gerados.',
    deliverables: ['Planejamento de campanha', 'Criativos e anúncios', 'Medição e otimização'],
    interest: 'Google Ads ou Meta Ads',
  },
  {
    id: 'development',
    icon: Code2,
    number: '05',
    title: 'Programação e automações',
    description: 'Sistemas, integrações e recursos específicos para simplificar a rotina da sua empresa. O ZapIA CRM é um exemplo desse trabalho.',
    deliverables: ['Aplicações web', 'Integrações', 'Automação de processos'],
    interest: 'Programação ou automação',
  },
];

export default function ServicesGrid({ onOpenModal }) {
  return (
    <section id="services" className="py-24 sm:py-28 relative border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.18em] font-medium text-neutral-400">Serviços</p>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
            Sua página é o começo. O negócio pode ir além.
          </h2>
          <p className="mt-5 text-base text-neutral-400 leading-relaxed max-w-2xl">
            Comece com uma landing page para apresentar sua oferta. Quando precisar, podemos ampliar o site, trabalhar os canais de marketing ou desenvolver uma solução específica.
          </p>
        </div>

        <article className="bento-card accent-card p-7 sm:p-10 mb-5 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16" style={getCardAccent('landing')}>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-300">01 · Landing page · Até 3 dias úteis</p>
            <h3 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-white">Uma página com um objetivo: gerar contato.</h3>
            <p className="mt-4 text-sm sm:text-base text-neutral-400 leading-relaxed">Para prestadores de serviço, pequenos negócios e campanhas que precisam de uma oferta clara e um caminho simples para pedir orçamento.</p>
            <button type="button" onClick={() => onOpenModal('Site ou landing page')} className="mt-7 min-h-11 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold inline-flex items-center gap-2 hover:bg-neutral-200 transition-colors">
              Quero minha landing page <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <div className="lg:border-l lg:border-white/[0.1] lg:pl-10">
            <p className="text-sm font-medium text-white">O pacote de página única inclui</p>
            <ul className="mt-5 space-y-3 text-sm text-neutral-300">
              {['Até 6 seções para apresentar sua oferta', 'Design adaptado à sua marca e ao celular', 'Botão de WhatsApp ou formulário de contato', 'Publicação no domínio combinado', 'Uma rodada de ajustes dentro do escopo'].map((item) => (
                <li key={item} className="flex gap-3"><span className="text-neutral-500" aria-hidden="true">—</span>{item}</li>
              ))}
            </ul>
            <p className="mt-6 pt-5 border-t border-white/[0.08] text-xs text-neutral-400 leading-relaxed">O prazo começa com o escopo aprovado, os materiais e acessos necessários recebidos e a data de início confirmada. Domínio, hospedagem e integrações são alinhados na proposta.</p>
          </div>
        </article>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.id} className="bento-card accent-card p-7 sm:p-9 flex flex-col justify-between min-h-[320px]" style={getCardAccent(service.accent || service.id)}>
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="accent-icon w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-sm text-neutral-500">{service.number}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold text-white tracking-tight">{service.title}</h3>
                  <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">{service.description}</p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/[0.08]">
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-neutral-300">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-neutral-400" aria-hidden="true" />{item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => onOpenModal(service.interest)}
                    className="mt-7 min-h-11 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-neutral-300 transition-colors"
                  >
                    Conversar sobre {service.title.toLowerCase()} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 bento-card accent-card p-7 sm:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8" style={getCardAccent('branding')}>
          <Palette className="accent-icon w-6 h-6 text-neutral-300 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Sua marca também faz parte da experiência.</h3>
            <p className="mt-1 text-sm text-neutral-400 leading-relaxed">Também trabalho com identidade visual e peças para sua presença digital, com escopo definido para cada projeto.</p>
          </div>
          <button type="button" onClick={() => onOpenModal('Identidade visual')} className="min-h-11 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-neutral-300 transition-colors">
            Conversar sobre a marca <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
