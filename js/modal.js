(function () {
  function populateModal(card) {
    var titleEl = document.getElementById('modal-title');
    var challengeEl = document.getElementById('modal-challenge');
    var solutionEl = document.getElementById('modal-solution');
    var imageEl = document.getElementById('modal-hero-image');
    var visitLink = document.getElementById('modal-visit-link');

    if (!card || !titleEl || !challengeEl || !solutionEl || !imageEl || !visitLink) {
      return;
    }

    var title = card.getAttribute('data-project-title') || '';
    var challenge = card.getAttribute('data-project-challenge') || '';
    var solution = card.getAttribute('data-project-solution') || '';
    var image = card.getAttribute('data-project-image') || '';
    var url = card.getAttribute('data-project-url') || '#';

    titleEl.textContent = title;
    challengeEl.textContent = challenge;
    solutionEl.textContent = solution;
    imageEl.src = image;
    imageEl.alt = 'Pré-visualização do projecto ' + title;
    visitLink.href = url;
    visitLink.setAttribute('aria-label', 'Visitar website de ' + title);
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
