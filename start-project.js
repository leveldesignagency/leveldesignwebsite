/**
 * Start a project — silent trail autofill + custom selects + EmailJS (same route as contact)
 */
(function () {
  'use strict';

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
      service: 'web-design', package: 'launch', budget: 'From £600 ex VAT',
      summary: 'Web design · Launch site',
      message: 'Looking at the Launch site band (from £600).',
    },
    'services/web-design/pricing/growth': {
      service: 'web-design', package: 'growth', budget: 'From £3,500 ex VAT',
      summary: 'Web design · Growth site',
      message: 'Looking at the Growth site band (from £3,500).',
    },
    'services/web-design/pricing/platform': {
      service: 'web-design', package: 'platform', budget: 'From £7,500 ex VAT',
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
      service: 'branding', package: 'launch', budget: 'From £1,200 ex VAT',
      summary: 'Branding · Starter',
      message: 'Looking at starter brand pricing (from £1,200).',
    },
    'services/branding/pricing/growth': {
      service: 'branding', package: 'growth', budget: 'From £2,500 ex VAT',
      summary: 'Branding · Core',
      message: 'Looking at core brand pricing (from £2,500).',
    },
    'services/branding/pricing/platform': {
      service: 'branding', package: 'platform', budget: 'From £5,000 ex VAT',
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
      service: 'systems', package: 'launch', budget: 'From £2,500 ex VAT',
      summary: 'Systems · Starter',
      message: 'Looking at starter systems pricing (from £2,500).',
    },
    'services/systems/pricing/growth': {
      service: 'systems', package: 'growth', budget: 'From £6,000 ex VAT',
      summary: 'Systems · Build',
      message: 'Looking at systems build pricing (from £6,000).',
    },
    'services/systems/pricing/platform': {
      service: 'systems', package: 'platform', budget: 'Custom / talk scope',
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
      service: 'seo', package: 'launch', budget: 'From £350/mo ex VAT',
      summary: 'SEO · Starter',
      message: 'Looking at starter SEO pricing (from £350/mo).',
    },
    'services/seo/pricing/growth': {
      service: 'seo', package: 'growth', budget: 'From £750/mo ex VAT',
      summary: 'SEO · Growth',
      message: 'Looking at growth SEO pricing (from £750/mo).',
    },
    'services/seo/pricing/platform': {
      service: 'seo', package: 'platform', budget: 'From £1,200 ex VAT',
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
      service: 'marketing', package: 'launch', budget: 'From £600/mo ex VAT',
      summary: 'Marketing · Starter',
      message: 'Looking at starter marketing pricing (from £600/mo).',
    },
    'services/marketing/pricing/growth': {
      service: 'marketing', package: 'growth', budget: 'From £1,200/mo ex VAT',
      summary: 'Marketing · Growth',
      message: 'Looking at growth marketing pricing (from £1,200/mo).',
    },
    'services/marketing/pricing/platform': {
      service: 'marketing', package: 'platform', budget: 'From £1,500 ex VAT',
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
      trigger.querySelector('.field-select-value').textContent = label;
      options.forEach((opt) => {
        opt.setAttribute('aria-selected', opt.getAttribute('data-value') === value ? 'true' : 'false');
      });
      root.classList.toggle('has-value', Boolean(value));
      if (!silent) {
        hidden.dispatchEvent(new Event('change', { bubbles: true }));
      }
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
      serviceSelect._setSelectValue(
        preset.service,
        SERVICE_LABELS[preset.service] || preset.service,
        true
      );
    }
    if (preset.package && packageSelect && packageSelect._setSelectValue) {
      packageSelect._setSelectValue(
        preset.package,
        PACKAGE_LABELS[preset.package] || preset.package,
        true
      );
    }
    if (budget && preset.budget && !budget.value.trim()) {
      budget.value = preset.budget;
    }
    if (message && preset.message && !message.value.trim()) {
      message.value = preset.message;
    }

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
      const el = form.querySelector(`[name="${name}"]`);
      return el ? String(el.value || '').trim() : '';
    };
    const service = get('service');
    const pkg = get('package');
    const timeline = get('timeline');
    const lines = [
      '--- Project brief ---',
      `Service: ${SERVICE_LABELS[service] || service || '—'}`,
      `Package: ${PACKAGE_LABELS[pkg] || pkg || '—'}`,
      `Budget: ${get('budget') || '—'}`,
      `Timeline: ${TIMELINE_LABELS[timeline] || timeline || '—'}`,
      `Company: ${get('company') || '—'}`,
      `Phone: ${get('phone') || '—'}`,
      `Source key: ${get('trail_raw') || '—'}`,
      '',
      get('message'),
    ];
    return lines.join('\n');
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
        ? `services/${params.get('service')}${params.get('tier') ? '/pricing/' + params.get('tier') : '/hero'}`
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
    };
    form.addEventListener('focusin', preload, { once: true });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          preload();
          io.disconnect();
        }
      }, { rootMargin: '200px 0px' });
      io.observe(form);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!submitBtn || !submitText || !formMessage) return;

      try {
        if (typeof window.ensureFormLibs === 'function') await window.ensureFormLibs();
      } catch (_) {
        formMessage.textContent = 'Form service failed to load. Please email help@leveldesignagency.com directly.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }

      if (typeof emailjs === 'undefined') {
        formMessage.textContent = 'Form service is not configured. Please email help@leveldesignagency.com.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }

      const honeypot = form.querySelector('input[name="company_fax"]');
      if (honeypot && honeypot.value.trim() !== '') return;

      const sanitize = window.sanitizeInput || ((v) => String(v || '').trim());
      const name = sanitize((form.querySelector('[name="name"]') || {}).value || '');
      const email = sanitize((form.querySelector('[name="email"]') || {}).value || '').toLowerCase();
      const messageBody = sanitize(buildMessagePayload(form));

      if (name.length < 2 || !email.includes('@') || (form.querySelector('[name="message"]') || {}).value.trim().length < 10) {
        formMessage.textContent = 'Please complete name, email, and a short project note.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }

      if (typeof window.checkRateLimit === 'function') {
        const rateLimit = window.checkRateLimit();
        if (!rateLimit.allowed) {
          formMessage.textContent = `Too many submissions. Please wait ${rateLimit.remainingTime} minutes before trying again.`;
          formMessage.className = 'form-message error';
          formMessage.style.display = 'block';
          return;
        }
      }

      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';
      formMessage.style.display = 'none';

      let recaptchaToken = null;
      try {
        if (typeof window.executeRecaptcha === 'function') {
          recaptchaToken = await window.executeRecaptcha();
        }
      } catch (_) {
        recaptchaToken = null;
      }

      try {
        const emailDataToYou = {
          from_name: name,
          from_email: email,
          message: messageBody,
          reply_to: email,
        };
        if (recaptchaToken) emailDataToYou.recaptcha_token = recaptchaToken;

        await emailjs.send('service_3y4my2r', 'template_jnkhrvh', emailDataToYou);
        await emailjs.send('service_3y4my2r', 'template_brnzty1', {
          name: name,
          from_email: email,
          email: email,
          message: messageBody,
          reply_to: email,
        });

        formMessage.textContent = "Message sent. We'll get back to you soon.";
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        form.reset();
        document.querySelectorAll('.field-select').forEach((sel) => {
          if (sel._setSelectValue) sel._setSelectValue('', 'Select…', true);
        });
        const banner = document.getElementById('trail-banner');
        if (banner) banner.hidden = true;
        setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
      } catch (err) {
        formMessage.textContent = 'Sorry, something went wrong. Email help@leveldesignagency.com directly.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
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
