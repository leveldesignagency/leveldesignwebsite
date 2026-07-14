// Nav toggle - full-screen menu + hard scroll lock
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
let navScrollY = 0;
function setNavOpen(isOpen) {
  if (!navToggle || !navLinks) return;
  navLinks.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.documentElement.classList.toggle('nav-open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  if (isOpen) {
    navScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${navScrollY}px`;
  } else {
    document.body.style.top = '';
    window.scrollTo(0, navScrollY);
  }
}
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    setNavOpen(!navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });
}

// Header fade out on scroll
// Header removed - no fade, just scrolls with page

// Logo click to refresh page
document.addEventListener('DOMContentLoaded', function() {
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/';
    });
    logo.style.cursor = 'pointer';
  }
});

// Entrance animations - per-item / section move-up on scroll
const REVEAL_ITEM_SELECTORS = [
  '#markets-strip .market-chip',
  '#work .work-card',
  '#process .steps > li',
  '#services.deliver-section .deliver-row',
  '#services.deliver-section .deliver-block',
  '#statistics-mobile .stat-item',
  '#contact .form-group',
  '#contact .contact-form > .btn',
  '#contact .contact-info h3',
  '#contact .contact-info > p',
  '#contact .contact-methods',
  '#services-gallery .service-slide',
  '.project-curated-card',
  '#articles .article-card',
  '[data-reveal]',
].join(', ');

const REVEAL_SECTION_SELECTORS = '[data-animate]';

let sectionRevealIo = null;
let itemRevealIo = null;
const pendingRevealTargets = [];
const revealPendingPaint = new WeakSet();

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function revealElement(el) {
  if (!el || el.classList.contains('in') || revealPendingPaint.has(el)) return;

  // Force the hidden frame to paint before unlocking transition -> .in
  el.classList.add('js-reveal');
  revealPendingPaint.add(el);
  // flush layout
  void el.offsetWidth;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      el.classList.add('in');
      revealPendingPaint.delete(el);
    });
  });
}

function assignRevealIndex(elements) {
  elements.forEach((el, index) => {
    el.classList.add('js-reveal');
    if (!el.style.getPropertyValue('--reveal-i')) {
      el.style.setProperty('--reveal-i', String(index % 12));
    }
  });
}

function isInRevealRange(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  if (rect.height === 0 && rect.width === 0) return false;
  // Enter when the top third of the item crosses into the lower ~80% of the viewport
  return rect.top < vh * 0.82 && rect.bottom > vh * 0.08;
}

function revealIfVisible(el) {
  if (!el || el.classList.contains('in') || revealPendingPaint.has(el)) return;
  if (isInRevealRange(el)) {
    revealElement(el);
    if (itemRevealIo) itemRevealIo.unobserve(el);
    if (sectionRevealIo) sectionRevealIo.unobserve(el);
  }
}

function flushVisibleReveals() {
  document.querySelectorAll(REVEAL_SECTION_SELECTORS).forEach(revealIfVisible);
  document.querySelectorAll(REVEAL_ITEM_SELECTORS).forEach(revealIfVisible);
}

function getItemRevealIo() {
  if (itemRevealIo || prefersReducedMotion()) return itemRevealIo;

  itemRevealIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealElement(entry.target);
        itemRevealIo.unobserve(entry.target);
      }
    },
    { threshold: [0, 0.12, 0.25], rootMargin: '0px 0px -12% 0px' }
  );

  return itemRevealIo;
}

function initSectionRevealAnimations() {
  const sections = document.querySelectorAll(REVEAL_SECTION_SELECTORS);
  if (!sections.length) return;

  assignRevealIndex(sections);

  if (prefersReducedMotion()) {
    sections.forEach(revealElement);
    return;
  }

  sectionRevealIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealElement(entry.target);
        sectionRevealIo.unobserve(entry.target);
      }
    },
    { threshold: [0, 0.1, 0.2], rootMargin: '0px 0px -10% 0px' }
  );

  sections.forEach((el) => sectionRevealIo.observe(el));
}

/** Scroll-linked reveals: each element gets .in when it enters the viewport. */
function initScrollRevealItems() {
  const nodes = document.querySelectorAll(REVEAL_ITEM_SELECTORS);
  if (!nodes.length && !pendingRevealTargets.length) return itemRevealIo;

  const list = Array.from(nodes);
  while (pendingRevealTargets.length) {
    list.push(...pendingRevealTargets.shift());
  }

  assignRevealIndex(list);

  if (prefersReducedMotion()) {
    list.forEach(revealElement);
    return itemRevealIo;
  }

  const io = getItemRevealIo();
  list.forEach((el) => {
    if (!el || el.classList.contains('in')) return;
    io.observe(el);
  });

  return itemRevealIo;
}

window.LEVEL_observeRevealTargets = function (elements) {
  if (!elements || !elements.length) return;
  const list = Array.from(elements).filter(Boolean);
  if (!list.length) return;

  assignRevealIndex(list);

  if (prefersReducedMotion()) {
    list.forEach(revealElement);
    return;
  }

  const io = getItemRevealIo();
  if (!io) {
    pendingRevealTargets.push(list);
    return;
  }

  list.forEach((el) => {
    if (!el.classList.contains('in')) io.observe(el);
  });

  window.requestAnimationFrame(() => list.forEach(revealIfVisible));
};

function drainRevealQueue() {
  const queued = window.__LEVEL_revealQueue || [];
  while (queued.length) {
    window.LEVEL_observeRevealTargets(queued.shift());
  }
}

function revealAboveFold() {
  // Only true above-fold chrome - never batch-reveal the whole page
  const hero = document.getElementById('hero-single');
  const header = document.querySelector('.site-header');
  if (hero) {
    hero.classList.add('js-reveal', 'in');
  }
  if (header) header.classList.add('in');
  flushVisibleReveals();
}

function initEntranceAnimations() {
  drainRevealQueue();
  initSectionRevealAnimations();
  initScrollRevealItems();

  // After layout settles, unlock anything already in view
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      revealAboveFold();
      flushVisibleReveals();
    });
  });

  window.setTimeout(flushVisibleReveals, 180);
  window.setTimeout(flushVisibleReveals, 500);
  window.addEventListener('load', flushVisibleReveals, { once: true });
  window.addEventListener('pageshow', flushVisibleReveals);

  let scrollFlushScheduled = false;
  const onScrollOrResize = () => {
    if (scrollFlushScheduled || prefersReducedMotion()) return;
    scrollFlushScheduled = true;
    window.requestAnimationFrame(() => {
      scrollFlushScheduled = false;
      flushVisibleReveals();
    });
  };
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
}

document.addEventListener('level:hero-intent', revealAboveFold);
document.addEventListener('DOMContentLoaded', initEntranceAnimations);

// Instant scroll for internal links (no animation - avoids scroll lag)
document.addEventListener('DOMContentLoaded', function() {
  const allLinks = document.querySelectorAll('a[href^="#"]');
  allLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.substring(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      const targetRect = target.getBoundingClientRect();
      const headerEl = document.querySelector('.site-header');
      const headerOffset = headerEl ? headerEl.offsetHeight : 0;
      // About is a sticky scroll-lock section - land so it pins under the header
      // (not early, while Process is still framing the viewport)
      let scrollPosition;
      if (id === 'about') {
        scrollPosition = Math.max(0, target.offsetTop);
      } else {
        scrollPosition = Math.max(0, targetRect.top + currentScroll - headerOffset);
      }
      window.scrollTo(0, scrollPosition);
      const navLinks = document.getElementById('nav-links');
      const navToggle = document.querySelector('.nav-toggle');
      if (navLinks && navLinks.classList.contains('open')) {
        setNavOpen(false);
      }
    });
  });
});

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Dark grey UI only
function initDarkMode() {
  document.body.classList.add('dark-mode');
  document.documentElement.classList.add('dark-mode');
}

initDarkMode();

function initReviewsMarquee() {
  const tracks = Array.from(document.querySelectorAll('.reviews-marquee-track'));
  if (tracks.length === 0) return;

  const updateTrackDistances = () => {
    tracks.forEach((track) => {
      const firstPrimary = track.querySelector('.review-tile:not([aria-hidden="true"])');
      const firstClone = track.querySelector('.review-tile[aria-hidden="true"]');
      if (!firstPrimary || !firstClone) return;

      const distance = firstClone.offsetLeft - firstPrimary.offsetLeft;
      if (distance > 0) {
        track.style.setProperty('--reviews-marquee-distance', `${distance}px`);
      }
    });
  };

  updateTrackDistances();
  window.addEventListener('resize', updateTrackDistances);
}

document.addEventListener('DOMContentLoaded', initReviewsMarquee);


// CLIENT LOGOS MARQUEE INTERACTIONS
document.addEventListener('DOMContentLoaded', function() {
  const marqueeRows = document.querySelectorAll('.marquee-row');
  const clientLogos = document.querySelectorAll('.client-logo');

  if (!marqueeRows.length || !clientLogos.length) return;
  
  clientLogos.forEach((logo, index) => {
    logo.style.setProperty('--logo-index', index);
  });

  const clientsSection = document.querySelector('.clients');
  if (!clientsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      marqueeRows.forEach((row) => {
        const track = row.querySelector('.marquee-track');
        if (track) track.style.animationPlayState = 'running';
      });
    });
  }, { threshold: 0.3 });

  observer.observe(clientsSection);
});


// About section - sticky with text animation
document.addEventListener('DOMContentLoaded', function() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) {
    return;
  }
  
  const words = ['LEVEL', 'Creatives', 'Innovators', 'Visionaries', 'Architects', 'Storytellers'];
  const descriptions = [
    'At LEVEL we are defined by balance, precision and levelling up. Front to Back, we got you covered.',
    'We are creative minds who transform ideas into visually stunning and functionally brilliant digital experiences.',
    'As innovators, we constantly explore new technologies and methodologies to stay ahead of the curve.',
    'We are visionaries who see the potential in every brand and help them realize their digital future.',
    'We architect robust, scalable solutions that form the foundation of your digital presence.',
    'We are storytellers who craft compelling narratives that connect your brand with your audience.'
  ];
  let currentWordIndex = 0;
  
  // Create content with scrolling word list
  aboutSection.innerHTML = `
    <div class="about-content">
      <div class="about-left">
        <div class="about-text">
          <span class="about-prefix">We are</span>
          <div class="word-container">
            <div class="word-list">
              ${words.map(word => `<div class="word-item">${word}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>
      <div class="about-right">
        <div class="description-container">
          <div class="description-list">
            ${descriptions.map(desc => `<div class="description-item">${desc}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  aboutSection.setAttribute('aria-hidden', 'false');

  const wordList = aboutSection.querySelector('.word-list');
  const wordItems = aboutSection.querySelectorAll('.word-item');
  const descriptionList = aboutSection.querySelector('.description-list');
  const descriptionItems = aboutSection.querySelectorAll('.description-item');
  
  function updateWordPosition() {
    const translateY = -currentWordIndex * 200; // 200px per word (taller)
    wordList.style.transform = `translateY(${translateY}px)`;
    descriptionList.style.transform = `translateY(${translateY}px)`;
    
    // Add fade effect to all words
    wordItems.forEach((item, index) => {
      const distance = Math.abs(index - currentWordIndex);
      if (distance === 0) {
        item.style.opacity = '1';
      } else if (distance === 1) {
        item.style.opacity = '0.3';
      } else {
        item.style.opacity = '0.1';
      }
    });
    
    // Add fade effect to all descriptions
    descriptionItems.forEach((item, index) => {
      const distance = Math.abs(index - currentWordIndex);
      if (distance === 0) {
        item.style.opacity = '1';
      } else if (distance === 1) {
        item.style.opacity = '0.3';
      } else {
        item.style.opacity = '0.1';
      }
    });
  }
  
  function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    updateWordPosition();
  }
  
  function prevWord() {
    currentWordIndex = currentWordIndex === 0 ? words.length - 1 : currentWordIndex - 1;
    updateWordPosition();
  }
  
  let lastWheelTime = 0;
  const wheelDelay = 400; // 400ms delay between word changes (faster)
  const exitDelay = 0; // No delay for exiting (instant)
  
  // Check if we should lock scrolling - works for both wheel and programmatic scrolling
  function shouldLockScroll() {
    const rect = aboutSection.getBoundingClientRect();
    const headerH =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
    // Lock once sticky "We are" panel has pinned under the header, until section exits
    return rect.top <= headerH && rect.bottom > window.innerHeight;
  }
  
  function handleWheel(e) {
    if (!shouldLockScroll()) {
      return; // Not in lock zone, allow normal scrolling
    }
    
    const now = Date.now();
    const isAtFirstWord = currentWordIndex === 0;
    const isAtLastWord = currentWordIndex === words.length - 1;
    const isScrollingUp = e.deltaY < 0;
    const isScrollingDown = e.deltaY > 0;
    const isTryingToExit = (isAtFirstWord && isScrollingUp) || (isAtLastWord && isScrollingDown);
    
    // If trying to exit, allow normal scroll immediately
    if (isTryingToExit) {
      return; // Don't prevent default, allow normal scroll
    }
    
    const requiredDelay = isTryingToExit ? exitDelay : wheelDelay;
    
    if (now - lastWheelTime > requiredDelay) {
      lastWheelTime = now;
      
      if (e.deltaY > 0) {
        // Scrolling down - next word
        if (currentWordIndex === words.length - 1) {
          // At last word (Storytellers) and scrolling down - resume normal scrolling
          return; // Don't prevent default, allow normal scroll
        } else {
          // Not at last word - go to next word
          nextWord();
        }
      } else {
        // Scrolling up - previous word
        if (currentWordIndex === 0) {
          // At first word (LEVEL) and scrolling up - resume normal scrolling
          return; // Don't prevent default, allow normal scroll
        } else {
          // Not at first word - go to previous word
          prevWord();
        }
      }
      
      // Prevent default scroll to lock the page
      e.preventDefault();
    }
  }
  
  // Handle programmatic scrolling (from smooth scroll, anchor links, etc.)
  function handleScroll() {
    if (!shouldLockScroll()) {
      return; // Not in lock zone
    }
    
    // Don't lock if we're at the last word (Storytellers) - allow scrolling to continue
    const isAtLastWord = currentWordIndex === words.length - 1;
    if (isAtLastWord) {
      return; // Allow normal scrolling past the section
    }
    
    // If we're in the lock zone but scroll position changed programmatically,
    // we need to maintain the lock by preventing further scroll
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < 0) {
      // Section has scrolled past the top, lock it at the top
      window.scrollTo({
        top: aboutSection.offsetTop,
        behavior: 'auto' // Instant, no smooth scroll
      });
    }
  }
  
  // Throttle wheel handler to prevent lag
  let wheelThrottle = false;
  let lastWheelCall = 0;
  function throttledWheel(e) {
    const now = Date.now();
    if (now - lastWheelCall < 16) return; // Only process every ~16ms (60fps)
    
    if (wheelThrottle) return;
    wheelThrottle = true;
    lastWheelCall = now;
    
    requestAnimationFrame(() => {
      handleWheel(e);
      wheelThrottle = false;
    });
  }
  
  // Add scroll listener to handle programmatic scrolling
  let scrollThrottle = false;
  function throttledScroll() {
    if (scrollThrottle) return;
    scrollThrottle = true;
    
    requestAnimationFrame(() => {
      handleScroll();
      scrollThrottle = false;
    });
  }
  
  // Keep passive: false because we need preventDefault
  window.addEventListener('wheel', throttledWheel, { passive: false });
  window.addEventListener('scroll', throttledScroll, { passive: true });
});

