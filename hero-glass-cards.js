/**
 * Hero glass cards — desktop pointer tilt + mobile stacked flick-through.
 */
(function () {
  'use strict';

  const ACTIVE_Z = 100;
  const DECK_PEEK = 12;

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function isDesktop() {
    return window.matchMedia('(min-width: 901px)').matches;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function baseZ(card) {
    const value = Number(card.dataset.stackZ);
    return Number.isFinite(value) ? value : 1;
  }

  function init() {
    const stage = document.getElementById('hero-glass-stage');
    const stack = stage && stage.querySelector('[data-hero-glass-cards]');
    if (!stage || !stack) return;

    const cards = Array.from(stack.querySelectorAll('.hero-glass-card'));
    if (!cards.length) return;

    const desktopCleanup = { run: null };
    const mobileCleanup = { run: null };

    function clearCardMotion(card) {
      card.classList.remove('is-pointer-active');
      card.style.removeProperty('--tilt-rz');
      card.style.removeProperty('--card-scale');
      card.style.removeProperty('--deck-y');
      card.style.removeProperty('--deck-r');
      card.style.removeProperty('--deck-s');
      card.style.removeProperty('--deck-o');
      card.style.zIndex = String(baseZ(card));
      card.style.pointerEvents = '';
    }

    function teardown() {
      if (desktopCleanup.run) desktopCleanup.run();
      if (mobileCleanup.run) mobileCleanup.run();
      desktopCleanup.run = null;
      mobileCleanup.run = null;
      stage.classList.remove('is-deck');
      stack.style.removeProperty('--deck-h');
      cards.forEach(clearCardMotion);
    }

    function initDesktop() {
      if (prefersReducedMotion()) {
        window.requestAnimationFrame(() => stage.classList.add('is-ready'));
        return;
      }

      let activeCard = null;
      let raf = 0;
      const pending = { card: null, event: null };

      function resetCard(card) {
        card.classList.remove('is-pointer-active');
        card.style.setProperty('--tilt-rz', '0deg');
        card.style.setProperty('--card-scale', '1');
        card.style.zIndex = String(baseZ(card));

        const frame = card.querySelector('.hero-glass-card-frame');
        if (frame) {
          frame.style.setProperty('--shimmer-x', '50%');
          frame.style.setProperty('--shimmer-y', '50%');
        }
      }

      function applyPointer(card, event) {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const depth = Number(card.dataset.tiltDepth || 1);
        // Flat rotate only — no skew (skew reads as stretch, not 3D)
        const tiltRz = (x - 0.5) * 6 * depth;

        card.style.setProperty('--tilt-rz', `${tiltRz}deg`);
        card.style.setProperty('--card-scale', '1.03');

        const frame = card.querySelector('.hero-glass-card-frame');
        if (frame) {
          frame.style.setProperty('--shimmer-x', `${x * 100}%`);
          frame.style.setProperty('--shimmer-y', `${y * 100}%`);
        }
      }

      function flushPointer() {
        raf = 0;
        if (!pending.card || !pending.event) return;
        applyPointer(pending.card, pending.event);
      }

      function requestPointer(card, event) {
        pending.card = card;
        pending.event = event;
        if (raf) return;
        raf = window.requestAnimationFrame(flushPointer);
      }

      function activateCard(card) {
        if (activeCard && activeCard !== card) resetCard(activeCard);
        activeCard = card;
        stack.classList.add('has-active-card');
        card.classList.add('is-pointer-active');
        card.style.zIndex = String(ACTIVE_Z);
      }

      function deactivateCard(card) {
        resetCard(card);
        if (activeCard === card) {
          activeCard = null;
          stack.classList.remove('has-active-card');
        }
      }

      const listeners = [];
      cards.forEach((card) => {
        const onEnter = (event) => {
          activateCard(card);
          requestPointer(card, event);
        };
        const onMove = (event) => {
          if (activeCard !== card) activateCard(card);
          requestPointer(card, event);
        };
        const onLeave = () => deactivateCard(card);
        card.addEventListener('pointerenter', onEnter);
        card.addEventListener('pointermove', onMove);
        card.addEventListener('pointerleave', onLeave);
        listeners.push([card, onEnter, onMove, onLeave]);
      });

      desktopCleanup.run = () => {
        listeners.forEach(([card, onEnter, onMove, onLeave]) => {
          card.removeEventListener('pointerenter', onEnter);
          card.removeEventListener('pointermove', onMove);
          card.removeEventListener('pointerleave', onLeave);
        });
        stack.classList.remove('has-active-card');
        if (raf) window.cancelAnimationFrame(raf);
      };
    }

    function initMobileDeck() {
      stage.classList.add('is-deck');

      const ordered = cards.slice().sort((a, b) => baseZ(b) - baseZ(a));
      const count = ordered.length;
      const reduced = prefersReducedMotion();
      let raf = 0;

      function measure() {
        const front = ordered[0];
        const height = front ? front.offsetHeight : 0;
        if (height) {
          stack.style.setProperty('--deck-h', `${height + (count - 1) * DECK_PEEK}px`);
        }
      }

      function applyDeck(progress) {
        const p = reduced ? 0 : progress;
        ordered.forEach((card, i) => {
          const local = clamp(p * count - i, 0, 1);
          const behind = Math.max(0, i - p * count);
          const restY = behind * DECK_PEEK;

          if (local > 0) {
            const ease = 1 - Math.pow(1 - local, 1.35);
            const dir = i % 2 === 0 ? -1 : 1;
            card.style.setProperty('--deck-y', `calc(${restY}px - ${ease * 145}%)`);
            card.style.setProperty('--deck-r', `${dir * ease * 22}deg`);
            card.style.setProperty('--deck-s', '1');
            card.style.setProperty('--deck-o', '1');
            // Exiting card rises above the remaining stack in leave order
            card.style.zIndex = String(100 + i);
          } else {
            card.style.setProperty('--deck-y', `${restY}px`);
            card.style.setProperty('--deck-r', '0deg');
            card.style.setProperty('--deck-s', '1');
            card.style.setProperty('--deck-o', '1');
            // Resting order: OnTimely on top, others behind (original stack)
            card.style.zIndex = String(count - i);
          }

          card.style.pointerEvents = local > 0.08 || behind > 0.4 ? 'none' : 'auto';
        });
      }

      function readProgress() {
        if (reduced) return 0;
        const start = 12;
        const range = Math.max(220, window.innerHeight * 0.62);
        return clamp((window.scrollY - start) / range, 0, 1);
      }

      function onFrame() {
        raf = 0;
        applyDeck(readProgress());
      }

      function requestFrame() {
        if (raf) return;
        raf = window.requestAnimationFrame(onFrame);
      }

      const onScroll = () => requestFrame();
      const onResize = () => {
        measure();
        requestFrame();
      };

      measure();
      applyDeck(0);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);

      mobileCleanup.run = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        if (raf) window.cancelAnimationFrame(raf);
      };
    }

    function bootMode() {
      teardown();
      cards.forEach((card) => {
        card.style.zIndex = String(baseZ(card));
      });

      if (isDesktop()) initDesktop();
      else initMobileDeck();

      window.requestAnimationFrame(() => stage.classList.add('is-ready'));
    }

    bootMode();
    window.matchMedia('(min-width: 901px)').addEventListener('change', bootMode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
