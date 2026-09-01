(function () {
  function setPreviewImage(img, src, fallback, onMissing) {
    if (!img || !src) {
      if (onMissing) onMissing();
      return;
    }

    img.onload = function () {
      img.classList.remove('modal-preview__image--missing');
    };

    img.onerror = function () {
      if (fallback) {
        img.onerror = function () {
          img.classList.add('modal-preview__image--missing');
          if (onMissing) onMissing();
        };
        img.src = fallback;
        return;
      }

      img.classList.add('modal-preview__image--missing');
      if (onMissing) onMissing();
    };

    img.src = src;
  }

  function populateModal(card) {
    var titleEl = document.getElementById('modal-title');
    var challengeEl = document.getElementById('modal-challenge');
    var solutionEl = document.getElementById('modal-solution');
    var heroImageEl = document.getElementById('modal-hero-image');
    var mobileImageEl = document.getElementById('modal-mobile-image');
    var mobileWrap = document.getElementById('modal-mobile-wrap');
    var visitLink = document.getElementById('modal-visit-link');

    if (!card || !titleEl || !challengeEl || !solutionEl || !heroImageEl || !visitLink) {
      return;
    }

    var title = card.getAttribute('data-project-title') || '';
    var challenge = card.getAttribute('data-project-challenge') || '';
    var solution = card.getAttribute('data-project-solution') || '';
    var desktopImage =
      card.getAttribute('data-project-image-desktop') ||
      card.getAttribute('data-project-image') ||
      '';
    var mobileImage = card.getAttribute('data-project-image-mobile') || '';
    var fallback = card.getAttribute('data-project-image-fallback') || '';
    var url = card.getAttribute('data-project-url') || '#';

    titleEl.textContent = title;
    challengeEl.textContent = challenge;
    solutionEl.textContent = solution;
    visitLink.href = url;
    visitLink.setAttribute('aria-label', 'Visitar website de ' + title);

    if (mobileWrap) {
      mobileWrap.hidden = true;
    }

    setPreviewImage(heroImageEl, desktopImage, fallback);
    heroImageEl.alt = 'Pré-visualização desktop de ' + title;

    if (mobileImageEl && mobileImage && mobileWrap) {
      mobileWrap.hidden = true;
      mobileImageEl.onload = function () {
        mobileWrap.hidden = false;
      };
      mobileImageEl.onerror = function () {
        mobileWrap.hidden = true;
      };
      mobileImageEl.alt = 'Pré-visualização mobile de ' + title;
      mobileImageEl.src = mobileImage;
    }
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
    if (event.key !== 'Escape') return;
    var activeOverlay = document.querySelector('.modal-overlay.active');
    if (activeOverlay) closeModal(activeOverlay);
  });
})();
