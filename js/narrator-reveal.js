// Reveals the jackalope narrator + speech bubble once the section
// scrolls into view. Plays once (unobserves after triggering).
(function () {
  const section = document.getElementById('narrator-section');
  if (!section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add('in-view');
          observer.unobserve(section); // play once
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(section);
})();
