/* ============================================================
   VESPERA — Lightweight Canvas 2D Particle Background
   (Replaces Three.js — no GPU shader compilation overhead)
   ============================================================ */

let canvas, ctx;
let W, H;
let particles = [];
let mouse  = { x: 0, y: 0 };
let target = { x: 0, y: 0 };
let animId;
let tick = 0;

const PARTICLE_COUNT = 280;

const COLORS = [
  [201, 162, 39],   // gold
  [232, 197, 71],   // gold-light
  [168, 133, 32],   // gold-muted
  [139,   0,  0],   // crimson
  [165,   0, 18],   // crimson-light
  [245, 240, 232],  // cream (rare)
];

const COLOR_WEIGHTS = [0.30, 0.22, 0.18, 0.15, 0.10, 0.05];

function pickColor() {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < COLOR_WEIGHTS.length; i++) {
    cum += COLOR_WEIGHTS[i];
    if (r < cum) return COLORS[i];
  }
  return COLORS[0];
}

function createParticle() {
  const c = pickColor();
  return {
    x:        Math.random() * W,
    y:        Math.random() * H,
    r:        Math.random() * 1.6 + 0.3,
    color:    c,
    baseAlpha: Math.random() * 0.55 + 0.08,
    speedX:   (Math.random() - 0.5) * 0.12,
    speedY:   (Math.random() - 0.5) * 0.12,
    phase:    Math.random() * Math.PI * 2,  // for breathing
    parallax: Math.random() * 0.25 + 0.04,
  };
}

export function initScene() {
  canvas = document.getElementById('canvasBg');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  resize();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  window.addEventListener('resize',    resize,      { passive: true });
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  animate();
}

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function onMouseMove(e) {
  target.x = (e.clientX / W - 0.5);
  target.y = (e.clientY / H - 0.5);
}

function animate() {
  animId = requestAnimationFrame(animate);
  tick++;

  // Smooth mouse lerp
  mouse.x += (target.x - mouse.x) * 0.045;
  mouse.y += (target.y - mouse.y) * 0.045;

  ctx.clearRect(0, 0, W, H);

  const t = tick * 0.008;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Drift
    p.x += p.speedX;
    p.y += p.speedY;

    // Wrap edges
    if (p.x < -4) p.x = W + 4;
    else if (p.x > W + 4) p.x = -4;
    if (p.y < -4) p.y = H + 4;
    else if (p.y > H + 4) p.y = -4;

    // Breathing alpha
    const alpha = p.baseAlpha * (0.65 + 0.35 * Math.sin(t + p.phase));

    // Parallax offset
    const ox = mouse.x * p.parallax * W * 0.12;
    const oy = mouse.y * p.parallax * H * 0.08;

    const [r, g, b] = p.color;
    ctx.beginPath();
    ctx.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
  }
}

export function destroyScene() {
  cancelAnimationFrame(animId);
  window.removeEventListener('resize', resize);
  window.removeEventListener('mousemove', onMouseMove);
}
