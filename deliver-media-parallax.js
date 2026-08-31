/**
 * Deliver section — image parallax inside rounded media masks.
 */
(function () {
  'use strict';

  const MAX_SHIFT = 28;

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function init() {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const medias = document.querySelectorAll('#services .deliver-row-media');
    if (!medias.length) return;

    medias.forEach((media) => {
      let raf = 0;
      let pending = null;
      const strength = media.classList.contains('deliver-row-media--wide')
        ? MAX_SHIFT * 0.55
        : MAX_SHIFT;

      function apply(x, y) {
        media.style.setProperty('--parallax-x', `${x * strength * 2}px`);
        media.style.setProperty('--parallax-y', `${y * strength * 2}px`);
      }

      function flush() {
        raf = 0;
        if (!pending) return;
        apply(pending.x, pending.y);
      }

      function onMove(event) {
        const rect = media.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pending = {
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        };
        media.classList.add('is-parallax-active');
        if (raf) return;
        raf = window.requestAnimationFrame(flush);
      }

      function onLeave() {
        media.classList.remove('is-parallax-active');
        pending = { x: 0, y: 0 };
        if (raf) window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(flush);
      }

      media.addEventListener('pointerenter', onMove);
      media.addEventListener('pointermove', onMove);
      media.addEventListener('pointerleave', onLeave);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
