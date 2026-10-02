/*
  boids.js
  ---------------------------------------------------------------------------
  A flock of birds in the dusk sky behind the Hero (see #boid-canvas and
  #sky-gradient in css/style.css — the flock is only actually visible there,
  since every section below has an opaque background painted over it). A
  simplified JS/canvas nod to Ayaan's real C++ boid project. Kept subtle and
  low-cost:
    - pauses once you scroll past the Hero (IntersectionObserver)
    - on prefers-reduced-motion, draws one static frame instead of animating
    - degrades to the static gradient fallback if canvas 2D isn't available
    - clicking/tapping in the Hero scatters nearby birds; hovering
      gently pushes them aside. Listeners live on the sections, not the
      canvas, so buttons and links keep working normally.
*/

(function () {
  const canvas = document.getElementById("boid-canvas");
  const hero = document.getElementById("top");
  if (!canvas || !hero) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext && canvas.getContext("2d");

  if (!ctx) {
    document.body.classList.add("no-canvas");
    return;
  }

  // Dark bird silhouettes against the sky gradient, not the site accent color.
  // One consistent shade for every boid — an earlier "dim" variant used a
  // second, much lighter shade for depth, but against the gradient's range
  // of brightness it just read as some birds being black and others white.
  const BOID_COLOR = "20, 16, 15";

  const CONFIG = {
    countPerArea: 1 / 2600,  // boid count scales with section area
    maxCount: 320,
    minCount: 70,
    maxSpeed: 1.1,
    perceptionRadius: 70,
    separationRadius: 26,
    edgeMargin: 40,
    alignWeight: 0.045,
    cohesionWeight: 0.03,
    separationWeight: 0.09,
    scatterRadius: 150,     // px, click/tap flee radius
    scatterDurationMs: 1000,
    scatterForce: 3.2,
    scatterSpeedMultiplier: 3.5,
    hoverRadius: 80,        // px, continuous hover repel radius
    hoverForce: 0.22
  };
  const PERCEPTION_SQ = CONFIG.perceptionRadius * CONFIG.perceptionRadius;
  const SEPARATION_SQ = CONFIG.separationRadius * CONFIG.separationRadius;

  let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
  let boids = [];
  let running = true;
  let rafId = null;

  // Interactive scatter (click/tap, fades out) and hover repel. Coordinates
  // are plain viewport pixels (clientX/clientY), matching the boid space
  // directly since the canvas is a fixed, full-viewport element.
  let scatterPoints = []; // { x, y, startedAt }
  let pointerX = 0, pointerY = 0, pointerActive = false;

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
      Math.min(width < 768 ? 90 : CONFIG.maxCount, Math.max(CONFIG.minCount, width * height * CONFIG.countPerArea))
    );
    boids = new Array(target).fill(null).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.maxSpeed,
      vy: (Math.random() - 0.5) * CONFIG.maxSpeed
    }));
  }

  function step() {
    const now = performance.now();
    if (scatterPoints.length) {
      scatterPoints = scatterPoints.filter((sp) => now - sp.startedAt < CONFIG.scatterDurationMs);
    }

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
        // Squared distances: with hundreds of birds this loop runs tens of
        // thousands of times a frame, so skip the sqrt unless it's needed.
        const d2 = dx * dx + dy * dy;

        if (d2 < PERCEPTION_SQ) {
          alignX += o.vx; alignY += o.vy; alignN++;
          cohX += o.x; cohY += o.y; cohN++;
          if (d2 < SEPARATION_SQ && d2 > 0) {
            const d = Math.sqrt(d2);
            sepX -= dx / d;
            sepY -= dy / d;
          }
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

      // Click/tap scatter: a strong flee force within scatterRadius that
      // fades out linearly over scatterDurationMs.
      let fleeing = false;
      for (let k = 0; k < scatterPoints.length; k++) {
        const sp = scatterPoints[k];
        const dx = b.x - sp.x, dy = b.y - sp.y;
        const d = Math.hypot(dx, dy);
        if (d > 0 && d < CONFIG.scatterRadius) {
          const fade = 1 - (now - sp.startedAt) / CONFIG.scatterDurationMs;
          const strength = (1 - d / CONFIG.scatterRadius) * fade * CONFIG.scatterForce;
          b.vx += (dx / d) * strength;
          b.vy += (dy / d) * strength;
          fleeing = true;
        }
      }

      // Hover: a much weaker continuous repel near the pointer.
      if (pointerActive) {
        const dx = b.x - pointerX, dy = b.y - pointerY;
        const d = Math.hypot(dx, dy);
        if (d > 0 && d < CONFIG.hoverRadius) {
          const strength = (1 - d / CONFIG.hoverRadius) * CONFIG.hoverForce;
          b.vx += (dx / d) * strength;
          b.vy += (dy / d) * strength;
        }
      }

      const speedCap = fleeing ? CONFIG.maxSpeed * CONFIG.scatterSpeedMultiplier : CONFIG.maxSpeed;
      const speed = Math.hypot(b.vx, b.vy);
      if (speed > speedCap) {
        b.vx = (b.vx / speed) * speedCap;
        b.vy = (b.vy / speed) * speedCap;
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

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(len, 0);
      ctx.lineTo(-len * 0.7, len * 0.5);
      ctx.lineTo(-len * 0.7, -len * 0.5);
      ctx.closePath();
      ctx.fillStyle = `rgba(${BOID_COLOR}, 0.8)`;
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

  if (prefersReducedMotion) {
    // A still flock instead of no flock at all: seed positions and draw one
    // frame, but never start the loop or wire up interactivity.
    resize();
    draw();
    window.addEventListener("resize", () => { resize(); draw(); }, { passive: true });
    return;
  }

  // Click/tap scatters nearby birds; listeners live on the sections (not
  // the canvas, which is pointer-events:none anyway) so buttons and links
  // inside the Hero are completely unaffected.
  function handleScatter(e) {
    const point = e.changedTouches ? e.changedTouches[0] : e;
    scatterPoints.push({ x: point.clientX, y: point.clientY, startedAt: performance.now() });
  }
  function handlePointerMove(e) {
    pointerX = e.clientX;
    pointerY = e.clientY;
    pointerActive = true;
  }
  function handlePointerLeave() {
    pointerActive = false;
  }
  hero.addEventListener("click", handleScatter);
  hero.addEventListener("pointermove", handlePointerMove, { passive: true });
  hero.addEventListener("pointerleave", handlePointerLeave, { passive: true });

  // Run only while the Hero is on screen, which is the only
  // place the canvas is visible under the sections above it.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) start();
      else stop();
    });
  }, { threshold: 0.05 });
  io.observe(hero);

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
