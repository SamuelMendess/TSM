(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  const motionButton = document.getElementById('motion-toggle');
  function setMotion(value) {
    paused = value;
    root.classList.toggle('motion-off', value);
    motionButton.setAttribute('aria-pressed', String(value));
    motionButton.textContent = value ? 'Ativar animações' : 'Pausar animações';
  }
  setMotion(paused);
  reduced.addEventListener('change', e => setMotion(e.matches));
  motionButton.addEventListener('click', () => setMotion(!paused));
  if ('IntersectionObserver' in window) {
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => reveals.observe(el));
    root.classList.add('motion-ready');
  }
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');
  function closeMenu() {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  }
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); } });
  const topics = {
    integrativa: ['01 / Compreender', 'Olhar para o contexto<br>muda a conversa.', 'A consulta reúne o que você sente, seu histórico e o impacto disso na sua vida. Há espaço para falar de sono, rotina, tratamentos que já tentou e do que espera melhorar.', ['Escuta da sua queixa e das suas prioridades.', 'Revisão do histórico e dos tratamentos em uso.', 'Discussão de possibilidades e próximos passos.'], 'As decisões são individualizadas e feitas em conjunto com a médica.'],
    cannabis: ['02 / Esclarecer', 'Uma possibilidade.<br>Uma avaliação individual.', 'A cannabis medicinal pode ser discutida como uma das possibilidades de cuidado. A conversa começa pelo seu histórico e pelos medicamentos que você já utiliza, para avaliar benefícios, riscos e limites no seu caso.', ['A indicação não é automática nem garantida.', 'Há espaço para perguntar sobre efeitos e interações.', 'Uma eventual prescrição é definida pela médica.'], 'Não interrompa ou altere tratamentos por conta própria. Leve suas dúvidas à consulta.'],
    acompanhamento: ['03 / Acompanhar', 'O cuidado continua<br>depois do encontro.', 'As percepções do dia a dia ajudam a dar contexto ao retorno. Anotar como você tem dormido, o que mudou e quais dúvidas surgiram torna a conversa com a médica mais completa.', ['Registre sua evolução no diário de bordo.', 'Compartilhe dúvidas e efeitos percebidos com a médica.', 'Combine os retornos e os canais de acompanhamento.'], 'Os registros apoiam a conversa clínica; não geram mudanças automáticas no tratamento.']
  };
  const panel = document.getElementById('topic-panel');
  document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-topic]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const [chapter, title, body, items, note] = topics[button.dataset.topic];
    panel.innerHTML = '<span class="chapter">' + chapter + '</span><h3>' + title + '</h3><p>' + body + '</p><ul class="check-list">' + items.map(t => '<li>' + t + '</li>').join('') + '</ul><p class="fine">' + note + '</p>';
    if (!paused && panel.animate) panel.animate([{opacity:0, transform:'translateY(12px)'},{opacity:1, transform:'translateY(0)'}], {duration:450,easing:'ease-out'});
  }));
  const checks = [...document.querySelectorAll('.checklist-card input')];
  function updateChecklist() {
    const n = checks.filter(c => c.checked).length;
    document.getElementById('check-count').textContent = n + ' de ' + checks.length;
    document.getElementById('check-bar').style.width = (n / checks.length * 100) + '%';
  }
  checks.forEach(c => c.addEventListener('change', updateChecklist));
  document.getElementById('reset-checklist').addEventListener('click', () => {checks.forEach(c => c.checked = false); updateChecklist();});
  let filter = 'todas';
  const search = document.getElementById('faq-search');
  const questions = [...document.querySelectorAll('#faq-list details')];
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function filterFaq() {
    const query = normalize(search.value.trim());
    let count = 0;
    questions.forEach(item => {
      const show = (filter === 'todas' || item.dataset.category === filter) && normalize(item.textContent).includes(query);
      item.hidden = !show; if(show) count++;
    });
    document.getElementById('faq-count').textContent = count + (count === 1 ? ' pergunta' : ' perguntas');
    document.getElementById('faq-empty').hidden = count > 0;
  }
  search.addEventListener('input', filterFaq);
  filterFaq();
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    filterFaq();
  }));
  const steps = [...document.querySelectorAll('.journey-step')];
  const progress = document.querySelector('.read-progress');
  let ticking = false;
  function onScroll() {
    const height = root.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (height > 0 ? window.scrollY / height : 0) + ')';
    let active = steps[0];
    steps.forEach(step => {if(step.getBoundingClientRect().top < window.innerHeight * .55) active = step;});
    steps.forEach(step => step.classList.toggle('active', step === active));
    document.getElementById('stage-number').textContent = active.dataset.stage;
    ticking = false;
  }
  window.addEventListener('scroll', () => { if(!ticking) {ticking = true; requestAnimationFrame(onScroll);} }, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();
})();
