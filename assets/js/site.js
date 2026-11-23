(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header hairline appears once the page scrolls.
  var header = document.querySelector('.site-header');
  var progress = document.querySelector('.progress');
  var story = document.querySelector('.story');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    if (progress && story) {
      var r = story.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var p = Math.min(1, Math.max(0, -r.top / (total > 0 ? total : 1)));
      progress.style.transform = 'scaleX(' + p + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Mobile menu.
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      }
    });
  }

  // Home hero: pointing at a story title brings its photograph forward.
  var stage = document.querySelector('.hero-stage');
  if (stage) {
    var links = document.querySelectorAll('.hero-list a');
    var show = function (slug) {
      stage.querySelectorAll('img').forEach(function (img) {
        img.classList.toggle('on', img.dataset.story === slug);
      });
      links.forEach(function (a) { a.classList.toggle('active', a.dataset.story === slug); });
    };
    links.forEach(function (a) {
      a.addEventListener('mouseenter', function () { show(a.dataset.story); });
      a.addEventListener('focus', function () { show(a.dataset.story); });
    });
  }

  // Story pictures unveil as they come into view.
  var figs = document.querySelectorAll('.story-figure');
  if (reduce || !('IntersectionObserver' in window)) {
    figs.forEach(function (f) { f.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    figs.forEach(function (f) { io.observe(f); });
  }

  // Discourage casual saving of the artwork (right-click, drag, long-press).
  document.addEventListener('contextmenu', function (e) {
    if (e.target.closest('img, figure, .media, .bag, .hero-stage')) e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
  document.querySelectorAll('img').forEach(function (img) { img.setAttribute('draggable', 'false'); });
})();
