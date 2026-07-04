// Animated particle canvas behind the header text — floating symbols,
// cursor repulsion + glow, subtle vignette.
(function () {
  const canvas = document.getElementById('header-canvas');
  const header = document.getElementById('site-header');
  if (!canvas || !header) return;
  const ctx = canvas.getContext('2d');

  /* ── Palette ── */
  const C = {
    crimson: 'rgba(179,18,46,',
    gold: 'rgba(212,162,76,',
    cream: 'rgba(255,248,240,',
    sage: 'rgba(79,143,106,'
  };

  /* ── Symbol sets for each interest ── */
  const SYMBOLS = [
    /* CODING */
    { text: '</>', cat: 'code', color: C.gold },
    { text: '{ }', cat: 'code', color: C.gold },
    { text: '( )', cat: 'code', color: C.cream },
    { text: 'fn', cat: 'code', color: C.crimson },
    { text: '[ ]', cat: 'code', color: C.gold },
    { text: '//', cat: 'code', color: C.cream },
    { text: '=>', cat: 'code', color: C.crimson },
    { text: '<>', cat: 'code', color: C.gold },
    { text: '&&', cat: 'code', color: C.cream },
    { text: '01', cat: 'code', color: C.crimson },
    { text: '#!', cat: 'code', color: C.gold },
    { text: '::', cat: 'code', color: C.cream },

    /* VIDEO EDITING */
    { text: '▶▶', cat: 'edit', color: C.gold },
    { text: '▌▌', cat: 'edit', color: C.cream },
    { text: '✂', cat: 'edit', color: C.crimson },
    { text: '◼◻', cat: 'edit', color: C.gold },
    { text: '⬡', cat: 'edit', color: C.cream },
    { text: '◐', cat: 'edit', color: C.crimson },
    { text: '▲▼', cat: 'edit', color: C.gold },
    { text: '⧉', cat: 'edit', color: C.cream },
    { text: '◈', cat: 'edit', color: C.crimson },

    /* FOOD */
    { text: '♨', cat: 'food', color: C.crimson },
    { text: '⬟', cat: 'food', color: C.gold },
    { text: '∿∿', cat: 'food', color: C.cream },
    { text: '◉', cat: 'food', color: C.crimson },
    { text: '☕', cat: 'food', color: C.gold },
    { text: '🍴', cat: 'food', color: C.cream },
    { text: '❋', cat: 'food', color: C.crimson },
    { text: '⊙', cat: 'food', color: C.gold },
    { text: '⌘', cat: 'food', color: C.cream },
    { text: '✦', cat: 'food', color: C.crimson },

    /* VOLLEYBALL */
    { text: '⚈', cat: 'volleyball', color: C.gold },
    { text: '⬤', cat: 'volleyball', color: C.cream },
    { text: '⤴', cat: 'volleyball', color: C.crimson },
    { text: '⌇', cat: 'volleyball', color: C.gold },
    { text: '⛹', cat: 'volleyball', color: C.cream },
    { text: '✹', cat: 'volleyball', color: C.crimson },

    /* CROCHET */
    { text: '〰', cat: 'crochet', color: C.crimson },
    { text: '⌒⌒', cat: 'crochet', color: C.gold },
    { text: '∞', cat: 'crochet', color: C.cream },
    { text: '⟳', cat: 'crochet', color: C.gold },
    { text: '⊛', cat: 'crochet', color: C.crimson },
    { text: '⟲', cat: 'crochet', color: C.gold },
    { text: '≋', cat: 'crochet', color: C.cream },
    { text: '❀', cat: 'crochet', color: C.crimson }
  ];

  /* ── Particle class ── */
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(init) {
      const W = canvas.width, H = canvas.height;
      this.sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -20;
      this.ox = this.x; // origin x for drift
      this.oy = this.y;
      this.vx = (Math.random() - 0.5) * 0.18;
      this.vy = (Math.random() - 0.5) * 0.18;
      this.size = 10 + Math.random() * 8;
      this.alpha = 0.08 + Math.random() * 0.12;
      this.baseA = this.alpha;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.003;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = 0.002 + Math.random() * 0.003;

      /* cursor repulsion state */
      this.rx = 0;
      this.ry = 0;
      this.lit = 0; // 0..1 lit-up factor from cursor proximity
    }

    update(mouse, W, H) {
      /* gentle float */
      this.phase += this.speed;
      this.x = this.ox + Math.sin(this.phase) * 18;
      this.y = this.oy + Math.cos(this.phase * 0.7) * 10;

      /* slow drift */
      this.ox += this.vx;
      this.oy += this.vy;

      /* wrap */
      if (this.ox < -40) this.ox = W + 40;
      if (this.ox > W + 40) this.ox = -40;
      if (this.oy < -40) this.oy = H + 40;
      if (this.oy > H + 40) this.oy = -40;

      /* cursor interaction */
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const RADIUS = 110;

      if (dist < RADIUS && mouse.active) {
        const force = 1 - dist / RADIUS;
        /* repel */
        this.rx += (dx / dist) * force * 2.2;
        this.ry += (dy / dist) * force * 2.2;
        /* glow */
        this.lit = Math.min(1, this.lit + force * 0.18);
      } else {
        this.lit *= 0.92; // fade glow
      }

      /* apply + decay repulsion */
      this.ox += this.rx;
      this.oy += this.ry;
      this.rx *= 0.82;
      this.ry *= 0.82;

      /* spin */
      this.angle += this.spin;

      /* alpha */
      this.alpha = this.baseA + this.lit * 0.55;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      /* glow halo when lit */
      if (this.lit > 0.05) {
        ctx.shadowColor = this.sym.color + '0.9)';
        ctx.shadowBlur = 10 * this.lit;
      }

      ctx.font = `300 ${this.size}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = this.sym.color + this.alpha.toFixed(2) + ')';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.sym.text, 0, 0);

      ctx.restore();
    }
  }

  /* ── State ── */
  let particles = [];
  let mouse = { x: -999, y: -999, active: false };
  let raf;

  /* ── Resize ── */
  function resize() {
    const rect = header.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    init();
  }

  function init() {
    const count = Math.floor((canvas.width * canvas.height) / 8000);
    particles = Array.from({ length: Math.max(22, Math.min(count, 55)) }, () => new Particle());
  }

  /* ── Mouse tracking on the whole header ── */
  header.addEventListener(
    'mousemove',
    (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    },
    { passive: true }
  );

  header.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  /* touch support */
  header.addEventListener(
    'touchmove',
    (e) => {
      const r = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - r.left;
      mouse.y = t.clientY - r.top;
      mouse.active = true;
    },
    { passive: true }
  );

  header.addEventListener('touchend', () => {
    mouse.active = false;
  });

  /* ── Draw loop ── */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* very subtle radial vignette to keep center clear */
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.max(cx, cy) * 1.1;
    const grd = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
    grd.addColorStop(0, 'rgba(26,16,16,0)');
    grd.addColorStop(1, 'rgba(26,16,16,0.35)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* draw cursor ripple ring */
    if (mouse.active) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 70, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(179,18,46,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 110, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(179,18,46,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    particles.forEach((p) => {
      p.update(mouse, canvas.width, canvas.height);
      p.draw(ctx);
    });

    raf = requestAnimationFrame(draw);
  }

  /* ── Boot ── */
  resize();
  draw();

  const ro = new ResizeObserver(resize);
  ro.observe(header);
})();
