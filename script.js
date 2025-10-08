// Nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Intersection animations
const animated = document.querySelectorAll('[data-animate]');
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add('in');
  }
}, { threshold: 0.16 });
animated.forEach(el => io.observe(el));

// Smooth scroll for internal links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Hero cycling animation system
const services = [
  "Web\nDesign",
  "Graphic\nDesign", 
  "Social\nMedia",
  "Brand &\nMarketing",
  "Drone\nServices",
  "Commercial\nPhotography",
  "Video\nEditing"
];

let currentSlideIndex = 0;
let isInitialAnimation = true;
let isCycling = false;

function createServiceSlide(service) {
  const slide = document.createElement('div');
  slide.className = 'hero-slide';
  
  // Handle line breaks in service names
  const lines = service.split('\n');
  
  slide.innerHTML = `
    <div class="border-line"></div>
    <div class="text-content">
      ${lines.map(line => `<div class="word">${line.trim()}</div>`).join('')}
    </div>
  `;
  
  return slide;
}

function startServiceCycling() {
  // Fade out the original text
  const heroHeadline = document.getElementById('hero-headline');
  heroHeadline.style.transition = 'opacity 1s ease-in-out';
  heroHeadline.style.opacity = '0';
  
  // Create wave effect right after text fades
  setTimeout(() => {
    createLightWave();
  }, 500);
  
  // Start the service cycling after wave
  setTimeout(() => {
    showNextSlide();
  }, 2000);
}

function showNextSlide() {
  const heroInner = document.querySelector('.hero-inner');
  
  if (!isCycling) return;
  
  // Fade out current slide
  const currentSlide = heroInner.querySelector('.hero-slide');
  if (currentSlide) {
    currentSlide.classList.remove('active');
    
    // Wait for fade out to complete, then create and show next slide
    setTimeout(() => {
      if (currentSlide.parentNode) {
        currentSlide.parentNode.removeChild(currentSlide);
      }
      
      // Create and show next slide after current one is completely gone
      const nextService = services[currentSlideIndex];
      const newSlide = createServiceSlide(nextService);
      heroInner.appendChild(newSlide);
      
      // Fade in after a brief delay
      setTimeout(() => {
        newSlide.classList.add('active');
      }, 100);
      
      // Move to next service
      currentSlideIndex = (currentSlideIndex + 1) % services.length;
      
      // Schedule next slide or return to initial text
      setTimeout(() => {
        if (isCycling) {
          // Check if we've completed all services
          if (currentSlideIndex === 0) {
            // All services completed, return to initial text
            returnToInitialText();
          } else {
            showNextSlide();
          }
        }
      }, 3000);
    }, 1000);
  } else {
    // No current slide, create and show first slide
    const nextService = services[currentSlideIndex];
    const newSlide = createServiceSlide(nextService);
    heroInner.appendChild(newSlide);
    
    // Fade in
    setTimeout(() => {
      newSlide.classList.add('active');
    }, 100);
    
    // Move to next service
    currentSlideIndex = (currentSlideIndex + 1) % services.length;
    
    // Schedule next slide or return to initial text
    setTimeout(() => {
      if (isCycling) {
        // Check if we've completed all services
        if (currentSlideIndex === 0) {
          // All services completed, return to initial text
          returnToInitialText();
        } else {
          showNextSlide();
        }
      }
    }, 3000);
  }
}

