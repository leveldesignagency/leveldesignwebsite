// Nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
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

// Auto Dark Mode based on local time zone
// Dark mode: 6 PM (18:00) to 6 AM (06:00)
// Light mode: 6 AM (06:00) to 6 PM (18:00)
function initDarkMode() {
  const now = new Date();
  const hour = now.getHours();
  
  // Dark mode between 6 PM (18:00) and 6 AM (06:00)
  const isDarkMode = hour >= 18 || hour < 6;
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark-mode');
  }
}

// Initialize dark mode on page load
initDarkMode();

// Update dark mode every minute to handle time changes
setInterval(initDarkMode, 60000);

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
let isMobile = window.matchMedia('(max-width: 768px)').matches;
let scrollBasedServiceIndex = 0;

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
  isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  // On mobile, keep the original headline visible and add service text below
  const heroHeadline = document.getElementById('hero-headline');
  if (!isMobile) {
    // Desktop: fade out original text
    heroHeadline.style.transition = 'opacity 1s ease-in-out';
    heroHeadline.style.opacity = '0';
  } else {
    // Mobile: keep original text visible
    heroHeadline.style.opacity = '1';
  }
  
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
    
    // On mobile, use scroll-based service changes instead of auto-cycling
    setupScrollBasedServices();
  } else {
    // Desktop: hide all images when cycling starts
    document.querySelectorAll('.hero-service-image-wrapper').forEach(wrapper => {
      wrapper.classList.remove('active');
    });
    
    // Start the service cycling immediately for desktop
    setTimeout(() => {
      showNextSlide();
    }, 1000);
  }
}

// Scroll-based service text changes for mobile - keep alternating
function setupScrollBasedServices() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;
  
  // Keep the auto-cycling but make it scroll-triggered
  let lastScrollY = window.scrollY;
  let scrollThreshold = 150; // Change service every 150px of scroll
  
  function updateServiceOnScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    if (Math.abs(scrollDelta) >= scrollThreshold) {
      scrollBasedServiceIndex = (scrollBasedServiceIndex + (scrollDelta > 0 ? 1 : -1) + services.length) % services.length;
      updateServiceSlide(scrollBasedServiceIndex);
      lastScrollY = currentScrollY;
    }
  }
  
  function updateServiceSlide(index) {
    const heroInner = document.querySelector('.hero-inner');
    if (!heroInner) return;
    
    // Remove existing slide
    const existingSlide = heroInner.querySelector('.hero-slide');
    if (existingSlide) {
      existingSlide.classList.remove('active');
      setTimeout(() => {
        if (existingSlide.parentNode) {
          existingSlide.parentNode.removeChild(existingSlide);
        }
      }, 300);
    }
    
    // Create and show new slide
    const service = services[index];
    const newSlide = createServiceSlide(service);
    heroInner.appendChild(newSlide);
    
    setTimeout(() => {
      newSlide.classList.add('active');
    }, 100);
  }
  
  // Initial service
  updateServiceSlide(0);
  
  // Update on scroll
  window.addEventListener('scroll', updateServiceOnScroll, { passive: true });
  
  // Also keep auto-cycling as backup
  setInterval(() => {
    if (window.scrollY < 500) { // Only auto-cycle if near top
      scrollBasedServiceIndex = (scrollBasedServiceIndex + 1) % services.length;
      updateServiceSlide(scrollBasedServiceIndex);
    }
  }, 4000);
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
  
  // Header fade handled by separate event listener
  
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

// Header fade handled by DOMContentLoaded listener above

// Scroll animations for all card sections
document.addEventListener('DOMContentLoaded', function() {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate-in');
        }, index * 50);
      }
    });
  }, { threshold: 0.1, rootMargin: '100px 0px 0px 0px' });

  // Observe all card types
  const cards = document.querySelectorAll('.card');
  const workCards = document.querySelectorAll('.work-card');
  const steps = document.querySelectorAll('.steps li');
  const reviewCards = document.querySelectorAll('.review-card');
  
  cards.forEach(card => cardObserver.observe(card));
  workCards.forEach(card => cardObserver.observe(card));
  steps.forEach(step => cardObserver.observe(step));
  reviewCards.forEach(card => cardObserver.observe(card));
});

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

// Cursor trail removed per design requirements

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

// Cursor trail and parallax removed per design requirements

