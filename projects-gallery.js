(function () {
  'use strict';

  const WILD_BASE = 'public/Projects/Into the wild/';

  function wildImage(filename) {
    return `${WILD_BASE}${encodeURIComponent(filename)}`;
  }

  const projects = [
    {
      title: 'Web and Mobile App Development',
      type: 'Digital products',
      image: wildImage('__Web and Mobile App Development.png'),
      span: 'standard',
    },
    {
      title: 'Chrome Extensions',
      type: 'Browser tools',
      image: wildImage('Chrome Extensions .png'),
      span: 'standard',
    },
    {
      title: 'Print Media',
      type: 'Physical touchpoints',
      image: wildImage('POP UP BANNER DEMO (1).jpg'),
      span: 'standard',
    },
    {
      title: 'Graphic Design',
      type: 'Visual communication',
      image: wildImage('Graphic Design.png'),
      span: 'standard',
    },
    {
      title: 'Event Design',
      type: 'Campaign creative',
      image: wildImage('Event_Posters_23_Beer Tasting.png'),
      span: 'standard',
    },
    {
      title: 'Brand Collateral',
      type: 'Brochures & print',
      image: wildImage('paramount brochure mockup.png'),
      span: 'standard',
    },
    {
      title: 'AI Systems',
      type: 'Intelligent platforms',
      image: wildImage('Ai Systems.png'),
      span: 'feature',
    },
    {
      title: 'Brand Identity',
      type: 'Identity systems',
      image: wildImage('Brand Identity.png'),
      span: 'feature',
    },
    {
      title: 'Social Media Management',
      type: 'Content & channels',
      image: wildImage('Social Media Management 1.png'),
      span: 'feature',
    },
  ];

  function renderProjects(container) {
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'projects-curated-grid';

    projects.forEach((project) => {
      const card = document.createElement('article');
      card.className = `project-curated-card project-curated-card--${project.span}`;

      const image = document.createElement('img');
      image.src = project.image;
      image.alt = `${project.title} — ${project.type}`;
      image.loading = 'lazy';
      image.decoding = 'async';

      const meta = document.createElement('div');
      meta.className = 'project-curated-meta';

      const title = document.createElement('h3');
      title.textContent = project.title;

      const type = document.createElement('p');
      type.textContent = project.type;

      meta.append(title, type);
      card.append(image, meta);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function initProjectsSection() {
    const projectsContainer = document.querySelector('.projects-container');
    const projectsMobileContainer = document.querySelector('.projects-mobile-container');
    const projectsSection = document.querySelector('#projects');
    const projectsMobileSection = document.querySelector('#projects-mobile');

    if (projectsContainer) {
      renderProjects(projectsContainer);
      projectsSection?.classList.add('projects-ready');
    }

    if (projectsMobileContainer) {
      renderProjects(projectsMobileContainer);
      projectsMobileSection?.classList.add('projects-ready');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsSection);
  } else {
    initProjectsSection();
  }
})();
