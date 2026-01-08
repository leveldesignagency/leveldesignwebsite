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
  // Check if mobile
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  // Fade out the original text
  const heroHeadline = document.getElementById('hero-headline');
  heroHeadline.style.transition = 'opacity 1s ease-in-out';
  heroHeadline.style.opacity = '0';
  
  // On mobile, keep Brand & Marketing image constant
  if (isMobile) {
    const brandingWrapper = document.querySelector('.hero-service-image-wrapper[data-service="Brand & Marketing"]');
    if (brandingWrapper) {
      brandingWrapper.classList.add('active');
    }
    // Hide all other images
    document.querySelectorAll('.hero-service-image-wrapper:not([data-service="Brand & Marketing"])').forEach(wrapper => {
      wrapper.classList.remove('active');
    });
  } else {
    // Desktop: hide all images when cycling starts
    document.querySelectorAll('.hero-service-image-wrapper').forEach(wrapper => {
      wrapper.classList.remove('active');
    });
  }
  
  // Start the service cycling immediately
  setTimeout(() => {
    showNextSlide();
  }, 1000);
}

function showNextSlide() {
  const heroInner = document.querySelector('.hero-inner');
  
  if (!isCycling) return;
  
  // Fade out current slide
  const currentSlide = heroInner.querySelector('.hero-slide');
  if (currentSlide) {
    currentSlide.classList.remove('active');
    
    // Hide service image wrapper for current service - fade out (desktop only)
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      const currentService = services[(currentSlideIndex - 1 + services.length) % services.length];
      const normalizedCurrentService = currentService.replace(/\n/g, ' ');
      const allImageWrappers = document.querySelectorAll('.hero-service-image-wrapper');
      allImageWrappers.forEach(wrapper => {
        const wrapperService = wrapper.getAttribute('data-service');
        if (wrapperService === normalizedCurrentService) {
          wrapper.classList.remove('active');
        }
      });
    }
    
    // Wait for fade out to complete, then create and show next slide
    setTimeout(() => {
      if (currentSlide.parentNode) {
        currentSlide.parentNode.removeChild(currentSlide);
      }
      
      // Create and show next slide after current one is completely gone
      const nextService = services[currentSlideIndex];
      const newSlide = createServiceSlide(nextService);
      heroInner.appendChild(newSlide);
      
      // Show service image wrapper for next service if it exists (desktop only)
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) {
        // Normalize service name for comparison (remove \n and compare)
        const normalizedNextService = nextService.replace(/\n/g, ' ');
        const allImageWrappers = document.querySelectorAll('.hero-service-image-wrapper');
        allImageWrappers.forEach(wrapper => {
          const wrapperService = wrapper.getAttribute('data-service');
          if (wrapperService === normalizedNextService) {
            setTimeout(() => {
              wrapper.classList.add('active');
            }, 200);
          } else {
            wrapper.classList.remove('active');
          }
        });
      }
      
      // Fade in after a brief delay
      setTimeout(() => {
        newSlide.classList.add('active');
      }, 100);
      
      // Move to next service
      currentSlideIndex = (currentSlideIndex + 1) % services.length;
      
      // Schedule next slide or return to initial text
      setTimeout(() => {
        if (isCycling) {
          // Continue cycling - loop constantly
          showNextSlide();
        }
      }, 5000); // Increased from 3000ms to 5000ms
    }, 1000);
  } else {
    // No current slide, create and show first slide
    const nextService = services[currentSlideIndex];
    const newSlide = createServiceSlide(nextService);
    heroInner.appendChild(newSlide);
    
    // Show service image wrapper for first service if it exists (desktop only)
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      // Normalize service name for comparison (remove \n and compare)
      const normalizedNextService = nextService.replace(/\n/g, ' ');
      const allImageWrappers = document.querySelectorAll('.hero-service-image-wrapper');
      allImageWrappers.forEach(wrapper => {
        const wrapperService = wrapper.getAttribute('data-service');
        if (wrapperService === normalizedNextService) {
          setTimeout(() => {
            wrapper.classList.add('active');
          }, 200);
        } else {
          wrapper.classList.remove('active');
        }
      });
    } else {
      // Mobile: keep Brand & Marketing image constant
      const brandingWrapper = document.querySelector('.hero-service-image-wrapper[data-service="Brand & Marketing"]');
      if (brandingWrapper) {
        brandingWrapper.classList.add('active');
      }
    }
    
    // Fade in
    setTimeout(() => {
      newSlide.classList.add('active');
    }, 100);
    
    // Move to next service
    currentSlideIndex = (currentSlideIndex + 1) % services.length;
    
    // Schedule next slide or return to initial text
    setTimeout(() => {
      if (isCycling) {
        // Continue cycling - loop constantly
        showNextSlide();
      }
    }, 5000); // Increased from 3000ms to 5000ms
  }
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
      }, 1300 + (index * 200)); // 1300ms initial delay + 200ms stagger between cards
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

