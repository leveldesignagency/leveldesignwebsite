(function () {
  const GAP_PX = 20;
  const MQ_HIDE = window.matchMedia('(max-width: 900px)');

  function layout() {
    const section = document.getElementById('process-carousel');
    const ring = section && section.querySelector('.process-carousel-ring');
    if (!section || !ring || MQ_HIDE.matches) return;

    const cards = Array.from(ring.querySelectorAll('.process-carousel-card'));
    const n = cards.length;
    if (!n) return;

    // offsetWidth ignores 3D transforms — use layout size, not projected bounds
    const widths = cards.map((card) => {
      const w = card.offsetWidth;
      if (w > 1) return w;
      if (card.naturalWidth && card.naturalHeight) {
        const h = card.offsetHeight || 180;
        return h * (card.naturalWidth / card.naturalHeight);
      }
      return 160;
    });

    const sumW = widths.reduce((a, b) => a + b, 0);
    const radius = (sumW + n * GAP_PX) / (2 * Math.PI);
    if (!Number.isFinite(radius) || radius <= 0) return;

    ring.style.setProperty('--carousel-r', `${radius}px`);

    let angle = 0;
    cards.forEach((card, i) => {
      const deg = (angle * 180) / Math.PI;
      card.style.setProperty('--carousel-a', `${deg}deg`);
      card.style.transform = `rotateY(${deg}deg) translateZ(${-radius}px)`;
      const next = widths[(i + 1) % n];
      angle += (widths[i] / 2 + GAP_PX + next / 2) / radius;
    });
  }

  function whenReady(cards) {
    return Promise.all(
      cards.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth) {
              resolve();
              return;
            }
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
      )
    );
  }

  function init() {
    const ring = document.querySelector('#process-carousel .process-carousel-ring');
    if (!ring) return;
    const cards = Array.from(ring.querySelectorAll('.process-carousel-card'));

    let resizeTimer = 0;
    const run = () => {
      requestAnimationFrame(() => layout());
    };
    const runDebounced = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(run, 80);
    };

    whenReady(cards).then(run);
    window.addEventListener('resize', runDebounced, { passive: true });
    if (typeof MQ_HIDE.addEventListener === 'function') {
      MQ_HIDE.addEventListener('change', run);
    } else if (typeof MQ_HIDE.addListener === 'function') {
      MQ_HIDE.addListener(run);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
