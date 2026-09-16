/**
 * Hero headline helper — keeps line markup in sync for intent variants.
 */
(function () {
  'use strict';

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
    const markup = linesToMarkup(linesFromHeadline(headlineHtml));

    if (white) {
      white.innerHTML = markup;
      return;
    }

    headlineEl.innerHTML = headlineHtml;
  }

  window.LEVEL_setHeroHeadline = setHeroHeadline;
})();
