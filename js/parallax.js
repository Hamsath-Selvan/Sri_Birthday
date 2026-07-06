// Every element with class="parallax" drifts vertically based on its
// distance from viewport center, scaled by its data-speed attribute.
// Works across all sections — header, family cards, timeline, etc.
(function () {
  const layers = Array.from(document.querySelectorAll('.parallax'));
  if (!layers.length) return;

  let ticking = false;

  function updateParallax() {
    const vh = window.innerHeight;
    const vCenter = vh / 2;

    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed) || 0;
      const rect = layer.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const offset = (vCenter - elCenter) * speed;
      layer.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateParallax();
})();
