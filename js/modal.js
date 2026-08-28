(function () {
  function openModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
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
      openModal(openTrigger.getAttribute('data-modal-open'));
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
