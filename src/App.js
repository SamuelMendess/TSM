import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuração do Tailwind CSS (assumindo que está configurado no ambiente)
// Para usar as cores personalizadas no Tailwind, você precisaria estender o tailwind.config.js
// Exemplo:
// module.exports = {
//   theme: {
//     extend: {
//       colors: {
//         'tsm-purple': '#8A2BE2', // Roxo
//         'tsm-violet': '#EE82EE', // Violeta
//       }
//     }
//   }
// }
// Para este exemplo, usaremos classes de cores Tailwind existentes que se aproximam.

// Componente de Cabeçalho (Header)
const Header = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para o menu mobile

  return (
    <header className="bg-gray-900 text-gray-100 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo da Agência */}
        <h1 className="text-3xl font-bold font-poppins text-tsm-purple">TSM Soluções</h1>

        {/* Botão do menu Hamburger para mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-100 focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>

        {/* Navegação Principal */}
        <nav className={`md:flex space-x-8 ${isOpen ? 'block absolute top-full left-0 w-full bg-gray-900 p-4 shadow-lg' : 'hidden'}`}>
          <ul className={`md:flex md:space-x-8 md:flex-row flex-col ${isOpen ? 'flex' : 'hidden md:flex'}`}>
            <li>
              <button
                onClick={() => { onNavigate('home'); setIsOpen(false); }}
                className={`block py-2 px-4 rounded-md text-lg font-inter transition-colors duration-300 ${currentPage === 'home' ? 'text-tsm-violet bg-gray-800' : 'hover:text-tsm-violet'}`}
              >
                Início
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('quemSomos'); setIsOpen(false); }}
                className={`block py-2 px-4 rounded-md text-lg font-inter transition-colors duration-300 ${currentPage === 'quemSomos' ? 'text-tsm-violet bg-gray-800' : 'hover:text-tsm-violet'}`}
              >
                Quem Somos
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('solucoes'); setIsOpen(false); }}
                className={`block py-2 px-4 rounded-md text-lg font-inter transition-colors duration-300 ${currentPage === 'solucoes' ? 'text-tsm-violet bg-gray-800' : 'hover:text-tsm-violet'}`}
              >
                Soluções
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('amazonSeller'); setIsOpen(false); }}
                className={`block py-2 px-4 rounded-md text-lg font-inter transition-colors duration-300 ${currentPage === 'amazonSeller' ? 'text-tsm-violet bg-gray-800' : 'hover:text-tsm-violet'}`}
              >
                Amazon Sellers
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('cases'); setIsOpen(false); }}
                className={`block py-2 px-4 rounded-md text-lg font-inter transition-colors duration-300 ${currentPage === 'cases' ? 'text-tsm-violet bg-gray-800' : 'hover:text-tsm-violet'}`}
              >
                Cases
              </button>
            </li>
            <li>
              {/* Novo link para o Chatbot */}
              <button
                onClick={() => { onNavigate('chatbot'); setIsOpen(false); }}
                className={`block py-2 px-4 rounded-md text-lg font-inter transition-colors duration-300 ${currentPage === 'chatbot' ? 'text-tsm-violet bg-gray-800' : 'hover:text-tsm-violet'}`}
              >
                Chat com IA
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('contato'); setIsOpen(false); }}
                className={`block py-2 px-4 rounded-md text-lg font-inter transition-colors duration-300 ${currentPage === 'contato' ? 'text-tsm-violet bg-gray-800' : 'hover:text-tsm-violet'}`}
              >
                Contato
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Componente de Botão Reutilizável
const TSMButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 ${className}`}
  >
    {children}
  </button>
);

// Componente de Título de Seção
const SectionTitle = ({ children }) => (
  <h2 className="text-4xl font-bold font-poppins text-center text-gray-100 mb-12 relative">
    {children}
    <span className="block w-20 h-1 bg-tsm-violet mx-auto mt-4 rounded-full"></span>
  </h2>
);

// Componente do Chatbot com Gemini API
const ChatbotPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null); // Ref para rolar para o final do chat

  // Rola para o final do chat quando novas mensagens são adicionadas
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage = { role: "user", parts: [{ text: userInput.trim() }] };
    const updatedChatHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedChatHistory);
    setUserInput('');
    setIsLoading(true);
    setError('');

    try {
      const apiKey = ""; // A chave será fornecida pelo ambiente Canvas
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: updatedChatHistory, // Envia o histórico completo para contexto
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const aiResponseText = result.candidates[0].content.parts[0].text;
        setChatHistory(prev => [...prev, { role: "model", parts: [{ text: aiResponseText }] }]);
      } else {
        setError('A IA não conseguiu responder. Tente reformular sua pergunta.');
        console.error("Estrutura de resposta inesperada da IA:", result);
      }
    } catch (err) {
      console.error("Erro ao chamar a API Gemini:", err);
      setError('Erro de conexão com a IA. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-20">
      <div className="container mx-auto px-4">
        <SectionTitle>Chat com a TSM IA</SectionTitle>
        <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 flex flex-col h-[70vh]">
          <div className="flex-grow overflow-y-auto p-4 rounded-lg bg-gray-700 mb-4 custom-scrollbar">
            {chatHistory.length === 0 ? (
              <p className="text-gray-400 text-center italic">
                Olá! Sou a IA da TSM Soluções. Como posso ajudar você hoje? Pergunte sobre nossos serviços, tráfego pago, marketplaces ou e-commerce!
              </p>
            ) : (
              chatHistory.map((message, index) => (
                <div key={index} className={`mb-4 p-3 rounded-lg ${message.role === 'user' ? 'bg-tsm-purple text-white ml-auto text-right' : 'bg-gray-600 text-gray-100 mr-auto text-left'}`} style={{ maxWidth: '80%' }}>
                  <p className="font-inter">{message.parts[0].text}</p>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-center items-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tsm-violet"></div>
                <p className="ml-3 text-tsm-violet">Digitando...</p>
              </div>
            )}
            {error && (
              <p className="text-red-400 text-center mt-4">{error}</p>
            )}
            <div ref={chatEndRef} /> {/* Elemento para rolagem automática */}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow shadow appearance-none border rounded-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:border-tsm-violet"
              placeholder="Digite sua pergunta..."
              disabled={isLoading}
            />
            <TSMButton type="submit" disabled={isLoading}>
              Enviar
            </TSMButton>
          </form>
          <p className="text-gray-400 text-sm text-center mt-4">
            Para dúvidas mais específicas ou para agendar uma análise, por favor, utilize nossa página de Contato.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Páginas do Site ---

// Página Inicial (Home)
const HomePage = ({ onNavigate }) => (
  <div className="min-h-screen bg-gray-900 text-gray-100">
    {/* Hero Section */}
    <section className="relative h-screen flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.8), rgba(26, 26, 26, 0.8)), url(https://placehold.co/1920x1080/1a1a1a/ffffff?text=Fundo+Hero+Section)' }}>
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold font-poppins mb-6 leading-tight animate-fade-in-up">
          Sua Solução em <span className="text-tsm-violet">Performance Digital</span>
        </h1>
        <p className="text-xl md:text-2xl font-inter mb-10 max-w-3xl mx-auto animate-fade-in-up delay-200">
          Estratégias baseadas em dados para escalar seu faturamento no e-commerce e marketplaces.
        </p>
        <TSMButton onClick={() => onNavigate('contato')} className="animate-fade-in-up delay-400">
          Agendar Análise Gratuita
        </TSMButton>
      </div>
    </section>

    {/* Prova Social */}
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xl font-inter text-gray-300 mb-8">Parceiros e Clientes que Confiam:</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {/* Logos de exemplo - substitua por logos reais */}
          <img src="https://placehold.co/150x50/333/ffffff?text=Google+Partner" alt="Google Partner" className="h-12 opacity-75 hover:opacity-100 transition-opacity duration-300" />
          <img src="https://placehold.co/150x50/333/ffffff?text=Meta+Partner" alt="Meta Partner" className="h-12 opacity-75 hover:opacity-100 transition-opacity duration-300" />
          <img src="https://placehold.co/150x50/333/ffffff?text=Cliente+A" alt="Cliente A" className="h-12 opacity-75 hover:opacity-100 transition-opacity duration-300" />
          <img src="https://placehold.co/150x50/333/ffffff?text=Cliente+B" alt="Cliente B" className="h-12 opacity-75 hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </section>

    {/* Nossas Soluções (Visão Geral) */}
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionTitle>Nossas Soluções</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cartão de Solução 1: Tráfego Pago */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
            <div className="text-tsm-violet mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8L11 2m9 20H4a2 2 0 01-2-2V6a2 2 0 012-2h9l3 3h7a2 2 0 012 2v10a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold font-poppins text-center mb-4 text-gray-100">Gestão de Tráfego Pago</h3>
            <p className="text-gray-300 text-center font-inter">
              Campanhas de alta performance no Google Ads, Meta Ads e mais, para maximizar seu ROAS.
            </p>
            <div className="text-center mt-6">
              <button onClick={() => onNavigate('solucoes')} className="text-tsm-violet hover:underline font-inter">Saiba Mais</button>
            </div>
          </div>
          {/* Cartão de Solução 2: Gestão de Marketplaces */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
            <div className="text-tsm-violet mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold font-poppins text-center mb-4 text-gray-100">Gestão de Marketplaces</h3>
            <p className="text-gray-300 text-center font-inter">
              Otimização de anúncios e reputação no Mercado Livre e Amazon.
            </p>
            <div className="text-center mt-6">
              <button onClick={() => onNavigate('solucoes')} className="text-tsm-violet hover:underline font-inter">Saiba Mais</button>
            </div>
          </div>
          {/* Cartão de Solução 3: Consultoria de E-commerce */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
            <div className="text-tsm-violet mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold font-poppins text-center mb-4 text-gray-100">Consultoria de E-commerce</h3>
            <p className="text-gray-300 text-center font-inter">
              Otimização da taxa de conversão (CRO) e planejamento estratégico para o crescimento.
            </p>
            <div className="text-center mt-6">
              <button onClick={() => onNavigate('solucoes')} className="text-tsm-violet hover:underline font-inter">Saiba Mais</button>
            </div>
          </div>
        </div>
        {/* Novo CTA para Amazon Seller Solutions - Agora para a página dedicada */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold font-poppins text-gray-100 mb-6">
            Especialistas em <span className="text-tsm-violet">Amazon Sellers</span>
          </h3>
          <p className="text-xl font-inter text-gray-300 mb-8 max-w-2xl mx-auto">
            Conquiste a Buy Box, otimize suas listagens e domine a Amazon com estratégias focadas em resultados.
          </p>
          <TSMButton onClick={() => onNavigate('amazonSeller')}>
            Descubra Nossas Soluções Amazon
          </TSMButton>
        </div>
      </div>
    </section>

    {/* Case de Sucesso em Destaque */}
    <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <SectionTitle>Case de Sucesso em Destaque</SectionTitle>
        <div className="flex flex-col md:flex-row items-center bg-gray-700 rounded-lg shadow-xl overflow-hidden border border-gray-600">
          <div className="md:w-1/2 p-8">
            <img src="https://placehold.co/600x400/555/ffffff?text=Case+Mercado+Livre" alt="Case de Sucesso Mercado Livre" className="rounded-lg shadow-md w-full h-auto object-cover" />
          </div>
          <div className="md:w-1/2 p-8">
            <h3 className="text-3xl font-bold font-poppins text-tsm-violet mb-4">Cliente X: Explosão de Vendas no Mercado Livre</h3>
            <p className="text-gray-200 text-lg font-inter mb-6">
              Nosso cliente, um vendedor de eletrônicos, enfrentava estagnação nas vendas. Aplicamos uma estratégia focada em otimização de anúncios e tráfego pago.
            </p>
            <ul className="list-disc list-inside text-gray-300 font-inter mb-6">
              <li>Aumento de <span className="font-bold text-tsm-violet">150%</span> nas vendas em 4 meses.</li>
              <li>Redução de <span className="font-bold text-tsm-violet">30%</span> no custo por clique.</li>
              <li>Melhora significativa na reputação da loja.</li>
            </ul>
            <TSMButton onClick={() => onNavigate('cases')}>
              Ver Todos os Cases
            </TSMButton>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Final */}
    <section className="py-20 bg-gray-900 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-poppins text-gray-100 mb-6">
          Pronto para Escalar Suas Vendas?
        </h2>
        <p className="text-xl font-inter text-gray-300 mb-10">
          Fale com um de nossos especialistas e descubra como a TSM Soluções pode transformar seu negócio.
        </p>
        <TSMButton onClick={() => onNavigate('contato')}>
          Fale com um Especialista
        </TSMButton>
      </div>
    </section>
  </div>
);

// Página Quem Somos
const QuemSomosPage = () => (
  <div className="min-h-screen bg-gray-900 text-gray-100 py-20">
    <div className="container mx-auto px-4">
      <SectionTitle>Quem Somos</SectionTitle>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg font-inter mb-8 leading-relaxed">
          A TSM Soluções nasceu da paixão por resultados e da crença de que o marketing digital, quando feito com estratégia e dados, é a chave para o crescimento sustentável de qualquer negócio online. Somos uma agência especializada em performance, focada em tráfego pago, gestão de marketplaces e consultoria de e-commerce.
        </p>
        <p className="text-lg font-inter mb-8 leading-relaxed">
          Nossa missão é transformar o potencial dos nossos clientes em vendas reais, otimizando cada etapa do funil e garantindo o melhor retorno sobre o investimento em anúncios (ROAS). Trabalhamos com transparência, dedicação e uma equipe de especialistas que está sempre atualizada com as últimas tendências do mercado.
        </p>
        <h3 className="text-3xl font-bold font-poppins text-tsm-violet mb-6 mt-12">Nossa Filosofia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h4 className="text-xl font-bold font-poppins mb-3">Foco em Dados</h4>
            <p className="text-gray-300 font-inter">Todas as nossas decisões são baseadas em análises profundas e métricas claras.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h4 className="text-xl font-bold font-poppins mb-3">Transparência Total</h4>
            <p className="text-gray-300 font-inter">Relatórios detalhados e comunicação aberta com nossos clientes.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h4 className="text-xl font-bold font-poppins mb-3">Resultados Reais</h4>
            <p className="text-gray-300 font-inter">Nosso sucesso é medido pelo crescimento do seu faturamento.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Página Soluções
const SolucoesPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-20">
      <div className="container mx-auto px-4">
        <SectionTitle>Nossas Soluções</SectionTitle>

        {/* Gestão de Tráfego Pago */}
        <section className="mb-20 bg-gray-800 p-10 rounded-lg shadow-xl border border-gray-700">
          <h3 className="text-3xl font-bold font-poppins text-tsm-violet mb-6">Gestão de Tráfego Pago</h3>
          <p className="text-lg font-inter mb-6 leading-relaxed">
            Dominamos as plataformas de anúncios mais poderosas para levar seu produto ou serviço ao público certo, no momento certo. Nossas campanhas são desenhadas para maximizar seu Retorno Sobre o Investimento em Anúncios (ROAS).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-bold font-poppins mb-4">Google Ads</h4>
              <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
                <li>Campanhas de Pesquisa, Display e Shopping</li>
                <li>Otimização de lances e palavras-chave</li>
                <li>Remarketing inteligente</li>
                <li>Análise de concorrência e tendências</li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-bold font-poppins mb-4">Meta Ads (Facebook & Instagram)</h4>
              <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
                <li>Campanhas de conversão e vendas</li>
                <li>Segmentação avançada de público-alvo e lookalikes</li>
                <li>Criação e teste de criativos de alta performance</li>
                <li>Otimização de funis de vendas e eventos</li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold font-poppins mb-4">Outras Plataformas e Estratégias</h4>
              <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
                <li>LinkedIn Ads para B2B</li>
                <li>TikTok Ads para alcance massivo</li>
                <li>Estratégias de Lances Automatizadas</li>
                <li>Análise de ROI e atribuição</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Gestão de Marketplaces */}
        <section className="mb-20 bg-gray-800 p-10 rounded-lg shadow-xl border border-gray-700">
          <h3 className="text-3xl font-bold font-poppins text-tsm-violet mb-6">Gestão de Marketplaces</h3>
          <p className="text-lg font-inter mb-6 leading-relaxed">
            Seja no Mercado Livre ou em outras plataformas, entendemos as nuances de cada marketplace para posicionar seus produtos à frente da concorrência, otimizar seus anúncios e impulsionar suas vendas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-bold font-poppins mb-4">Mercado Livre</h4>
              <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
                <li>Otimização de anúncios (título, descrição, fotos de alta qualidade)</li>
                <li>Gestão de Mercado Ads e campanhas patrocinadas</li>
                <li>Estratégias para melhorar a reputação (termômetro) e avaliações</li>
                <li>Análise de concorrência, precificação dinâmica e sortimento</li>
                <li>Gestão de estoque e logística (Mercado Envios)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-bold font-poppins mb-4">Outros Marketplaces</h4>
              <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
                <li>Consultoria para B2W (Americanas, Submarino)</li>
                <li>Estratégias para Magazine Luiza e Via Varejo</li>
                <li>Integração e automação de vendas</li>
                <li>Análise de performance e relatórios</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Consultoria de E-commerce */}
        <section className="bg-gray-800 p-10 rounded-lg shadow-xl border border-gray-700">
          <h3 className="text-3xl font-bold font-poppins text-tsm-violet mb-6">Consultoria de E-commerce</h3>
          <p className="text-lg font-inter mb-6 leading-relaxed">
            Vamos além do tráfego. Analisamos seu e-commerce de ponta a ponta para identificar gargalos, otimizar a experiência do usuário e aumentar sua taxa de conversão (CRO), garantindo um crescimento sustentável.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-bold font-poppins mb-4">Otimização de Conversão (CRO)</h4>
              <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
                <li>Análise de usabilidade (UX/UI) e jornada do cliente</li>
                <li>Testes A/B para elementos-chave do site</li>
                <li>Otimização de páginas de produto e checkout</li>
                <li>Redução de abandono de carrinho</li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-bold font-poppins mb-4">Estratégia e Crescimento</h4>
              <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
                <li>Planejamento estratégico para expansão e novos mercados</li>
                <li>Automação de Marketing e Email Marketing (fluxos de nutrição)</li>
                <li>Implementação e gestão de CRM</li>
                <li>Análise de dados avançada e business intelligence</li>
                <li>Gestão de catálogo de produtos e integrações</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Nova Página Dedicada a Amazon Sellers
const AmazonSellerPage = () => {
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedBulletPoints, setGeneratedBulletPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateContent = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedTitle('');
    setGeneratedBulletPoints([]);

    const prompt = `Gere um título e 5 bullet points para uma listagem de produto na Amazon, otimizados para SEO e conversão.
    Nome do Produto: ${productName}
    Palavras-chave/Características Principais: ${keywords}
    Público-alvo (opcional): ${targetAudience}

    Formato da Resposta (JSON):
    {
      "title": "Título do Produto Otimizado",
      "bulletPoints": [
        "Bullet Point 1",
        "Bullet Point 2",
        "Bullet Point 3",
        "Bullet Point 4",
        "Bullet Point 5"
      ]
    }`;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "title": { "type": "STRING" },
              "bulletPoints": {
                "type": "ARRAY",
                "items": { "type": "STRING" }
              }
            },
            "propertyOrdering": ["title", "bulletPoints"]
          }
        }
      };
      const apiKey = ""; // Deixe como está, a chave será fornecida pelo ambiente Canvas
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const json = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(json);
        setGeneratedTitle(parsedJson.title);
        setGeneratedBulletPoints(parsedJson.bulletPoints);
      } else {
        setError('Não foi possível gerar o conteúdo. Tente novamente.');
        console.error("Estrutura de resposta inesperada:", result);
      }
    } catch (err) {
      console.error("Erro ao chamar a API Gemini:", err);
      setError('Erro ao conectar com a IA. Verifique sua conexão ou tente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-20">
      <div className="container mx-auto px-4">
        <SectionTitle>Soluções Exclusivas para Amazon Sellers</SectionTitle>
        <div className="max-w-5xl mx-auto text-center mb-16">
          <p className="text-xl font-inter mb-8 leading-relaxed">
            Na TSM Soluções, somos especialistas em ajudar vendedores da Amazon a escalar seus negócios. Entendemos as complexidades do ecossistema Amazon e oferecemos estratégias personalizadas para você dominar a plataforma.
          </p>
          <p className="text-xl font-inter leading-relaxed">
            Desde a otimização de listagens até campanhas de anúncios avançadas, nossa equipe está pronta para impulsionar sua performance e garantir que seus produtos alcancem a Buy Box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Otimização de Listagens */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-2xl font-bold font-poppins text-tsm-violet mb-4">Otimização de Listagens e SEO</h3>
            <p className="text-gray-300 font-inter mb-4">
              Garanta que seus produtos sejam encontrados facilmente pelos compradores da Amazon.
            </p>
            <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
              <li>Pesquisa aprofundada de palavras-chave (Keywords)</li>
              <li>Otimização de títulos e Bullet Points</li>
              <li>Criação de descrições de produtos persuasivas</li>
              <li>Seleção e otimização de imagens de alta qualidade</li>
              <li>Acompanhamento e ajuste contínuo de performance</li>
            </ul>
          </div>

          {/* Gestão de Amazon Ads */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-2xl font-bold font-poppins text-tsm-violet mb-4">Gestão de Amazon Ads (PPC)</h3>
            <p className="text-gray-300 font-inter mb-4">
              Maximize sua visibilidade e vendas com campanhas de anúncios eficazes na Amazon.
            </p>
            <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
              <li>Campanhas de Sponsored Products, Sponsored Brands e Sponsored Display</li>
              <li>Otimização de lances e orçamentos para o melhor ACoS (Advertising Cost of Sales)</li>
              <li>Segmentação de público-alvo e estratégias de palavras-chave</li>
              <li>Criação e teste de criativos de anúncios</li>
              <li>Análise de relatórios e otimização para ROAS</li>
            </ul>
          </div>

          {/* Estratégias de Buy Box e Reputação */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-2xl font-bold font-poppins text-tsm-violet mb-4">Buy Box e Gestão de Reputação</h3>
            <p className="text-gray-300 font-inter mb-4">
              Conquiste a posição mais cobiçada na Amazon e construa confiança com seus clientes.
            </p>
            <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
              <li>Estratégias para ganhar e manter a Buy Box</li>
              <li>Gestão proativa de avaliações e perguntas/respostas</li>
              <li>Melhoria da saúde da conta de vendedor</li>
              <li>Monitoramento de preços da concorrência</li>
            </ul>
          </div>

          {/* Conteúdo A+ e Storefront */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-2xl font-bold font-poppins text-tsm-violet mb-4">Conteúdo A+ e Storefront</h3>
            <p className="text-gray-300 font-inter mb-4">
              Apresente sua marca e produtos de forma profissional e atraente.
            </p>
            <ul className="list-disc list-inside text-gray-300 font-inter space-y-2">
              <li>Criação de Conteúdo A+ (Enhanced Brand Content)</li>
              <li>Design e desenvolvimento de Storefront personalizado</li>
              <li>Storytelling visual para sua marca</li>
              <li>Aumento do engajamento e taxa de conversão</li>
            </ul>
          </div>

          {/* Logística e Inventário */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 md:col-span-2">
            <h3 className="text-2xl font-bold font-poppins text-tsm-violet mb-4">Logística e Gestão de Inventário (FBA/FBM)</h3>
            <p className="text-gray-300 font-inter mb-4">
              Otimize suas operações para garantir entregas eficientes e estoque sempre disponível.
            </p>
            <ul className="list-disc list-inside text-gray-300 font-inter space-y-2 grid grid-cols-1 md:grid-cols-2">
              <li>Consultoria sobre FBA (Fulfillment by Amazon) e FBM (Fulfillment by Merchant)</li>
              <li>Planejamento de reabastecimento e previsão de demanda</li>
              <li>Gestão de envios e recebimento em centros de distribuição Amazon</li>
              <li>Otimização de custos logísticos</li>
            </ul>
          </div>
        </div>

        {/* Seção de Geração de Conteúdo com IA */}
        <section className="mt-20 bg-gray-800 p-10 rounded-lg shadow-xl border border-gray-700">
          <h3 className="text-3xl font-bold font-poppins text-tsm-violet mb-6 text-center">
            Gerador de Conteúdo para Amazon com IA ✨
          </h3>
          <p className="text-lg font-inter text-gray-300 mb-8 text-center max-w-2xl mx-auto">
            Utilize nossa inteligência artificial para criar títulos e bullet points otimizados para suas listagens na Amazon.
          </p>

          <div className="space-y-6 max-w-xl mx-auto">
            <div>
              <label htmlFor="productName" className="block text-gray-300 text-sm font-bold mb-2">Nome do Produto:</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:border-tsm-violet"
                placeholder="Ex: Fone de Ouvido Bluetooth TSM Pro"
                required
              />
            </div>
            <div>
              <label htmlFor="keywords" className="block text-gray-300 text-sm font-bold mb-2">Palavras-chave / Características Principais (separadas por vírgula):</label>
              <textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows="4"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:border-tsm-violet"
                placeholder="Ex: áudio HD, cancelamento de ruído, bateria 30h, esportes, confortável"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="targetAudience" className="block text-gray-300 text-sm font-bold mb-2">Público-alvo (opcional):</label>
              <input
                type="text"
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:border-tsm-violet"
                placeholder="Ex: Atletas, Gamers, Profissionais em Home Office"
              />
            </div>
            <div className="text-center">
              <TSMButton onClick={handleGenerateContent} disabled={isLoading}>
                {isLoading ? 'Gerando...' : 'Gerar Sugestões ✨'}
              </TSMButton>
            </div>
            {error && (
              <p className="mt-4 text-center text-red-400 text-lg font-inter">{error}</p>
            )}

            {generatedTitle && (
              <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
                <h4 className="text-xl font-bold font-poppins text-tsm-violet mb-3">Título Sugerido:</h4>
                <p className="text-gray-200 font-inter mb-6">{generatedTitle}</p>
                <h4 className="text-xl font-bold font-poppins text-tsm-violet mb-3">Bullet Points Sugeridos:</h4>
                <ul className="list-disc list-inside text-gray-200 font-inter space-y-2">
                  {generatedBulletPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <div className="text-center mt-20">
          <h2 className="text-4xl font-bold font-poppins text-gray-100 mb-6">
            Pronto para Vender Mais na Amazon?
          </h2>
          <p className="text-xl font-inter text-gray-300 mb-10">
            Nossa expertise em Amazon Sellers é o que você precisa para alcançar seus objetivos.
          </p>
          <TSMButton onClick={() => window.location.href = '#contato'}>
            Agendar Análise Amazon Gratuita
          </TSMButton>
        </div>
      </div>
    </div>
  );
};


// Página de Cases de Sucesso (Mock Data)
const CasesPage = () => {
  const cases = [
    {
      id: 1,
      title: "E-commerce de Moda: Aumento de 200% no ROAS",
      description: "Uma loja de moda online buscava escalar suas vendas e melhorar o retorno sobre o investimento em anúncios. Implementamos uma estratégia de tráfego pago focada em públicos de alta intenção e otimização de criativos.",
      image: "https://placehold.co/600x400/666/ffffff?text=Case+Moda",
      results: [
        "ROAS de 2.5x para 7.5x em 6 meses.",
        "Aumento de 200% no faturamento mensal.",
        "Redução de 40% no Custo por Aquisição (CPA)."
      ]
    },
    {
      id: 2,
      title: "Amazon Seller de Eletrônicos: Domínio da Buy Box",
      description: "Um vendedor de eletrônicos na Amazon enfrentava forte concorrência. Atuamos na otimização de listagens, gestão de Amazon Ads e estratégias de precificação dinâmica para conquistar a Buy Box.",
      image: "https://placehold.co/600x400/666/ffffff?text=Case+Eletronicos",
      results: [
        "Aumento de 80% nas vendas via Amazon.",
        "Conquista da Buy Box em 70% dos produtos chave.",
        "Melhora de 25% na margem de lucro."
      ]
    },
    {
      id: 3,
      title: "Mercado Livre: Escalada de Reputação e Vendas",
      description: "Um novo vendedor no Mercado Livre precisava construir reputação e volume de vendas rapidamente. Desenvolvemos uma estratégia de anúncios e atendimento ao cliente exemplar.",
      image: "https://placehold.co/600x400/666/ffffff?text=Case+ML",
      results: [
        "Alcançou 'Mercado Líder Gold' em 5 meses.",
        "Aumento de 120% nas vendas mensais.",
        "Redução de 35% no custo por venda."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-20">
      <div className="container mx-auto px-4">
        <SectionTitle>Cases de Sucesso</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cases.map(caseItem => (
            <div key={caseItem.id} className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:scale-105">
              <img src={caseItem.image} alt={caseItem.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold font-poppins text-tsm-violet mb-3">{caseItem.title}</h3>
                <p className="text-gray-300 font-inter mb-4">{caseItem.description}</p>
                <h4 className="text-xl font-bold font-poppins mb-2">Resultados:</h4>
                <ul className="list-disc list-inside text-gray-300 font-inter space-y-1">
                  {caseItem.results.map((result, index) => (
                    <li key={index}>{result}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Página de Contato
const ContatoPage = ({ db, userId }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db || !userId) {
      setStatusMessage('Erro: Firebase não inicializado ou usuário não autenticado.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Enviando mensagem...');

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const contactsCollectionRef = collection(db, `artifacts/${appId}/public/data/contacts`);
      await addDoc(contactsCollectionRef, {
        ...formData,
        timestamp: new Date(),
        userId: userId // Adiciona o userId para rastreamento
      });
      setStatusMessage('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      setFormData({ name: '', email: '', message: '' }); // Limpa o formulário
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setStatusMessage('Erro ao enviar mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-20">
      <div className="container mx-auto px-4">
        <SectionTitle>Contato</SectionTitle>
        <div className="max-w-3xl mx-auto bg-gray-800 p-10 rounded-lg shadow-xl border border-gray-700">
          <p className="text-lg font-inter mb-8 text-center">
            Preencha o formulário abaixo ou utilize nossos contatos diretos para falar com um especialista.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:border-tsm-violet"
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:border-tsm-violet"
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">Mensagem:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 focus:border-tsm-violet"
                placeholder="Descreva suas necessidades ou dúvidas..."
                required
              ></textarea>
            </div>
            <div className="text-center">
              <TSMButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </TSMButton>
            </div>
            {statusMessage && (
              <p className={`mt-4 text-center text-lg font-inter ${statusMessage.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
                {statusMessage}
              </p>
            )}
          </form>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold font-poppins text-tsm-violet mb-4">Ou Fale Conosco Diretamente:</h3>
            <div className="space-y-4">
              <a
                href="https://wa.me/5511999999999" // Substitua pelo seu número de WhatsApp
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2C7.03 2 3 6.03 3 11.04c0 1.95.61 3.76 1.65 5.27L3.05 21l5.31-1.41c1.47.8 3.16 1.25 4.38 1.25 5.01 0 9.04-4.03 9.04-9.04S17.05 2 12.04 2zM17.29 15.4c-.1-.17-.36-.27-.75-.46-.39-.18-.94-.3-1.09-.33-.15-.03-.33-.03-.47.3-.14.33-.54.8-.66.94-.12.14-.24.15-.45.07-.2-.08-.85-.31-1.62-.94-.6-.49-1.01-1.08-1.13-1.28-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.36.1-.12.13-.2.2-.33.07-.14.03-.25-.01-.35-.04-.1-.4-.96-.55-1.3-.15-.33-.3-.28-.47-.28-.17 0-.36-.02-.55-.02-.19 0-.49.07-.75.33-.26.26-1 1-1 2.45s1.02 2.83 1.16 3.02c.14.19 2 3.07 4.93 4.38 2.93 1.3 2.93.88 3.45.85.52-.03 1.47-.6 1.67-1.17.2-.56.2-1.03.14-1.17z"/></svg>
                WhatsApp
              </a>
              <p className="text-xl font-inter text-gray-200">
                E-mail: <a href="mailto:contato@tsmsolucoes.com" className="text-tsm-violet hover:underline">contato@tsmsolucoes.com</a>
              </p>
              <p className="text-xl font-inter text-gray-200">
                Telefone: <a href="tel:+5511999999999" className="text-tsm-violet hover:underline">+55 (11) 99999-9999</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Principal da Aplicação
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // Indica se a autenticação inicial foi concluída

  // Função de navegação
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Efeito para inicializar o Firebase e autenticar o usuário
  useEffect(() => {
    // Variáveis globais fornecidas pelo ambiente Canvas
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    // Verifica se a configuração do Firebase está presente
    if (Object.keys(firebaseConfig).length === 0) {
      console.error("Erro: A configuração do Firebase está faltando. Não é possível inicializar.");
      setIsAuthReady(true); // Marca como pronto mesmo com erro para não bloquear a UI
      return;
    }

    // Inicializa o Firebase
    const app = initializeApp(firebaseConfig);
    const firestoreDb = getFirestore(app);
    const firebaseAuth = getAuth(app);

    setDb(firestoreDb);
    setAuth(firebaseAuth);

    // Listener para mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Se não há usuário e nenhum token inicial foi fornecido, tenta autenticar anonimamente
        if (!initialAuthToken) {
          try {
            const anonUserCredential = await signInAnonymously(firebaseAuth);
            setUserId(anonUserCredential.user.uid);
          } catch (error) {
            console.error("Erro ao autenticar anonimamente:", error);
          }
        }
      }
      setIsAuthReady(true); // Marca que a autenticação inicial foi processada
    });

    // Tenta autenticar com o token personalizado se disponível
    if (initialAuthToken && firebaseAuth && !firebaseAuth.currentUser) {
      signInWithCustomToken(firebaseAuth, initialAuthToken)
        .then((userCredential) => {
          setUserId(userCredential.user.uid);
        })
        .catch((error) => {
          console.error("Erro ao autenticar com token personalizado:", error);
        });
    }

    // Função de limpeza para o listener de autenticação
    return () => unsubscribe();
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // Função para renderizar a página atual
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'quemSomos':
        return <QuemSomosPage />;
      case 'solucoes':
        return <SolucoesPage />;
      case 'amazonSeller':
        return <AmazonSellerPage />;
      case 'chatbot':
        return <ChatbotPage />;
      case 'cases':
        return <CasesPage />;
      case 'contato':
        return <ContatoPage db={db} userId={userId} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="font-inter"> {/* Define a fonte padrão para o corpo */}
      {/* Estilos globais para o gradiente de fundo */}
      <style>{`
        body {
          background-color: #1a1a1a; /* Cor de fundo principal */
        }
        /* Adiciona um gradiente sutil ao corpo ou a uma div principal */
        .app-container {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
          min-height: 100vh;
        }
        /* Definição das cores personalizadas para o Tailwind */
        .text-tsm-purple { color: #8A2BE2; }
        .bg-tsm-purple { background-color: #8A2BE2; }
        .text-tsm-violet { color: #EE82EE; }
        .bg-tsm-violet { background-color: #EE82EE; }
        .border-tsm-violet { border-color: #EE82EE; }

        /* Animações para a Hero Section */
        @keyframes fadeInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInFromBottom 0.8s ease-out forwards;
          opacity: 0; /* Garante que o elemento esteja invisível antes da animação */
        }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in-up.delay-400 { animation-delay: 0.4s; }

        /* Estilos para a barra de rolagem customizada */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #333;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8A2BE2;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #EE82EE;
        }
      `}</style>
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="app-container">
        {renderPage()}
      </main>
      <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-700">
        <div className="container mx-auto px-4">
          <p className="mb-4 font-inter">&copy; {new Date().getFullYear()} TSM Soluções. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-6">
            {/* Ícones de Redes Sociais (exemplo: Ícone do Facebook e Instagram) */}
            <a href="#" className="text-gray-400 hover:text-tsm-violet transition-colors duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.24.195 2.24.195v2.46h-1.26c-1.247 0-1.625.777-1.625 1.56V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-tsm-violet transition-colors duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.92.333 4.145.647 3.37.959 2.682 1.442 2.083 2.042.883 3.242.296 4.653.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.278.261 2.133.575 2.908.312.776.795 1.465 1.394 2.064.6.6 1.289 1.083 2.064 1.394.775.314 1.63.515 2.908.575C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.278-.06 2.133-.261 2.908-.575.776-.312 1.465-.795 2.064-1.394.6-.6 1.083-1.289 1.394-2.064.314-.775.515-1.63.575-2.908.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947C23.928 5.775 23.727 4.92 23.413 4.145 23.101 3.37 22.618 2.682 22.018 2.083 20.817.883 19.406.296 17.006.072 15.627.014 15.22 0 12 0zm0 2.16c3.2 0 3.585.016 4.85.075 1.17.055 1.8.245 2.225.415.42.17.75.385 1.045.68.295.295.51.625.68 1.045.17.42.36 1.055.415 2.225.06 1.265.075 1.65.075 4.85s-.016 3.585-.075 4.85c-.055 1.17-.245 1.8-.415 2.225-.17.42-.385.75-.68 1.045-.295.295-.625.51-1.045.68-.42.17-1.055.36-2.225.415-1.265.06-1.65.075-4.85.075s-3.585-.016-4.85-.075c-1.17-.055-1.8-.245-2.225-.415-.42-.17-.75-.385-1.045-.68-.295-.295-.51-.625-.68-1.045-.17-.42-.36-1.055-.415-2.225-.06-1.265-.075-1.65-.075-4.85s.016-3.585.075-4.85c.055-1.17.245-1.8.415-2.225.17-.42.385-.75.68-1.045.295-.295.625-.51 1.045-.68.42-.17 1.055-.36 2.225-.415C8.415 2.176 8.8 2.16 12 2.16zm0 3.635C9.03 5.795 5.795 9.03 5.795 12s3.235 6.205 6.205 6.205 6.205-3.235 6.205-6.205S14.97 5.795 12 5.795zm0 2.16c2.235 0 4.045 1.81 4.045 4.045s-1.81 4.045-4.045 4.045-4.045-1.81-4.045-4.045S9.765 7.955 12 7.955zm6.406-5.467c-.77.005-1.23.16-1.555.29-.315.13-.56.295-.735.47-.175.175-.34.42-.47.735-.13.315-.285.77-.29 1.555-.005.77-.005 1.03-.005 3.095s0 2.325.005 3.095c.005.77.16 1.23.29 1.555.13.315.295.56.47.735.175.175.42.34.735.47.315.13.77.285 1.555.29.77.005 1.03.005 3.095.005s2.325 0 3.095-.005c.77-.005 1.23-.16 1.555-.29.315-.13.56-.295.735-.47.175-.175.34-.42.47-.735.13-.315.285-.77.29-1.555.005-.77.005-1.03.005-3.095s0-2.325-.005-3.095c-.005-.77-.16-1.23-.29-1.555-.13-.315-.295-.56-.47-.735-.175-.175-.42-.34-.735-.47-.315-.13-.77-.285-1.555-.29-.77-.005-1.03-.005-3.095-.005z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
