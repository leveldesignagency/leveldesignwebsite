/**
 * Hero selected work - tabs switch spotlight; links go to live sites (case studies hidden).
 * Listens to level:hero-intent so order/copy follow search silos.
 */
(function () {
  'use strict';

  const FALLBACK_PROJECTS = {
    ontimely: {
      id: 'ontimely',
      title: 'OnTimely.',
      desc: 'Event management platform and mobile app.',
      image: 'public/hero-spotlight/ontimely.jpg',
      thumb: 'public/hero-thumbs/ontimely.jpg',
      imageAlt: 'OnTimely event management platform',
      url: 'https://www.ontimely.co.uk',
      pickLabel: 'OnTimely',
      pickSub: 'Event management',
    },
    kleen: {
      id: 'kleen',
      title: 'KLEEN.',
      desc: 'Web app service connecting clients with specialist cleaners.',
      image: 'public/hero-spotlight/kleen.jpg?v=3',
      thumb: 'public/hero-thumbs/kleen.jpg?v=3',
      imageAlt: 'KLEEN cleaning platform',
      url: 'https://kleenapp.co.uk',
      pickLabel: 'KLEEN',
      pickSub: 'Web app service',
    },
    pocdocs: {
      id: 'pocdocs',
      title: 'Pocdocs.',
      desc: 'Mobile-first PDF transformation for documents on any device.',
      image: 'public/hero-spotlight/pocdocs.jpg',
      thumb: 'public/hero-thumbs/pocdocs.jpg',
      imageAlt: 'Pocdocs mobile-first PDF platform',
      url: 'https://www.leveldesignagency.com/#work-title',
      pickLabel: 'Pocdocs',
      pickSub: 'Web platform',
    },
    nimbus: {
      id: 'nimbus',
      title: 'Nimbus.',
      desc: 'In-browser learning: highlight any text for definitions, AI explanations, and translation.',
      image: 'public/hero-spotlight/nimbus.jpg',
      thumb: 'public/hero-thumbs/nimbus.jpg',
      imageAlt: 'Nimbus Chrome extension',
      url: 'https://chromewebstore.google.com/detail/abmihilkdbamlelkmpfegjfimcjpcihh?utm_source=item-share-cb',
      pickLabel: 'Nimbus',
      pickSub: 'Chrome extension',
    },
  };

  function imageSrcMatches(img, src) {
    if (!img || !src) return false;
    const current = img.getAttribute('src') || '';
    return current === src || current.endsWith(src.replace(/^\//, ''));
  }

  function preloadAndSetImage(img, src, onReady) {
    if (imageSrcMatches(img, src)) {
      onReady();
      return;
    }
    const preloader = new Image();
    preloader.decoding = 'async';
    preloader.onload = () => {
      img.src = src;
      onReady();
    };
    preloader.onerror = onReady;
    preloader.src = src;
  }

  function toPickProject(p) {
    return {
      id: p.id,
      title: p.title || `${p.name}.`,
      desc: p.desc,
      image: p.image,
      thumb: p.thumb || p.image,
      imageAlt: p.imageAlt,
      url: p.url,
      pickLabel: p.name || p.pickLabel,
      pickSub: p.type || p.pickSub,
    };
  }

  function init() {
    const root = document.querySelector('.hero-selected-work');
    if (!root) return;

    const panel = root.querySelector('.hero-spotlight-panel');
    const titleEl = root.querySelector('.hero-spotlight-title');
    const descEl = root.querySelector('.hero-spotlight-desc');
    const kickerEl = root.querySelector('.hero-spotlight-kicker');
    const mediaImg = root.querySelector('.hero-spotlight-media img');
    const cta = root.querySelector('.hero-spotlight-cta');
    const picksWrap = root.querySelector('.hero-picks');

    if (!panel || !titleEl || !descEl || !mediaImg || !cta || !picksWrap) return;

    let projectsById = { ...FALLBACK_PROJECTS };
    let order = Object.keys(FALLBACK_PROJECTS);

    function plainDesc(el, text) {
      el.textContent = text;
      el.classList.remove('text-reveal', 'text-reveal--done');
      delete el.dataset.revealReady;
    }

    function setProject(id, options) {
      const opts = options || {};
      const project = projectsById[id];
      if (!project) return;

      const isInitial = Boolean(opts.initial);
      if (!isInitial) panel.classList.add('is-switching');

      titleEl.textContent = project.title;
      plainDesc(descEl, project.desc);
      mediaImg.alt = project.imageAlt;
      cta.href = project.url;
      cta.setAttribute('target', '_blank');
      cta.setAttribute('rel', 'noopener noreferrer');
      cta.textContent = 'View live →';
      panel.dataset.activeProject = id;

      picksWrap.querySelectorAll('.hero-pick').forEach((tab) => {
        const active = tab.dataset.project === id;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      const finish = () => {
        if (!isInitial) {
          window.requestAnimationFrame(() => panel.classList.remove('is-switching'));
        }
      };

      preloadAndSetImage(mediaImg, project.image, finish);
    }

    function renderPicks(projectList, kicker) {
      if (kickerEl && kicker) kickerEl.textContent = kicker;

      projectsById = {};
      order = projectList.map((p) => p.id);
      projectList.forEach((p) => {
        projectsById[p.id] = toPickProject(p);
      });

      picksWrap.innerHTML = projectList
        .map(
          (p, i) => `<button type="button" class="hero-pick${i === 0 ? ' is-active' : ''}" role="tab" aria-selected="${
            i === 0 ? 'true' : 'false'
          }" data-project="${p.id}">
            <span class="hero-pick-thumb">
              <img src="${p.thumb || p.image}" alt="" width="168" height="168" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" />
            </span>
            <span class="hero-pick-text">
              <strong>${p.name || p.pickLabel}</strong>
              <em>${p.type || p.pickSub}</em>
            </span>
          </button>`
        )
        .join('');

      picksWrap.querySelectorAll('.hero-pick').forEach((tab) => {
        tab.addEventListener('click', () => setProject(tab.dataset.project));
      });

      setProject(order[0], { initial: true });
    }

    function applyIntentDetail(detail) {
      if (!detail || !detail.projects || !detail.projects.length) return;
      const kicker = (detail.workSilo && detail.workSilo.spotlightKicker) || 'Selected work';
      renderPicks(detail.projects, kicker);
    }

    if (window.LEVEL_CURRENT_INTENT) {
      applyIntentDetail(window.LEVEL_CURRENT_INTENT);
    } else {
      renderPicks(
        order.map((id) => FALLBACK_PROJECTS[id]),
        'Selected work'
      );
    }

    document.addEventListener('level:hero-intent', (e) => {
      applyIntentDetail(e.detail);
    });

    window.setTimeout(() => {
      order.forEach((id) => {
        const p = projectsById[id];
        if (!p) return;
        const img = new Image();
        img.decoding = 'async';
        img.src = p.image;
      });
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
