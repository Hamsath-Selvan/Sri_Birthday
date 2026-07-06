// WhatsApp fab: reveal after gift videos, scroll to the story section
// on click, and hide itself once the story section is reached.
(function () {
  const fab = document.getElementById('waFab');
  const target = document.getElementById('storySection');
  if (!fab || !target) return;

  // Exposed globally so the gift-modal script can call this once
  // both wishes have finished playing.
  window.__revealWaFab = function () {
    fab.classList.add('show');
  };

  fab.addEventListener('click', () => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Keep the fab visible until the visitor actually starts scrolling
  // into the story section, then fade it out of the way.
  const hideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fab.classList.remove('show');
        }
      });
    },
    { threshold: 0.05 }
  );
  hideObserver.observe(target);
})();