// Projects Section - Dynamic image loading from folders
// Define all project images from folders (excluding services)
const projectFolders = {
  'commercial photography': [
    'public/Projects/commercial photography/20220515170316_IMG_2146.jpg',
    'public/Projects/commercial photography/20220515173923_IMG_2328 (1).JPG',
    'public/Projects/commercial photography/20220515174927_IMG_2412.jpg',
    'public/Projects/commercial photography/20220515184056_IMG_2570_edited.jpg',
    'public/Projects/commercial photography/IMG_1069.jpg',
    'public/Projects/commercial photography/IMG_1145.jpg',
    'public/Projects/commercial photography/IMG_1303 (1).jpg',
    'public/Projects/commercial photography/IMG_1499.jpg'
  ],
  'graphic design': [
    'public/Projects/graphic design/bc298ad2-d03a-485f-b161-76d37995eaa3.png',
    'public/Projects/graphic design/Beer Pong Tournament.jpg',
    'public/Projects/graphic design/Brochure_Final.png',
    'public/Projects/graphic design/COFFEE WEEK.png',
    'public/Projects/graphic design/Coffee_Dynamic2_edited.jpg',
    'public/Projects/graphic design/Event_Posters_23_Beer Pong.png',
    'public/Projects/graphic design/Event_Posters_23_Beer Tasting.png',
    'public/Projects/graphic design/Event_Posters_23_Comedy Night.png',
    'public/Projects/graphic design/Event_Posters_23_Cooking Night.png',
    'public/Projects/graphic design/Event_Posters_23_Flip Cup-13.png',
    'public/Projects/graphic design/Event_Posters_23_Flip Cup-27.png',
    'public/Projects/graphic design/Event_Posters_23_Flower Crown.png',
    'public/Projects/graphic design/Event_Posters_23_Karaoke Night.png',
    'public/Projects/graphic design/Event_Posters_23_Never Have I Ever-09.png',
    'public/Projects/graphic design/Event_Posters_23_Pub Quiz.png',
    'public/Projects/graphic design/Event_Posters_23_Quiz Evening Yellow.png',
    'public/Projects/graphic design/Event_Posters_23_Treasure Hunt.png',
    'public/Projects/graphic design/Event_Posters_23_Yogo.png',
    'public/Projects/graphic design/Events_23_long.jpg',
    'public/Projects/graphic design/HALLOWEEN.png',
    'public/Projects/graphic design/instagram post - grand jam tour.png',
    'public/Projects/graphic design/JOIN US FOR BREAKFAST.jpg',
    'public/Projects/graphic design/LETS GET WAVY - WAVES FESTIVAL DESIGN FOR PROMO.jpg',
    // Removed: 'public/Projects/graphic design/O zapft 20% jpg.jpg', - filename contains % causing HTTP2 errors
    'public/Projects/graphic design/OKTOBERFEST POSTER - IN HOUSE.jpg',
    'public/Projects/graphic design/paramount brochure mockup.png',
    'public/Projects/graphic design/POLYTECH BRANDED CONTENT.png',
    'public/Projects/graphic design/POLYTECH.png',
    'public/Projects/graphic design/POP UP BANNER DEMO.jpg',
    'public/Projects/graphic design/Rosetum Lodge_Booklet.jpg',
    'public/Projects/graphic design/Rosetum Lodge.jpg',
    'public/Projects/graphic design/Social Follow Wombat\'s.jpg',
    'public/Projects/graphic design/St Patricks Poster.jpg',
    'public/Projects/graphic design/time for a coffee vienna coffee festival_edited.jpg',
    'public/Projects/graphic design/Vienna Coffee Festival.jpg',
    'public/Projects/graphic design/WAVEBREAKER.png',
    'public/Projects/graphic design/WAVES FESTIVAL.jpg',
    'public/Projects/graphic design/WOMBEATS.png',
    'public/Projects/graphic design/WOMTOBERFEST .jpg',
    'public/Projects/graphic design/WOMTOBERFEST A4 - FOR PRINT - A4.jpg',
    'public/Projects/graphic design/WORLD TOURISM DAY 22.jpg'
  ],
  'movember': [
    'public/Projects/movember/BIRD.png',
    'public/Projects/movember/CAPTAIN HOOK.png',
    'public/Projects/movember/EVEREST.png',
    'public/Projects/movember/GENTLEMAN.png',
    'public/Projects/movember/HANGOVER.png',
    'public/Projects/movember/I TRIED.png',
    'public/Projects/movember/MOVEMBER.png'
  ],
  'promotions': [
    'public/Projects/promotions/ac3c0f_782e3a0351644b6e8cbd20484b21a42a~mv2.avif',
    'public/Projects/promotions/Acting_Headshots_Black.jpg',
    'public/Projects/promotions/Banner-01.png',
    'public/Projects/promotions/Banner-02.png',
    'public/Projects/promotions/Banner-04.png',
    'public/Projects/promotions/Branded Content Is still Important.jpg'
  ]
};

