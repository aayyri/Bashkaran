const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('#main-menu');
    const dropdown = document.querySelector('.nav-dropdown');
    const servicesToggle = document.querySelector('.services-toggle');
    const setServicesOpen = (open) => {
      dropdown.classList.toggle('is-expanded', open);
      servicesToggle.setAttribute('aria-expanded', String(open));
    };
    servicesToggle.addEventListener('click', () => setServicesOpen(servicesToggle.getAttribute('aria-expanded') !== 'true'));
    dropdown.addEventListener('mouseenter', () => {
      if (matchMedia('(min-width: 901px) and (hover: hover)').matches) setServicesOpen(true);
    });
    dropdown.addEventListener('mouseleave', () => {
      if (matchMedia('(min-width: 901px) and (hover: hover)').matches) setServicesOpen(false);
    });
    dropdown.addEventListener('focusout', (event) => {
      if (!dropdown.contains(event.relatedTarget)) setServicesOpen(false);
    });
    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) setServicesOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (dropdown.classList.contains('is-expanded')) servicesToggle.focus();
        setServicesOpen(false);
      }
    });

    menuToggle.addEventListener('click', () => {
      const isOpen = mainMenu.classList.toggle('is-open');
      if (!isOpen) setServicesOpen(false);
      document.body.classList.toggle('menu-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Menü schliessen' : 'Menü öffnen');
    });

    mainMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        setServicesOpen(false);
        mainMenu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Menü öffnen');
      }
    });

    document.querySelectorAll('.property-gallery-wrap').forEach((galleryWrap) => {
      const gallery = galleryWrap.querySelector('.property-gallery');
      const slides = gallery.querySelectorAll('.property-slide');

      const showSlide = (direction) => {
        const current = Math.round(gallery.scrollLeft / gallery.clientWidth);
        const next = (current + direction + slides.length) % slides.length;
        gallery.scrollTo({ left: next * gallery.clientWidth, behavior: 'smooth' });
      };

      galleryWrap.querySelector('.previous').addEventListener('click', () => showSlide(-1));
      galleryWrap.querySelector('.next').addEventListener('click', () => showSlide(1));
    });