cards.forEach(card => cardObserver.observe(card));

// Scroll animations for process steps
const processSteps = document.querySelectorAll('.steps li');
const processObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('animate-in');
      }, index * 150); // Stagger animation
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

processSteps.forEach(step => processObserver.observe(step));

// Scroll animations for review cards
const reviewCards = document.querySelectorAll('.review-card');
const reviewObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('animate-in');
      }, index * 200); // Stagger animation
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

reviewCards.forEach(card => reviewObserver.observe(card));

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

  // Only enable pointer tracking on devices with hover capability
  if (window.matchMedia('(hover: hover)').matches) {
    cards.forEach(card => {
      card.addEventListener('pointermove', cardUpdate);
      card.addEventListener('mousemove', cardUpdate); // Fallback for mouse events
    });
  }

  return () => {
    if (window.matchMedia('(hover: hover)').matches) {
      cards.forEach(card => {
        card.removeEventListener('pointermove', cardUpdate);
        card.removeEventListener('mousemove', cardUpdate);
      });
    }
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

// Parallax: subtle mouse parallax on hero layers (disabled on touch devices)
const parallax = document.querySelector('.hero-parallax');
if (parallax && window.matchMedia('(hover: hover)').matches) {
  const layers = parallax.querySelectorAll('.layer');
  window.addEventListener('mousemove', (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX / w - 0.5);
    const y = (e.clientY / h - 0.5);
    layers.forEach((layer, i) => {
      const depth = (i + 1) * 4; // small movement for elegance
      layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  }, { passive: true });
}

// Glowing canvas cursor trail (only on devices with hover capability)
const canvas = document.getElementById('cursor-canvas');
const heroCanvas = document.getElementById('hero-cursor-canvas');

// Only initialize canvas on devices with hover capability
const hasHover = window.matchMedia('(hover: hover)').matches;
let ctx, heroCtx;

if (hasHover && canvas && heroCanvas) {
  ctx = canvas.getContext('2d');
  heroCtx = heroCanvas.getContext('2d');
} else {
  // Hide canvas on touch devices
  if (canvas) canvas.style.display = 'none';
  if (heroCanvas) heroCanvas.style.display = 'none';
}

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
    if (e.targetTouches && e.targetTouches[0]) {
        updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
}, { passive: true });

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

if (hasHover) {
  setupCanvas();
  setupHeroCanvas();
  update(0);
  window.addEventListener("resize", () => {
      setupCanvas();
      setupHeroCanvas();
  });
}

function update(t) {
    // Only update canvas on devices with hover capability
    if (!hasHover || !ctx || !heroCtx || !canvas || !heroCanvas) {
        return;
    }
    
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
    image: "public/__apx.png"
  },
  {
    id: 2,
    title: "ONTIMELY - DESKTOP APP, MOBILE APP, BACKEND AND PORTAL",
    year: "2024",
    image: "public/__ontimely.png"
  },
  {
    id: 3,
    title: "RICHTONS - BRANDING",
    year: "2024",
    image: "public/__richtons.png"
  },
  {
    id: 4,
    title: "WOMBATS - SOCIAL MEDIA MANAGEMENT",
    year: "2023",
    image: null
  },
  {
    id: 5,
    title: "HOSTELWORLD - CAMPAIGINS",
    year: "2023",
    image: null
  },
  {
    id: 6,
    title: "PERSONAL BRANDS",
    year: "2024",
    image: "public/work/PERSONAL BRANDS.png"
  },
  {
    id: 7,
    title: "LUKIS TECHNOLOGIES",
    year: "2023",
    image: "public/__lukis.png"
  }
];

