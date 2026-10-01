import { useEffect } from 'react';

// No toque, a rolagem destaca um único card próximo ao centro da tela.
export default function useMobileCardAccent(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const mobileMode = window.matchMedia('(max-width: 767px), (hover: none), (pointer: coarse)');
    const visibleCards = new Set();
    let cards = [];
    let activeCard = null;
    let frame = null;

    const activate = (card) => {
      if (card === activeCard) return;
      activeCard?.classList.remove('is-touch-active');
      activeCard = card;
      activeCard?.classList.add('is-touch-active');
    };

    const update = () => {
      frame = null;
      if (!mobileMode.matches || document.hidden) {
        activate(null);
        return;
      }

      const center = window.innerHeight / 2;
      let closest = null;
      let closestDistance = window.innerHeight * 0.25;

      visibleCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom <= 80 || rect.top >= window.innerHeight - 60) return;
        const distance = rect.top > center ? rect.top - center : rect.bottom < center ? center - rect.bottom : 0;
        if (distance < closestDistance) {
          closest = card;
          closestDistance = distance;
        }
      });
      activate(closest);
    };

    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) visibleCards.add(target);
        else visibleCards.delete(target);
      });
      scheduleUpdate();
    }, { rootMargin: '15% 0px 15% 0px' });

    const refresh = () => {
      observer.disconnect();
      visibleCards.clear();
      cards = Array.from(container.querySelectorAll('.accent-card'));
      if (activeCard && !cards.includes(activeCard)) activate(null);
      cards.forEach((card) => observer.observe(card));
      scheduleUpdate();
    };

    // Recalcula os cards quando o filtro de projetos muda.
    const mutations = new MutationObserver(refresh);
    mutations.observe(container, { childList: true, subtree: true });
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    mobileMode.addEventListener('change', scheduleUpdate);
    document.addEventListener('visibilitychange', scheduleUpdate);
    refresh();

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      mobileMode.removeEventListener('change', scheduleUpdate);
      document.removeEventListener('visibilitychange', scheduleUpdate);
      activate(null);
    };
  }, [containerRef]);
}
