(function () {
  var TRANSITION_MS = 500;
  var plans = document.querySelector('[data-service-plans]');

  if (!plans) return;

  var videos = plans.querySelectorAll('[data-service-video]');
  var cards = plans.querySelectorAll('[data-service-plan]');
  var activeVideo = null;

  function getVideoForCard(card) {
    var id = card.getAttribute('data-service-plan');
    return plans.querySelector('[data-service-video="' + id + '"]');
  }

  function ensureVideoSource(video) {
    if (!video || video.dataset.sourceLoaded === 'true') {
      return;
    }

    var src = video.getAttribute('data-video-src');
    if (!src) return;

    var source = document.createElement('source');
    source.src = src;
    var type = video.getAttribute('data-video-type');
    if (type) {
      source.type = type;
    }

    video.appendChild(source);
    video.load();
    video.dataset.sourceLoaded = 'true';
  }

  function canPlayVideo(video) {
    return video && !video.error && video.readyState >= HTMLMediaElement.HAVE_METADATA;
  }

  function pauseVideo(video) {
    if (!video) return;

    video.classList.remove('service-plans__video--active');
    window.setTimeout(function () {
      video.pause();
      video.currentTime = 0;
    }, TRANSITION_MS);
  }

  function showVideo(video) {
    if (!video) return;

    ensureVideoSource(video);

    if (!canPlayVideo(video)) {
      video.addEventListener(
        'loadedmetadata',
        function onMetadata() {
          video.removeEventListener('loadedmetadata', onMetadata);
          showVideo(video);
        },
        { once: true }
      );
      return;
    }

    if (activeVideo && activeVideo !== video) {
      activeVideo.classList.remove('service-plans__video--active');
      activeVideo.pause();
    }

    video.classList.add('service-plans__video--active');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        video.classList.remove('service-plans__video--active');
      });
    }

    activeVideo = video;
  }

  function hideAllVideos() {
    videos.forEach(pauseVideo);
    activeVideo = null;
  }

  videos.forEach(function (video) {
    video.addEventListener('error', function () {
      video.remove();
    });
  });

  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      showVideo(getVideoForCard(card));
    });

    card.addEventListener(
      'focusin',
      function () {
        showVideo(getVideoForCard(card));
      },
      true
    );
  });

  plans.addEventListener('mouseleave', function () {
    hideAllVideos();
  });
})();