function createLightWave() {
  
  // Create wave container in hero section
  const heroSection = document.querySelector('.hero');
  if (!heroSection) {
    return;
  }
  
  const waveContainer = document.createElement('div');
  waveContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  `;
  
  // Create waving gradient from top left to bottom right
  const waveGradient = document.createElement('div');
  waveGradient.style.cssText = `
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at center, 
      rgba(255, 45, 45, 0.8) 0%, 
      rgba(255, 45, 45, 0.4) 30%, 
      rgba(255, 255, 255, 0.6) 50%, 
      rgba(255, 45, 45, 0.4) 70%, 
      transparent 100%);
    transform: rotate(-45deg) scale(0);
    animation: waveExpand 2s ease-out forwards;
    filter: blur(20px);
  `;
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes waveExpand {
      0% { 
        transform: rotate(-45deg) scale(0) translateX(-100px);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% { 
        transform: rotate(-45deg) scale(1.5) translateX(100px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add element to container and append to hero section
  waveContainer.appendChild(waveGradient);
  heroSection.appendChild(waveContainer);
  
  // Remove after animation
  setTimeout(() => {
    if (waveContainer.parentNode) {
      waveContainer.parentNode.removeChild(waveContainer);
    }
    document.head.removeChild(style);
  }, 2500);
}

function returnToInitialText() {
  // Stop cycling
  isCycling = false;
  
  // Remove current slide
  const currentSlide = document.querySelector('.hero-slide');
  if (currentSlide) {
    currentSlide.remove();
  }
  
  // Fade in the original text
  const heroHeadline = document.getElementById('hero-headline');
  heroHeadline.style.transition = 'opacity 1s ease-in-out';
  heroHeadline.style.opacity = '1';
  
  // Reset for next cycle
  setTimeout(() => {
    isInitialAnimation = true;
    currentSlideIndex = 0;
  }, 1000);
}

// Headline animation: each phrase fades in over 3s; next starts 1s after previous start
const phrases = document.querySelectorAll('.headline .phrase');
if (phrases.length === 3) {
  let currentIndex = 0;
  
  function showNextPhrase() {
    if (currentIndex < phrases.length) {
      phrases[currentIndex].classList.add('show');
      currentIndex++;
      
      // Start next phrase 1s after previous started
      if (currentIndex < phrases.length) {
        setTimeout(showNextPhrase, 1000);
      } else {
        // After all phrases are shown, start the cycling after 3 seconds
        setTimeout(() => {
          isInitialAnimation = false;
          isCycling = true;
          startServiceCycling();
        }, 3000);
      }
    }
  }
  
  // Start animation after a brief delay
  setTimeout(showNextPhrase, 500);
}

// Advanced scroll animations and parallax
let ticking = false;

function updateScrollEffects() {
  const scrollY = window.scrollY;
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.site-header');
  
  // Debug: Check if header exists
  if (!header) {
    return;
  }
  
  // Hero parallax scroll
  if (hero) {
    const heroHeight = hero.offsetHeight;
    const parallaxSpeed = 0.5;
    const yPos = -(scrollY * parallaxSpeed);
    hero.style.transform = `translate3d(0, ${yPos}px, 0)`;
  }
  
  // Header fade out based on scroll
  if (header) {
    const fadeStart = 50; // Start fading after 50px scroll
    const fadeEnd = 200; // Complete fade at 200px scroll
    const fadeProgress = Math.min(Math.max((scrollY - fadeStart) / (fadeEnd - fadeStart), 0), 1);
    const opacity = 1 - fadeProgress;
    header.style.opacity = opacity;
    
    // Debug logging (only when opacity changes significantly)
    if (scrollY > 30 && (opacity < 0.9 || opacity > 0.1)) {
    }
  }
  
  // Parallax effects for "What we do" section cards
  const servicesSection = document.querySelector('#services');
  if (servicesSection) {
    const cards = servicesSection.querySelectorAll('.card');
    const sectionRect = servicesSection.getBoundingClientRect();
    const sectionTop = sectionRect.top + scrollY;
    const sectionHeight = sectionRect.height;
    
    // Only apply parallax when section is in view
    if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.top + cardRect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distanceFromCenter = cardCenter - viewportCenter;
        
        // Different parallax speeds for each card (staggered effect)
        const parallaxSpeed = 0.1 + (index * 0.05); // 0.1, 0.15, 0.2, 0.25
        const yOffset = distanceFromCenter * parallaxSpeed;
        
        // Apply subtle rotation and translation
        const rotation = (distanceFromCenter / window.innerHeight) * 2; // Max 2 degrees
        card.style.transform = `translate3d(0, ${yOffset}px, 0) rotate(${rotation}deg)`;
      });
    }
  }
  
  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

window.addEventListener('scroll', requestTick, { passive: true });

// Test scroll event first
window.addEventListener('scroll', () => {
}, { passive: true });

// Header fade on scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const header = document.querySelector('.site-header');
  
  
  if (header) {
    if (scrollY > 100) {
      header.style.opacity = '0';
      header.style.visibility = 'hidden';
    } else {
      header.style.opacity = '1';
      header.style.visibility = 'visible';
    }
  }
}, { passive: true });

// Staggered card animations
const cards = document.querySelectorAll('.card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('animate-in');
      }, index * 200); // 200ms stagger between cards
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

cards.forEach(card => cardObserver.observe(card));

// Pointer tracking for service cards, work cards, and steps glow effect
const setupPointerTracking = () => {
  const cards = document.querySelectorAll('.card, .work-card, .steps li');
  
  const centerOfElement = ($el) => {
    const rect = $el.getBoundingClientRect();
    return [rect.width / 2, rect.height / 2];
  };

  const pointerPositionRelativeToElement = ($el, e) => {
    const pos = [e.clientX, e.clientY];
    const rect = $el.getBoundingClientRect();
    const x = pos[0] - rect.left;
    const y = pos[1] - rect.top;
    const px = Math.min(Math.max((100 / rect.width) * x, 0), 100);
    const py = Math.min(Math.max((100 / rect.height) * y, 0), 100);
    return { pixels: [x, y], percent: [px, py] };
  };

  const angleFromPointerEvent = ($el, dx, dy) => {
    let angleRadians = 0;
    let angleDegrees = 0;
    if (dx !== 0 || dy !== 0) {
      angleRadians = Math.atan2(dy, dx);
      angleDegrees = angleRadians * (180 / Math.PI) + 90;
      if (angleDegrees < 0) {
        angleDegrees += 360;
      }
    }
    return angleDegrees;
  };

  const distanceFromCenter = ($card, x, y) => {
    const [cx, cy] = centerOfElement($card);
    return [x - cx, y - cy];
  };

  const closenessToEdge = ($card, x, y) => {
    const [cx, cy] = centerOfElement($card);
    const [dx, dy] = distanceFromCenter($card, x, y);
    let k_x = Infinity;
    let k_y = Infinity;
    if (dx !== 0) {
      k_x = cx / Math.abs(dx);
    }
    if (dy !== 0) {
      k_y = cy / Math.abs(dy);
    }
    return Math.min(Math.max(1 / Math.min(k_x, k_y), 0), 1);
  };

  const cardUpdate = (e) => {
    const $card = e.currentTarget;
    const position = pointerPositionRelativeToElement($card, e);
    const [px, py] = position.pixels;
    const [perx, pery] = position.percent;
    const [dx, dy] = distanceFromCenter($card, px, py);
    const edge = closenessToEdge($card, px, py);
    const angle = angleFromPointerEvent($card, dx, dy);

    $card.style.setProperty('--pointer-x', `${perx.toFixed(3)}%`);
    $card.style.setProperty('--pointer-y', `${pery.toFixed(3)}%`);
    $card.style.setProperty('--pointer-°', `${angle.toFixed(3)}deg`);
    $card.style.setProperty('--pointer-d', `${(edge * 100).toFixed(3)}`);
    
    $card.classList.remove('animating');
  };

  cards.forEach(card => {
    card.addEventListener('pointermove', cardUpdate);
    card.addEventListener('mousemove', cardUpdate); // Fallback for mouse events
  });

  return () => {
    cards.forEach(card => {
      card.removeEventListener('pointermove', cardUpdate);
      card.removeEventListener('mousemove', cardUpdate);
    });
  };
};

// Initialize pointer tracking
const cleanupPointerTracking = setupPointerTracking();

// Cursor trail fade after hero section
let trailFadeActive = false;
let trailFadeProgress = 0;

const heroSection = document.querySelector('.hero');

function getHeroHeight() {
  if (!heroSection) return 0;
  const rect = heroSection.getBoundingClientRect();
  return rect.height + rect.top + window.scrollY;
}

function updateTrailFade() {
  const scrollY = window.scrollY;
  const heroHeight = getHeroHeight();
  const fadeStart = heroHeight * 0.9; // Start fading at 90% of hero height
  const fadeEnd = heroHeight; // Complete fade at end of hero
  
  if (scrollY > fadeStart) {
    trailFadeActive = true;
    trailFadeProgress = Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1);
  } else {
    trailFadeActive = false;
    trailFadeProgress = 0;
  }

  // Hard toggle the global canvas visibility beyond the hero
  if (canvas) {
    if (scrollY >= fadeEnd) {
      canvas.style.display = 'none';
    } else {
      canvas.style.display = 'block';
    }
  }
}

// Update trail fade on scroll
window.addEventListener('scroll', updateTrailFade);

// Recalculate on resize (hero height can change)
window.addEventListener('resize', updateTrailFade);

// Custom background activation at "selected work" section
const customBackground = document.getElementById('custom-background');
const workSection = document.querySelector('#work');

function updateCustomBackground() {
  if (!customBackground || !workSection) return;
  
  const workRect = workSection.getBoundingClientRect();
  const workTop = workRect.top + window.scrollY;
  const scrollY = window.scrollY;
  
  // Activate background when we reach the work section
  if (scrollY >= workTop) {
    customBackground.classList.add('active');
  } else {
    customBackground.classList.remove('active');
  }
}

// Update custom background on scroll
window.addEventListener('scroll', updateCustomBackground);

// Update on resize
window.addEventListener('resize', updateCustomBackground);

// Parallax: subtle mouse parallax on hero layers
const parallax = document.querySelector('.hero-parallax');
if (parallax) {
  const layers = parallax.querySelectorAll('.layer');
  window.addEventListener('mousemove', (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX / w - 0.5);
    const y = (e.clientY / h - 0.5);
    layers.forEach((layer, i) => {
      const depth = (i + 1) * 4; // small movement for elegance
      layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });
}

// Glowing canvas cursor trail
const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');

// Hero-specific cursor trail for behind logo effect
const heroCanvas = document.getElementById('hero-cursor-canvas');
const heroCtx = heroCanvas.getContext('2d');

// for intro motion
let mouseMoved = false;

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 40,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5
};

const trail = new Array(params.pointsNumber);
const heroTrail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
    heroTrail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}

window.addEventListener("click", e => {
    updateMousePosition(e.clientX, e.clientY);
});
window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.clientX, e.clientY);
});
window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

setupCanvas();
setupHeroCanvas();
update(0);
window.addEventListener("resize", () => {
    setupCanvas();
    setupHeroCanvas();
});

function update(t) {
    // for intro motion
    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    // Update main canvas trail with fade effect
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateTrail(trail, pointer);
    
    // Apply fade effect after hero section
    const trailAlpha = trailFadeActive ? 1 - trailFadeProgress : 1;
    const trailBlur = trailFadeActive ? 8 * (1 - trailFadeProgress) : 8;
    
    if (trailAlpha > 0) {
      drawTrail(ctx, trail, {
        color: '#ff2d2d',
        shadowBlur: trailBlur,
        widthScale: 1,
        alpha: trailAlpha
      });
    }

    // Update hero canvas trail (behind logo). Use pointer relative to hero.
    const heroRect = heroCanvas.getBoundingClientRect();
    const heroPointer = { x: pointer.x - heroRect.left, y: pointer.y - heroRect.top };
    // Clear canvas completely so trail fades naturally
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    updateTrail(heroTrail, heroPointer);
    drawTrail(heroCtx, heroTrail, {
      // bigger but subtler white backlight
      color: 'white',
      shadowBlur: 28,
      widthScale: 1.6,
      alpha: 0.25,
      gradientCenter: heroPointer,
      gradientRadius: 200
    });
    
    window.requestAnimationFrame(update);
}

function updateTrail(trailArray, targetPointer) {
    trailArray.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? targetPointer : trailArray[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });
}

function drawTrail(context, trailArray, opts) {
    const { color = '#ff2d2d', shadowBlur = 8, widthScale = 1, alpha = 1, gradientCenter, gradientRadius } = opts || {};
    context.save();
    context.globalAlpha = alpha;
    context.lineCap = 'round';
    let stroke = color;
    if (gradientCenter && gradientRadius) {
      const g = context.createRadialGradient(gradientCenter.x, gradientCenter.y, 0, gradientCenter.x, gradientCenter.y, gradientRadius);
      g.addColorStop(0, 'rgba(255,255,255,0.9)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      stroke = g;
    }
    context.strokeStyle = stroke;
    context.shadowColor = color;
    context.shadowBlur = shadowBlur;
    context.beginPath();
    context.moveTo(trailArray[0].x, trailArray[0].y);

    for (let i = 1; i < trailArray.length - 1; i++) {
        const xc = .5 * (trailArray[i].x + trailArray[i + 1].x);
        const yc = .5 * (trailArray[i].y + trailArray[i + 1].y);
        context.quadraticCurveTo(trailArray[i].x, trailArray[i].y, xc, yc);
        context.lineWidth = widthScale * params.widthFactor * (params.pointsNumber - i);
        context.stroke();
    }
    context.lineTo(trailArray[trailArray.length - 1].x, trailArray[trailArray.length - 1].y);
    context.stroke();
    context.restore();
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function setupHeroCanvas() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        heroCanvas.width = rect.width;
        heroCanvas.height = rect.height;
    }
}

// Projects Section
const projects = [
  {
    id: 1,
    title: "APX - FULL REBRAND",
    year: "2024",
    image: "APX - FULL REBRAND"
  },
  {
    id: 2,
    title: "ONTIMELY - DESKTOP APP, MOBILE APP, BACKEND AND PORTAL",
    year: "2024",
    image: "ONTIMELY - DESKTOP APP, MOBILE APP, BACKEND AND PORTAL"
  },
  {
    id: 3,
    title: "RICHTONS - BRANDING",
    year: "2024",
    image: "RICHTONS - BRANDING"
  },
  {
    id: 4,
    title: "WOMBATS - SOCIAL MEDIA MANAGEMENT",
    year: "2024",
    image: "WOMBATS - SOCIAL MEDIA MANAGEMENT"
  },
  {
    id: 5,
    title: "HOSTELWORLD - CAMPAIGINS",
    year: "2024",
    image: "HOSTELWORLD - CAMPAIGINS"
  },
  {
    id: 6,
    title: "PERSONAL BRANDS",
    year: "2024",
    image: "PERSONAL BRANDS"
  }
];

// Initialize projects section
function initProjectsSection() {
  const projectsContainer = document.querySelector('.projects-container');
  const backgroundImage = document.getElementById('background-image');
  
  if (!projectsContainer || !backgroundImage) return;
  
  // Render projects
  renderProjects(projectsContainer);
  
  // Initialize animations
  initialAnimation();
  
  // DISABLED - Image preloading removed to prevent console flooding
  // preloadImages();
  
  // DISABLED - Image hover events removed to prevent console flooding
  // setupHoverEvents(backgroundImage, projectsContainer);
}

// Render project items
function renderProjects(container) {
  projects.forEach((project) => {
    const projectItem = document.createElement('div');
    projectItem.classList.add('project-item');
    projectItem.dataset.id = project.id;
    projectItem.dataset.image = project.image;

    projectItem.innerHTML = `
      <div class="project-title">${project.title}</div>
      <div class="project-year">${project.year}</div>
    `;

    container.appendChild(projectItem);
  });
}

// Initial animation for project items
function initialAnimation() {
  const projectItems = document.querySelectorAll('.project-item');

  // Set initial state
  projectItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';

    // Animate in with staggered delay
    setTimeout(() => {
      item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 60);
  });
}

// Setup hover events for project items - DISABLED TO STOP CONSOLE FLOODING
function setupHoverEvents(backgroundImage, projectsContainer) {
  // DISABLED - All image loading removed to prevent console flooding
}

// Preload images
function preloadImages() {
  // DISABLED - Image preloading to prevent console flooding
}

// Initialize projects section when DOM is loaded
document.addEventListener('DOMContentLoaded', initProjectsSection);

// Transform "What we do" bullet lists into underlapping sub-cards
document.addEventListener('DOMContentLoaded', function() {
  
  const serviceCards = document.querySelectorAll('#services .card');
  
  serviceCards.forEach((card, cardIndex) => {
    
    const list = card.querySelector('ul');
    if (!list) {
      return;
    }

    const items = Array.from(list.querySelectorAll('li'));
    
    if (items.length === 0) return;

    // Create sub-card container
    const subList = document.createElement('div');
    subList.className = 'subcard-list';
    subList.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1;
    `;

    // Create individual sub-cards
    items.forEach((li, idx) => {
      const sub = document.createElement('div');
      sub.className = 'sub-card';
      sub.style.cssText = `
        position: relative;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: rgba(255, 255, 255, 0.1) 0px 10px 16px -8px, rgba(255, 255, 255, 0.15) 0px 20px 36px -14px;
        padding: 12px 14px;
        margin-bottom: 8px;
        transform: translateY(-20px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.5, 1, 0.89, 1);
        cursor: pointer;
      `;
      sub.innerHTML = `<span style="display: block; color: var(--text); font-size: 15px; letter-spacing: .2px; margin: 0;">${li.innerHTML}</span>`;
      sub.style.setProperty('--drop-delay', `${idx * 100}ms`);
      subList.appendChild(sub);
    });

    // Make card relative positioned
    card.style.position = 'relative';
    
    // Add sub-list to card
    card.appendChild(subList);
    
    // Remove original list
    list.parentNode.removeChild(list);
    
  });

  // Animate sub-cards on intersection
  const subCards = document.querySelectorAll('.sub-card');
  
  const subObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(getComputedStyle(entry.target).getPropertyValue('--drop-delay') || '0', 10);
        setTimeout(() => {
          entry.target.classList.add('in');
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
        }, delay);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  subCards.forEach(c => subObserver.observe(c));

  // Add hover effects to sub-cards
  subCards.forEach(subCard => {
    // Add glow element
    const glow = document.createElement('span');
    glow.className = 'glow';
    glow.style.cssText = `
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: -1;
    `;
    subCard.appendChild(glow);

    // Hover effects
    subCard.addEventListener('mouseenter', () => {
      subCard.style.background = 'rgba(255, 255, 255, 0.15)';
      subCard.style.transform = 'translateY(-2px)';
      subCard.style.boxShadow = 'rgba(255, 255, 255, 0.2) 0px 15px 25px -8px, rgba(255, 255, 255, 0.25) 0px 25px 45px -14px';
      glow.style.opacity = '1';
    });

    subCard.addEventListener('mouseleave', () => {
      subCard.style.background = 'rgba(255, 255, 255, 0.1)';
      subCard.style.transform = 'translateY(0)';
      subCard.style.boxShadow = 'rgba(255, 255, 255, 0.1) 0px 10px 16px -8px, rgba(255, 255, 255, 0.15) 0px 20px 36px -14px';
      glow.style.opacity = '0';
    });
  });
});