// Remove duplicates (files with (1) if base exists)
function removeDuplicates(imageArray) {
  const seen = new Set();
  const result = [];
  
  for (const image of imageArray) {
    // Remove (1) from filename for comparison
    const baseName = image.replace(/\s*\(1\)\s*/g, '');
    if (!seen.has(baseName)) {
      seen.add(baseName);
      result.push(image);
    }
  }
  
  return result;
}

// Distribute images proportionally from each folder
function buildProjectsArray() {
  const allImages = [];
  
  // Count total images per folder
  const folderCounts = {};
  for (const [folder, images] of Object.entries(projectFolders)) {
    const uniqueImages = removeDuplicates(images);
    folderCounts[folder] = uniqueImages.length;
    projectFolders[folder] = uniqueImages; // Update with deduplicated
  }
  
  const totalImages = Object.values(folderCounts).reduce((a, b) => a + b, 0);
  
  // Calculate how many to show from each (proportional, but ensure at least 1 from each)
  const maxPerFolder = Math.ceil(totalImages / Object.keys(folderCounts).length);
  
  // Interleave images from different folders
  const folderArrays = Object.entries(projectFolders).map(([folder, images]) => ({
    folder,
    images: [...images],
    index: 0
  }));
  
  let id = 1;
  while (folderArrays.some(f => f.index < f.images.length)) {
    // Round-robin through folders
    for (const folderData of folderArrays) {
      if (folderData.index < folderData.images.length) {
        allImages.push({
          id: id++,
          image: folderData.images[folderData.index],
          size: getRandomSize() // Varying sizes
        });
        folderData.index++;
      }
    }
  }
  
  return allImages;
}

// Generate random size classes for varying image heights
function getRandomSize() {
  const sizes = ['small', 'medium', 'large', 'xlarge'];
  const weights = [0.2, 0.3, 0.3, 0.2]; // Distribution
  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < sizes.length; i++) {
    sum += weights[i];
    if (rand <= sum) return sizes[i];
  }
  return 'medium';
}

const projects = buildProjectsArray();

// Initialize projects section
function initProjectsSection() {
  const projectsContainer = document.querySelector('.projects-container');
  const projectsSection = document.querySelector('#projects');
  
  if (!projectsContainer) {
    return;
  }
  
  console.log('Initializing projects section, projects count:', projects.length);
  
  // Render projects
  renderProjects(projectsContainer);
  
  // Force visibility
  if (projectsSection) {
    projectsSection.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important;';
  }
  projectsContainer.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
  
  // Force all project items visible
  setTimeout(() => {
    const projectItems = document.querySelectorAll('.project-item');
    console.log('Project items found:', projectItems.length);
    projectItems.forEach(item => {
      item.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important;';
    });
  }, 100);
  
  // Initialize auto-scroll
  initAutoScroll(projectsContainer);
}

