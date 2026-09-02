(function () {
  var videos = document.querySelectorAll('[data-lazy-video]');
  if (!videos.length) return;

  function loadVideo(video) {
    if (video.dataset.lazyLoaded === 'true') return;

    var src = video.getAttribute('data-lazy-video');
    if (!src) return;

    var source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }

    video.dataset.lazyLoaded = 'true';
  }

  if (!('IntersectionObserver' in window)) {
    videos.forEach(loadVideo);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        loadVideo(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '120px' }
  );

  videos.forEach(function (video) {
    observer.observe(video);
  });
})();
