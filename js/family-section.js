// Fades + lifts each .life-card into view the first time it's scrolled
// past, on top of whatever parallax.js is already doing to it.
// Add class="reveal-on-scroll" to any element you want this treatment on.
(function () {
  const targets = document.querySelectorAll('.reveal-on-scroll');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  targets.forEach((el) => observer.observe(el));
})();
