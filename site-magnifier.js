/**
 * Site-wide red plus cursor (desktop).
 */
(function () {
  'use strict';

  const SIZE = 22;
  const HALF = SIZE / 2;

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function isEnabled() {
    return (
      !prefersReducedMotion() &&
      window.matchMedia('(pointer: fine)').matches &&
      window.matchMedia('(min-width: 901px)').matches
    );
  }

  function init() {
    if (!isEnabled()) return;

    document.documentElement.classList.add('has-site-cursor');

    const cursor = document.createElement('div');
    cursor.className = 'site-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    const plus = document.createElement('span');
    plus.className = 'site-cursor__plus';
    cursor.appendChild(plus);

    document.body.appendChild(cursor);

    function onPointerMove(event) {
      cursor.classList.add('is-visible');
      cursor.style.transform = `translate3d(${event.clientX - HALF}px, ${event.clientY - HALF}px, 0)`;
    }

    function onPointerLeave() {
      cursor.classList.remove('is-visible');
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
