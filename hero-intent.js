/**
 * Hero variants & market intent: URL params, referrer keywords, and in-page chips.
 * Campaign links: ?intent=aeo | web-design | ai-support | construction | golf | fintech | trades
 */
(function () {
  'use strict';

  const HERO_VARIANTS = {
    default: {
      kicker: 'Web design · AI search · AI systems',
      headline:
        '<span class="hero-line-bright">Design. Build. Optimise.</span><span class="hero-line-dim">Convert.</span>',
      subhead:
        'Premium web design and AI search optimisation for teams that need qualified enquiries, not vanity traffic.',
      cta: 'Start a project',
      metaTitle: 'Web Design, AI Search Optimisation & AI Support | LEVEL Design Agency',
      metaDescription:
        'Win high-value clients with web design, AI search optimisation (AEO), and AI support. Construction, trades, fintech, golf, and growth-minded brands. London & UK.',
    },
    aeo: {
      kicker: 'AI search optimisation · AEO',
      headline: 'Show up when buyers<br>ask ChatGPT & Google AI.',
      subhead:
        'We structure your site, content, and schema so generative search and AI overviews cite you, not just rank on page ten. Pair AEO with a site built to convert the traffic it brings.',
      cta: 'Improve AI visibility',
      metaTitle: 'AI Search Optimisation (AEO) & GEO | LEVEL Design Agency',
      metaDescription:
        'AI search optimisation for UK businesses: structured content, entity clarity, and technical SEO built for ChatGPT, Perplexity, and Google AI Overviews. London agency.',
    },
    'web-design': {
      kicker: 'Premium web design',
      headline: 'A site that looks<br>as strong as your margins.',
      subhead:
        'Rebuilds and new builds for brands that invest in growth: clear positioning, fast performance, and enquiry paths tuned for high-ticket services.',
      cta: 'Discuss your website',
      metaTitle: 'Premium Web Design for High-Value Businesses | LEVEL',
      metaDescription:
        'Web design for construction, trades, fintech, golf, and professional services. Credibility-first builds that turn traffic into serious enquiries. LEVEL Design Agency.',
    },
    'ai-support': {
      kicker: 'AI support & automation',
      headline: 'AI that supports<br>your team, not replaces it.',
      subhead:
        'Portals, assistants, and workflows that save time on quotes, onboarding, and client comms, integrated with the site and brand you already trust us to ship.',
      cta: 'Explore AI support',
      metaTitle: 'AI Support, Portals & Business Automation | LEVEL',
      metaDescription:
        'Practical AI support for UK businesses: custom portals, assistants, and automation wired to your website and operations. LEVEL Design Agency, London.',
    },
    construction: {
      kicker: 'Construction & trades',
      headline: 'Win better jobs<br>with a site that sells trust.',
      subhead:
        'Project galleries, capability pages, and local SEO for contractors, builders, and trade firms, plus AI search setup so you appear when prospects search and ask AI who to hire.',
      cta: 'Get a construction quote',
      metaTitle: 'Web Design for Construction & Building Firms | LEVEL',
      metaDescription:
        'Web design and AI search optimisation for construction, building, and development companies. Showcase projects, capture tenders, and grow qualified leads.',
    },
    trades: {
      kicker: 'Trades & field services',
      headline: 'More calls.<br>Less tyre-kicking.',
      subhead:
        'Electricians, plumbers, HVAC, and maintenance brands get sharp service pages, proof, and booking flows optimised for Google and AI recommendations in your patch.',
      cta: 'Grow trade enquiries',
      metaTitle: 'Web Design for Trades & Contractors | LEVEL',
      metaDescription:
        'Websites and AI visibility for trades and contractors: local SEO, service pages, and conversion-focused design. LEVEL Design Agency.',
    },
    golf: {
      kicker: 'Golf · leisure · hospitality',
      headline: 'Membership & bookings<br>deserve a premium feel.',
      subhead:
        'Clubs, venues, and leisure brands get atmosphere-rich design, event and membership journeys, and search presence that matches the spend your guests already commit.',
      cta: 'Elevate your club site',
      metaTitle: 'Web Design for Golf Clubs & Leisure Brands | LEVEL',
      metaDescription:
        'Web design for golf clubs, venues, and leisure: bookings, membership, and brand experiences that drive revenue. LEVEL Design Agency, London.',
    },
    fintech: {
      kicker: 'Fintech & regulated finance',
      headline: 'Clarity converts<br>in complex categories.',
      subhead:
        'Product storytelling, compliant structure, and performance for fintech and professional finance, with technical SEO and AEO so due-diligence starts online in your favour.',
      cta: 'Talk fintech web',
      metaTitle: 'Web Design & AEO for Fintech | LEVEL Design Agency',
      metaDescription:
        'Web design and AI search optimisation for fintech and finance brands. Trust-first UX, clear product narrative, and discoverability. LEVEL, London.',
    },
    property: {
      kicker: 'Property & land',
      headline: 'Developments deserve<br>more than a template.',
      subhead:
        'Land, lettings, and development brands get premium positioning, lead capture, and search visibility across Google and AI, built for high-value transactions.',
      cta: 'Start a property project',
      metaTitle: 'Web Design for Property & Development | LEVEL',
      metaDescription:
        'Web design for property, land, and development: premium sites, lead generation, and AI search optimisation. LEVEL Design Agency.',
    },
  };

  const MARKETS = [
    {
      id: 'construction',
      label: 'Construction',
      short: 'Builders & contractors',
      detail:
        'Project proof, tender-ready structure, and AI-friendly service pages so you win work that matches your capability.',
    },
    {
      id: 'trades',
      label: 'Trades',
      short: 'Field & maintenance',
      detail:
        'Local visibility, fast quote paths, and service-area SEO for firms that live on the phone and the van.',
    },
    {
      id: 'fintech',
      label: 'Fintech',
      short: 'Finance & payments',
      detail:
        'Product narrative and trust signals for regulated categories, discoverable in search and AI answers.',
    },
    {
      id: 'golf',
      label: 'Golf & leisure',
      short: 'Clubs & venues',
      detail:
        'Membership, events, and booking journeys with brand weight that matches your fee structure.',
    },
    {
      id: 'property',
      label: 'Property',
      short: 'Land & development',
      detail:
        'Premium positioning and enquiry flows for developments, agencies, and land services.',
    },
    {
      id: 'professional',
      label: 'Professional',
      short: 'B2B services',
      detail:
        'Outgrown the old site? Align brand, web, and AI presence with how established you already are.',
    },
    {
      id: 'healthcare',
      label: 'Healthcare',
      short: 'Clinics & practices',
      detail:
        'Calm, credible UX that still drives booking and enquiry, accessible and maintainable.',
    },
    {
      id: 'hospitality',
      label: 'Hospitality',
      short: 'Hotels & venues',
      detail:
        'Atmosphere, reputation, and direct booking, with less dependency on third-party platforms.',
    },
  ];

  const INTENT_ALIASES = {
    geo: 'aeo',
    'ai-search': 'aeo',
    aeo: 'aeo',
    seo: 'aeo',
    web: 'web-design',
    website: 'web-design',
    'web-design': 'web-design',
    webdesign: 'web-design',
    ai: 'ai-support',
    'ai-support': 'ai-support',
    automation: 'ai-support',
    builder: 'construction',
    building: 'construction',
    contractor: 'construction',
    construction: 'construction',
    trade: 'trades',
    trades: 'trades',
    electrician: 'trades',
    plumber: 'trades',
    golf: 'golf',
    club: 'golf',
    fintech: 'fintech',
    finance: 'fintech',
    banking: 'fintech',
    property: 'property',
    land: 'property',
    development: 'property',
  };

  const KEYWORD_RULES = [
    { intent: 'aeo', patterns: /\b(aeo|geo\b|generative engine|ai search|ai overview|chatgpt|perplexity|ai seo|answer engine)\b/i },
    { intent: 'ai-support', patterns: /\b(ai support|ai assistant|ai automation|ai portal|ai system|llm integration)\b/i },
    { intent: 'web-design', patterns: /\b(web design|website design|website rebuild|new website|redesign)\b/i },
    { intent: 'construction', patterns: /\b(construction|builder|building firm|contractor|civil engineering|surveyor)\b/i },
    { intent: 'trades', patterns: /\b(trades?|electrician|plumber|hvac|roofing|maintenance company)\b/i },
    { intent: 'golf', patterns: /\b(golf|country club|golf club|leisure club)\b/i },
    { intent: 'fintech', patterns: /\b(fintech|payments? platform|neobank|wealth tech|regtech)\b/i },
    { intent: 'property', patterns: /\b(property developer|lettings|estate agency|land development)\b/i },
  ];

  function normalizeIntent(raw) {
    if (!raw) return null;
    const key = String(raw).toLowerCase().trim().replace(/\s+/g, '-');
    return INTENT_ALIASES[key] || (HERO_VARIANTS[key] ? key : null);
  }

  function resolveIntent() {
    const params = new URLSearchParams(window.location.search);
    const explicit =
      params.get('intent') || params.get('market') || params.get('service') || params.get('utm_campaign');
    let intent = normalizeIntent(explicit);
    if (intent) return intent;

    const haystack = [
      window.location.href,
      params.get('utm_term') || '',
      params.get('q') || '',
      document.referrer || '',
    ].join(' ');

    for (const rule of KEYWORD_RULES) {
      if (rule.patterns.test(haystack)) return rule.intent;
    }

    return 'default';
  }

  function setMeta(variant) {
    const title = variant.metaTitle;
    const desc = variant.metaDescription;
    document.title = title;

    const setNamed = (selector, attr, value) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    setNamed('meta[name="title"]', 'content', title);
    setNamed('meta[name="description"]', 'content', desc);
    setNamed('meta[property="og:title"]', 'content', title);
    setNamed('meta[property="og:description"]', 'content', desc);
    setNamed('meta[name="twitter:title"]', 'content', title);
    setNamed('meta[name="twitter:description"]', 'content', desc);
  }

  function applyHero(variant, intentKey) {
    const hero = document.getElementById('hero-single');
    if (!hero) return;

    const kicker = hero.querySelector('.hero-intent-kicker');
    const headline = hero.querySelector('.hero-headline-single');
    const subhead = hero.querySelector('.hero-subhead');
    const cta = hero.querySelector('.hero-cta-single');

    if (kicker) kicker.textContent = variant.kicker;
    if (headline) headline.innerHTML = variant.headline;
    if (subhead) subhead.textContent = variant.subhead;
    if (cta) {
      cta.textContent = variant.cta;
      const contact = document.getElementById('contact-title');
      if (contact) {
        const note = encodeURIComponent(`Interest: ${intentKey} - ${variant.kicker}`);
        cta.href = `#contact-title`;
        cta.dataset.intentNote = note;
      }
    }

    hero.dataset.heroIntent = intentKey;
    hero.classList.add('hero-ready');
    document.documentElement.setAttribute('data-hero-intent', intentKey);
  }

  function renderMarkets(activeMarketId) {
    const strip = document.getElementById('markets-strip');
    const detailEl = document.getElementById('market-detail');
    if (!strip || !detailEl) return;

    const marketId =
      activeMarketId && MARKETS.some((m) => m.id === activeMarketId)
        ? activeMarketId
        : INTENT_ALIASES[activeMarketId] || activeMarketId;

    const showMarket = (id, options) => {
      const opts = options || {};
      const market = MARKETS.find((m) => m.id === id) || MARKETS[0];
      strip.querySelectorAll('.market-chip').forEach((chip) => {
        const on = chip.dataset.market === market.id;
        chip.classList.toggle('is-active', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        // Only centre the chip on user tap - never on first load (scrollIntoView
        // pulls the whole page down to Markets on mobile).
        if (on && opts.scrollChip && window.matchMedia('(max-width: 900px)').matches) {
          chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });

      const updateDetail = () => {
        detailEl.innerHTML = `
        <p class="market-detail-label">${market.label}</p>
        <p class="market-detail-text">${market.detail}</p>
      `;
        detailEl.dataset.market = market.id;
        detailEl.classList.remove('is-switching');
      };

      if (opts.scrollChip && window.matchMedia('(max-width: 900px)').matches) {
        detailEl.classList.add('is-switching');
        window.setTimeout(updateDetail, 140);
      } else {
        updateDetail();
      }
    };

    strip.innerHTML = MARKETS.map(
      (m) =>
        `<button type="button" class="market-chip" data-market="${m.id}" aria-pressed="false">
          <span class="market-chip-label">${m.label}</span>
          <span class="market-chip-short">${m.short}</span>
        </button>`
    ).join('');

    strip.addEventListener('click', (e) => {
      const chip = e.target.closest('.market-chip');
      if (!chip) return;
      showMarket(chip.dataset.market, { scrollChip: true });
      const url = new URL(window.location.href);
      url.searchParams.set('market', chip.dataset.market);
      window.history.replaceState({}, '', url);
    });

    const initial =
      MARKETS.some((m) => m.id === marketId) ? marketId : 'construction';
    showMarket(initial);

    if (typeof window.LEVEL_observeRevealTargets === 'function') {
      window.LEVEL_observeRevealTargets(strip.querySelectorAll('.market-chip'));
    }
  }

  function init() {
    const intentKey = resolveIntent();
    const variant = HERO_VARIANTS[intentKey] || HERO_VARIANTS.default;

    setMeta(variant);
    applyHero(variant, intentKey);

    const marketFromIntent =
      intentKey === 'default' || intentKey === 'aeo' || intentKey === 'web-design' || intentKey === 'ai-support'
        ? 'construction'
        : intentKey;
    renderMarkets(marketFromIntent);

    document.dispatchEvent(
      new CustomEvent('level:hero-intent', { detail: { intent: intentKey, variant } })
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LEVEL_HERO_INTENT = { resolveIntent, HERO_VARIANTS, MARKETS };
})();
