/**
 * Start a project — silent trail autofill + custom selects + EmailJS
 * Same EmailJS service/templates as the homepage contact form.
 */
(function () {
  'use strict';

  const EMAILJS_PUBLIC_KEY = 'YZEUywDpGdF8ypKDn';
  const RECAPTCHA_SITE_KEY = '6LeCRlIsAAAAAGPZzNsKcCRa_BSgy6ICxaSAh1wm';
  const HELP_EMAIL = 'help@leveldesignagency.com';

  const TRAIL_PRESETS = {
    nav: { service: '', package: '', budget: '', summary: '', message: '' },
    'home/hero': { service: 'web-design', package: '', budget: '', summary: 'Web design', message: '' },
    'home/contact': { service: '', package: '', budget: '', summary: '', message: '' },
    'home/footer': { service: '', package: '', budget: '', summary: '', message: '' },
    'services/web-design/hero': {
      service: 'web-design', package: '', budget: '', summary: 'Web design & build',
      message: 'Interested in a website project.',
    },
    'services/web-design/cta': {
      service: 'web-design', package: '', budget: '', summary: 'Web design & build', message: '',
    },
    'services/web-design/pricing/launch': {
      service: 'web-design', package: 'launch', budget: '600+',
      summary: 'Web design · Launch site',
      message: 'Looking at the Launch site band (from £600).',
    },
    'services/web-design/pricing/growth': {
      service: 'web-design', package: 'growth', budget: '3,500+',
      summary: 'Web design · Growth site',
      message: 'Looking at the Growth site band (from £3,500).',
    },
    'services/web-design/pricing/platform': {
      service: 'web-design', package: 'platform', budget: '7,500+',
      summary: 'Web design · Platform site',
      message: 'Looking at the Platform site band (from £7,500).',
    },
    'services/branding/hero': {
      service: 'branding', package: '', budget: '', summary: 'Brand & identity',
      message: 'Interested in brand / identity work.',
    },
    'services/branding/cta': {
      service: 'branding', package: '', budget: '', summary: 'Brand & identity', message: '',
    },
    'services/branding/pricing/launch': {
      service: 'branding', package: 'launch', budget: '1,200+',
      summary: 'Branding · Starter',
      message: 'Looking at starter brand pricing (from £1,200).',
    },
    'services/branding/pricing/growth': {
      service: 'branding', package: 'growth', budget: '2,500+',
      summary: 'Branding · Core',
      message: 'Looking at core brand pricing (from £2,500).',
    },
    'services/branding/pricing/platform': {
      service: 'branding', package: 'platform', budget: '5,000+',
      summary: 'Branding · Full system',
      message: 'Looking at full brand system pricing (from £5,000).',
    },
    'services/systems/hero': {
      service: 'systems', package: '', budget: '', summary: 'AI systems & portals',
      message: 'Interested in systems / portals.',
    },
    'services/systems/cta': {
      service: 'systems', package: '', budget: '', summary: 'AI systems & portals', message: '',
    },
    'services/systems/pricing/launch': {
      service: 'systems', package: 'launch', budget: '2,500+',
      summary: 'Systems · Starter',
      message: 'Looking at starter systems pricing (from £2,500).',
    },
    'services/systems/pricing/growth': {
      service: 'systems', package: 'growth', budget: '6,000+',
      summary: 'Systems · Build',
      message: 'Looking at systems build pricing (from £6,000).',
    },
    'services/systems/pricing/platform': {
      service: 'systems', package: 'platform', budget: '',
      summary: 'Systems · Platform',
      message: 'Looking at larger systems / platform pricing.',
    },
    'services/seo/hero': {
      service: 'seo', package: '', budget: '', summary: 'SEO & AI search',
      message: 'Interested in SEO / AI search.',
    },
    'services/seo/cta': {
      service: 'seo', package: '', budget: '', summary: 'SEO & AI search', message: '',
    },
    'services/seo/pricing/launch': {
      service: 'seo', package: 'launch', budget: '350+/mo',
      summary: 'SEO · Starter',
      message: 'Looking at starter SEO pricing (from £350/mo).',
    },
    'services/seo/pricing/growth': {
      service: 'seo', package: 'growth', budget: '750+/mo',
      summary: 'SEO · Growth',
      message: 'Looking at growth SEO pricing (from £750/mo).',
    },
    'services/seo/pricing/platform': {
      service: 'seo', package: 'platform', budget: '1,200+',
      summary: 'SEO · Scale',
      message: 'Looking at scale SEO pricing (from £1,200).',
    },
    'services/marketing/hero': {
      service: 'marketing', package: '', budget: '', summary: 'Marketing & growth',
      message: 'Interested in marketing / growth.',
    },
    'services/marketing/cta': {
      service: 'marketing', package: '', budget: '', summary: 'Marketing & growth', message: '',
    },
    'services/marketing/pricing/launch': {
      service: 'marketing', package: 'launch', budget: '600+/mo',
      summary: 'Marketing · Starter',
      message: 'Looking at starter marketing pricing (from £600/mo).',
    },
    'services/marketing/pricing/growth': {
      service: 'marketing', package: 'growth', budget: '1,200+/mo',
      summary: 'Marketing · Growth',
      message: 'Looking at growth marketing pricing (from £1,200/mo).',
    },
    'services/marketing/pricing/platform': {
      service: 'marketing', package: 'platform', budget: '1,500+',
      summary: 'Marketing · Scale',
      message: 'Looking at scale marketing pricing (from £1,500).',
    },
    'industries/construction': {
      service: 'web-design', package: '', budget: '', summary: 'Construction',
      message: 'Industry focus: construction.',
    },
    'industries/trades': {
      service: 'web-design', package: '', budget: '', summary: 'Trades',
      message: 'Industry focus: trades.',
    },
    'industries/fintech': {
      service: 'web-design', package: '', budget: '', summary: 'Fintech',
      message: 'Industry focus: fintech.',
    },
    'industries/golf': {
      service: 'web-design', package: '', budget: '', summary: 'Golf / leisure',
      message: 'Industry focus: golf / leisure.',
    },
    'industries/property': {
      service: 'web-design', package: '', budget: '', summary: 'Property',
      message: 'Industry focus: property.',
    },
    'industries/professional-services': {
      service: 'web-design', package: '', budget: '', summary: 'Professional services',
      message: 'Industry focus: professional services.',
    },
    'industries/healthcare': {
      service: 'web-design', package: '', budget: '', summary: 'Healthcare',
      message: 'Industry focus: healthcare.',
    },
    'industries/hospitality': {
      service: 'web-design', package: '', budget: '', summary: 'Hospitality',
      message: 'Industry focus: hospitality.',
    },
    other: { service: '', package: '', budget: '', summary: '', message: '' },
  };

  const SERVICE_LABELS = {
    'web-design': 'Web design & build',
    branding: 'Brand & identity',
    systems: 'AI systems & portals',
    seo: 'SEO & AI search',
    marketing: 'Marketing & growth',
    unsure: 'Not sure yet',
  };

  const PACKAGE_LABELS = {
    launch: 'Starter / Launch',
    growth: 'Growth / Most chosen',
    platform: 'Scale / Platform',
    custom: 'Custom / talk scope',
    unsure: 'Not sure yet',
  };

  const TIMELINE_LABELS = {
    asap: 'ASAP',
    '1-month': 'Within a month',
    '1-3-months': '1–3 months',
    'no-rush': 'No rush',
    exploring: 'Just exploring',
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function mailtoLink(subject) {
    return (
      '<a href="mailto:' +
      HELP_EMAIL +
      '?subject=' +
      encodeURIComponent(subject || 'Project enquiry') +
      '">' +
      HELP_EMAIL +
      '</a>'
    );
  }

  function showMessage(el, text, type) {
    if (!el) return;
    el.innerHTML = text;
    el.className = 'form-message ' + (type || '');
    el.style.display = 'block';
    el.setAttribute('role', 'alert');
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (_) {}
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-form-lib="' + src + '"]') ||
        document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === 'true' || existing.getAttribute('data-loaded') === 'true') {
          resolve();
          return;
        }
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load ' + src)), { once: true });
        // Already in DOM from a prior page script — give it a moment, then resolve anyway
        setTimeout(() => resolve(), 800);
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.formLib = src;
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(script);
    });
  }

  let libsPromise = null;

  function ensureLibs() {
    if (typeof window.ensureFormLibs === 'function') {
      return window.ensureFormLibs();
    }
    if (!libsPromise) {
      libsPromise = Promise.all([
        loadScript('https://www.google.com/recaptcha/api.js?render=' + RECAPTCHA_SITE_KEY),
        loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'),
      ]).then(() => {
        if (typeof emailjs !== 'undefined' && emailjs.init) {
          try {
            emailjs.init(EMAILJS_PUBLIC_KEY);
          } catch (_) {}
        }
      });
    }
    return libsPromise;
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
    ]);
  }

  async function getRecaptchaToken() {
    try {
      if (typeof window.executeRecaptcha === 'function') {
        return await withTimeout(window.executeRecaptcha(), 2500);
      }
      if (typeof grecaptcha === 'undefined') return null;
      await withTimeout(
        new Promise((resolve) => {
          if (grecaptcha.ready) grecaptcha.ready(resolve);
          else resolve();
        }),
        2500
      );
      return await withTimeout(
        grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'start_project' }),
        2500
      );
    } catch (_) {
      return null;
    }
  }

  function checkRateLimitOnly() {
    const KEY = 'form_submission_times';
    const MAX = 5;
    const WINDOW = 60 * 60 * 1000;
    try {
      const now = Date.now();
      let times = JSON.parse(localStorage.getItem(KEY) || '[]').filter((t) => now - t < WINDOW);
      if (times.length >= MAX) {
        return {
          allowed: false,
          remainingTime: Math.max(1, Math.ceil((WINDOW - (now - times[0])) / 60000)),
        };
      }
      return { allowed: true };
    } catch (_) {
      return { allowed: true };
    }
  }

  function recordSuccessfulSubmit() {
    const KEY = 'form_submission_times';
    const WINDOW = 60 * 60 * 1000;
    try {
      const now = Date.now();
      let times = JSON.parse(localStorage.getItem(KEY) || '[]').filter((t) => now - t < WINDOW);
      times.push(now);
      localStorage.setItem(KEY, JSON.stringify(times));
    } catch (_) {}
  }

  function sanitize(value) {
    if (typeof window.sanitizeInput === 'function') return window.sanitizeInput(String(value || ''));
    return String(value || '').replace(/[<>]/g, '').trim();
  }

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
  }

  function initCustomSelect(root) {
    const trigger = $('.field-select-trigger', root);
    const menu = $('.field-select-menu', root);
    const hidden = $('input[type="hidden"]', root);
    if (!trigger || !menu || !hidden) return;

    const options = Array.from(menu.querySelectorAll('[data-value]'));

    function close() {
      root.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    function open() {
      root.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function setValue(value, label, silent) {
      hidden.value = value;
      const labelEl = trigger.querySelector('.field-select-value');
      if (labelEl) labelEl.textContent = label;
      options.forEach((opt) => {
        opt.setAttribute('aria-selected', opt.getAttribute('data-value') === value ? 'true' : 'false');
      });
      root.classList.toggle('has-value', Boolean(value));
      if (!silent) hidden.dispatchEvent(new Event('change', { bubbles: true }));
    }

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (root.classList.contains('is-open')) close();
      else open();
    });

    options.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        setValue(opt.getAttribute('data-value'), opt.textContent.trim());
        close();
      });
    });

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) close();
    });

    root._setSelectValue = setValue;
    root._getSelectValue = () => hidden.value;
  }

  function applyTrail(trailKey) {
    const preset = TRAIL_PRESETS[trailKey] || TRAIL_PRESETS.other;
    const serviceSelect = document.querySelector('[data-select="service"]');
    const packageSelect = document.querySelector('[data-select="package"]');
    const message = document.querySelector('textarea[name="message"]');
    const budget = document.querySelector('input[name="budget"]');
    const trailRaw = document.querySelector('input[name="trail_raw"]');

    if (trailRaw) trailRaw.value = trailKey;

    if (preset.service && serviceSelect && serviceSelect._setSelectValue) {
      serviceSelect._setSelectValue(preset.service, SERVICE_LABELS[preset.service] || preset.service, true);
    }
    if (preset.package && packageSelect && packageSelect._setSelectValue) {
      packageSelect._setSelectValue(preset.package, PACKAGE_LABELS[preset.package] || preset.package, true);
    }
    if (budget && preset.budget && !budget.value.trim()) budget.value = preset.budget;
    if (message && preset.message && !message.value.trim()) message.value = preset.message;

    const params = new URLSearchParams(window.location.search);
    const intent = params.get('intent');
    const location = params.get('location');
    if (message) {
      const extras = [];
      if (intent) extras.push('Intent: ' + intent);
      if (location) extras.push('Location: ' + location);
      if (extras.length && !message.value.includes('Intent:') && !message.value.includes('Location:')) {
        message.value = (message.value ? message.value + '\n' : '') + extras.join(' · ');
      }
    }

    const banner = document.getElementById('trail-banner');
    if (banner) {
      if (preset.summary) {
        banner.hidden = false;
        const label = banner.querySelector('[data-trail-label]');
        if (label) label.textContent = preset.summary;
      } else {
        banner.hidden = true;
      }
    }
  }

  function buildMessagePayload(form) {
    const get = (name) => {
      const el = form.querySelector('[name="' + name + '"]');
      return el ? String(el.value || '').trim() : '';
    };
    const service = get('service');
    const pkg = get('package');
    const timeline = get('timeline');
    return [
      '--- Project brief ---',
      'Service: ' + (SERVICE_LABELS[service] || service || '—'),
      'Package: ' + (PACKAGE_LABELS[pkg] || pkg || '—'),
      'Budget: ' + (get('budget') ? '£' + get('budget').replace(/^£\s*/, '') : '—'),
      'Timeline: ' + (TIMELINE_LABELS[timeline] || timeline || '—'),
      'Company: ' + (get('company') || '—'),
      'Phone: ' + (get('phone') || '—'),
      'Source key: ' + (get('trail_raw') || '—'),
      '',
      get('message'),
    ].join('\n');
  }

  function validate(form) {
    const errors = [];
    const name = sanitize((form.querySelector('[name="name"]') || {}).value || '');
    const email = sanitize((form.querySelector('[name="email"]') || {}).value || '').toLowerCase();
    const note = String((form.querySelector('[name="message"]') || {}).value || '').trim();

    if (name.length < 2) errors.push('Enter your name (at least 2 characters).');
    if (!validEmail(email)) errors.push('Enter a valid email address.');
    if (note.length < 10) errors.push('Add a short project note (at least 10 characters).');
    if (note.length > 2000) errors.push('Project note is too long (max 2000 characters).');

    return { ok: errors.length === 0, errors, name, email, note };
  }

  function initForm() {
    const form = document.getElementById('start-project-form');
    if (!form) return;

    document.querySelectorAll('.field-select').forEach(initCustomSelect);

    const params = new URLSearchParams(window.location.search);
    const trail =
      params.get('trail') ||
      params.get('from') ||
      (params.get('service')
        ? 'services/' + params.get('service') + (params.get('tier') ? '/pricing/' + params.get('tier') : '/hero')
        : '');
    if (trail) applyTrail(trail);

    const intentParam = params.get('intent');
    if (intentParam) {
      const intentMap = {
        'web-design': 'web-design',
        web: 'web-design',
        branding: 'branding',
        systems: 'systems',
        seo: 'seo',
        marketing: 'marketing',
        golf: 'web-design',
        construction: 'web-design',
        trades: 'web-design',
        fintech: 'web-design',
        property: 'web-design',
        healthcare: 'web-design',
        hospitality: 'web-design',
        'professional-services': 'web-design',
      };
      const svc = intentMap[String(intentParam).toLowerCase()];
      const serviceSelect = document.querySelector('[data-select="service"]');
      if (svc && serviceSelect && serviceSelect._setSelectValue && !serviceSelect._getSelectValue()) {
        serviceSelect._setSelectValue(svc, SERVICE_LABELS[svc], true);
        const banner = document.getElementById('trail-banner');
        if (banner && banner.hidden) {
          banner.hidden = false;
          const label = banner.querySelector('[data-trail-label]');
          if (label) label.textContent = SERVICE_LABELS[svc];
        }
      }
    }

    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const formMessage = document.getElementById('form-message');

    const preload = () => {
      if (typeof window.ensureFormLibs === 'function') window.ensureFormLibs().catch(() => {});
      else ensureLibs().catch(() => {});
    };
    form.addEventListener('focusin', preload, { once: true });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            preload();
            io.disconnect();
          }
        },
        { rootMargin: '200px 0px' }
      );
      io.observe(form);
    } else {
      preload();
    }

    form.addEventListener('focusin', () => {
      const hp = form.querySelector('input[name="company_fax"]');
      if (hp) hp.value = '';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!submitBtn || !submitText || !formMessage) {
        window.location.href = 'mailto:' + HELP_EMAIL + '?subject=' + encodeURIComponent('Project enquiry');
        return;
      }

      const honeypot = form.querySelector('input[name="company_fax"]');
      if (honeypot && honeypot.value.trim() !== '') {
        return;
      }

      const result = validate(form);
      if (!result.ok) {
        showMessage(
          formMessage,
          result.errors.join(' ') + ' Or email us at ' + mailtoLink('Project enquiry') + '.',
          'error'
        );
        return;
      }

      const rate = checkRateLimitOnly();
      if (!rate.allowed) {
        showMessage(
          formMessage,
          'Too many submissions. Please wait about ' +
            rate.remainingTime +
            ' minutes, or email ' +
            mailtoLink('Project enquiry') +
            '.',
          'error'
        );
        return;
      }

      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';
      formMessage.style.display = 'none';

      const messageBody = sanitize(buildMessagePayload(form));
      const recaptchaToken = await getRecaptchaToken();

      try {
        if (typeof window.sendLevelEnquiry !== 'function') {
          await withTimeout(ensureLibs(), 10000);
          if (typeof window.sendLevelEnquiry !== 'function') {
            throw new Error('Form service unavailable');
          }
        }

        await window.sendLevelEnquiry({
          name: result.name,
          email: result.email,
          message: messageBody,
          recaptchaToken: recaptchaToken,
        });

        showMessage(formMessage, "Sent. We'll get back to you soon.", 'success');
        form.reset();
        document.querySelectorAll('.field-select').forEach((sel) => {
          if (sel._setSelectValue) sel._setSelectValue('', 'Select…', true);
        });
        const banner = document.getElementById('trail-banner');
        if (banner) banner.hidden = true;
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 6000);
      } catch (err) {
        const detail = (err && (err.text || err.message)) ? String(err.text || err.message) : '';
        showMessage(
          formMessage,
          'Sorry, we could not send that. Please try again or email ' +
            mailtoLink('Project enquiry') +
            '.' +
            (detail ? ' <span class="form-message-detail">(' + detail.replace(/[<>]/g, '') + ')</span>' : ''),
          'error'
        );
      }

      submitBtn.disabled = false;
      submitText.textContent = 'Send brief';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();
