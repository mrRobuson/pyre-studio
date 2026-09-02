(function () {
  var TRANSITION_MS = 500;
  var plans = document.querySelector('[data-service-plans]');

  if (!plans) return;

  var media = window.pyreMedia || { allowBackgroundVideo: function () { return true; } };
  var backdrop = plans.querySelector('.service-plans__backdrop');
  var videos = plans.querySelectorAll('[data-service-video]');
  var cards = plans.querySelectorAll('[data-service-plan]');
  var posterEl = backdrop ? backdrop.querySelector('.service-plans__poster') : null;
  var activeVideo = null;
  var activePlanId = '';

  var PLAN_POSTERS = {
    faisca: {
      webp: 'assets/images/service-faisca.webp',
      jpg: 'assets/images/service-faisca.jpg'
    },
    chama: {
      webp: 'assets/images/service-chama.webp',
      jpg: 'assets/images/service-chama.jpg'
    },
    forja: {
      webp: 'assets/images/service-forja.webp',
      jpg: 'assets/images/service-forja.jpg'
    }
  };

  function scheduleInit(fn) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(fn, { timeout: 1500 });
      return;
    }

    window.setTimeout(fn, 0);
  }

  function unloadVideo(video) {
    if (!video) return;

    video.classList.remove('service-plans__video--active');
    video.pause();
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(function (source) {
      source.remove();
    });
    video.load();
    video.dataset.sourceLoaded = 'false';
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

  function hidePoster() {
    if (!posterEl) return;
    posterEl.hidden = true;
    posterEl.removeAttribute('src');
  }

  function showPoster(planId) {
    if (!posterEl || !PLAN_POSTERS[planId]) return;

    var poster = PLAN_POSTERS[planId];
    posterEl.src = poster.webp;
    posterEl.dataset.fallback = poster.jpg;
    posterEl.onerror = function () {
      if (posterEl.src.indexOf('.webp') !== -1) {
        posterEl.src = poster.jpg;
      }
    };
    posterEl.hidden = false;
    activePlanId = planId;
  }

  function hideAll() {
    videos.forEach(unloadVideo);
    hidePoster();
    activeVideo = null;
    activePlanId = '';
  }

  function showVideo(video, planId) {
    if (!video) return;

    showPoster(planId);
    ensureVideoSource(video);

    if (!canPlayVideo(video)) {
      video.addEventListener(
        'loadedmetadata',
        function onMetadata() {
          video.removeEventListener('loadedmetadata', onMetadata);
          showVideo(video, planId);
        },
        { once: true }
      );
      return;
    }

    if (activeVideo && activeVideo !== video) {
      unloadVideo(activeVideo);
    }

    hidePoster();
    video.classList.add('service-plans__video--active');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        video.classList.remove('service-plans__video--active');
        showPoster(planId);
      });
    }

    activeVideo = video;
  }

  function onCardEnter(card) {
    var planId = card.getAttribute('data-service-plan');
    showVideo(getVideoForCard(card), planId);
  }

  function getVideoForCard(card) {
    var id = card.getAttribute('data-service-plan');
    return plans.querySelector('[data-service-video="' + id + '"]');
  }

  function enableStaticBackdrop() {
    plans.classList.add('service-plans--static-backdrop');
    videos.forEach(function (video) {
      video.remove();
    });
  }

  if (!media.allowBackgroundVideo()) {
    enableStaticBackdrop();
    return;
  }

  videos.forEach(function (video) {
    video.addEventListener('error', function () {
      unloadVideo(video);
      if (activePlanId) {
        showPoster(activePlanId);
      }
    });
  });

  scheduleInit(function () {
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        onCardEnter(card);
      });
    });

    plans.addEventListener('mouseleave', hideAll);
  });
})();
