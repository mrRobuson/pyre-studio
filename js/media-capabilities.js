(function () {
  var hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  window.pyreMedia = {
    hoverCapable: hoverQuery.matches,
    reducedMotion: motionQuery.matches,
    allowBackgroundVideo: function () {
      return this.hoverCapable && !this.reducedMotion;
    }
  };
})();
