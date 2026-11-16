/**
 * Hero 3D cylinder - curved webview panels on an elongated drum.
 */
(function () {
  'use strict';

  const STRIPS = 12;
  // Opens space between panels and elongates the drum in Z
  const GAP = 1.9;

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function buildCurvedMedia(media, src, alt) {
    media.textContent = '';
    media.classList.add('is-curved');

    const surface = document.createElement('div');
    surface.className = 'hero-cylinder-surface';
    surface.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < STRIPS; i += 1) {
      const strip = document.createElement('div');
      strip.className = 'hero-cylinder-strip';
      strip.style.setProperty('--strip-i', String(i));

      const face = document.createElement('div');
      face.className = 'hero-cylinder-strip-face';
      face.style.backgroundImage = `url("${src}")`;
      strip.appendChild(face);
      surface.appendChild(strip);
    }

    media.appendChild(surface);

    const fallback = document.createElement('img');
    fallback.className = 'hero-cylinder-fallback';
    fallback.src = src;
    fallback.alt = alt || '';
    fallback.decoding = 'async';
    fallback.draggable = false;
    media.appendChild(fallback);
  }

  function init() {
    const stage = document.getElementById('hero-cylinder-stage');
    const cylinder = stage && stage.querySelector('[data-hero-cylinder]');
    if (!stage || !cylinder) return;

    const panels = Array.from(cylinder.querySelectorAll('.hero-cylinder-panel'));
    const count = panels.length;
    if (!count) return;

    const angleStep = 360 / count;
    let radius = 0;
    let rotation = 0;
    let velocity = prefersReducedMotion() ? 0 : 0.014;
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let raf = 0;
    let resumeTimer = 0;

    panels.forEach((panel) => {
      const media = panel.querySelector('.hero-cylinder-media');
      const img = media && media.querySelector('img');
      if (!media || !img) return;
      buildCurvedMedia(media, img.currentSrc || img.src, img.alt);
    });

    function measure() {
      const panel = panels[0];
      const width = panel.getBoundingClientRect().width || 260;
      const tight = width / (2 * Math.tan(Math.PI / count));
      radius = tight * GAP;

      // Angular width of each curved card on the drum
      const panelAngle = (2 * Math.atan(width / (2 * radius)) * 180) / Math.PI;
      const stripAngle = panelAngle / STRIPS;
      const stripWidth = 2 * radius * Math.tan((stripAngle * Math.PI) / 360);

      cylinder.style.setProperty('--cylinder-radius', `${radius}px`);
      cylinder.style.setProperty('--panel-angle', `${panelAngle}deg`);
      cylinder.style.setProperty('--strip-angle', `${stripAngle}deg`);
      cylinder.style.setProperty('--strip-width', `${stripWidth}px`);
      cylinder.style.setProperty('--panel-width', `${width}px`);

      panels.forEach((panel, index) => {
        const baseYaw = index * angleStep;
        panel.style.setProperty('--panel-yaw', `${baseYaw}deg`);
        panel.style.transform = `rotateY(${baseYaw}deg)`;

        const strips = panel.querySelectorAll('.hero-cylinder-strip');
        strips.forEach((strip, i) => {
          const local = -panelAngle / 2 + (i + 0.5) * stripAngle;
          strip.style.width = `${stripWidth}px`;
          strip.style.marginLeft = `${-stripWidth / 2}px`;
          strip.style.transform = `rotateY(${local}deg) translateZ(${radius}px)`;

          const face = strip.querySelector('.hero-cylinder-strip-face');
          if (face) {
            face.style.backgroundSize = `${width}px 100%`;
            face.style.backgroundPosition = `${-i * stripWidth}px 50%`;
          }
        });

        const copy = panel.querySelector('.hero-cylinder-copy');
        if (copy) {
          copy.style.transform = `translateZ(${radius + 8}px)`;
        }
      });
    }

    function applyRotation() {
      cylinder.style.transform = `translateZ(var(--cylinder-depth, -340px)) rotateX(6deg) rotateY(${rotation}deg)`;
    }

    function tick() {
      raf = window.requestAnimationFrame(tick);
      if (!dragging && velocity) rotation += velocity;
      applyRotation();
    }

    function pauseAuto() {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      velocity = 0;
    }

    function resumeAuto() {
      if (prefersReducedMotion()) return;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        velocity = 0.014;
      }, 900);
    }

    function onPointerDown(event) {
      dragging = true;
      moved = false;
      lastX = event.clientX;
      pauseAuto();
      stage.setPointerCapture(event.pointerId);
      stage.classList.add('is-dragging');
    }

    function onPointerMove(event) {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      if (Math.abs(dx) > 1) moved = true;
      rotation += dx * 0.26;
      applyRotation();
    }

    function onPointerUp(event) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      try {
        stage.releasePointerCapture(event.pointerId);
      } catch (err) {
        /* ignore */
      }
      resumeAuto();
    }

    function onClickCapture(event) {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    }

    measure();
    applyRotation();
    stage.classList.add('is-ready');

    if (!prefersReducedMotion()) {
      raf = window.requestAnimationFrame(tick);
    }

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);
    stage.addEventListener('click', onClickCapture, true);
    stage.addEventListener('pointerleave', () => {
      if (!dragging) resumeAuto();
    });

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 120);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
