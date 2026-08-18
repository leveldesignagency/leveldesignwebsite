/**
 * Intent / location silos: personalise hero + selected work from URL, UTM, or referrer.
 * Campaign examples:
 *   ?intent=social-media | marketing | web-design | aeo | branding
 *   ?location=mayfair | knightsbridge | chelsea | belgravia | richmond | surrey
 *   ?utm_campaign=social-media-mayfair
 */
(function () {
  'use strict';

  const PROJECT_CATALOG = {
    ontimely: {
      id: 'ontimely',
      title: 'OnTimely.',
      name: 'OnTimely',
      type: 'Event management',
      desc: 'Event management platform and mobile app.',
      workDesc: 'Front-to-back design of a complete event management platform and mobile app.',
      image: 'public/hero-spotlight/ontimely.jpg',
      thumb: 'public/hero-thumbs/ontimely.jpg',
      imageAlt: 'OnTimely event management platform',
      url: 'https://www.ontimely.co.uk',
      media: { type: 'video', src: 'public/OnTimelyLoadingScreen.mp4' },
    },
    kleen: {
      id: 'kleen',
      title: 'KLEEN.',
      name: 'KLEEN',
      type: 'Web app service',
      desc: 'Web app connecting clients with specialist cleaners.',
      workDesc: 'Platform connecting domestic and commercial clients with specialist cleaners - end-to-end design and build.',
      image: 'public/hero-spotlight/kleen.jpg?v=3',
      thumb: 'public/hero-thumbs/kleen.jpg?v=3',
      imageAlt: 'KLEEN cleaning platform',
      url: 'https://kleenapp.co.uk',
      media: { type: 'image', src: 'public/Kleen Promo.png' },
    },
    pocdocs: {
      id: 'pocdocs',
      title: 'Pocdocs.',
      name: 'Pocdocs',
      type: 'Web platform',
      desc: 'Mobile-first PDF transformation for documents on any device.',
      workDesc: 'Mobile-first document platform - clear product story and conversion-led UX.',
      image: 'public/hero-spotlight/pocdocs.jpg',
      thumb: 'public/hero-thumbs/pocdocs.jpg',
      imageAlt: 'Pocdocs mobile-first PDF platform',
      url: 'https://www.pocdocs.co.uk/',
      media: { type: 'image', src: 'public/hero-spotlight/pocdocs.jpg' },
    },
    nimbus: {
      id: 'nimbus',
      title: 'Nimbus.',
      name: 'Nimbus',
      type: 'Chrome extension',
      desc: 'In-browser learning with AI explanations, definitions, and translation.',
      workDesc: 'In-browser learning: highlight any text for definitions, AI explanations, translation, and pronunciation.',
      image: 'public/hero-spotlight/nimbus.jpg',
      thumb: 'public/hero-thumbs/nimbus.jpg',
      imageAlt: 'Nimbus Chrome extension',
      url: 'https://chromewebstore.google.com/detail/abmihilkdbamlelkmpfegjfimcjpcihh?utm_source=item-share-cb',
      media: { type: 'video', src: 'public/Nimbus Pre.mp4' },
    },
  };

  /** Per-intent work order + optional copy overrides for selected work */
  const WORK_SILOS = {
    // Work that ships grid shows first 3; keep OnTimely / KLEEN / Nimbus as the default trio.
    // Pocdocs stays available in the hero spotlight (4th pick) where relevant.
    default: {
      projects: ['ontimely', 'kleen', 'nimbus', 'pocdocs'],
      workLead: 'From brand to product to platform.',
      workHeading: 'Work that ships.',
      spotlightKicker: 'Selected work',
    },
    'social-media': {
      projects: ['kleen', 'ontimely', 'nimbus', 'pocdocs'],
      workLead: 'Brand systems, content-ready design, and channels that actually convert.',
      workHeading: 'Work built for attention.',
      spotlightKicker: 'Selected marketing work',
      overrides: {
        kleen: {
          type: 'Brand & acquisition',
          desc: 'Marketplace brand and web presence built to win trust and bookings.',
          workDesc: 'Brand-led product design and acquisition paths for a service marketplace.',
        },
        ontimely: {
          type: 'Events & content',
          desc: 'Event platform with marketing-ready visuals and clear conversion paths.',
          workDesc: 'Event product design with campaign-ready surfaces and booking clarity.',
        },
      },
    },
    marketing: {
      projects: ['kleen', 'ontimely', 'nimbus', 'pocdocs'],
      workLead: 'Sites and systems that turn spend into qualified enquiries.',
      workHeading: 'Work that converts.',
      spotlightKicker: 'Selected growth work',
      overrides: {
        kleen: {
          type: 'Growth product',
          desc: 'Service marketplace designed around acquisition, trust, and repeat booking.',
        },
      },
    },
    branding: {
      projects: ['kleen', 'ontimely', 'nimbus', 'pocdocs'],
      workLead: 'Identity systems that hold up across product, web, and campaigns.',
      workHeading: 'Brand that ships.',
      spotlightKicker: 'Selected brand work',
    },
    aeo: {
      projects: ['nimbus', 'ontimely', 'kleen', 'pocdocs'],
      workLead: 'Structured for search, AI answers, and real enquiries.',
      workHeading: 'Discoverable work.',
      spotlightKicker: 'Selected AI-search work',
    },
    'web-design': {
      projects: ['ontimely', 'kleen', 'nimbus', 'pocdocs'],
      workLead: 'Premium sites and products built to look expensive and convert.',
      workHeading: 'Web that ships.',
      spotlightKicker: 'Selected web work',
    },
    'ai-support': {
      projects: ['nimbus', 'ontimely', 'kleen', 'pocdocs'],
      workLead: 'AI products and portals that support the team, not replace judgement.',
      workHeading: 'AI work that ships.',
      spotlightKicker: 'Selected AI work',
    },
    construction: {
      projects: ['kleen', 'ontimely', 'nimbus', 'pocdocs'],
      workLead: 'Proof-led sites for firms that win on trust and capability.',
      workHeading: 'Work that wins jobs.',
      spotlightKicker: 'Selected trade work',
    },
    trades: {
      projects: ['kleen', 'ontimely', 'nimbus', 'pocdocs'],
      workLead: 'Enquiry-first design for firms that live on the phone.',
      workHeading: 'Work that books jobs.',
      spotlightKicker: 'Selected trades work',
    },
    golf: {
      projects: ['ontimely', 'kleen', 'nimbus', 'pocdocs'],
      workLead: 'Membership, events, and leisure experiences with premium weight.',
      workHeading: 'Work for premium venues.',
      spotlightKicker: 'Selected leisure work',
    },
    fintech: {
      projects: ['nimbus', 'ontimely', 'kleen', 'pocdocs'],
      workLead: 'Clarity and credibility for complex, high-trust products.',
      workHeading: 'Work that builds trust.',
      spotlightKicker: 'Selected fintech work',
    },
    property: {
      projects: ['ontimely', 'kleen', 'nimbus', 'pocdocs'],
      workLead: 'Premium positioning for developments, land, and property brands.',
      workHeading: 'Work for high-value deals.',
      spotlightKicker: 'Selected property work',
    },
  };

  const LOCATIONS = {
    dartford: { name: 'Dartford', region: 'Kent & South East London' },
    mayfair: { name: 'Mayfair', region: 'Central London' },
    knightsbridge: { name: 'Knightsbridge', region: 'Central London' },
    belgravia: { name: 'Belgravia', region: 'Central London' },
    chelsea: { name: 'Chelsea', region: 'West London' },
    kensington: { name: 'Kensington', region: 'West London' },
    'notting-hill': { name: 'Notting Hill', region: 'West London' },
    marylebone: { name: 'Marylebone', region: 'Central London' },
    fitzrovia: { name: 'Fitzrovia', region: 'Central London' },
    hampstead: { name: 'Hampstead', region: 'North London' },
    highgate: { name: 'Highgate', region: 'North London' },
    richmond: { name: 'Richmond', region: 'South West London' },
    barnes: { name: 'Barnes', region: 'South West London' },
    'st-johns-wood': { name: "St John's Wood", region: 'North West London' },
    'canary-wharf': { name: 'Canary Wharf', region: 'East London' },
    surrey: { name: 'Surrey', region: 'South East England' },
    cobham: { name: 'Cobham', region: 'Surrey' },
    esher: { name: 'Esher', region: 'Surrey' },
    ascot: { name: 'Ascot', region: 'Berkshire' },
    windsor: { name: 'Windsor', region: 'Berkshire' },
    beaconsfield: { name: 'Beaconsfield', region: 'Buckinghamshire' },
  };

  const HERO_VARIANTS = {
    default: {
      kicker: 'Web design · marketing · brand',
      headline:
        '<span class="hero-line-bright">Design. Build. Optimise.</span><span class="hero-line-dim">Convert.</span>',
      subhead:
        'Premium web design and digital marketing for teams that need qualified enquiries, not vanity traffic.',
      cta: 'Start a project',
      metaTitle: 'Web Design & Marketing Agency | Dartford, Kent & London | LEVEL',
      metaDescription:
        'Web design, branding and digital marketing for Dartford, Kent and London businesses. Premium websites and campaigns that win qualified enquiries.',
    },
    'social-media': {
      kicker: 'Social media · content · brand',
      headline: 'Social that looks<br>expensive and converts.',
      subhead:
        'Social media management, content systems, and brand-led creative for businesses that sell high-ticket services - not engagement theatre.',
      cta: 'Talk social & marketing',
      metaTitle: 'Social Media Management & Marketing | LEVEL Design Agency',
      metaDescription:
        'Social media management, content, and marketing for premium London and UK brands. Strategy, creative, and conversion - LEVEL Design Agency.',
    },
    marketing: {
      kicker: 'Marketing · growth · conversion',
      headline: 'Marketing that fills<br>the pipeline, not the feed.',
      subhead:
        'Positioning, campaigns, and digital presence for high-value businesses that need qualified enquiries - web, content, and social working as one system.',
      cta: 'Plan growth with LEVEL',
      metaTitle: 'Digital Marketing for High-Value Brands | LEVEL Design Agency',
      metaDescription:
        'Digital marketing, social, and conversion-focused web for premium UK businesses. LEVEL Design Agency, London.',
    },
    branding: {
      kicker: 'Brand identity · visual systems',
      headline: 'A brand that holds<br>across every touchpoint.',
      subhead:
        'Identity, tone, and rollout systems for businesses that have outgrown a logo file and need coherence from website to social to product.',
      cta: 'Start a brand project',
      metaTitle: 'Brand Identity & Visual Systems | LEVEL Design Agency',
      metaDescription:
        'Brand identity and visual systems for premium UK businesses. Coherent across web, product, and marketing. LEVEL Design Agency, London.',
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
    social: 'social-media',
    'social-media': 'social-media',
    'social-media-management': 'social-media',
    'social-media-manager': 'social-media',
    smm: 'social-media',
    instagram: 'social-media',
    content: 'social-media',
    marketing: 'marketing',
    'digital-marketing': 'marketing',
    growth: 'marketing',
    brand: 'branding',
    branding: 'branding',
    identity: 'branding',
  };

  const KEYWORD_RULES = [
    {
      intent: 'social-media',
      patterns:
        /\b(social media manager|social media management|social media marketing|smm\b|instagram management|content creator|social media agency)\b/i,
    },
    {
      intent: 'marketing',
      patterns: /\b(digital marketing|marketing agency|growth marketing|performance marketing|lead generation)\b/i,
    },
    { intent: 'branding', patterns: /\b(brand identity|branding agency|rebrand|visual identity|brand design)\b/i },
    {
      intent: 'aeo',
      patterns: /\b(aeo|geo\b|generative engine|ai search|ai overview|chatgpt|perplexity|ai seo|answer engine)\b/i,
    },
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

  function normalizeLocation(raw) {
    if (!raw) return null;
    const key = String(raw)
      .toLowerCase()
      .trim()
      .replace(/['']/g, '')
      .replace(/\s+/g, '-');
    if (LOCATIONS[key]) return key;
    const alias = {
      'st-johns-wood': 'st-johns-wood',
      stjohnswood: 'st-johns-wood',
      'nottinghill': 'notting-hill',
      canarywharf: 'canary-wharf',
    };
    return alias[key] || null;
  }

  function detectLocation(haystack) {
    const lower = haystack.toLowerCase();
    const ordered = Object.keys(LOCATIONS).sort((a, b) => b.length - a.length);
    for (const id of ordered) {
      const loc = LOCATIONS[id];
      const re = new RegExp('\\b' + loc.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      if (re.test(lower) || lower.includes(id.replace(/-/g, ' '))) return id;
    }
    return null;
  }

  function resolveIntent() {
    const params = new URLSearchParams(window.location.search);
    const explicit =
      params.get('intent') || params.get('service') || params.get('utm_campaign') || params.get('market');
    let intent = normalizeIntent(explicit);
    if (intent && HERO_VARIANTS[intent]) return intent;
    // market chips use market ids that may not be hero intents
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

  function resolveLocation() {
    const params = new URLSearchParams(window.location.search);
    const explicit = normalizeLocation(params.get('location') || params.get('area') || params.get('city'));
    if (explicit) return explicit;

    const haystack = [
      window.location.href,
      params.get('utm_term') || '',
      params.get('utm_campaign') || '',
      params.get('q') || '',
      document.referrer || '',
    ].join(' ');

    return detectLocation(haystack);
  }

  function buildLocationVariant(baseIntent, locationId) {
    const loc = LOCATIONS[locationId];
    const base = HERO_VARIANTS[baseIntent] || HERO_VARIANTS.default;
    if (!loc) return base;

    const serviceLabel =
      baseIntent === 'social-media'
        ? 'Social media management'
        : baseIntent === 'marketing'
          ? 'Digital marketing'
          : baseIntent === 'branding'
            ? 'Brand design'
            : baseIntent === 'aeo'
              ? 'AI search optimisation'
              : 'Premium web design';

    return {
      ...base,
      kicker: `${serviceLabel} · ${loc.name}`,
      headline: `${serviceLabel}<br>for ${loc.name}.`,
      subhead: `${base.subhead.replace(/\.$/, '')} Serving ${loc.name}, ${loc.region}, and surrounding high-value areas.`,
      metaTitle: `${serviceLabel} in ${loc.name} | LEVEL`,
      metaDescription: `${serviceLabel} in ${loc.name} for premium brands. Websites, branding and marketing that win enquiries. LEVEL Design Agency, ${loc.region}.`,
    };
  }

  function getWorkSilo(intentKey) {
    return WORK_SILOS[intentKey] || WORK_SILOS.default;
  }

  function getProjectsForIntent(intentKey) {
    const silo = getWorkSilo(intentKey);
    return silo.projects.map((id) => {
      const base = PROJECT_CATALOG[id];
      const over = (silo.overrides && silo.overrides[id]) || {};
      return { ...base, ...over, id };
    });
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

  function applyHero(variant, intentKey, locationId) {
    const hero = document.getElementById('hero-single');
    if (!hero) return;

    const kicker = hero.querySelector('.hero-intent-kicker');
    const headline = hero.querySelector('.hero-headline-single');
    const subhead = hero.querySelector('.hero-subhead');
    const cta = hero.querySelector('.hero-cta-single');

    if (kicker) {
      kicker.hidden = false;
      kicker.textContent = variant.kicker;
    }
    if (headline) headline.innerHTML = variant.headline;
    if (subhead) subhead.textContent = variant.subhead;
    if (cta) {
      cta.textContent = variant.cta;
      cta.href = '#contact-title';
      const note = encodeURIComponent(
        `Interest: ${intentKey}${locationId ? ' / ' + locationId : ''} - ${variant.kicker}`
      );
      cta.dataset.intentNote = note;
    }

    hero.dataset.heroIntent = intentKey;
    if (locationId) hero.dataset.heroLocation = locationId;
    else delete hero.dataset.heroLocation;
    hero.classList.add('hero-ready');
    document.documentElement.setAttribute('data-hero-intent', intentKey);
    if (locationId) document.documentElement.setAttribute('data-hero-location', locationId);
    else document.documentElement.removeAttribute('data-hero-location');
  }

  function applyWorkSection(intentKey) {
    const silo = getWorkSilo(intentKey);
    const projects = getProjectsForIntent(intentKey).slice(0, 3);

    const lead = document.querySelector('#work-title .section-title-lead');
    const heading = document.querySelector('#work-title .section-title-heading');
    if (lead) lead.textContent = silo.workLead;
    if (heading) heading.textContent = silo.workHeading;

    const grid = document.querySelector('#work .work-grid');
    if (!grid || !projects.length) return;

    grid.innerHTML = projects
      .map((p) => {
        const media =
          p.media.type === 'video'
            ? `<video autoplay muted loop playsinline><source src="${p.media.src}" type="video/mp4">Your browser does not support the video tag.</video>`
            : `<img src="${p.media.src}" alt="${p.imageAlt}" />`;
        return `<a class="work-card" href="${p.url}" target="_blank" rel="noopener noreferrer" aria-label="${p.name} - ${p.type}">
          <span class="glow"></span>
          <div class="work-media">${media}</div>
          <div class="work-meta">
            <strong class="work-name">${p.name}</strong>
            <span class="work-type">${p.type}</span>
            <p class="work-desc">${p.workDesc || p.desc}</p>
          </div>
        </a>`;
      })
      .join('');

    // Re-bind scroll reveals if available
    if (typeof window.LEVEL_observeRevealTargets === 'function') {
      window.LEVEL_observeRevealTargets(grid.querySelectorAll('.work-card'));
    } else if (typeof window.initWorkCardReveals === 'function') {
      window.initWorkCardReveals();
    }
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

    const initial = MARKETS.some((m) => m.id === marketId) ? marketId : 'construction';
    showMarket(initial);

    if (typeof window.LEVEL_observeRevealTargets === 'function') {
      window.LEVEL_observeRevealTargets(strip.querySelectorAll('.market-chip'));
    }
  }

  function init() {
    const intentKey = resolveIntent();
    const locationId = resolveLocation();
    const baseVariant = HERO_VARIANTS[intentKey] || HERO_VARIANTS.default;
    const variant = locationId ? buildLocationVariant(intentKey, locationId) : baseVariant;
    const workIntent = WORK_SILOS[intentKey] ? intentKey : 'default';

    setMeta(variant);
    applyHero(variant, intentKey, locationId);
    applyWorkSection(workIntent);

    const marketFromIntent =
      intentKey === 'default' ||
      intentKey === 'aeo' ||
      intentKey === 'web-design' ||
      intentKey === 'ai-support' ||
      intentKey === 'social-media' ||
      intentKey === 'marketing' ||
      intentKey === 'branding'
        ? 'construction'
        : intentKey;
    renderMarkets(marketFromIntent);

    const detail = {
      intent: intentKey,
      location: locationId,
      variant,
      projects: getProjectsForIntent(workIntent),
      workSilo: getWorkSilo(workIntent),
    };

    document.dispatchEvent(new CustomEvent('level:hero-intent', { detail }));
    window.LEVEL_CURRENT_INTENT = detail;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LEVEL_HERO_INTENT = {
    resolveIntent,
    resolveLocation,
    HERO_VARIANTS,
    MARKETS,
    LOCATIONS,
    PROJECT_CATALOG,
    WORK_SILOS,
    getProjectsForIntent,
  };
})();
