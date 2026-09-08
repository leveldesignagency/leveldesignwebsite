/**
 * Hero headline — soft spotlight reveal follows the cursor over textured fill.
 */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function stripTags(html) {
    return String(html || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .trim();
  }

  function linesFromHeadline(headlineHtml) {
    return stripTags(headlineHtml)
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function linesToMarkup(lines) {
    return lines
      .map((line) => `<span class="hero-headline-line">${line}</span>`)
      .join('');
  }

  function setHeroHeadline(headlineEl, headlineHtml) {
    if (!headlineEl) return;

    const white = headlineEl.querySelector('[data-hero-headline-white]');
    const textured = headlineEl.querySelector('[data-hero-headline-textured]');
    const markup = linesToMarkup(linesFromHeadline(headlineHtml));

    if (white && textured) {
      white.innerHTML = markup;
      textured.innerHTML = markup;
      return;
    }

    headlineEl.innerHTML = headlineHtml;
  }

  function initMask() {
    const headline = document.getElementById('hero-headline-mask');
    const stack = headline && headline.querySelector('[data-hero-headline-stack]');
    if (!headline || !stack) return;

    if (prefersReducedMotion()) return;

    const isDesktop = window.matchMedia('(min-width: 901px)').matches;
    const radius = isDesktop ? 140 : 100;

    let raf = 0;
    let targetX = -999;
    let targetY = -999;
    let currentX = -999;
    let currentY = -999;
    let active = false;

    stack.style.setProperty('--headline-spot-r', `${radius}px`);

    function hideSpot() {
      active = false;
      stack.classList.remove('is-spotlight-active');
      targetX = -999;
      targetY = -999;
      currentX = -999;
      currentY = -999;
      stack.style.setProperty('--headline-spot-x', '-999px');
      stack.style.setProperty('--headline-spot-y', '-999px');
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function tick() {
      raf = 0;
      if (!active) return;

      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      stack.style.setProperty('--headline-spot-x', `${currentX}px`);
      stack.style.setProperty('--headline-spot-y', `${currentY}px`);

      const bgX = Math.max(0, Math.min(100, (currentX / Math.max(stack.clientWidth, 1)) * 100));
      const bgY = Math.max(0, Math.min(100, (currentY / Math.max(stack.clientHeight, 1)) * 100));
      stack.style.setProperty('--headline-bg-x', `${bgX}%`);
      stack.style.setProperty('--headline-bg-y', `${bgY}%`);

      if (Math.abs(targetX - currentX) > 0.4 || Math.abs(targetY - currentY) > 0.4) {
        raf = window.requestAnimationFrame(tick);
      }
    }

    function showSpot(clientX, clientY) {
      const rect = stack.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      targetX = clientX - rect.left;
      targetY = clientY - rect.top;

      if (!active) {
        active = true;
        currentX = targetX;
        currentY = targetY;
        stack.classList.add('is-spotlight-active');
      }

      if (!raf) raf = window.requestAnimationFrame(tick);
    }

    headline.addEventListener('pointerenter', (event) => {
      showSpot(event.clientX, event.clientY);
    });

    headline.addEventListener('pointermove', (event) => {
      showSpot(event.clientX, event.clientY);
    });

    headline.addEventListener('pointerleave', hideSpot);

    hideSpot();
  }

  window.LEVEL_setHeroHeadline = setHeroHeadline;

  function boot() {
    initMask();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
