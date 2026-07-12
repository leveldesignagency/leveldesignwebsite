/**
 * First-visit cookie consent banner.
 * Stores preference in localStorage — no third-party cookies set by this script.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'level_cookie_consent_v1';
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (!banner) return;

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* storage blocked */
    }
    document.documentElement.setAttribute('data-cookie-consent', value);
  }

  function hideBanner() {
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => {
      banner.hidden = true;
    }, 400);
  }

  function showBanner() {
    banner.hidden = false;
    banner.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      banner.classList.add('is-visible');
    });
  }

  function init() {
    const existing = getConsent();
    if (existing) {
      document.documentElement.setAttribute('data-cookie-consent', existing);
      return;
    }

    showBanner();

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        setConsent('all');
        hideBanner();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        setConsent('essential');
        hideBanner();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