// Auto-scroll function - slow continuous scrolling
function initAutoScroll(container) {
  if (!container) {
    return;
  }
  
  // Check if container already has auto-scroll initialized
  if (container.dataset.autoScrollInitialized === 'true') {
    return;
  }
  
  container.dataset.autoScrollInitialized = 'true';
  
  // Faster speed for projects section, normal for others
  const isProjectsContainer = container.classList.contains('projects-container');
  const isServicesContainer = container.classList.contains('services-container');
  let scrollSpeed = isProjectsContainer ? 3.0 : (isServicesContainer ? 1.5 : 1.5); // Same speed for services as projects
  let isScrolling = true;
  let animationFrame;
  
  function scroll() {
    if (!container) return;
    
    if (isScrolling) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      if (maxScroll <= 0) {
        // Container not wide enough to scroll, try again later
        setTimeout(() => {
          if (container && container.scrollWidth > container.clientWidth) {
            scroll();
          }
        }, 100);
        return;
      }
      
      if (container.scrollLeft >= maxScroll - 1) {
        // Reset to start when reaching the end
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      
      animationFrame = requestAnimationFrame(scroll);
    }
  }
  
  // Pause on hover
  container.addEventListener('mouseenter', () => {
    isScrolling = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
  
  container.addEventListener('mouseleave', () => {
    isScrolling = true;
    scroll();
  });
  
  // Start scrolling immediately
  scroll();
}

// Render project items - horizontal scroll gallery with varying sizes
function renderProjects(container) {
  projects.forEach((project, index) => {
    const projectItem = document.createElement('div');
    projectItem.classList.add('project-item');
    projectItem.classList.add(`project-size-${project.size || 'medium'}`);
    projectItem.dataset.id = project.id;
    projectItem.dataset.index = index;
    
    const imagePath = project.image;
    
    // Extract filename for descriptive alt text
    const filename = imagePath ? imagePath.split('/').pop().replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : '';
    const altText = filename ? `${filename} - Credit: LEVEL DESIGN AGENCY LTD` : `Project ${project.id} - Credit: LEVEL DESIGN AGENCY LTD`;
    
    const imageHTML = imagePath 
      ? `<div class="project-image"><img src="${imagePath}" alt="${altText}" loading="lazy" onerror="this.parentElement.classList.add('placeholder')"></div>`
      : `<div class="project-image placeholder"></div>`;
    
    projectItem.innerHTML = imageHTML;
    container.appendChild(projectItem);
  });
}

// Collage layout - no scroll lock needed
function initScrollAnimations() {
  // Disabled for collage layout - images scroll normally with page
  return;
}

// Initialize projects section when DOM is loaded
document.addEventListener('DOMContentLoaded', initProjectsSection);

// Services Gallery Section - COMPLETELY REBUILT TO MATCH PROJECTS EXACTLY
const servicesImages = [
  'public/Projects/services/LEVEL _SERVICES-01.png',
  'public/Projects/services/LEVEL _SERVICES-02.png',
  'public/Projects/services/LEVEL _SERVICES-03.png',
  'public/Projects/services/LEVEL _SERVICES-04.png',
  'public/Projects/services/LEVEL _SERVICES-05.png',
  'public/Projects/services/LEVEL _SERVICES-06.png'
];

// Render services images - EXACT COPY OF renderProjects
function renderServicesImages(container) {
  servicesImages.forEach((imagePath, index) => {
    const serviceItem = document.createElement('div');
    serviceItem.classList.add('service-item');
    serviceItem.dataset.id = `service-${index + 1}`;
    serviceItem.dataset.index = index;
    
    const filename = imagePath.split('/').pop().replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const altText = filename ? `${filename} - Credit: LEVEL DESIGN AGENCY LTD` : `Service ${index + 1} - Credit: LEVEL DESIGN AGENCY LTD`;
    
    const imageHTML = `<div class="service-image"><img src="${imagePath}" alt="${altText}" loading="lazy" onerror="this.parentElement.classList.add('placeholder')"></div>`;
    
    serviceItem.innerHTML = imageHTML;
    container.appendChild(serviceItem);
  });
}

// Initialize services gallery - EXACT COPY OF initProjectsSection
function initServicesGallery() {
  const servicesContainer = document.querySelector('.services-container');
  const servicesGallery = document.querySelector('#services-gallery');
  
  if (!servicesContainer) {
    return;
  }
  
  // Render services images
  renderServicesImages(servicesContainer);
  
  // Force visibility
  if (servicesGallery) {
    servicesGallery.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important;';
  }
  servicesContainer.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
  
  // Force all service items visible
  setTimeout(() => {
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
      item.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: flex !important;';
    });
  }, 100);
  
  // Initialize auto-scroll - USE SAME FUNCTION AS PROJECTS
  initAutoScroll(servicesContainer);
}

// Initialize services gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initServicesGallery);

// Bullet points are now integrated directly into the main cards - no separate sub-cards needed

// CLIENT LOGOS MARQUEE INTERACTIONS
document.addEventListener('DOMContentLoaded', function() {
  const marqueeRows = document.querySelectorAll('.marquee-row');
  const clientLogos = document.querySelectorAll('.client-logo');

  if (!marqueeRows.length || !clientLogos.length) return;
  
  // Set logo indices for staggered shimmer animation
  clientLogos.forEach((logo, index) => {
    logo.style.setProperty('--logo-index', index);
  });
  
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
