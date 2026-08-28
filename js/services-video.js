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
    if (!canPlayVideo(video)) return;

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
  });

  plans.addEventListener('mouseleave', function () {
    hideAllVideos();
  });
})();
