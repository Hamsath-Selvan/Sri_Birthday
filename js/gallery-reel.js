// Photo gallery: pinned, scroll-driven horizontal reel.
// As the page scrolls through the tall .gallery-pin spacer, the sticky
// reel stays fixed on screen while the track itself is translated
// horizontally left→right. The card nearest the front of the reel gets
// the .active class and widens — this includes the gift box card, which
// is the final stop in the reel. No native scrollbar, no drag handlers —
// vertical scroll is the only input.
(function () {
  const pin = document.getElementById('galleryPin');
  const sticky = document.getElementById('gallerySticky');
  const track = document.getElementById('galleryTrack');
  if (!pin || !sticky || !track) return;

  // Every widening "stop" in the reel, in order — photo cards first,
  // gift box last, so the gift box gets the same widen treatment.
  const allCards = Array.from(track.children);

  // How much extra scroll distance to give the reel per card.
  // Larger = slower, more deliberate horizontal movement.
  const SCROLL_PER_CARD = 420;

  let maxX = 0;
  let awake = false;

  function sizePin() {
    const extra = allCards.length * SCROLL_PER_CARD;
    pin.style.height = `${window.innerHeight + extra}px`;
  }

  // Keep the horizontal travel distance in sync with the track's real
  // width, even as the active card grows wider mid-transition.
  const ro = new ResizeObserver(() => {
    maxX = Math.max(0, track.scrollWidth - sticky.clientWidth);
  });
  ro.observe(track);

  function update() {
    const rect = pin.getBoundingClientRect();
    const scrollable = pin.offsetHeight - window.innerHeight;
    let progress = scrollable > 0 ? -rect.top / scrollable : 0;
    progress = Math.min(1, Math.max(0, progress));

    // Wake the reel in (opacity) once it's actually being scrolled through
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView !== awake) {
      awake = inView;
      sticky.classList.toggle('awake', awake);
    }

    // Which card is "leading" right now — photo cards or the gift box
    const activeIdx = Math.min(allCards.length - 1, Math.floor(progress * allCards.length));
    allCards.forEach((card, i) => {
      card.classList.toggle('active', i === activeIdx);
    });

    track.style.transform = `translateX(-${progress * maxX}px)`;
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  function onResize() {
    sizePin();
    maxX = Math.max(0, track.scrollWidth - sticky.clientWidth);
    update();
  }

  sizePin();
  // Let layout settle, then take the first width measurement
  requestAnimationFrame(() => {
    maxX = Math.max(0, track.scrollWidth - sticky.clientWidth);
    update();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
})();
