(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.getElementById('site-nav');

  if (!header || !toggle || !mobileNav) return;

  function setNavOpen(isOpen) {
    header.classList.toggle('is-nav-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');

    if (isOpen) {
      mobileNav.removeAttribute('hidden');
      document.body.classList.add('nav-open');
    } else {
      mobileNav.setAttribute('hidden', '');
      document.body.classList.remove('nav-open');
    }
  }

  toggle.addEventListener('click', function () {
    setNavOpen(!header.classList.contains('is-nav-open'));
  });

  mobileNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setNavOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && header.classList.contains('is-nav-open')) {
      setNavOpen(false);
    }
  });

  window.addEventListener('resize', function () {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setNavOpen(false);
    }
  });
})();