// Email copy to clipboard functionality
document.addEventListener('DOMContentLoaded', function() {
  const emailCopy = document.getElementById('email-copy');
  const copyNotice = document.querySelector('.copy-notice');
  
  if (emailCopy && copyNotice) {
    emailCopy.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const email = this.dataset.email;
      
      try {
        await navigator.clipboard.writeText(email);
        
        // Show the message
        copyNotice.style.display = 'block';
        
        // Hide after 2 seconds
        setTimeout(() => {
          copyNotice.style.display = 'none';
        }, 2000);
        
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show the message
        copyNotice.style.display = 'block';
        
        // Hide after 2 seconds
        setTimeout(() => {
          copyNotice.style.display = 'none';
        }, 2000);
      }
    });
  }
});

// Soundscape toggle (expects an <audio id="soundscape"> element if added later)
const soundBtn = document.getElementById('sound-toggle');
const audioEl = document.getElementById('soundscape');
if (soundBtn && audioEl instanceof HTMLAudioElement) {
  soundBtn.addEventListener('click', () => {
    const isPlaying = !audioEl.paused;
    if (isPlaying) { audioEl.pause(); soundBtn.textContent = 'Soundscape: Off'; soundBtn.setAttribute('aria-pressed', 'false'); }
    else { audioEl.play(); soundBtn.textContent = 'Soundscape: On'; soundBtn.setAttribute('aria-pressed', 'true'); }
  });
}


