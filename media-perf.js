/**
 * Faster media: defer below-fold video until near viewport, pause off-screen.
 * Videos keep poster visible; source loads only when needed.
 */
(function () {
  'use strict';

  function armVideo(video) {
    if (!video || video.dataset.mediaArmed === '1') return;
    video.dataset.mediaArmed = '1';
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    if (!video.hasAttribute('preload')) video.preload = 'none';

    const sources = Array.from(video.querySelectorAll('source'));
    sources.forEach((source) => {
      if (source.dataset.src) return;
      const src = source.getAttribute('src');
      if (!src) return;
      source.dataset.src = src;
      source.removeAttribute('src');
    });

    // Also support src on <video> itself
    if (video.getAttribute('src') && !video.dataset.src) {
      video.dataset.src = video.getAttribute('src');
      video.removeAttribute('src');
    }
  }

  function loadVideo(video) {
    if (!video || video.dataset.mediaLoaded === '1') return;
    video.dataset.mediaLoaded = '1';

    video.querySelectorAll('source').forEach((source) => {
      if (source.dataset.src && !source.getAttribute('src')) {
        source.setAttribute('src', source.dataset.src);
      }
    });
    if (video.dataset.src && !video.getAttribute('src')) {
      video.setAttribute('src', video.dataset.src);
    }
    try {
      video.load();
    } catch (_) {}
  }

  function playSafe(video) {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  function init() {
    const videos = Array.from(document.querySelectorAll('video'));
    if (!videos.length) return;

    videos.forEach(armVideo);

    if (!('IntersectionObserver' in window)) {
      videos.forEach((video) => {
        loadVideo(video);
        if (video.hasAttribute('autoplay')) playSafe(video);
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            loadVideo(video);
            if (video.hasAttribute('autoplay') || video.dataset.autoplay === '1') {
              playSafe(video);
            }
          } else if (!video.paused) {
            video.pause();
          }
        });
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    videos.forEach((video) => io.observe(video));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
