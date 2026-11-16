/* AccordionGallery (vanilla port of React Bits AccordionGallery-JS-CSS) */
(function () {
  'use strict';

  function mountAccordionGallery(root, options) {
    if (!root) return () => {};
    const opts = Object.assign(
      {
        items: [],
        defaultIndex: 2,
        expandRatio: 0.52,
        trigger: 'hover',
        accentColor: '#ffffff',
        overlayColor: '#060010',
        textColor: '#ffffff',
        grayscale: true,
        showLabels: true,
        duration: 0.6,
        parallax: 0.5,
        tilt: 8,
        height: 460,
        gap: 10,
        radius: 16,
        orientation: 'horizontal'
      },
      options || {}
    );

    const items = Array.isArray(opts.items) ? opts.items : [];
    const count = items.length;
    if (!count) {
      root.replaceChildren();
      return () => {};
    }

    let active = Math.min(Math.max(Number(opts.defaultIndex) || 0, 0), count - 1);
    let mediaSize = 320;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mqMobile = window.matchMedia('(max-width: 900px)');

    root.className = 'accordion-gallery';
    root.style.setProperty('--ag-accent', opts.accentColor);
    root.style.setProperty('--ag-overlay', opts.overlayColor);
    root.style.setProperty('--ag-text', opts.textColor);
    root.style.setProperty('--ag-gap', `${opts.gap}px`);
    root.style.setProperty('--ag-radius', `${opts.radius}px`);
    root.style.setProperty('--ag-duration', `${opts.duration}s`);
    root.setAttribute('role', 'list');
    root.setAttribute('aria-label', opts.ariaLabel || 'Sector gallery');

    root.replaceChildren();
    const panels = items.map((item, i) => {
      const panel = document.createElement('div');
      panel.className = 'ag-panel';
      panel.setAttribute('role', 'listitem');
      panel.tabIndex = 0;
      panel.setAttribute('aria-label', item.label || `Panel ${i + 1}`);
      panel.style.borderRadius = `${opts.radius}px`;

      const detail = item.detail ? `<p class="ag-panel__body">${item.detail}</p>` : '';
      const cta =
        item.link && item.link !== '#'
          ? `<a class="ag-panel__cta" href="${item.link}">${item.cta || `View ${(item.label || '').toLowerCase()} funnel →`}</a>`
          : '';

      panel.innerHTML = `
        <span class="ag-panel__frame">
          <span class="ag-panel__media">
            <img src="${item.image}" alt="" loading="${i === active ? 'eager' : 'lazy'}" decoding="async" width="900" height="1200" />
          </span>
          <span class="ag-panel__overlay" aria-hidden="true"></span>
        </span>
        <div class="ag-panel__copy">
          <p class="ag-panel__title">${item.label || ''}</p>
          ${detail}
          ${cta}
        </div>
      `;
      root.appendChild(panel);
      return panel;
    });

    const applyLayout = () => {
      const vertical = opts.orientation === 'vertical' || mqMobile.matches;
      root.classList.toggle('accordion-gallery--vertical', vertical);
      root.style.height = vertical ? '' : `${opts.height}px`;

      const rect = root.getBoundingClientRect();
      const total = vertical ? Math.max(rect.height, 1) : Math.max(rect.width, 1);
      const usable = Math.max(total - opts.gap * (count - 1), 120);
      const ratio = Math.min(Math.max(opts.expandRatio, 0.2), 0.9);
      mediaSize = Math.max(140, usable * ratio * 1.22);
      root.style.setProperty('--ag-media-size', `${mediaSize}px`);

      const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;

      panels.forEach((panel, i) => {
        const isActive = i === active;
        panel.classList.toggle('ag-panel--active', isActive);
        panel.setAttribute('aria-current', isActive ? 'true' : 'false');
        panel.style.flexGrow = String(isActive ? grow : 1);

        const rot = isActive || reduce ? 0 : i < active ? opts.tilt : -opts.tilt;
        if (!mqMobile.matches && !reduce) {
          panel.style.transform = `rotateY(${rot}deg)`;
        } else {
          panel.style.transform = '';
        }

        const media = panel.querySelector('.ag-panel__media');
        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * opts.parallax * mediaSize * 0.06;
          const gray = opts.grayscale ? (isActive ? 0 : 1) : 0;
          media.style.setProperty('--ag-gray', String(gray));
          media.style.setProperty('--ag-dim', isActive ? '0' : '0.35');
          if (vertical || reduce) {
            media.style.transform = 'translate(-50%, -50%)';
          } else {
            media.style.transform = `translate(calc(-50% + ${isActive ? 0 : shift}px), -50%)`;
          }
        }
      });
    };

    const setActive = (i, fromUser) => {
      if (i < 0 || i >= count || i === active) return;
      active = i;
      applyLayout();
      if (fromUser && typeof opts.onChange === 'function') opts.onChange(items[i], i);
    };

    const onEnter = (i) => {
      if (opts.trigger === 'hover' && !mqMobile.matches) setActive(i, true);
    };

    const onClick = (i, e) => {
      if (e.target.closest('a')) return;
      if (i !== active) {
        e.preventDefault();
        setActive(i, true);
      }
    };

    const onKey = (i, e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i + 1) % count, true);
        panels[(i + 1) % count].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = (i - 1 + count) % count;
        setActive(next, true);
        panels[next].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (i !== active) {
          e.preventDefault();
          setActive(i, true);
        }
      }
    };

    const cleanups = [];
    panels.forEach((panel, i) => {
      const enter = () => onEnter(i);
      const click = (e) => onClick(i, e);
      const focus = () => setActive(i, true);
      const key = (e) => onKey(i, e);
      panel.addEventListener('mouseenter', enter);
      panel.addEventListener('click', click);
      panel.addEventListener('focus', focus);
      panel.addEventListener('keydown', key);
      cleanups.push(() => {
        panel.removeEventListener('mouseenter', enter);
        panel.removeEventListener('click', click);
        panel.removeEventListener('focus', focus);
        panel.removeEventListener('keydown', key);
      });
    });

    const ro = new ResizeObserver(() => applyLayout());
    ro.observe(root);
    const onMq = () => applyLayout();
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onMq);
    else if (mqMobile.addListener) mqMobile.addListener(onMq);

    applyLayout();

    return () => {
      ro.disconnect();
      if (mqMobile.removeEventListener) mqMobile.removeEventListener('change', onMq);
      else if (mqMobile.removeListener) mqMobile.removeListener(onMq);
      cleanups.forEach((fn) => fn());
      root.replaceChildren();
    };
  }

  window.LEVEL_mountAccordionGallery = mountAccordionGallery;
})();