// Projects Webview Tabs Functionality
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  // Detect mobile device
  const isMobile = window.innerWidth <= 900 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Initialize: Hide all panels initially
  tabPanels.forEach(panel => {
    panel.classList.remove('active');
    panel.style.display = 'none';
    panel.style.height = '0';
    panel.style.opacity = '0';
  });
  
  // Desktop viewport size - iframe gets this so sites render desktop layout; we scale down to fit
  const WEBVIEW_VIEWPORT_W = 1200;
  const WEBVIEW_VIEWPORT_H = 750;

  function scaleWebviewToFit(wrapper) {
    if (!wrapper || !wrapper.offsetParent) return; // not visible
    if (wrapper.classList.contains('webview-wrapper--static')) return;
    const w = wrapper.offsetWidth;
    if (w <= 0) return;
    const scale = w / WEBVIEW_VIEWPORT_W;
    const scaled = wrapper.querySelector('.webview-scaled');
    if (scaled) scaled.style.transform = 'scale(' + scale + ')';
    wrapper.style.height = Math.round(WEBVIEW_VIEWPORT_H * scale) + 'px';
  }

  function scaleVisibleWebviews() {
    const activePanel = document.querySelector('.tab-panel.active');
    if (!activePanel) return;
    activePanel.querySelectorAll('.webview-wrapper').forEach(scaleWebviewToFit);
  }

  // Function to load iframe only when tab is opened (iframe may be inside .webview-scaled)
  function loadIframe(panel) {
    const iframe = panel.querySelector('.webview-wrapper iframe[data-src]') || panel.querySelector('iframe[data-src]');
    const fallback = panel.querySelector('.webview-wrapper .iframe-fallback') || panel.querySelector('.iframe-fallback');
    
    if (iframe && !iframe.src) {
      const url = iframe.getAttribute('data-src');
      
      // Sites that block iframe embedding - use static preview image instead
      const blockedSites = [];
      
      // Check if this site is known to block iframes
      const isBlocked = blockedSites.some(site => url.includes(site));
      
      if (isBlocked && fallback) {
        // Show fallback immediately for known blocked sites
        iframe.style.display = 'none';
        fallback.style.display = 'flex';
        return;
      }
      
      // Try to load iframe
      iframe.src = url;
      
      // Ensure iframe is visible and fallback is hidden initially
      if (fallback) {
        fallback.style.display = 'none';
      }
      iframe.style.display = 'block';
      
      // Set up error handling for blocked iframes
      iframe.onerror = function() {
        if (fallback) {
          iframe.style.display = 'none';
          fallback.style.display = 'flex';
        }
      };
      
      // Check for connection refused or blocked errors
      const checkConnection = setTimeout(() => {
        // If iframe hasn't loaded or shows connection error, show fallback
        if (isBlocked && fallback) {
          // Check if iframe is showing an error page
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const bodyText = iframeDoc.body ? iframeDoc.body.innerText || iframeDoc.body.textContent : '';
            // If we see connection error messages, show fallback
            if (bodyText.includes('refused to connect') || 
                bodyText.includes('ERR_') || 
                bodyText.includes('This site can\'t be reached')) {
              iframe.style.display = 'none';
              fallback.style.display = 'flex';
            }
          } catch (e) {
            // Can't access - likely blocked, show fallback for known blocked sites
            if (isBlocked && fallback) {
              iframe.style.display = 'none';
              fallback.style.display = 'flex';
            }
          }
        }
      }, 3000);
      
      // Clear check if iframe loads successfully
      iframe.onload = function() {
        clearTimeout(checkConnection);
      };
      
      // For known blocked sites, show fallback immediately
      // For other sites, let them try to load - if they're blocked, browser will show blank
      // We check after a delay if the iframe appears to be empty/blocked
      const checkBlocked = setTimeout(() => {
        // Only check for known blocked sites or if iframe failed to load
        // We can't reliably check contentDocument due to CORS, so we rely on
        // the known blocked list and onerror handler
        if (isBlocked && fallback) {
          iframe.style.display = 'none';
          fallback.style.display = 'flex';
        }
      }, 1000);
      
      // If iframe loads successfully, clear the check
      iframe.onload = function() {
        clearTimeout(checkBlocked);
        // If it's a known blocked site, still show fallback
        if (isBlocked && fallback) {
          iframe.style.display = 'none';
          fallback.style.display = 'flex';
        } else if (fallback) {
          // For non-blocked sites, ensure fallback is hidden
          fallback.style.display = 'none';
          iframe.style.display = 'block';
        }
      };
    }
  }
  
  // Tab button click handler
  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const targetTab = this.getAttribute('data-tab');
      const targetPanel = document.getElementById(`tab-${targetTab}`);
      
      // On mobile: open in new tab instead of showing webview
      if (isMobile && targetPanel) {
        const url = targetPanel.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
          return;
        }
      }
      
      // Desktop behavior: show webview
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
        panel.style.height = '0';
        panel.style.opacity = '0';
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Show the target panel (no height animation - was causing content to jump up then down)
      if (targetPanel) {
        loadIframe(targetPanel);
        targetPanel.style.display = '';
        targetPanel.style.height = '';
        targetPanel.style.opacity = '';
        targetPanel.classList.add('active');
        requestAnimationFrame(function() { scaleVisibleWebviews(); });
      }
    });
  });

  // Auto-select first tab on page load (desktop only)
  if (!isMobile && tabButtons.length > 0) {
    const defaultButton =
      Array.from(tabButtons).find((btn) => btn.getAttribute('data-tab') === 'richtons') ||
      tabButtons[0];
    if (defaultButton) {
      setTimeout(() => {
        defaultButton.click();
        requestAnimationFrame(scaleVisibleWebviews);
      }, 100);
    }
  }

  // Rescale webviews when window or wrapper size changes
  window.addEventListener('resize', function() {
    requestAnimationFrame(scaleVisibleWebviews);
  });
  const webviewSection = document.querySelector('#projects-webview');
  if (webviewSection && typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(function() { scaleVisibleWebviews(); });
    document.querySelectorAll('.webview-wrapper').forEach(function(w) { ro.observe(w); });
  }
});

