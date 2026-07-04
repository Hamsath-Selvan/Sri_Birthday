// Gift box: tap to open, plays birthday wish video(s) centered in a
// wide modal over the page. Once BOTH videos finish playing naturally
// (not on manual close), it reveals the WhatsApp fab.
(function () {
  const giftBox = document.getElementById('giftBox');
  const modal = document.getElementById('giftModal');
  const backdrop = document.getElementById('giftModalBackdrop');
  const closeBtn = document.getElementById('giftModalClose');
  const video = document.getElementById('giftVideo');
  const caption = document.getElementById('giftVideoCaption');
  if (!giftBox || !modal || !video) return;

  // Two videos, played back to back. Update these paths to match
  // your actual filenames in /assets.
  const VIDEOS = ['assets/mosaic.mp4', 'assets/mosaic2.mp4'];

  let queue = [];
  let queueIndex = 0;

  function playAt(i) {
    queueIndex = i;
    video.src = queue[i];
    caption.textContent = queue.length > 1 ? `wish ${i + 1} of ${queue.length}` : 'a birthday wish';
    video.load();
    video.play().catch(() => {
      /* autoplay may need a tap on some browsers */
    });
  }

  function openModal() {
    queue = VIDEOS.slice();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playAt(0);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    video.pause();
    video.removeAttribute('src');
    video.load();
    giftBox.classList.remove('opened');
  }

  // Fires when a video reaches its natural end (not on manual close/skip)
  video.addEventListener('ended', () => {
    if (queueIndex < queue.length - 1) {
      playAt(queueIndex + 1);
    } else {
      // Both videos have finished playing — surface the WhatsApp fab
      closeModal();
      if (typeof window.__revealWaFab === 'function') {
        window.__revealWaFab();
      }
    }
  });

  giftBox.addEventListener('click', () => {
    giftBox.classList.add('opened');
    setTimeout(openModal, 420);
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
