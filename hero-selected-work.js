/**
 * Hero selected work — tab picker switches spotlight; View project goes to case study page.
 */
(function () {
  'use strict';

  const PROJECTS = {
    ontimely: {
      title: 'OnTimely.',
      desc: 'Event management platform and mobile app.',
      image: 'public/ontimely project.png?v=2',
      imageAlt: 'OnTimely event management platform',
      page: '/work/ontimely',
      pickLabel: 'OnTimely',
      pickSub: 'Event management',
    },
    kleen: {
      title: 'KLEEN.',
      desc: 'Web app service connecting clients with specialist cleaners.',
      image: 'public/Kleen Promo.png',
      imageAlt: 'KLEEN cleaning platform',
      page: '/work/kleen',
      pickLabel: 'KLEEN',
      pickSub: 'Web app service',
    },
    pocdocs: {
      title: 'Pocdocs.',
      desc: 'Mobile-first PDF transformation for documents on any device.',
      image: 'public/pocdocs-01.png?v=1',
      imageAlt: 'Pocdocs mobile-first PDF platform',
      page: '/work/pocdocs',
      pickLabel: 'Pocdocs',
      pickSub: 'Web platform',
    },
    nimbus: {
      title: 'Nimbus.',
      desc: 'In-browser learning: highlight any text for definitions, AI explanations, and translation.',
      image: 'public/Nimbus-01.png',
      imageAlt: 'Nimbus Chrome extension',
      page: '/work/nimbus',
      pickLabel: 'Nimbus',
      pickSub: 'Chrome extension',
    },
  };

  function init() {
    const root = document.querySelector('.hero-selected-work');
    if (!root) return;

    const panel = root.querySelector('.hero-spotlight-panel');
    const titleEl = root.querySelector('.hero-spotlight-title');
    const descEl = root.querySelector('.hero-spotlight-desc');
    const mediaImg = root.querySelector('.hero-spotlight-media img');
    const cta = root.querySelector('.hero-spotlight-cta');
    const tabs = root.querySelectorAll('.hero-pick[data-project]');

    if (!panel || !titleEl || !descEl || !mediaImg || !cta || !tabs.length) return;

    function plainDesc(el, text) {
      el.textContent = text;
      el.classList.remove('text-reveal', 'text-reveal--done');
      delete el.dataset.revealReady;
    }

    function setProject(id, options) {
      const opts = options || {};
      const project = PROJECTS[id];
      if (!project) return;

      panel.classList.add('is-switching');
      titleEl.textContent = project.title;
      plainDesc(descEl, project.desc);
      mediaImg.src = project.image;
      mediaImg.alt = project.imageAlt;
      cta.href = project.page;
      panel.dataset.activeProject = id;

      tabs.forEach((tab) => {
        const active = tab.dataset.project === id;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      window.requestAnimationFrame(() => {
        panel.classList.remove('is-switching');
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        setProject(tab.dataset.project);
      });
    });

    const initial = root.querySelector('.hero-pick.is-active')?.dataset.project || 'ontimely';
    setProject(initial, { initial: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
