import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { contactReady, getWhatsappUrl, leadEndpoint } from '../config/contact';

const interests = [
  'Site ou landing page',
  'E-commerce',
  'Identidade visual',
  'Google Ads ou Meta Ads',
  'Perfil da Empresa no Google',
  'Programação ou automação',
  'Outro projeto',
];

const initialForm = {
  name: '',
  business: '',
  whatsapp: '',
  email: '',
  interest: '',
  message: '',
};

export default function LeadModal({ isOpen, onClose, initialInterest = '' }) {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData((current) => ({ ...current, interest: interests.includes(initialInterest) ? initialInterest : '' }));
    }
  }, [isOpen, initialInterest]);

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateField = (field, value) => setFormData((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!contactReady || status === 'submitting') return;
    setError('');

    const params = new URLSearchParams(window.location.search);
    const payload = {
      ...formData,
      source: 'site-velox',
      page: window.location.pathname,
      campaign: {
        source: params.get('utm_source') || '',
        medium: params.get('utm_medium') || '',
        name: params.get('utm_campaign') || '',
        content: params.get('utm_content') || '',
        term: params.get('utm_term') || '',
      },
    };

    if (leadEndpoint) {
      setStatus('submitting');
      try {
        const response = await fetch(leadEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setStatus('success');
        setFormData(initialForm);
      } catch {
        setStatus('idle');
        setError('Não foi possível enviar agora. Tente novamente em instantes.');
      }
      return;
    }

    const message = `Olá! Sou ${formData.name}${formData.business ? `, da ${formData.business}` : ''}. Quero conversar sobre ${formData.interest.toLowerCase()}.${formData.message ? ` Meu projeto: ${formData.message}` : ''}`;
    window.location.assign(getWhatsappUrl(message));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="lead-modal-title" className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-[#0d0d0f] border border-white/[0.12] text-left shadow-2xl">
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar formulário" className="absolute top-5 right-5 min-w-11 min-h-11 rounded-full text-neutral-300 hover:text-white bg-white/[0.05] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {status === 'success' ? (
          <div className="py-12 pr-8" role="status">
            <h2 id="lead-modal-title" className="text-2xl font-semibold text-white">Recebemos seu projeto.</h2>
            <p className="mt-3 text-sm text-neutral-300 leading-relaxed">Obrigado pelo contato. Vamos analisar as informações e responder pelo canal informado.</p>
            <button type="button" onClick={onClose} className="mt-7 min-h-11 px-6 rounded-full bg-white text-black text-sm font-semibold">Fechar</button>
          </div>
        ) : !contactReady ? (
          <div className="py-10 pr-8">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">Contato comercial</p>
            <h2 id="lead-modal-title" className="mt-3 text-2xl font-semibold text-white">Estamos preparando este canal.</h2>
            <p className="mt-3 text-sm text-neutral-300 leading-relaxed">O formulário ainda não está conectado a uma caixa de entrada. Ele será ativado assim que definirmos o destino dos contatos.</p>
            <a href="#portfolio" onClick={onClose} className="mt-7 min-h-11 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-neutral-300">Conhecer projetos <ArrowUpRight className="w-4 h-4" aria-hidden="true" /></a>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">Seu próximo projeto</p>
            <h2 id="lead-modal-title" className="mt-3 pr-8 text-2xl font-semibold text-white">Conte o que você precisa criar.</h2>
            <p className="mt-3 text-sm text-neutral-300 leading-relaxed">Envie algumas informações para começarmos uma conversa sobre a melhor solução para sua empresa.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="lead-name" className="block text-sm font-medium text-neutral-200 mb-2">Seu nome</label>
                <input id="lead-name" type="text" required autoComplete="name" value={formData.name} onChange={(event) => updateField('name', event.target.value)} className="w-full min-h-11 px-4 rounded-xl bg-black border border-white/[0.16] text-white placeholder-neutral-500 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" placeholder="Como podemos chamar você?" />
              </div>
              <div>
                <label htmlFor="lead-business" className="block text-sm font-medium text-neutral-200 mb-2">Empresa ou projeto</label>
                <input id="lead-business" type="text" value={formData.business} onChange={(event) => updateField('business', event.target.value)} className="w-full min-h-11 px-4 rounded-xl bg-black border border-white/[0.16] text-white placeholder-neutral-500 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" placeholder="Nome do negócio, se já existir" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lead-whatsapp" className="block text-sm font-medium text-neutral-200 mb-2">Seu WhatsApp</label>
                  <input id="lead-whatsapp" type="tel" required autoComplete="tel" value={formData.whatsapp} onChange={(event) => updateField('whatsapp', event.target.value)} className="w-full min-h-11 px-4 rounded-xl bg-black border border-white/[0.16] text-white placeholder-neutral-500 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" placeholder="DDD + número" />
                </div>
                <div>
                  <label htmlFor="lead-email" className="block text-sm font-medium text-neutral-200 mb-2">E-mail (opcional)</label>
                  <input id="lead-email" type="email" autoComplete="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} className="w-full min-h-11 px-4 rounded-xl bg-black border border-white/[0.16] text-white placeholder-neutral-500 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" placeholder="voce@empresa.com" />
                </div>
              </div>
              <div>
                <label htmlFor="lead-interest" className="block text-sm font-medium text-neutral-200 mb-2">Principal interesse</label>
                <select id="lead-interest" required value={formData.interest} onChange={(event) => updateField('interest', event.target.value)} className="w-full min-h-11 px-4 rounded-xl bg-black border border-white/[0.16] text-white text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                  <option value="">Selecione um serviço</option>
                  {interests.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="lead-message" className="block text-sm font-medium text-neutral-200 mb-2">Sobre o projeto (opcional)</label>
                <textarea id="lead-message" rows="3" value={formData.message} onChange={(event) => updateField('message', event.target.value)} className="w-full px-4 py-3 rounded-xl bg-black border border-white/[0.16] text-white placeholder-neutral-500 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" placeholder="O que você gostaria de melhorar?" />
              </div>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              <button type="submit" disabled={status === 'submitting'} className="w-full min-h-11 px-6 rounded-full text-sm font-semibold text-black bg-white hover:bg-neutral-200 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2">
                {status === 'submitting' ? 'Enviando...' : leadEndpoint ? 'Enviar pedido de contato' : 'Continuar no WhatsApp'}
                {status !== 'submitting' && <ArrowUpRight className="w-4 h-4" aria-hidden="true" />}
              </button>
              {!leadEndpoint && <p className="text-xs text-neutral-400 leading-relaxed">O WhatsApp abrirá com sua mensagem pronta. Envie a mensagem na conversa para concluir o contato.</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
