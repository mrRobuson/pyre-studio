(function () {
  var carouselState = {
    index: 0,
    items: []
  };

  function pauseCarouselVideos(container) {
    if (!container) return;
    container.querySelectorAll('video').forEach(function (video) {
      video.pause();
      video.currentTime = 0;
    });
  }

  function createSlide(item, title, index) {
    var slide = document.createElement('div');
    slide.className = 'modal-carousel__slide';
    slide.setAttribute('data-carousel-slide', String(index));

    if (item.type === 'video') {
      var video = document.createElement('video');
      video.className = 'modal-carousel__video';
      video.src = item.src;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      if (item.poster) {
        video.poster = item.poster;
      }
      video.setAttribute('aria-label', item.alt || 'Vídeo de ' + title);
      slide.appendChild(video);
      return slide;
    }

    var image = document.createElement('img');
    image.className = 'modal-carousel__image';
    image.src = item.src;
    image.alt = item.alt || title + ' — imagem ' + (index + 1);
    image.loading = 'lazy';
    image.decoding = 'async';
    slide.appendChild(image);
    return slide;
  }

  function renderCarousel(items, title) {
    var carousel = document.getElementById('modal-carousel');
    var track = document.getElementById('modal-carousel-track');
    var dots = document.getElementById('modal-carousel-dots');
    var counter = document.getElementById('modal-carousel-counter');
    var prevBtn = document.querySelector('[data-carousel-prev]');
    var nextBtn = document.querySelector('[data-carousel-next]');

    if (!carousel || !track || !dots) return;

    pauseCarouselVideos(track);
    track.innerHTML = '';
    dots.innerHTML = '';
    carouselState.items = items;
    carouselState.index = 0;

    items.forEach(function (item, index) {
      track.appendChild(createSlide(item, title, index));

      if (items.length > 1) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'modal-carousel__dot';
        dot.setAttribute('data-carousel-dot', String(index));
        dot.setAttribute('aria-label', 'Ir para mídia ' + (index + 1));
        dots.appendChild(dot);
      }
    });

    var hasMany = items.length > 1;
    carousel.hidden = items.length === 0;
    carousel.classList.toggle('modal-carousel--single', !hasMany);

    if (prevBtn) prevBtn.hidden = !hasMany;
    if (nextBtn) nextBtn.hidden = !hasMany;
    if (dots) dots.hidden = !hasMany;
    if (counter) counter.hidden = !hasMany;

    updateCarousel(title);
  }

  function updateCarousel(title) {
    var track = document.getElementById('modal-carousel-track');
    var dots = document.querySelectorAll('[data-carousel-dot]');
    var counter = document.getElementById('modal-carousel-counter');
    var total = carouselState.items.length;

    if (!track || total === 0) return;

    if (carouselState.index >= total) {
      carouselState.index = 0;
    }

    if (carouselState.index < 0) {
      carouselState.index = total - 1;
    }

    pauseCarouselVideos(track);
    track.style.transform = 'translateX(-' + carouselState.index * 100 + '%)';

    dots.forEach(function (dot, index) {
      var isActive = index === carouselState.index;
      dot.classList.toggle('modal-carousel__dot--active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    if (counter) {
      counter.textContent =
        carouselState.index + 1 + ' / ' + total + ' — ' + (title || 'Projecto');
    }
  }

  function goToSlide(index, title) {
    carouselState.index = index;
    updateCarousel(title);
  }

  function shiftSlide(delta, title) {
    goToSlide(carouselState.index + delta, title);
  }

  function parseMedia(card) {
    var projectId = card.getAttribute('data-project-id');
    if (projectId && window.PORTFOLIO_MEDIA && window.PORTFOLIO_MEDIA[projectId]) {
      return window.PORTFOLIO_MEDIA[projectId];
    }

    var raw = card.getAttribute('data-project-media');
    if (!raw) return [];

    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function populateModal(card) {
    var titleEl = document.getElementById('modal-title');
    var challengeEl = document.getElementById('modal-challenge');
    var solutionEl = document.getElementById('modal-solution');
    var extraWrap = document.getElementById('modal-extra-wrap');
    var extraEl = document.getElementById('modal-extra');
    var visitLink = document.getElementById('modal-visit-link');

    if (!card || !titleEl || !challengeEl || !solutionEl || !visitLink) {
      return;
    }

    var title = card.getAttribute('data-project-title') || '';
    var challenge = card.getAttribute('data-project-challenge') || '';
    var solution = card.getAttribute('data-project-solution') || '';
    var extra = card.getAttribute('data-project-extra') || '';
    var url = card.getAttribute('data-project-url') || '#';
    var media = parseMedia(card);

    titleEl.textContent = title;
    challengeEl.textContent = challenge;
    solutionEl.textContent = solution;
    visitLink.href = url;
    visitLink.setAttribute('aria-label', 'Visitar website de ' + title);

    if (extraWrap && extraEl) {
      extraWrap.hidden = !extra;
      extraEl.textContent = extra;
    }

    renderCarousel(media, title);
    card.setAttribute('data-carousel-title', title);
  }

  function openModal(id, card) {
    var overlay = document.getElementById(id);
    if (!overlay) return;

    if (card) {
      populateModal(card);
    }

    overlay.classList.add('active');
    document.body.classList.add('modal-active');
  }

  function closeModal(overlay) {
    var track = document.getElementById('modal-carousel-track');
    pauseCarouselVideos(track);
    overlay.classList.remove('active');
    document.body.classList.remove('modal-active');
  }

  document.addEventListener('click', function (event) {
    var openTrigger = event.target.closest('[data-modal-open]');
    if (openTrigger) {
      event.preventDefault();
      var card = openTrigger.closest('[data-project]');
      openModal(openTrigger.getAttribute('data-modal-open'), card);
      return;
    }

    var prevBtn = event.target.closest('[data-carousel-prev]');
    if (prevBtn) {
      var activeCard = document.querySelector('[data-project][data-carousel-title]');
      var title = activeCard ? activeCard.getAttribute('data-carousel-title') : '';
      shiftSlide(-1, title);
      return;
    }

    var nextBtn = event.target.closest('[data-carousel-next]');
    if (nextBtn) {
      var activeCardNext = document.querySelector('[data-project][data-carousel-title]');
      var titleNext = activeCardNext ? activeCardNext.getAttribute('data-carousel-title') : '';
      shiftSlide(1, titleNext);
      return;
    }

    var dot = event.target.closest('[data-carousel-dot]');
    if (dot) {
      var activeCardDot = document.querySelector('[data-project][data-carousel-title]');
      var titleDot = activeCardDot ? activeCardDot.getAttribute('data-carousel-title') : '';
      goToSlide(Number(dot.getAttribute('data-carousel-dot')), titleDot);
      return;
    }

    var closeTrigger = event.target.closest('[data-modal-close]');
    if (closeTrigger) {
      var closeOverlay = closeTrigger.closest('.modal-overlay');
      if (closeOverlay) closeModal(closeOverlay);
      return;
    }

    if (
      event.target.classList.contains('modal-overlay') &&
      event.target.classList.contains('active')
    ) {
      closeModal(event.target);
    }
  });

  document.addEventListener('keydown', function (event) {
    var activeOverlay = document.querySelector('.modal-overlay.active');
    if (!activeOverlay) return;

    if (event.key === 'Escape') {
      closeModal(activeOverlay);
      return;
    }

    var activeCard = document.querySelector('[data-project][data-carousel-title]');
    var title = activeCard ? activeCard.getAttribute('data-carousel-title') : '';

    if (event.key === 'ArrowLeft') {
      shiftSlide(-1, title);
    }

    if (event.key === 'ArrowRight') {
      shiftSlide(1, title);
    }
  });
})();