// About section - sticky with text animation
document.addEventListener('DOMContentLoaded', function() {
  console.log('About section script starting...');
  const aboutSection = document.getElementById('about');
  console.log('About section found:', aboutSection);
  if (!aboutSection) {
    console.log('About section not found!');
    return;
  }
  
  const words = ['LEVEL', 'Creatives', 'Innovators', 'Visionaries', 'Architects', 'Storytellers'];
  const descriptions = [
    'A multi-service design agency that blends brand craft with technical execution—shipping websites, portals, and AI agents that create leverage.',
    'A team built with common interests and the love for marketing with understanding on what sells, creating campaigns that resonate and convert.',
    'We push boundaries and challenge conventions, developing cutting-edge solutions that set new standards in digital experience design.',
    'We see beyond the present, crafting strategic roadmaps and future-focused solutions that position brands for long-term success.',
    'We build the foundation of digital experiences, creating robust systems and scalable solutions that stand the test of time.',
    'We craft compelling narratives that connect brands with their audiences, turning complex ideas into engaging stories that inspire action.'
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
  
  const wordList = aboutSection.querySelector('.word-list');
  const wordItems = aboutSection.querySelectorAll('.word-item');
  const descriptionList = aboutSection.querySelector('.description-list');
  const descriptionItems = aboutSection.querySelectorAll('.description-item');
  
  function updateWordPosition() {
    const translateY = -currentWordIndex * 120; // 120px per word (taller)
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
  
  function handleWheel(e) {
    const rect = aboutSection.getBoundingClientRect();
    const isInView = rect.top <= 0 && rect.bottom > 0;
    
    // Only control scrolling if we're actually in the sticky part of the section
    // (not just passing through the tall section)
    const isInStickyArea = rect.top <= 0 && rect.top > -window.innerHeight;
    
    if (isInView && isInStickyArea) {
      const now = Date.now();
      const isAtFirstWord = currentWordIndex === 0;
      const isAtLastWord = currentWordIndex === words.length - 1;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      const isTryingToExit = (isAtFirstWord && isScrollingUp) || (isAtLastWord && isScrollingDown);
      
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
      }
      
      // Only prevent default if we're handling the word change
      // (variables already declared above)
      if (!((isAtFirstWord && isScrollingUp) || (isAtLastWord && isScrollingDown))) {
        e.preventDefault();
      }
    }
  }
  
  window.addEventListener('wheel', handleWheel, { passive: false });
});

// Selected work hover backgrounds - DISABLED TO STOP CONSOLE FLOODING

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


// Cache bust: 1759795340
