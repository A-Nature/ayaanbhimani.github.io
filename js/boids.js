/*
  boids.js
  ---------------------------------------------------------------------------
  Ambient flocking simulation, rendered as a fixed full-viewport background
  behind the whole page (see #boid-canvas in css/style.css — it's only
  actually visible behind Hero/About, since every section below has an
  opaque background painted over it). A simplified JS/canvas nod to Ayaan's
  real C++ boid project. Kept subtle and low-cost:
    - pauses once you scroll past Hero + About (IntersectionObserver)
    - pauses on prefers-reduced-motion / falls back to a static background
    - degrades to the static gradient fallback if canvas 2D isn't available
*/

(function () {
  const canvas = document.getElementById("boid-canvas");
  const hero = document.getElementById("top");
  const about = document.getElementById("about");
  if (!canvas || !hero || !about) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext && canvas.getContext("2d");

  if (!ctx || prefersReducedMotion) {
    document.body.classList.add("no-canvas");
    return;
  }

  const BOID_COLOR = "78, 178, 150";   // muted teal-green, matches --color-accent
  const BOID_COLOR_DIM = "139, 148, 158"; // --color-text-muted, for depth variety

  const CONFIG = {
    countPerArea: 1 / 9000,  // boid count scales with section area
    maxCount: 45,
    minCount: 14,
    maxSpeed: 1.1,
    perceptionRadius: 70,
    separationRadius: 26,
    edgeMargin: 40,
    alignWeight: 0.045,
    cohesionWeight: 0.03,
    separationWeight: 0.09
  };

  let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let boids = [];
  let running = true;
  let rafId = null;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const target = Math.round(
      Math.min(CONFIG.maxCount, Math.max(CONFIG.minCount, width * height * CONFIG.countPerArea))
    );
    boids = new Array(target).fill(null).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.maxSpeed,
      vy: (Math.random() - 0.5) * CONFIG.maxSpeed,
      dim: Math.random() < 0.35
    }));
  }

  function step() {
    for (let i = 0; i < boids.length; i++) {
      const b = boids[i];
      let alignX = 0, alignY = 0, alignN = 0;
      let cohX = 0, cohY = 0, cohN = 0;
      let sepX = 0, sepY = 0;

      for (let j = 0; j < boids.length; j++) {
        if (i === j) continue;
        const o = boids[j];
        const dx = o.x - b.x;
        const dy = o.y - b.y;
        const d = Math.hypot(dx, dy);

        if (d < CONFIG.perceptionRadius) {
          alignX += o.vx; alignY += o.vy; alignN++;
          cohX += o.x; cohY += o.y; cohN++;
        }
        if (d < CONFIG.separationRadius && d > 0) {
          sepX -= dx / d;
          sepY -= dy / d;
        }
      }

      if (alignN > 0) {
        b.vx += (alignX / alignN) * CONFIG.alignWeight;
        b.vy += (alignY / alignN) * CONFIG.alignWeight;
      }
      if (cohN > 0) {
        b.vx += ((cohX / cohN) - b.x) * CONFIG.cohesionWeight * 0.02;
        b.vy += ((cohY / cohN) - b.y) * CONFIG.cohesionWeight * 0.02;
      }
      b.vx += sepX * CONFIG.separationWeight;
      b.vy += sepY * CONFIG.separationWeight;

      // Gentle steer away from edges instead of hard wrap, keeps motion calm
      if (b.x < CONFIG.edgeMargin) b.vx += 0.02;
      if (b.x > width - CONFIG.edgeMargin) b.vx -= 0.02;
      if (b.y < CONFIG.edgeMargin) b.vy += 0.02;
      if (b.y > height - CONFIG.edgeMargin) b.vy -= 0.02;

      const speed = Math.hypot(b.vx, b.vy);
      if (speed > CONFIG.maxSpeed) {
        b.vx = (b.vx / speed) * CONFIG.maxSpeed;
        b.vy = (b.vy / speed) * CONFIG.maxSpeed;
      }

      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -20) b.x = width + 20;
      if (b.x > width + 20) b.x = -20;
      if (b.y < -20) b.y = height + 20;
      if (b.y > height + 20) b.y = -20;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const b of boids) {
      const angle = Math.atan2(b.vy, b.vx);
      const len = 6.5;
      const color = b.dim ? BOID_COLOR_DIM : BOID_COLOR;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(len, 0);
      ctx.lineTo(-len * 0.7, len * 0.5);
      ctx.lineTo(-len * 0.7, -len * 0.5);
      ctx.closePath();
      ctx.fillStyle = `rgba(${color}, 0.55)`;
      ctx.fill();
      ctx.restore();
    }
  }

  function loop() {
    if (!running) return;
    step();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (rafId === null) {
      running = true;
      rafId = requestAnimationFrame(loop);
    }
  }

  function stop() {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Run only while Hero or About is actually on screen — that's the only
  // place the canvas is visible under the sections above it.
  let heroVisible = false;
  let aboutVisible = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === hero) heroVisible = entry.isIntersecting;
      if (entry.target === about) aboutVisible = entry.isIntersecting;
    });
    if (heroVisible || aboutVisible) start();
    else stop();
  }, { threshold: 0.05 });
  io.observe(hero);
  io.observe(about);

  // ResizeObserver on <html> catches real viewport size once layout/fonts
  // settle, and any later size change — more reliable than a single
  // resize() call on load.
  let resizeTimer = null;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });
  ro.observe(document.documentElement);

  resize();
})();
