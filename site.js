const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('#main-menu');

    menuToggle.addEventListener('click', () => {
      const isOpen = mainMenu.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Menü schliessen' : 'Menü öffnen');
    });

    mainMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
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
