(function () {
  var filterBar = document.querySelector('[data-portfolio-filter]');
  var grid = document.getElementById('portfolio-grid');
  var emptyState = document.getElementById('portfolio-empty');

  if (!filterBar || !grid) return;

  var buttons = filterBar.querySelectorAll('[data-filter]');
  var cards = grid.querySelectorAll('[data-category]');

  function setActiveButton(activeButton) {
    buttons.forEach(function (button) {
      var isActive = button === activeButton;
      button.classList.toggle('filter-btn--active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function applyFilter(filter) {
    var visibleCount = 0;

    cards.forEach(function (card) {
      var category = card.getAttribute('data-category');
      var show = filter === 'all' || category === filter;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  function bindFilterEvents() {
    filterBar.addEventListener('click', function (event) {
      var button = event.target.closest('[data-filter]');
      if (!button || !filterBar.contains(button)) return;

      var filter = button.getAttribute('data-filter');
      if (!filter) return;

      setActiveButton(button);
      applyFilter(filter);
    });

    applyFilter('all');
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(bindFilterEvents, { timeout: 1500 });
  } else {
    bindFilterEvents();
  }
})();
