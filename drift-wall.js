/* DriftWall (vanilla port of React Bits DriftWall-JS-CSS) */
(function () {
  'use strict';

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const columnFactor = (index, variance) => {
    const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
    return 1 + variance * pseudo;
  };

  const mulberry32 = (seed) => {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const shuffleInPlace = (arr, rand) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  };

  /** Full shuffled decks per column — no identical images stacked back-to-back. */
  const buildColumnSequence = (items, colIndex, targetLen) => {
    if (!items.length) return [];
    if (items.length === 1) {
      return Array.from({ length: Math.max(1, targetLen) }, () => items[0]);
    }

    const rand = mulberry32(0x9e3779b9 ^ (colIndex + 1) * 0x85ebca6b);
    const out = [];
    const len = Math.max(targetLen, items.length);

    while (out.length < len) {
      const deck = shuffleInPlace(items.slice(), rand);
      if (out.length && deck[0].image === out[out.length - 1].image) {
        const swapAt = deck.findIndex((it) => it.image !== out[out.length - 1].image);
        if (swapAt > 0) {
          const tmp = deck[0];
          deck[0] = deck[swapAt];
          deck[swapAt] = tmp;
        }
      }
      for (let i = 0; i < deck.length && out.length < len; i++) {
        const item = deck[i];
        if (out.length && item.image === out[out.length - 1].image) continue;
        out.push(item);
      }
      if (out.length < len) {
        const pick = items.find((it) => it.image !== out[out.length - 1].image) || items[0];
        out.push(pick);
      }
    }

    // Seamless loop: last tile must differ from first
    if (out.length > 1 && out[0].image === out[out.length - 1].image) {
      for (let i = out.length - 2; i > 0; i--) {
        if (out[i].image !== out[0].image) {
          const tmp = out[out.length - 1];
          out[out.length - 1] = out[i];
          out[i] = tmp;
          break;
        }
      }
    }

    return out;
  };

  /** src → blob: URL after fetch+decode. One network hit per unique asset. */
  const blobUrlCache = new Map();

  function ensureBlobUrl(src) {
    if (!src) return Promise.resolve('');
    if (blobUrlCache.has(src)) return blobUrlCache.get(src);

    const promise = (async () => {
      try {
        const res = await fetch(src, { cache: 'force-cache' });
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        // Decode into memory so first paint is not deferred
        await new Promise((resolve) => {
          const img = new Image();
          const done = () => {
            if (typeof img.decode === 'function') {
              img.decode().then(resolve).catch(resolve);
            } else {
              resolve();
            }
          };
          img.onload = done;
          img.onerror = resolve;
          img.src = url;
          if (img.complete && img.naturalWidth > 0) done();
        });
        return url;
      } catch (_) {
        return src; // fall back to original path
      }
    })();

    blobUrlCache.set(src, promise);
    return promise;
  }

  function ensureBlobUrls(urls) {
    const unique = Array.from(new Set(urls.filter(Boolean)));
    return Promise.all(unique.map((src) => ensureBlobUrl(src))).then(() => {
      const map = new Map();
      return Promise.all(
        unique.map(async (src) => {
          map.set(src, await ensureBlobUrl(src));
        })
      ).then(() => map);
    });
  }

  const DEFAULTS = {
    columns: 11,
    tileWidth: 160,
    tileHeight: 224,
    gap: 12,
    radius: 10,
    tilt: 16,
    turn: -12,
    roll: 0,
    perspective: 1200,
    depth: 120,
    speed: 42,
    direction: 'up',
    variance: 0.45,
    parallax: 0.6,
    pauseOnHover: false,
    lift: 64,
    fade: 0.6,
    dim: 0.9,
    grayscale: false,
    overlayColor: '#0a0a0a',
    scale: 2.45
  };

  function readItems(host) {
    const raw = host.getAttribute('data-items');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      } catch (_) {}
    }
    return Array.from(host.querySelectorAll('[data-drift-item]')).map((el) => ({
      image: el.getAttribute('data-image') || el.getAttribute('src') || '',
      title: el.getAttribute('data-title') || el.getAttribute('alt') || '',
      href: el.getAttribute('data-href') || el.getAttribute('href') || undefined
    })).filter((item) => item.image);
  }

  function readOptions(host) {
    const o = Object.assign({}, DEFAULTS);
    const num = (name, key) => {
      const v = host.getAttribute(name);
      if (v != null && v !== '' && Number.isFinite(Number(v))) o[key] = Number(v);
    };
    const bool = (name, key) => {
      const v = host.getAttribute(name);
      if (v == null) return;
      o[key] = v === 'true' || v === '';
    };
    num('data-columns', 'columns');
    num('data-tile-width', 'tileWidth');
    num('data-tile-height', 'tileHeight');
    num('data-gap', 'gap');
    num('data-radius', 'radius');
    num('data-tilt', 'tilt');
    num('data-turn', 'turn');
    num('data-roll', 'roll');
    num('data-perspective', 'perspective');
    num('data-depth', 'depth');
    num('data-speed', 'speed');
    num('data-variance', 'variance');
    num('data-parallax', 'parallax');
    num('data-lift', 'lift');
    num('data-fade', 'fade');
    num('data-dim', 'dim');
    num('data-scale', 'scale');
    bool('data-pause-on-hover', 'pauseOnHover');
    bool('data-grayscale', 'grayscale');
    const dir = host.getAttribute('data-direction');
    if (dir === 'up' || dir === 'down') o.direction = dir;
    const overlay = host.getAttribute('data-overlay-color');
    if (overlay) o.overlayColor = overlay;
    return o;
  }

  function mountDriftWall(host, items, options) {
    if (!host || host.dataset.driftMounted === '1') return null;
    const opts = Object.assign({}, DEFAULTS, options || {});
    const sourceItems = (items && items.length ? items : readItems(host)).filter((i) => i && i.image);
    if (!sourceItems.length) return null;

    host.dataset.driftMounted = '1';
    host.innerHTML = '';
    host.classList.add('drift-wall', 'is-loading');
    host.classList.remove('is-ready');
    host.setAttribute('role', 'group');
    if (!host.getAttribute('aria-label')) host.setAttribute('aria-label', 'Drifting wall of tiles');

    const plane = document.createElement('div');
    plane.className = 'drift-wall__plane';
    host.appendChild(plane);

    const state = {
      opts,
      items: sourceItems,
      urlMap: new Map(),
      containerHeight: host.getBoundingClientRect().height || 600,
      reduced: prefersReducedMotion(),
      trackEls: [],
      offsets: [],
      velocities: [],
      baseVelocities: [],
      columnMeta: [],
      columnItems: [],
      hoveredCol: -1,
      wallHovered: false,
      activeId: null,
      pointer: { x: 0, y: 0 },
      pointerDamped: { x: 0, y: 0 },
      lastTs: null,
      raf: 0,
      ready: false,
      destroyed: false
    };

    const resolveUrl = (src) => state.urlMap.get(src) || src;

    const applyCssVars = () => {
      const o = state.opts;
      host.style.setProperty('--dw-tile-w', `${o.tileWidth}px`);
      host.style.setProperty('--dw-tile-h', `${o.tileHeight}px`);
      host.style.setProperty('--dw-gap', `${o.gap}px`);
      host.style.setProperty('--dw-radius', `${o.radius}px`);
      host.style.setProperty('--dw-perspective', `${o.perspective}px`);
      host.style.setProperty('--dw-lift', `${o.lift}px`);
      host.style.setProperty('--dw-dim', String(o.dim));
      host.style.setProperty('--dw-gray', o.grayscale ? '1' : '0');
      host.style.setProperty('--dw-overlay', o.overlayColor);
      host.style.setProperty('--dw-edge', `${Math.max(0, (1 - o.fade) * 100)}%`);
    };

    const applyPlaneTransform = (px, py) => {
      const o = state.opts;
      plane.style.transform =
        `translate(-50%, -50%) scale(${o.scale}) ` +
        `rotateX(${o.tilt + py}deg) rotateY(${o.turn + px}deg) rotateZ(${o.roll}deg) ` +
        `translateZ(${-o.depth}px)`;
    };

    const buildColumns = () => {
      const o = state.opts;

      // Shuffle once per mount — each column gets a full randomised deck
      if (state.columnItems.length !== o.columns) {
        const targetLen = Math.max(state.items.length, 8);
        state.columnItems = Array.from({ length: o.columns }, (_, c) =>
          buildColumnSequence(state.items, c, targetLen)
        );
      }

      const unit = o.tileHeight + o.gap;
      state.columnMeta = state.columnItems.map((col) => {
        const copyHeight = Math.max(unit, col.length * unit);
        const copies = Math.max(3, Math.ceil((state.containerHeight * 2.2) / copyHeight) + 1);
        return { copyHeight, copies };
      });

      const dirSign = o.direction === 'up' ? 1 : -1;
      state.baseVelocities = state.columnItems.map((_, c) => {
        const altSign = c % 2 === 0 ? 1 : -1;
        return o.speed * columnFactor(c, o.variance) * dirSign * altSign;
      });

      plane.innerHTML = '';
      state.trackEls = [];
      state.columnItems.forEach((col, c) => {
        const meta = state.columnMeta[c];
        const colEl = document.createElement('div');
        colEl.className = 'drift-wall__col';
        const track = document.createElement('div');
        track.className = 'drift-wall__track';
        for (let copyIndex = 0; copyIndex < meta.copies; copyIndex++) {
          col.forEach((item, itemIndex) => {
            const id = `${c}-${copyIndex}-${itemIndex}`;
            const tile = document.createElement(item.href ? 'a' : 'div');
            tile.className = 'drift-wall__tile';
            tile.dataset.tileId = id;
            tile.dataset.col = String(c);
            tile.tabIndex = 0;
            if (item.href) {
              tile.href = item.href;
              tile.rel = 'noopener noreferrer';
            }
            if (item.title) tile.setAttribute('aria-label', item.title);
            tile.addEventListener('focus', () => activate(id, c));
            tile.addEventListener('blur', release);

            const inner = document.createElement('span');
            inner.className = 'drift-wall__inner';
            const img = document.createElement('img');
            img.src = resolveUrl(item.image);
            img.alt = item.title || '';
            img.draggable = false;
            img.decoding = 'sync';
            img.loading = 'eager';
            img.width = o.tileWidth;
            img.height = o.tileHeight;
            const overlay = document.createElement('span');
            overlay.className = 'drift-wall__overlay';
            overlay.setAttribute('aria-hidden', 'true');
            inner.appendChild(img);
            inner.appendChild(overlay);
            tile.appendChild(inner);
            track.appendChild(tile);
          });
        }
        colEl.appendChild(track);
        plane.appendChild(colEl);
        state.trackEls[c] = track;
      });

      state.offsets = state.columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
      state.velocities = state.columnItems.map(() => 0);
      applyPlaneTransform(state.pointerDamped.x, state.pointerDamped.y);
    };

    const setActiveClass = (id) => {
      plane.querySelectorAll('.drift-wall__tile.is-active').forEach((el) => el.classList.remove('is-active'));
      if (!id) return;
      plane.querySelectorAll(`.drift-wall__tile[data-tile-id="${CSS.escape(id)}"]`).forEach((el) => {
        el.classList.add('is-active');
      });
    };

    const activate = (id, index) => {
      state.activeId = id;
      state.hoveredCol = index;
      setActiveClass(id);
    };

    const release = () => {
      state.activeId = null;
      state.hoveredCol = -1;
      setActiveClass(null);
    };

    const animate = (ts) => {
      if (state.destroyed) return;
      if (!state.ready) {
        state.raf = requestAnimationFrame(animate);
        return;
      }
      if (state.lastTs === null) state.lastTs = ts;
      const dt = Math.min(0.05, Math.max(0, (ts - state.lastTs) / 1000));
      state.lastTs = ts;

      const maxTilt = state.opts.parallax * 8;
      const targetX = state.pointer.x * maxTilt;
      const targetY = -state.pointer.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      state.pointerDamped.x += (targetX - state.pointerDamped.x) * damp;
      state.pointerDamped.y += (targetY - state.pointerDamped.y) * damp;
      applyPlaneTransform(state.pointerDamped.x, state.pointerDamped.y);

      if (!state.reduced) {
        for (let c = 0; c < state.trackEls.length; c++) {
          const meta = state.columnMeta[c];
          if (!meta) continue;
          const paused = state.wallHovered && state.opts.pauseOnHover;
          const factor = paused || state.hoveredCol === c ? 0 : 1;
          const target = state.baseVelocities[c] * factor;
          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          state.velocities[c] += (target - state.velocities[c]) * ease;
          let next = (state.offsets[c] || 0) + state.velocities[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          state.offsets[c] = next;
          const el = state.trackEls[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < state.trackEls.length; c++) {
          const el = state.trackEls[c];
          const meta = state.columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(state.offsets[c] || 0)}px, 0)`;
        }
      }

      state.raf = requestAnimationFrame(animate);
    };

    const onPointerMove = (e) => {
      const rect = host.getBoundingClientRect();
      if (state.opts.parallax > 0 && !state.reduced) {
        state.pointer = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
      if (!tile || !host.contains(tile)) return;
      const id = tile.dataset.tileId;
      if (id === state.activeId) return;
      activate(id, Number(tile.dataset.col));
    };

    const onPointerEnter = () => {
      state.wallHovered = true;
    };

    const onPointerLeave = () => {
      state.wallHovered = false;
      state.pointer = { x: 0, y: 0 };
      release();
    };

    const onMotionChange = (e) => {
      state.reduced = e.matches;
      host.classList.toggle('drift-wall--reduced', state.reduced);
    };

    applyCssVars();
    host.classList.toggle('drift-wall--reduced', state.reduced);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onMotionChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onMotionChange);

    let rebuildTimer = 0;
    const ro = new ResizeObserver(([entry]) => {
      const nextH = entry.contentRect.height || 600;
      if (Math.abs(nextH - state.containerHeight) < 8) return;
      state.containerHeight = nextH;
      if (!state.ready) return;
      window.clearTimeout(rebuildTimer);
      rebuildTimer = window.setTimeout(() => buildColumns(), 80);
    });
    ro.observe(host);

    host.addEventListener('pointermove', onPointerMove, { passive: true });
    host.addEventListener('pointerenter', onPointerEnter);
    host.addEventListener('pointerleave', onPointerLeave);
    state.raf = requestAnimationFrame(animate);

    ensureBlobUrls(state.items.map((item) => item.image)).then((map) => {
      if (state.destroyed) return;
      state.urlMap = map;
      buildColumns();
      state.ready = true;
      host.classList.remove('is-loading');
      host.classList.add('is-ready');
    });

    return {
      destroy() {
        state.destroyed = true;
        cancelAnimationFrame(state.raf);
        window.clearTimeout(rebuildTimer);
        ro.disconnect();
        host.removeEventListener('pointermove', onPointerMove);
        host.removeEventListener('pointerenter', onPointerEnter);
        host.removeEventListener('pointerleave', onPointerLeave);
        if (typeof mq.removeEventListener === 'function') mq.removeEventListener('change', onMotionChange);
        else if (typeof mq.removeListener === 'function') mq.removeListener(onMotionChange);
        delete host.dataset.driftMounted;
      }
    };
  }

  function warmHosts() {
    document.querySelectorAll('[data-drift-wall]').forEach((host) => {
      readItems(host).forEach((item) => {
        ensureBlobUrl(item.image);
      });
    });
  }

  function init() {
    warmHosts();
    document.querySelectorAll('[data-drift-wall]').forEach((host) => {
      mountDriftWall(host, null, readOptions(host));
    });
  }

  warmHosts();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.LEVEL_mountDriftWall = mountDriftWall;
})();