// Initialize projects section
function initProjectsSection() {
  const projectsContainer = document.querySelector('.projects-container');
  
  if (!projectsContainer) return;
  
  // Render projects
  renderProjects(projectsContainer);
  
  // Initialize scroll animations
  initScrollAnimations();
}

// Render project items with alternating layout
function renderProjects(container) {
  projects.forEach((project, index) => {
    const projectItem = document.createElement('div');
    projectItem.classList.add('project-item');
    projectItem.dataset.id = project.id;
    
    // Alternate left/right: even indices (0, 2, 4) = image left, odd (1, 3, 5) = image right
    const isImageLeft = index % 2 === 0;
    projectItem.classList.add(isImageLeft ? 'image-left' : 'image-right');
    
    const imageHTML = project.image 
      ? `<div class="project-image"><img src="${project.image}" alt="${project.title}" loading="lazy"></div>`
      : `<div class="project-image placeholder"></div>`;
    
    const textHTML = `
      <div class="project-content">
        <div class="project-year">${project.year}</div>
        <div class="project-title">${project.title}</div>
      </div>
    `;
    
    if (isImageLeft) {
      projectItem.innerHTML = imageHTML + textHTML;
    } else {
      projectItem.innerHTML = textHTML + imageHTML;
    }

    container.appendChild(projectItem);
  });
}

// Initialize scroll animations for project items
function initScrollAnimations() {
  const projectItems = document.querySelectorAll('.project-item');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  projectItems.forEach((item) => {
    observer.observe(item);
  });
}

// Initialize projects section when DOM is loaded
document.addEventListener('DOMContentLoaded', initProjectsSection);

// Bullet points are now integrated directly into the main cards - no separate sub-cards needed

// CLIENT LOGOS MARQUEE INTERACTIONS
document.addEventListener('DOMContentLoaded', function() {
  const marqueeRows = document.querySelectorAll('.marquee-row');
  const clientLogos = document.querySelectorAll('.client-logo');
  
  if (!marqueeRows.length || !clientLogos.length) return;
  
  // Client logo hover effects
  clientLogos.forEach((logo, index) => {
    logo.addEventListener('mouseenter', () => {
      // Pause the marquee when hovering over a logo
      const parentRow = logo.closest('.marquee-row');
      if (parentRow) {
        const track = parentRow.querySelector('.marquee-track');
        if (track) {
          track.style.animationPlayState = 'paused';
        }
      }
    });
    
    logo.addEventListener('mouseleave', () => {
      // Resume the marquee when leaving a logo
      const parentRow = logo.closest('.marquee-row');
      if (parentRow) {
        const track = parentRow.querySelector('.marquee-track');
        if (track) {
          track.style.animationPlayState = 'running';
        }
      }
    });
    
    // Click interaction with ripple effect
    logo.addEventListener('click', () => {
      // Add ripple effect
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 45, 45, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
      `;
      
      logo.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        width: 200px;
        height: 200px;
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Intersection observer for animation triggers
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Start marquee animations
        marqueeRows.forEach((row, index) => {
          const track = row.querySelector('.marquee-track');
          if (track) {
            track.style.animationPlayState = 'running';
          }
        });
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(document.querySelector('.clients'));
  
  // Dynamic speed adjustment based on content
  function adjustMarqueeSpeed() {
    marqueeRows.forEach(row => {
      const track = row.querySelector('.marquee-track');
      if (track) {
        const items = track.querySelectorAll('.client-logo');
        const totalWidth = items.length * 420; // 300px width + 120px margin
        const speed = totalWidth / 30; // 30 seconds duration
        
        // Adjust animation duration based on content
        track.style.animationDuration = `${30}s`;
      }
    });
  }
  
  adjustMarqueeSpeed();
  
  // Recalculate on resize
  window.addEventListener('resize', adjustMarqueeSpeed);
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