// ============================================
// SECURITY FUNCTIONS
// ============================================

/**
 * Sanitize input to prevent XSS attacks
 * Removes HTML tags and escapes special characters
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  // Create a temporary div element to strip HTML
  const div = document.createElement('div');
  div.textContent = input;
  let sanitized = div.textContent || div.innerText || '';
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Remove any remaining HTML entities that might be dangerous
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized;
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Rate limiting - prevent spam submissions
 * Returns true if submission is allowed, false if rate limited
 */
function checkRateLimit() {
  const RATE_LIMIT_KEY = 'form_submission_times';
  const MAX_SUBMISSIONS = 3; // Max 3 submissions
  const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
  
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    let submissionTimes = stored ? JSON.parse(stored) : [];
    
    // Remove old submissions outside the time window
    const now = Date.now();
    submissionTimes = submissionTimes.filter(time => (now - time) < TIME_WINDOW);
    
    // Check if limit exceeded
    if (submissionTimes.length >= MAX_SUBMISSIONS) {
      return {
        allowed: false,
        remainingTime: Math.ceil((TIME_WINDOW - (now - submissionTimes[0])) / 1000 / 60) // minutes
      };
    }
    
    // Add current submission time
    submissionTimes.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissionTimes));
    
    return { allowed: true };
  } catch (error) {
    return { allowed: true };
  }
}

