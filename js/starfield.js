/* ==========================================================================
   Starfield. A quiet canvas of twinkling stars, with the odd shooting star,
   drawn behind any section marked with a data-starfield attribute (Skills
   and Education). It only animates while its section is on screen, and it
   stays still for visitors who prefer reduced motion.
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = window.matchMedia && window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
  // Mostly warm white, with a few terracotta and blue stars.
  var TINTS = ["243,233,214", "243,233,214", "243,233,214", "243,233,214", "240,178,122", "170,190,255"];

  function makeField(section) {
    var canvas = document.createElement("canvas");
    canvas.className = "starfield";
    canvas.setAttribute("aria-hidden", "true");
    section.insertBefore(canvas, section.firstChild);
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5);
    var w = 1, h = 1;
    var stars = [];
    var shots = [];
    var raf = 0;
    var visible = false;
    var last = 0;
    var nextShot = 0;

    function build() {
      var r = section.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round((w * h) / (small ? 15000 : 8000));
      stars = [];
      for (var i = 0; i < count; i++) {
        var big = Math.random() < 0.1;
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: big ? 1.3 + Math.random() * 0.8 : 0.45 + Math.random() * 0.75,
          a: 0.25 + Math.random() * 0.6,
          s: 0.6 + Math.random() * 1.8,
          p: Math.random() * 6.283,
          c: TINTS[Math.floor(Math.random() * TINTS.length)],
          big: big
        });
      }
      draw(performance.now() / 1000);
    }

    function spawnShot() {
      var angle = (0.15 + Math.random() * 0.2) * Math.PI;   // heading down and to the left
      var speed = (small ? 520 : 700) + Math.random() * 300;
      shots.push({
        x: w * (0.35 + Math.random() * 0.65),
        y: Math.random() * h * 0.45,
        dx: -Math.cos(angle),
        dy: Math.sin(angle),
        speed: speed,
        len: 90 + Math.random() * 90,
        life: 0.8 + Math.random() * 0.5,
        age: 0
      });
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = reduce ? s.a * 0.8 : s.a * (0.62 + 0.38 * Math.sin(t * s.s + s.p));
        ctx.fillStyle = "rgba(" + s.c + "," + a.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
        if (s.big) {
          ctx.fillStyle = "rgba(" + s.c + "," + (a * 0.14).toFixed(3) + ")";
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3.2, 0, 6.283);
          ctx.fill();
        }
      }
      for (var k = 0; k < shots.length; k++) {
        var sh = shots[k];
        var fade = Math.sin(Math.PI * Math.min(1, sh.age / sh.life));
        var tx = sh.x - sh.dx * sh.len;
        var ty = sh.y - sh.dy * sh.len;
        var g = ctx.createLinearGradient(tx, ty, sh.x, sh.y);
        g.addColorStop(0, "rgba(255,238,210,0)");
        g.addColorStop(1, "rgba(255,244,226," + (0.9 * fade).toFixed(3) + ")");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(sh.x, sh.y);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,246,230," + (0.95 * fade).toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 1.6, 0, 6.283);
        ctx.fill();
      }
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (var k = shots.length - 1; k >= 0; k--) {
        var sh = shots[k];
        sh.age += dt;
        sh.x += sh.dx * sh.speed * dt;
        sh.y += sh.dy * sh.speed * dt;
        if (sh.age >= sh.life) shots.splice(k, 1);
      }
      if (now >= nextShot) {
        if (shots.length < (small ? 1 : 2)) spawnShot();
        nextShot = now + (small ? 4500 : 2600) + Math.random() * 4200;
      }
      draw(now / 1000);
    }

    function start() {
      if (reduce || raf || !visible || document.hidden) return;
      last = performance.now();
      nextShot = last + 1200 + Math.random() * 2000;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    build();
    if (window.ResizeObserver) {
      var pending = 0;
      new ResizeObserver(function () {
        if (pending) return;
        pending = requestAnimationFrame(function () { pending = 0; build(); });
      }).observe(section);
    }
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        visible = entries.some(function (e) { return e.isIntersecting; });
        if (visible) start(); else stop();
      }).observe(section);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-starfield]"), makeField);
})();
