/**
 * Homepage hero capability scanner — feathered vertical list that
 * pauses on each option, then advances forever (no cursor control).
 */
(function () {
  const list = document.getElementById('hero-scan-list');
  if (!list) return;

  const originals = Array.from(list.querySelectorAll('.hero-scan-item'));
  if (originals.length < 2) return;

  const HOLD_MS = 2200;
  const STEP_MS = 520;
  const COPIES = 3;
  let index = 0;
  let timer = null;
  let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let items = [];

  // Build a long track: original + clones so we never jump backward visually
  const fragment = document.createDocumentFragment();
  for (let c = 1; c < COPIES; c += 1) {
    originals.forEach((el) => {
      const clone = el.cloneNode(true);
      clone.removeAttribute('aria-current');
      clone.classList.remove('is-active');
      fragment.appendChild(clone);
    });
  }
  list.appendChild(fragment);
  items = Array.from(list.querySelectorAll('.hero-scan-item'));

  const baseCount = originals.length;
  // Start in the middle copy so we can scroll "forever" in one direction
  index = baseCount;

  function setActive(i, { instant } = {}) {
    index = i;
    items.forEach((el, n) => {
      const dist = Math.abs(n - index);
      el.classList.toggle('is-active', n === index);
      el.style.setProperty('--scan-dist', String(Math.min(dist, 4)));
      if (n === index) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });

    const active = items[index];
    const viewport = list.parentElement;
    if (!active || !viewport) return;

    if (instant) list.classList.add('is-instant');
    const vMid = viewport.clientHeight / 2;
    const aMid = active.offsetTop + active.offsetHeight / 2;
    list.style.transform = `translate3d(0, ${vMid - aMid}px, 0)`;

    if (instant) {
      // Force reflow then restore transition
      void list.offsetHeight;
      list.classList.remove('is-instant');
    }
  }

  function next() {
    const nextIndex = index + 1;
    setActive(nextIndex);

    // When we enter the last copy, snap back to the matching item in the middle copy
    if (index >= baseCount * (COPIES - 1)) {
      window.setTimeout(() => {
        setActive(index - baseCount, { instant: true });
      }, STEP_MS + 40);
    }
  }

  function schedule() {
    clearTimeout(timer);
    if (reduced) return;
    timer = window.setTimeout(() => {
      next();
      schedule();
    }, HOLD_MS + STEP_MS);
  }

  window.addEventListener(
    'resize',
    () => {
      setActive(index, { instant: true });
    },
    { passive: true }
  );

  setActive(index, { instant: true });
  list.classList.add('is-ready');
  schedule();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timer);
    else schedule();
  });
})();
