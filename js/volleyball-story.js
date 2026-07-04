// Cinematic story sequence (GSAP ScrollTrigger).
// One scrubbed timeline drives every stage: flash card + ball → title →
// sequential wish-card expansion → ball centers → videos emerge.
// The volleyball uses three nested layers (idle bounce, cursor parallax,
// scroll position) so those motions don't fight over the same transform.
//
// Tuning tip: every stage below is placed on the timeline with an
// explicit start time (the second argument to .to()). Nudge those
// numbers to speed up/slow down a stage relative to the others, and
// adjust `.story-pin { height: 650vh }` in css/section-volleyball.css
// to change the overall scroll distance for the whole sequence.
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const pin = document.getElementById('storyPin');
  const flashGroup = document.getElementById('storyFlashGroup');
  const ballWrap = document.getElementById('volleyballWrap');
  const ballCursor = document.getElementById('volleyballCursor');
  const ball = document.getElementById('volleyball');
  const title = document.getElementById('storyTitle');
  const card1 = document.getElementById('storyCard1');
  const card2 = document.getElementById('storyCard2');
  const bubble1 = document.getElementById('storyBubble1');
  const bubble2 = document.getElementById('storyBubble2');
  const text1 = document.getElementById('storyText1');
  const text2 = document.getElementById('storyText2');
  const videoLeft = document.getElementById('storyVideoLeft');
  const videoRight = document.getElementById('storyVideoRight');

  if (!pin || !flashGroup || !ball) return;

  /* ── Idle float: always running, independent of scroll ── */
  gsap.to(ball, {
    y: -12,
    rotate: 10,
    duration: 2.6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });

  /* ── Cursor parallax: ball drifts gently toward the pointer,
       but only while the flash-card stage is on screen, so it
       doesn't fight the later "move to center" scroll animation ── */
  const quickX = gsap.quickTo(ballCursor, 'x', { duration: 0.7, ease: 'power3.out' });
  const quickY = gsap.quickTo(ballCursor, 'y', { duration: 0.7, ease: 'power3.out' });
  let cursorParallaxActive = true;

  window.addEventListener(
    'mousemove',
    (e) => {
      if (!cursorParallaxActive) return;
      const relX = (e.clientX / window.innerWidth - 0.5) * 24;
      const relY = (e.clientY / window.innerHeight - 0.5) * 24;
      quickX(relX);
      quickY(relY);
    },
    { passive: true }
  );

  /* ── Master scrubbed timeline ── */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      // markers: true, // uncomment while tuning
      onLeaveBack: () => {
        cursorParallaxActive = true;
      }
    }
  });

  // Stage 1 — flash card + ball entrance
  tl.to(flashGroup, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' }, 0);

  // Stage 2 — flash card exits, hero title enters and settles higher
  tl.to(flashGroup, { opacity: 0, y: -30, scale: 0.94, duration: 0.8, ease: 'power2.in' }, 1.6)
    .to(title, { opacity: 1, y: -60, duration: 1, ease: 'power2.out' }, 1.8)
    .to(title, { y: -140, duration: 0.6, ease: 'power1.inOut' }, 2.8);

  // Stage 3 — wish card 1 expands first, sequentially, then card 2
  tl.to(card1, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 3.2)
    .to(bubble1, { width: 340, duration: 1.1, ease: 'power2.inOut' }, 3.3)
    .to(text1, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 4.1)
    .to(card2, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 4.8)
    .to(bubble2, { width: 340, duration: 1.1, ease: 'power2.inOut' }, 4.9)
    .to(text2, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 5.7);

  // Stage 4 — cards fade, ball drifts to true center and grows,
  // cursor parallax switches off so the scroll-driven move wins
  tl.call(() => { cursorParallaxActive = false; }, null, 6.4)
    .to([card1, card2, title], { opacity: 0, duration: 0.7, ease: 'power1.in' }, 6.4)
    .to(ballCursor, { x: 0, y: 0, duration: 0.6, ease: 'power2.inOut' }, 6.4)
    .to(
      ballWrap,
      {
        x: () => -1 * (flashGroup.querySelector('.flash-card').offsetWidth / 2 + 11),
        scale: 1.6,
        duration: 1.2,
        ease: 'power2.inOut'
      },
      6.6
    );

  // Stage 5 — videos emerge outward from the ball, ball fades as it
  // "becomes" the video experience, both videos start playing
  tl.to(ballWrap, { opacity: 0, scale: 2.1, duration: 0.7, ease: 'power2.in' }, 7.8)
    .to(videoLeft, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' }, 8.0)
    .to(videoRight, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' }, 8.0)
    .call(
      () => {
        videoLeft.play().catch(() => {});
        videoRight.play().catch(() => {});
      },
      null,
      8.0
    );
})();
