/**
 * "Where we go deep" — full-bleed services image carousel.
 */
(function () {
  'use strict';

  const servicesImages = [
    'public/Projects/services/LEVEL _SERVICES-01.png',
    'public/Projects/services/LEVEL _SERVICES-02.png',
    'public/Projects/services/LEVEL _SERVICES-03.png',
    'public/Projects/services/LEVEL _SERVICES-04.png',
    'public/Projects/services/LEVEL _SERVICES-05.png',
    'public/Projects/services/LEVEL _SERVICES-06.png',
  ];

  function renderServicesImages(container) {
    let slider = container.querySelector('.services-slider');
    if (!slider) {
      slider = document.createElement('div');
      slider.classList.add('services-slider');
      container.appendChild(slider);
    }

    slider.innerHTML = '';

    servicesImages.forEach((imagePath, index) => {
      const slide = document.createElement('div');
      slide.classList.add('service-slide');
      slide.dataset.index = String(index);

      const serviceItem = document.createElement('div');
      serviceItem.classList.add('service-item');
      serviceItem.dataset.id = `service-${index + 1}`;
      serviceItem.dataset.index = String(index);

      const filename = imagePath
        .split('/')
        .pop()
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ');
      const altText = filename
        ? `${filename} — LEVEL Design Agency`
        : `Service ${index + 1} — LEVEL Design Agency`;

      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = altText;
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';

      img.onerror = () => {
        img.parentElement?.classList.add('placeholder');
      };

      const imageDiv = document.createElement('div');
      imageDiv.classList.add('service-image');
      imageDiv.appendChild(img);

      serviceItem.appendChild(imageDiv);
      slide.appendChild(serviceItem);
      slider.appendChild(slide);
    });

    const firstSlide = slider.firstElementChild;
    if (firstSlide) {
      slider.appendChild(firstSlide.cloneNode(true));
    }

    const slides = slider.querySelectorAll('.service-slide');
    if (typeof window.LEVEL_observeRevealTargets === 'function') {
      window.LEVEL_observeRevealTargets(slides);
    }
  }

  function initServicesGallery() {
    const servicesContainer = document.querySelector('.services-container');
    if (!servicesContainer) return;

    renderServicesImages(servicesContainer);

    const slider = servicesContainer.querySelector('.services-slider');
    if (!slider) return;

    const actualSlides = servicesImages.length;
    if (!actualSlides) return;

    let currentSlide = 0;
    const interval = 5000;
    let timerId = null;

    const move = () => {
      slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
    };

    const slide = () => {
      currentSlide += 1;

      if (currentSlide >= actualSlides) {
        slider.style.transition = 'none';
        currentSlide = 0;
        move();
        requestAnimationFrame(() => {
          slider.style.transition = '';
        });
      } else {
        move();
      }
    };

    const start = () => {
      if (timerId) return;
      move();
      timerId = window.setInterval(slide, interval);
    };

    const stop = () => {
      if (!timerId) return;
      window.clearInterval(timerId);
      timerId = null;
    };

    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      move();
      return;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) start();
            else stop();
          });
        },
        { threshold: 0.15 }
      );
      io.observe(servicesContainer);
    } else {
      start();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesGallery);
  } else {
    initServicesGallery();
  }
})();
