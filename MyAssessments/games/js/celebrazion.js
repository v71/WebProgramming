/*!
 * confetti.js — a small, dependency-free confetti burst.
 */
(function (root) {
  'use strict';

  var DEFAULT_COLORS = ['#f5c542', '#e8505b', '#3fa7d6', '#59c9a5', '#9b7ede', '#f2f2f2'];
  var G = 600;              // px/s²
  var pieces = [];
  var canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  var rafId = 0, last = 0, zIndex = 9999;

  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var pick = function (a) { return a[(Math.random() * a.length) | 0]; };

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;';
    canvas.style.zIndex = String(zIndex);
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function teardown() {
    if (!canvas) return;
    window.removeEventListener('resize', resize);
    canvas.parentNode && canvas.parentNode.removeChild(canvas);
    canvas = ctx = null;
    rafId = 0;
  }

  function burst(opts) {
    opts = opts || {};
    if (typeof window === 'undefined') return;
    if (opts.respectReducedMotion !== false &&
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (opts.zIndex != null) zIndex = opts.zIndex;
    ensureCanvas();

    var x, y;
    if (opts.element && opts.element.getBoundingClientRect) {
      var r = opts.element.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    } else {
      var o = opts.origin || {};
      x = (o.x != null ? o.x : 0.5) * W;
      y = (o.y != null ? o.y : 0.8) * H;
    }

    var angle  = (opts.angle  != null ? opts.angle  : 90) * Math.PI / 180;
    var spread = (opts.spread != null ? opts.spread : 55) * Math.PI / 180;
    var count  = opts.count  != null ? opts.count  : 90;
    var power  = opts.power  != null ? opts.power  : 1;
    var grav   = opts.gravity != null ? opts.gravity : 1;
    var scalar = opts.scalar != null ? opts.scalar : 1;
    var colors = opts.colors && opts.colors.length ? opts.colors : DEFAULT_COLORS;
    var vScale = Math.max(0.7, Math.min(1.5, H / 900)) * power;

    for (var i = 0; i < count; i++) {
      var a = angle + (Math.random() + Math.random() - 1) * spread;
      var speed = rand(700, 2000) * vScale;
      var kx = rand(2.0, 3.2);
      pieces.push({
        x: x, y: y,
        vx: Math.cos(a) * speed,
        vy: -Math.sin(a) * speed,
        kx: kx, ky: rand(2.3, 3.5),
        g: G * grav,
        w: rand(5, 9) * scalar, h: rand(8, 14) * scalar,
        rot: rand(0, 6.28), vr: rand(-9, 9),
        flip: rand(0, 6.28), fs: rand(6, 16),
        sway: rand(30, 80), sf: rand(2, 5), ph: rand(0, 6.28),
        shape: (Math.random() * 3) | 0,
        color: pick(colors),
        age: 0, life: rand(2.8, 4.2)
      });
    }

    if (!rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  }

  function frame(now) {
    var dt = Math.min(0.033, (now - last) / 1000);
    last = now;

    var j = 0;
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      p.age += dt;
      p.vx -= p.kx * p.vx * dt;
      p.vy += (p.g - p.ky * p.vy) * dt;
      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      var calm = Math.max(0, 1 - speed / 900);
      p.x += (p.vx + Math.cos(p.age * p.sf + p.ph) * p.sway * calm) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.flip += p.fs * dt;
      if (p.age < p.life && p.y < H + 40) pieces[j++] = p;
    }
    pieces.length = j;

    ctx.clearRect(0, 0, W, H);
    for (var k = 0; k < pieces.length; k++) {
      var q = pieces[k];
      var c = Math.cos(q.flip);
      var fade = Math.min(1, (q.life - q.age) / 0.8);
      ctx.globalAlpha = (0.6 + 0.4 * Math.abs(c)) * fade;
      ctx.fillStyle = q.color;
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.rotate(q.rot);
      ctx.scale(1, c);
      if (q.shape === 0) {
        ctx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h);
      } else if (q.shape === 1) {
        ctx.beginPath(); ctx.arc(0, 0, q.w * 0.45, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillRect(-q.w * 0.2, -q.h * 0.8, q.w * 0.4, q.h * 1.6);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    if (pieces.length) {
      rafId = requestAnimationFrame(frame);
    } else {
      teardown();
    }
  }

  function clear() {
    pieces.length = 0;
    if (rafId) cancelAnimationFrame(rafId);
    teardown();
  }

  root.Confetti = { burst: burst, clear: clear };
})(typeof window !== 'undefined' ? window : this);