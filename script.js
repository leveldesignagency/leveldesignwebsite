// Custom Cursor - Design Company Crosshair (Immediate tracking, no lag)
document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;
  
  // Hide default cursor completely - apply to all elements
  const hideCursor = () => {
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    document.querySelectorAll('*').forEach(el => {
      el.style.cursor = 'none';
    });
  };
  hideCursor();
  
  // Re-apply on any new elements added
  const observer = new MutationObserver(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.style.cursor !== 'none') {
        el.style.cursor = 'none';
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Immediate tracking - no easing for perfect sync
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  
  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
  
  // Add hover effect on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .card, .work-card, .nav a, input, textarea, select, .back-to-top');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
});

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

// Smooth scroll for internal links - account for header height
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 Initializing smooth scroll handler...');
  
  // Handle all anchor link clicks - attach directly to links
  const allLinks = document.querySelectorAll('a[href^="#"]');
  console.log(`🔍 Found ${allLinks.length} anchor links with href starting with #`);
  
  if (allLinks.length === 0) {
    console.error('❌ No anchor links found!');
    return;
  }
  
  allLinks.forEach(function(link, index) {
    const href = link.getAttribute('href');
    console.log(`🔍 Link ${index + 1}: href="${href}"`, link);
    
    link.addEventListener('click', function(e) {
      console.log('🖱️ CLICK DETECTED on link:', this);
      console.log('🖱️ Event target:', e.target);
      console.log('🖱️ Current target:', e.currentTarget);
      
      const href = this.getAttribute('href');
      console.log('🖱️ Link href:', href);
      
      if (!href || href === '#') {
        console.log('⚠️ Invalid href, exiting');
        return;
      }
      
      const id = href.substring(1); // Remove the #
      console.log('🖱️ Target ID:', id);
      
      if (!id) {
        console.log('⚠️ No ID found, exiting');
        return;
      }
      
      const target = document.getElementById(id);
      console.log('🖱️ Target element:', target);
      
      if (!target) {
        console.error(`❌ Target element with id "${id}" not found`);
        return;
      }
      
      console.log('✅ Target found, preventing default and scrolling...');
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      
      // Get current scroll position BEFORE any calculations
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      console.log('📊 Current scroll position:', currentScroll);
      
      // Calculate scroll position - we want the top border of title section at position 0 (top of page)
      // Use getBoundingClientRect for more accurate position calculation
      const targetRect = target.getBoundingClientRect();
      const targetPosition = targetRect.top + currentScroll;
      
      // No header offset - top border should be at position 0 (top of page)
      console.log('📏 Target rect top (viewport):', targetRect.top);
      console.log('📏 Calculated scroll position (top of page):', targetPosition);
      
      // Custom smooth scroll using requestAnimationFrame (works regardless of CSS)
      const scrollPosition = Math.max(0, targetPosition);
      console.log('✅ Attempting to scroll to position:', scrollPosition);
      console.log('📊 Start position:', window.pageYOffset);
      console.log('📊 Distance to travel:', scrollPosition - (window.pageYOffset || 0));
      
      // Store animation ID so we can track it
      let animationId = null;
      let isScrolling = true;
      
      const startPosition = window.pageYOffset || document.documentElement.scrollTop;
      const distance = scrollPosition - startPosition;
      const duration = 800; // 800ms
      let startTime = null;
      
      function smoothScrollStep(currentTime) {
        if (!isScrolling) {
          console.log('⚠️ Scroll animation cancelled');
          return;
        }
        
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (easeInOutCubic)
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        const currentPosition = startPosition + (distance * ease);
        
        // Force scroll - use both methods
        window.scrollTo(0, currentPosition);
        document.documentElement.scrollTop = currentPosition;
        document.body.scrollTop = currentPosition;
        
        const actualPosition = window.pageYOffset || document.documentElement.scrollTop;
        console.log('📊 Progress:', Math.round(progress * 100) + '%', 'Target:', Math.round(currentPosition), 'Actual:', Math.round(actualPosition));
        
        if (progress < 1) {
          animationId = requestAnimationFrame(smoothScrollStep);
        } else {
          // Ensure we end at exact position
          window.scrollTo(0, scrollPosition);
          document.documentElement.scrollTop = scrollPosition;
          document.body.scrollTop = scrollPosition;
          const finalPos = window.pageYOffset || document.documentElement.scrollTop;
          console.log('✅ Smooth scroll completed. Final position:', finalPos);
          isScrolling = false;
        }
      }
      
      animationId = requestAnimationFrame(smoothScrollStep);
      
      // Safety check - if scroll doesn't complete in 1 second, force it
      setTimeout(() => {
        if (isScrolling) {
          console.log('⚠️ Scroll taking too long, forcing to position');
          isScrolling = false;
          window.scrollTo(0, scrollPosition);
          document.documentElement.scrollTop = scrollPosition;
          document.body.scrollTop = scrollPosition;
        }
      }, 1000);
      
      // Close mobile menu if open
      const navLinks = document.getElementById('nav-links');
      const navToggle = document.querySelector('.nav-toggle');
      if (navLinks && navLinks.classList.contains('open')) {
        console.log('📱 Closing mobile menu');
        navLinks.classList.remove('open');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
  
  console.log('✅ Smooth scroll handler initialized');
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
  
  // Apply to body and html
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
  "web design &\ndevelopment",
  "ariel drone\nphotography",
  "motion & graphic\ndesign",
  "social media\nmanagement",
  "videography\nservices",
  "software & app\ndevelopment"
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
  
  // On mobile, combine all words into single text for proper masking
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    // Single text element for proper background-clip masking
    const normalizedService = service.replace(/\n/g, ' ').toLowerCase();
    let imagePath = 'public/branding_white.png'; // default
    
    // Map services to their white image files
    if (normalizedService.includes('web design') || normalizedService.includes('development')) {
      imagePath = 'public/branding_white.png';
    } else if (normalizedService.includes('drone') || normalizedService.includes('photography')) {
      imagePath = 'public/drone_white.png';
    } else if (normalizedService.includes('social media')) {
      imagePath = 'public/SOCIAL MEDIA_WHITE.png';
    } else if (normalizedService.includes('videography')) {
      imagePath = 'public/videography services white.png';
    } else if (normalizedService.includes('motion') || normalizedService.includes('graphic')) {
      imagePath = 'public/branding_white.png'; // default for now
    } else if (normalizedService.includes('software') || normalizedService.includes('app')) {
      imagePath = 'public/branding_white.png'; // default for now
    }
    
    slide.innerHTML = `
      <div class="border-line"></div>
      <div class="text-content" style="background-image: url('${imagePath}');">
        ${lines.map(line => line.trim()).join(' ')}
      </div>
    `;
  } else {
    // Desktop: keep separate word divs
    slide.innerHTML = `
      <div class="border-line"></div>
      <div class="text-content">
        ${lines.map(line => `<div class="word">${line.trim()}</div>`).join('')}
      </div>
    `;
  }
  
  return slide;
}

function startServiceCycling() {
  // Check if mobile
  isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  // On mobile, fade out original headline after initial display, then show services
  const heroHeadline = document.getElementById('hero-headline');
  if (!isMobile) {
    // Desktop: fade out original text
    if (heroHeadline) {
      heroHeadline.style.transition = 'opacity 1s ease-in-out';
      heroHeadline.style.opacity = '0';
    }
  } else {
    // Mobile: fade out original text after 3 seconds, then show services in same position
    if (heroHeadline) {
      setTimeout(() => {
        heroHeadline.style.transition = 'opacity 1s ease-in-out';
        heroHeadline.style.opacity = '0';
      }, 3000);
    }
  }
  
  // On mobile, keep Brand & Marketing image constant
  if (isMobile) {
    const firstServiceWrapper = document.querySelector('.hero-service-image-wrapper[data-service="web design & development"]');
    if (firstServiceWrapper) {
      firstServiceWrapper.classList.add('active');
    }
    // Hide all other images
    document.querySelectorAll('.hero-service-image-wrapper:not([data-service="web design & development"])').forEach(wrapper => {
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
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Remove existing slide with fade out
    const existingSlide = heroSection.querySelector('.hero-slide');
    if (existingSlide) {
      existingSlide.style.opacity = '0';
      existingSlide.style.transition = 'opacity 0.5s ease-in-out';
      setTimeout(() => {
        if (existingSlide.parentNode) {
          existingSlide.parentNode.removeChild(existingSlide);
        }
      }, 500);
    }
    
    // Create and show new slide with fade in - positioned in same spot as headline
    const service = services[index];
    const newSlide = createServiceSlide(service);
    newSlide.style.opacity = '0';
    newSlide.style.transition = 'opacity 0.5s ease-in-out';
    heroSection.appendChild(newSlide); // Append directly to hero, not hero-inner
    
    // Fade in new slide
    setTimeout(() => {
      newSlide.style.opacity = '1';
    }, 50);
  }
  
  // Initial service - start after main title fades out
  setTimeout(() => {
    updateServiceSlide(0);
    
    // Auto-cycle services with fade in/out
    setInterval(() => {
      if (window.scrollY < 500) { // Only auto-cycle if near top
        scrollBasedServiceIndex = (scrollBasedServiceIndex + 1) % services.length;
        updateServiceSlide(scrollBasedServiceIndex);
      }
    }, 4000);
  }, 3500); // Start after main title fades (3s fade + 0.5s delay)
}

function showNextSlide() {
  const heroInner = document.querySelector('.hero-inner');
  
  if (!isCycling) return;
  
  // Slide out current slide (exit animation)
  const currentSlide = heroInner.querySelector('.hero-slide');
  if (currentSlide) {
    currentSlide.classList.remove('active');
    currentSlide.classList.add('exiting');
    
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
        
        // Hide hero images when leaving their respective services
        const allHeroImageWrappers = document.querySelectorAll('.hero-image-wrapper');
        allHeroImageWrappers.forEach(wrapper => {
          const wrapperService = wrapper.getAttribute('data-service');
          if (wrapperService && wrapperService.toLowerCase() === normalizedCurrentService.toLowerCase()) {
            // Capture current transform state before removing active
            const computedStyle = window.getComputedStyle(wrapper);
            const currentTransform = computedStyle.transform;
            if (currentTransform && currentTransform !== 'none') {
              // Extract translateX value from current transform
              const matrix = new DOMMatrix(currentTransform);
              const currentX = matrix.e; // translateX value
              // Apply current transform and continue sliding left while fading
              wrapper.style.transform = `translateY(-50%) translateX(${currentX}px)`;
            }
            wrapper.classList.remove('active');
            // Continue sliding left while fading out
            setTimeout(() => {
              wrapper.style.transform = 'translateY(-50%) translateX(-30px)';
              // Clear inline style after transition completes
              setTimeout(() => {
                wrapper.style.transform = '';
              }, 1000);
            }, 10);
          }
        });
      }
    
    // Wait for exit animation to complete (0.6s + 0.2s delay for last word), then create and show next slide
    setTimeout(() => {
      if (currentSlide.parentNode) {
        currentSlide.parentNode.removeChild(currentSlide);
      }
      
      // Create and show next slide after current one is completely gone
      const nextService = services[currentSlideIndex];
      const newSlide = createServiceSlide(nextService);
      heroInner.appendChild(newSlide);
      
      // Update mobile text background image based on service
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile && newSlide) {
        const textContent = newSlide.querySelector('.text-content');
        if (textContent) {
          const normalizedService = nextService.replace(/\n/g, ' ').toLowerCase();
          let imagePath = 'public/branding_white.png'; // default
          
          // Map services to their white image files
          if (normalizedService.includes('web design') || normalizedService.includes('development')) {
            imagePath = 'public/branding_white.png';
          } else if (normalizedService.includes('drone') || normalizedService.includes('photography')) {
            imagePath = 'public/drone_white.png';
          } else if (normalizedService.includes('social media')) {
            imagePath = 'public/SOCIAL MEDIA_WHITE.png';
          } else if (normalizedService.includes('videography')) {
            imagePath = 'public/videography services white.png';
          } else if (normalizedService.includes('motion') || normalizedService.includes('graphic')) {
            imagePath = 'public/branding_white.png'; // default for now
          } else if (normalizedService.includes('software') || normalizedService.includes('app')) {
            imagePath = 'public/branding_white.png'; // default for now
          }
          
          textContent.style.backgroundImage = `url('${imagePath}')`;
        }
      }
      
      // Show service image wrapper for next service if it exists (desktop only)
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
        
        // Sync hero images with their respective services
        const allHeroImageWrappers = document.querySelectorAll('.hero-image-wrapper');
        allHeroImageWrappers.forEach(wrapper => {
          const wrapperService = wrapper.getAttribute('data-service');
          if (wrapperService && wrapperService.toLowerCase() === normalizedNextService.toLowerCase()) {
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
    
    // Update mobile text background image based on service
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile && newSlide) {
      const textContent = newSlide.querySelector('.text-content');
      if (textContent) {
        const normalizedService = nextService.replace(/\n/g, ' ').toLowerCase();
        let imagePath = 'public/branding_white.png'; // default
        
        // Map services to their white image files
        if (normalizedService.includes('web design') || normalizedService.includes('development')) {
          imagePath = 'public/branding_white.png';
        } else if (normalizedService.includes('drone') || normalizedService.includes('photography')) {
          imagePath = 'public/drone_white.png';
        } else if (normalizedService.includes('social media')) {
          imagePath = 'public/SOCIAL MEDIA_WHITE.png';
        } else if (normalizedService.includes('videography')) {
          imagePath = 'public/videography services white.png';
        } else if (normalizedService.includes('motion') || normalizedService.includes('graphic')) {
          imagePath = 'public/branding_white.png'; // default for now
        } else if (normalizedService.includes('software') || normalizedService.includes('app')) {
          imagePath = 'public/branding_white.png'; // default for now
        }
        
        textContent.style.backgroundImage = `url('${imagePath}')`;
      }
    }
    
      // Show service image wrapper for first service if it exists (desktop only)
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
        
        // Sync hero images with their respective services
        const allHeroImageWrappers = document.querySelectorAll('.hero-image-wrapper');
        allHeroImageWrappers.forEach(wrapper => {
          const wrapperService = wrapper.getAttribute('data-service');
          if (wrapperService && wrapperService.toLowerCase() === normalizedNextService.toLowerCase()) {
            setTimeout(() => {
              wrapper.classList.add('active');
            }, 200);
          } else {
            wrapper.classList.remove('active');
          }
        });
      } else {
      // Mobile: keep first service (web design & development) image constant
      const firstServiceWrapper = document.querySelector('.hero-service-image-wrapper[data-service="web design & development"]');
      if (firstServiceWrapper) {
        firstServiceWrapper.classList.add('active');
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

// Removed heavy parallax effects for performance - was causing lag

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

// Pointer tracking for work cards - DISABLED
// All pointer tracking code removed

// Initialize pointer tracking for work cards - DISABLED
// document.addEventListener('DOMContentLoaded', () => {
//   setupWorkCardPointerTracking();
// });

// Cursor trail removed per design requirements

// Custom background - DISABLED to prevent color changes
// const customBackground = document.getElementById('custom-background');
// const workSection = document.querySelector('#work');

// function updateCustomBackground() {
//   if (!customBackground || !workSection) return;
//   
//   const workRect = workSection.getBoundingClientRect();
//   const workTop = workRect.top + window.scrollY;
//   const scrollY = window.scrollY;
//   
//   // Activate background when we reach the work section
//   if (scrollY >= workTop) {
//     customBackground.classList.add('active');
//   } else {
//     customBackground.classList.remove('active');
//   }
// }

// Custom background - DISABLED to prevent color changes on scroll
// window.addEventListener('scroll', throttledBackgroundUpdate, { passive: true });
// window.addEventListener('resize', throttledBackgroundUpdate, { passive: true });

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
  const projectsMobileContainer = document.querySelector('.projects-mobile-container');
  const projectsMobileSection = document.querySelector('#projects-mobile');
  
  // Initialize desktop projects
  if (projectsContainer) {
    // Render projects
    renderProjects(projectsContainer);
    
    // Force visibility
    if (projectsSection) {
      projectsSection.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important;';
    }
    projectsContainer.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
    
    // Force all project items visible
    setTimeout(() => {
      const projectItems = projectsContainer.querySelectorAll('.project-item');
      projectItems.forEach(item => {
        item.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important;';
      });
    }, 100);
    
    // Initialize auto-scroll after images load (desktop only)
    setTimeout(() => {
      const images = projectsContainer.querySelectorAll('img');
      let loaded = 0;
      const total = images.length;
      
      if (total === 0) {
        initAutoScroll(projectsContainer);
        return;
      }
      
      function checkAndStart() {
        loaded++;
        if (loaded === total) {
          initAutoScroll(projectsContainer);
        }
      }
      
      images.forEach((img) => {
        if (img.complete) {
          checkAndStart();
        } else {
          img.addEventListener('load', checkAndStart, { once: true });
          img.addEventListener('error', checkAndStart, { once: true });
        }
      });
    }, 300);
  }
  
  // Initialize mobile projects - ONLY on mobile devices
  if (projectsMobileContainer && window.innerWidth <= 768) {
    renderMobileProjects(projectsMobileContainer);
    
    if (projectsMobileSection) {
      projectsMobileSection.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important;';
    }
  } else if (projectsMobileContainer && window.innerWidth > 768) {
    // Hide mobile projects container on desktop
    if (projectsMobileSection) {
      projectsMobileSection.style.cssText = 'display: none !important; visibility: hidden !important;';
    }
  }
}

// Render mobile projects - FRESH START - Rearranged order with auto-scroll
function renderMobileProjects(container) {
  if (!container) return;
  
  container.innerHTML = '';
  
  // Rearrange projects - reverse order for different order
  const rearrangedProjects = [...projects].reverse();
  
  // Create a wrapper for seamless looping
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display: flex; flex-direction: row; gap: 16px; width: max-content;';
  
  // Render projects twice for seamless loop
  for (let loop = 0; loop < 2; loop++) {
    rearrangedProjects.forEach((project, index) => {
      const imagePath = project.image;
      if (!imagePath) return;
      
      const filename = imagePath.split('/').pop().replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const altText = filename ? `${filename} - Credit: LEVEL DESIGN AGENCY LTD` : `Project ${project.id} - Credit: LEVEL DESIGN AGENCY LTD`;
      
      const item = document.createElement('div');
      item.classList.add('projects-mobile-item');
      
      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = altText;
      img.loading = 'lazy';
      
      img.onerror = function() {
        this.style.display = 'none';
        item.style.display = 'none';
      };
      
      item.appendChild(img);
      wrapper.appendChild(item);
    });
  }
  
  container.appendChild(wrapper);
  
  // Auto-scroll animation
  let scrollPosition = 0;
  const scrollSpeed = 1.5; // pixels per frame (increased from 0.5 for faster scroll)
  const totalWidth = wrapper.offsetWidth / 2; // Half because we duplicated
  
  function autoScroll() {
    scrollPosition += scrollSpeed;
    if (scrollPosition >= totalWidth) {
      scrollPosition = 0; // Reset for seamless loop
    }
    container.scrollLeft = scrollPosition;
    requestAnimationFrame(autoScroll);
  }
  
  // Start auto-scroll after a brief delay
  setTimeout(() => {
    autoScroll();
  }, 500);
}

// Projects auto-scroll using Swiper for smooth continuous scroll
function initAutoScroll(container) {
  if (!container || !window.Swiper) return;
  
  if (container.dataset.autoScrollInitialized === 'true') return;
  container.dataset.autoScrollInitialized = 'true';
  
  const isProjectsContainer = container.classList.contains('projects-container');
  if (!isProjectsContainer) return;
  
  // DISABLE SWIPER ON MOBILE to prevent crashes - use simple scroll instead
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    // On mobile, just enable simple horizontal scroll - no Swiper
    container.style.overflowX = 'auto';
    container.style.overflowY = 'hidden';
    return; // Exit early, don't initialize Swiper
  }
  
  // Initialize Swiper for SMOOTH continuous marquee scroll - NO hover pause (DESKTOP ONLY)
  const swiper = new Swiper(container, {
    slidesPerView: 'auto',
    spaceBetween: 30,
    freeMode: false,
    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false, // NO pause on hover
      stopOnLastSlide: false,
    },
    loop: true,
    loopAdditionalSlides: 10,
    allowTouchMove: false,
    grabCursor: false,
    watchSlidesProgress: false,
    watchSlidesVisibility: false,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    effect: 'slide',
  });
  
  // Hover handlers for desktop only
  container.addEventListener('mouseenter', (e) => {
    e.stopPropagation();
    if (swiper && swiper.autoplay) {
      swiper.autoplay.start(); // Force continue on hover
    }
  });
  
  container.addEventListener('mouseleave', (e) => {
    e.stopPropagation();
    if (swiper && swiper.autoplay) {
      swiper.autoplay.start(); // Force continue on leave
    }
  });
}

// Render project items - horizontal scroll gallery with varying sizes
function renderProjects(container) {
  // Create Swiper wrapper if it doesn't exist
  let wrapper = container.querySelector('.swiper-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.classList.add('swiper-wrapper');
    container.appendChild(wrapper);
  }
  
  projects.forEach((project, index) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    
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
    slide.appendChild(projectItem);
    wrapper.appendChild(slide);
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

// Render services images - Simple slider (no Swiper) - Optimized for performance
function renderServicesImages(container) {
  // Create slider wrapper if it doesn't exist
  let slider = container.querySelector('.services-slider');
  if (!slider) {
    slider = document.createElement('div');
    slider.classList.add('services-slider');
    container.appendChild(slider);
  }
  
  // Clear existing content
  slider.innerHTML = '';
  
  // Create all slides
  servicesImages.forEach((imagePath, index) => {
    const slide = document.createElement('div');
    slide.classList.add('service-slide');
    slide.dataset.index = index;
    
    const serviceItem = document.createElement('div');
    serviceItem.classList.add('service-item');
    serviceItem.dataset.id = `service-${index + 1}`;
    serviceItem.dataset.index = index;
    
    const filename = imagePath.split('/').pop().replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const altText = filename ? `${filename} - Credit: LEVEL DESIGN AGENCY LTD` : `Service ${index + 1} - Credit: LEVEL DESIGN AGENCY LTD`;
    
    // Load all images - don't use lazy loading for slider
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = altText;
    img.loading = 'eager';
    img.decoding = 'async';
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = 'auto';
    
    img.onload = () => {
      console.log(`✅ Specialities image ${index + 1} loaded: ${imagePath}`);
    };
    img.onerror = (e) => {
      console.error(`❌ Specialities image ${index + 1} FAILED: ${imagePath}`, e);
      img.parentElement?.classList.add('placeholder');
    };
    
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('service-image');
    imageDiv.appendChild(img);
    
    serviceItem.appendChild(imageDiv);
    slide.appendChild(serviceItem);
    slider.appendChild(slide);
  });
  
  // Duplicate first slide at the end for seamless loop
  const firstSlide = slider.firstElementChild.cloneNode(true);
  slider.appendChild(firstSlide);
  
  console.log(`Total slides created: ${slider.children.length} (including duplicate for seamless loop)`);
}

// Simple auto-slide for specialities section - following the example pattern
function initServicesGallery() {
  const servicesContainer = document.querySelector('.services-container');
  if (!servicesContainer) {
    setTimeout(initServicesGallery, 100);
    return;
  }
  
  // Render images
  renderServicesImages(servicesContainer);
  
  setTimeout(() => {
    const slider = servicesContainer.querySelector('.services-slider');
    if (!slider) {
      console.error('Specialities: Slider not found');
      setTimeout(initServicesGallery, 200);
      return;
    }
    
    const slides = slider.querySelectorAll('.service-slide');
    console.log(`Specialities: Found ${slides.length} slides`);
    if (slides.length === 0) {
      console.error('Specialities: No slides found');
      setTimeout(initServicesGallery, 200);
      return;
    }
    
    // Transform value in viewport width units
    let currentSlide = 0;
    const actualSlides = 6; // 6 original slides (duplicate is 7th, not counted)
    const interval = 5000; // 5 seconds between slides
    
    // Function to move slider using viewport width units
    const move = () => {
      slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
    };
    
    // Function to slide forward - seamless infinite loop
    const slide = () => {
      currentSlide++;
      
      // When we reach the duplicate slide (slide 6), instantly jump back to 0
      if (currentSlide >= actualSlides) {
        // Remove transition for instant jump
        slider.style.transition = 'none';
        currentSlide = 0;
        move();
        // Force reflow
        requestAnimationFrame(() => {
          slider.style.transition = '';
        });
      } else {
        move();
      }
    };
    
    // Initialize position
    move();
    console.log(`Specialities slider initialized with ${actualSlides} slides`);
    
    // Start interval for auto-slide
    setInterval(slide, interval);
  }, 200);
}

// Initialize services gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initServicesGallery();
});


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
  
  // Client logo hover effects - REMOVED: No pause on hover, keep scrolling
  // Logos continue scrolling even when hovered
  
  clientLogos.forEach((logo, index) => {
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
    // Lock when section top reaches or passes viewport top AND section is still visible
    return rect.top <= 0 && rect.bottom > window.innerHeight;
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

// Pointer tracking for work cards - DISABLED
// All pointer tracking code removed

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
  const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Initialize: Hide all panels initially
  tabPanels.forEach(panel => {
    panel.classList.remove('active');
    panel.style.display = 'none';
    panel.style.height = '0';
    panel.style.opacity = '0';
  });
  
  // Function to load iframe only when tab is opened
  function loadIframe(panel) {
    const iframe = panel.querySelector('iframe[data-src]');
    const fallback = panel.querySelector('.iframe-fallback');
    
    if (iframe && !iframe.src) {
      const url = iframe.getAttribute('data-src');
      
      // List of known sites that block iframe embedding
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
      
      // Show and expand the target panel
      if (targetPanel) {
        // Load iframe when tab is opened
        loadIframe(targetPanel);
        
        // Set display first
        targetPanel.style.display = 'block';
        
        // Use requestAnimationFrame to ensure display is set before height transition
        requestAnimationFrame(() => {
          // Get the natural height of the content
          targetPanel.style.height = 'auto';
          const height = targetPanel.scrollHeight;
          targetPanel.style.height = '0';
          
          // Force reflow
          targetPanel.offsetHeight;
          
          // Animate to full height
          targetPanel.style.height = height + 'px';
          targetPanel.style.opacity = '1';
          
          // After transition, set to auto for responsive behavior
          setTimeout(() => {
            targetPanel.style.height = 'auto';
            targetPanel.classList.add('active');
          }, 400);
        });
      }
    });
  });
  
  // Auto-select Richtons tab on page load (desktop only)
  if (!isMobile && tabButtons.length > 0) {
    const richtonsButton = Array.from(tabButtons).find(btn => btn.getAttribute('data-tab') === 'richtons');
    if (richtonsButton) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        richtonsButton.click();
      }, 100);
    }
  }
  
  // Update on window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Re-check mobile status on resize if needed
      // The isMobile check happens on click, so this is mainly for future enhancements
    }, 250);
  });
});

