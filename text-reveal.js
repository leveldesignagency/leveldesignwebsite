/**
 * Scroll-linked typography reveal: 50% opacity → full, left-to-right per character.
 */
(function () {
  'use strict';

  const REVEAL_SELECTORS = [
    '.deliver-row-headline',
    '.text-reveal',
  ].join(', ');

  const reducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function splitRevealText(el) {
    if (el.dataset.revealReady === '1') return;
    const raw = el.textContent.trim();
    if (!raw) return;

    el.textContent = '';
    const frag = document.createDocumentFragment();

    [...raw].forEach((ch, i) => {
      if (ch === ' ') {
        frag.appendChild(document.createTextNode(' '));
        return;
      }
      const span = document.createElement('span');
      span.className = 'text-reveal-char';
      span.style.setProperty('--ci', String(i));
      span.textContent = ch;
      frag.appendChild(span);
    });

    el.appendChild(frag);
    el.classList.add('text-reveal');
    el.dataset.revealReady = '1';
  }

  function progressForElement(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const start = vh * 0.88;
    const end = vh * 0.28;
    const span = start - end;
    if (span <= 0) return 1;
    return Math.min(1, Math.max(0, (start - rect.top) / span));
  }

  function updateReveals() {
    document.querySelectorAll('.text-reveal').forEach((el) => {
      const chars = el.querySelectorAll('.text-reveal-char');
      if (!chars.length) return;

      const p = progressForElement(el);
      const total = chars.length;
      const spread = Math.max(6, total * 0.55);

      chars.forEach((char, i) => {
        const local = (p * (total + spread) - i) / spread;
        const opacity = 0.5 + Math.min(1, Math.max(0, local)) * 0.5;
        char.style.opacity = String(opacity);
      });

      if (p >= 0.98) el.classList.add('text-reveal--done');
    });
  }

  function init() {
    document.querySelectorAll(REVEAL_SELECTORS).forEach(splitRevealText);

    if (reducedMotion()) {
      document.querySelectorAll('.text-reveal-char').forEach((c) => {
        c.style.opacity = '1';
      });
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateReveals();
        ticking = false;
      });
    };

    updateReveals();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LEVEL_refreshTextReveal = function () {
    document.querySelectorAll(REVEAL_SELECTORS).forEach(splitRevealText);
    updateReveals();
  };
})();
