(function () {
  var media = window.pyreMedia || { allowBackgroundVideo: function () { return true; } };
  var videos = document.querySelectorAll('[data-lazy-video]');
  if (!videos.length) return;

  function unloadVideo(video) {
    video.pause();
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(function (source) {
      source.remove();
    });
    video.load();
    video.dataset.lazyLoaded = 'false';
  }

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

  if (!media.allowBackgroundVideo()) {
    videos.forEach(function (video) {
      video.removeAttribute('data-lazy-video');
    });
    return;
  }

  function scheduleInit(fn) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(fn, { timeout: 2000 });
      return;
    }

    window.setTimeout(fn, 0);
  }

  scheduleInit(function () {
    if (!('IntersectionObserver' in window)) {
      videos.forEach(loadVideo);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            loadVideo(entry.target);
            observer.unobserve(entry.target);
            return;
          }

          if (entry.target.dataset.lazyLoaded === 'true') {
            unloadVideo(entry.target);
          }
        });
      },
      { rootMargin: '120px' }
    );

    videos.forEach(function (video) {
      observer.observe(video);
    });
  });
})();