// Contact Form Submission with EmailJS
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const formMessage = document.getElementById('form-message');
  
  if (contactForm) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS is not loaded. Please check that the EmailJS script is included in index.html');
      if (formMessage) {
        formMessage.textContent = 'Form service is not configured. Please contact us directly at help@leveldesignagency.com';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
      }
      return;
    }
    
    // Initialize EmailJS with your Public Key
    emailjs.init('YZEUywDpGdF8ypKDn');
    
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Disable submit button
      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';
      
      // Hide previous messages
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
      
      // Get form data
      const formData = {
        name: contactForm.querySelector('input[name="name"]').value,
        email: contactForm.querySelector('input[name="email"]').value,
        message: contactForm.querySelector('textarea[name="message"]').value
      };
      
      try {
        // Send email using EmailJS
        const SERVICE_ID = 'service_3y4my2r';
        const TEMPLATE_ID_TO_YOU = 'template_jnkhrvh'; // Email to you
        const TEMPLATE_ID_AUTO_REPLY = 'template_brnzty1'; // Auto-reply to customer
        
        // Send email to you
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID_TO_YOU,
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            reply_to: formData.email
          }
        );
        
        // Send auto-reply to customer
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID_AUTO_REPLY,
          {
            name: formData.name, // Use 'name' to match template variable {{name}}
            from_email: formData.email,
            email: formData.email, // Also send as 'email' in case template uses {{email}}
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
        console.error('EmailJS Error:', error);
        console.error('Error details:', error.text || error.message || error);
        
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
  }
});

// Cache bust: 1759795340