/**
 * Validate form input lengths and content.
 * Bot/spam handling is left to reCAPTCHA v3 + rate limiting - avoid heuristic "random string" checks
 * that falsely reject real names and short professional messages.
 */
function validateFormData(formData) {
  const errors = [];
  
  // Validate name
  if (!formData.name || formData.name.length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }
  if (formData.name.length > 100) {
    errors.push('Name must be less than 100 characters.');
  }
  
  // Validate email
  if (!formData.email || !validateEmail(formData.email)) {
    errors.push('Please enter a valid email address.');
  }
  
  // Validate message
  if (!formData.message || formData.message.length < 10) {
    errors.push('Message must be at least 10 characters long.');
  }
  if (formData.message.length > 2000) {
    errors.push('Message must be less than 2000 characters.');
  }
  
  // Light spam keyword check only (URLs/links are normal in project briefs)
  const spamPatterns = [
    /(viagra|casino|crypto wallet|click here to win|seo service guaranteed)/gi
  ];
  
  const messageLower = formData.message.toLowerCase();
  const spamKeywordHits = spamPatterns.reduce((count, pattern) => {
    return count + (messageLower.match(pattern) || []).length;
  }, 0);
  
  if (spamKeywordHits > 0) {
    errors.push('Your message contains suspicious content. Please revise and try again.');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// ============================================
// RECAPTCHA v3 CONFIGURATION
// ============================================

// reCAPTCHA v3 Site Key
// Get it from: https://www.google.com/recaptcha/admin
const RECAPTCHA_SITE_KEY = '6LeCRlIsAAAAAGPZzNsKcCRa_BSgy6ICxaSAh1wm';

/**
 * Execute reCAPTCHA v3 and get token
 * Returns token if successful, null if reCAPTCHA not configured
 */
async function executeRecaptcha() {
  // Check if reCAPTCHA is loaded and configured
  if (typeof grecaptcha === 'undefined' || RECAPTCHA_SITE_KEY === 'YOUR_RECAPTCHA_SITE_KEY') {
    return null;
  }
  
  try {
    // Execute reCAPTCHA v3 - returns a token
    const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
    return token;
  } catch (error) {
    return null;
  }
}

// ============================================
// CONTACT FORM - lazy-load EmailJS + reCAPTCHA
// ============================================

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

let formLibsPromise = null;

function ensureFormLibs() {
  if (!formLibsPromise) {
    formLibsPromise = Promise.all([
      loadExternalScript('https://www.google.com/recaptcha/api.js?render=6LeCRlIsAAAAAGPZzNsKcCRa_BSgy6ICxaSAh1wm'),
      loadExternalScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'),
    ]).then(() => {
      if (typeof emailjs !== 'undefined') {
        emailjs.init('YZEUywDpGdF8ypKDn');
      }
    });
  }
  return formLibsPromise;
}

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const formMessage = document.getElementById('form-message');

  if (!contactForm) return;

  const contactSection = document.getElementById('contact-title') || contactForm;
  const preloadForm = () => { ensureFormLibs().catch(() => {}); };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        preloadForm();
        io.disconnect();
      }
    }, { rootMargin: '200px 0px' });
    io.observe(contactSection);
  }
  contactForm.addEventListener('focusin', preloadForm, { once: true });

  contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      try {
        await ensureFormLibs();
      } catch (error) {
        formMessage.textContent = 'Form service failed to load. Please email help@leveldesignagency.com directly.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }

      if (typeof emailjs === 'undefined') {
        formMessage.textContent = 'Form service is not configured. Please contact us directly at help@leveldesignagency.com';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }
      
      // Disable submit button to prevent double submissions
      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';
      
      // Hide previous messages
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
      
      // SECURITY CHECK 1: Honeypot field (bots will fill this)
      const honeypot = contactForm.querySelector('input[name="website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        return; // Don't show error to bot
      }
      
      // Get and sanitize form data
      const rawData = {
        name: contactForm.querySelector('input[name="name"]').value,
        email: contactForm.querySelector('input[name="email"]').value,
        message: contactForm.querySelector('textarea[name="message"]').value
      };
      
      // SECURITY CHECK 2: Sanitize all inputs
      const formData = {
        name: sanitizeInput(rawData.name),
        email: sanitizeInput(rawData.email).toLowerCase().trim(),
        message: sanitizeInput(rawData.message)
      };
      
      // SECURITY CHECK 3: Validate form data
      const validation = validateFormData(formData);
      if (!validation.valid) {
        formMessage.textContent = validation.errors.join(' ');
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        return;
      }
      
      // SECURITY CHECK 4: Rate limiting
      const rateLimit = checkRateLimit();
      if (!rateLimit.allowed) {
        formMessage.textContent = `Too many submissions. Please wait ${rateLimit.remainingTime} minutes before trying again.`;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        return;
      }
      
      // SECURITY CHECK 5: reCAPTCHA v3 verification
      const recaptchaToken = await executeRecaptcha();
      if (RECAPTCHA_SITE_KEY !== 'YOUR_RECAPTCHA_SITE_KEY' && !recaptchaToken) {
        // reCAPTCHA is configured but failed - block submission
        formMessage.textContent = 'Security verification failed. Please refresh the page and try again.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        return;
      }
      
      try {
        // Send email using EmailJS
        const SERVICE_ID = 'service_3y4my2r';
        const TEMPLATE_ID_TO_YOU = 'template_jnkhrvh'; // Email to you
        const TEMPLATE_ID_AUTO_REPLY = 'template_brnzty1'; // Auto-reply to customer
        
        // Prepare email data with reCAPTCHA token (if available)
        const emailDataToYou = {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email
        };
        
        // Add reCAPTCHA token if available (for logging/monitoring)
        if (recaptchaToken) {
          emailDataToYou.recaptcha_token = recaptchaToken;
        }
        
        // Send email to you (with sanitized data)
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID_TO_YOU,
          emailDataToYou
        );
        
        // Send auto-reply to customer
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID_AUTO_REPLY,
          {
            name: formData.name,
            from_email: formData.email,
            email: formData.email,
            message: formData.message,
            reply_to: formData.email
          }
        );
        
        // Success message
        formMessage.textContent = 'Message sent successfully! We\'ll get back to you soon.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 5000);
        
      } catch (error) {
        // More detailed error message
        let errorMsg = 'Sorry, there was an error sending your message. ';
        if (error.text) {
          errorMsg += `Error: ${error.text}`;
        } else if (error.message) {
          errorMsg += `Error: ${error.message}`;
        } else {
          errorMsg += 'Please try again or email us directly at help@leveldesignagency.com';
        }
        
        formMessage.textContent = errorMsg;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
      }
    });
});
