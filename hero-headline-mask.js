/**
 * Hero headline — hard linear wipe reveals textured fill over white base text.
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

    const wipeHalf = window.matchMedia('(min-width: 901px)').matches ? 52 : 40;

    function hideWipe() {
      stack.style.setProperty('--headline-wipe-x', '-999px');
    }

    function showWipe(clientX) {
      const rect = stack.getBoundingClientRect();
      if (!rect.width) return;
      stack.style.setProperty('--headline-wipe-x', `${clientX - rect.left}px`);
      stack.style.setProperty('--headline-wipe-half', `${wipeHalf}px`);
    }

    headline.addEventListener('pointerenter', (event) => {
      showWipe(event.clientX);
    });

    headline.addEventListener('pointermove', (event) => {
      showWipe(event.clientX);
    });

    headline.addEventListener('pointerleave', hideWipe);

    hideWipe();
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
