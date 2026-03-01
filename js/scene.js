/* ============================================================
   VESPERA — Three.js WebGL Background Scene
   ============================================================ */

import * as THREE from 'three';

let renderer, scene, camera, particles, lightShafts;
let mouse = new THREE.Vector2(0, 0);
let targetMouse = new THREE.Vector2(0, 0);
let animFrameId;
let clock;

export function initScene() {
  const canvas = document.getElementById('canvasBg');
  if (!canvas) return;

  // ── Renderer ──
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── Scene ──
  scene = new THREE.Scene();

  // ── Camera ──
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  // ── Clock ──
  clock = new THREE.Clock();

  // ── Build scene objects ──
  createParticles();
  createLightShafts();
  createCrossGeometry();

  // ── Events ──
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);

  // ── Animate ──
  animate();
}

// ── Particles ──────────────────────────────────────────────

function createParticles() {
  const COUNT = 2200;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const sizes     = new Float32Array(COUNT);

  // Color palette
  const palette = [
    new THREE.Color('#c9a227'), // gold
    new THREE.Color('#e8c547'), // gold-light
    new THREE.Color('#a88520'), // gold-muted
    new THREE.Color('#8b0000'), // crimson
    new THREE.Color('#a50012'), // crimson-light
    new THREE.Color('#f5f0e8'), // cream (rare)
  ];

  const weights = [0.30, 0.20, 0.20, 0.15, 0.10, 0.05];

  for (let i = 0; i < COUNT; i++) {
    // Sphere distribution
    const radius = 15 + Math.random() * 20;
    const theta  = Math.random() * Math.PI * 2;
    const phi    = Math.acos(2 * Math.random() - 1);

    positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi) - 10;

    // Weighted color
    const rnd = Math.random();
    let cumulative = 0;
    let chosenColor = palette[0];
    for (let j = 0; j < weights.length; j++) {
      cumulative += weights[j];
      if (rnd < cumulative) { chosenColor = palette[j]; break; }
    }

    colors[i * 3]     = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;

    sizes[i] = 0.5 + Math.random() * 2.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  // Shader material for soft glowing particles
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime:       { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: /* glsl */`
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

        // Breathing
        float wave = sin(uTime * 0.5 + position.x * 0.1 + position.y * 0.1) * 0.3;
        mvPosition.y += wave;

        gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
        gl_Position  = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */`
      varying vec3 vColor;

      void main() {
        // Soft circular particle with glow
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        if (dist > 0.5) discard;

        // Radial glow falloff
        float alpha = 1.0 - smoothstep(0.15, 0.5, dist);
        alpha *= alpha; // quadratic falloff for softer look

        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `,
    transparent:  true,
    blending:     THREE.AdditiveBlending,
    depthWrite:   false,
    vertexColors: true,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

// ── Light Shafts ────────────────────────────────────────────

function createLightShafts() {
  lightShafts = new THREE.Group();

  const shaftData = [
    { color: 0x8b0000, opacity: 0.04, x: -12, y: 8,   z: -20, rx: 0.3, rz:  0.2 },
    { color: 0xc9a227, opacity: 0.025, x:  10, y: -5,  z: -25, rx: -0.2, rz: -0.15 },
    { color: 0x6b0000, opacity: 0.035, x:   2, y: 12,  z: -30, rx: 0.15, rz:  0.05 },
  ];

  shaftData.forEach(d => {
    const geo = new THREE.PlaneGeometry(8, 60);
    const mat = new THREE.MeshBasicMaterial({
      color:       d.color,
      transparent: true,
      opacity:     d.opacity,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
      side:        THREE.DoubleSide,
    });

    // Gradient alpha via vertex colors would require a shader;
    // using opacity + blending gives a soft volumetric feel
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(d.x, d.y, d.z);
    mesh.rotation.x = d.rx;
    mesh.rotation.z = d.rz;
    lightShafts.add(mesh);
  });

  scene.add(lightShafts);
}

// ── Cross geometry ──────────────────────────────────────────

function createCrossGeometry() {
  const crossGroup = new THREE.Group();

  // Vertical bar
  const vGeo = new THREE.PlaneGeometry(0.8, 6);
  // Horizontal bar
  const hGeo = new THREE.PlaneGeometry(4, 0.8);

  const mat = new THREE.MeshBasicMaterial({
    color:       0xc9a227,
    transparent: true,
    opacity:     0.04,
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
    side:        THREE.DoubleSide,
  });

  const vMesh = new THREE.Mesh(vGeo, mat);
  const hMesh = new THREE.Mesh(hGeo, mat.clone());
  hMesh.position.y = 1.0;

  crossGroup.add(vMesh);
  crossGroup.add(hMesh);
  crossGroup.position.set(0, 0, -5);
  crossGroup.rotation.z = 0.05;

  scene.add(crossGroup);
}

// ── Animation Loop ──────────────────────────────────────────

function animate() {
  animFrameId = requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Update particle shader time
  if (particles?.material?.uniforms) {
    particles.material.uniforms.uTime.value = elapsed;
  }

  // Slow rotation
  if (particles) {
    particles.rotation.y = elapsed * 0.018;
    particles.rotation.x = Math.sin(elapsed * 0.008) * 0.12;
  }

  // Light shaft drift
  if (lightShafts) {
    lightShafts.rotation.z = Math.sin(elapsed * 0.06) * 0.05;
    lightShafts.rotation.y = Math.cos(elapsed * 0.04) * 0.03;
  }

  // Smooth mouse parallax
  mouse.x += (targetMouse.x - mouse.x) * 0.04;
  mouse.y += (targetMouse.y - mouse.y) * 0.04;

  camera.position.x = mouse.x * 2.5;
  camera.position.y = mouse.y * 1.5;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

// ── Events ──────────────────────────────────────────────────

function onMouseMove(e) {
  targetMouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
  targetMouse.y = (e.clientY / window.innerHeight - 0.5) * -2;
}

function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  if (particles?.material?.uniforms?.uPixelRatio) {
    particles.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }
}

export function destroyScene() {
  cancelAnimationFrame(animFrameId);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('mousemove', onMouseMove);
  renderer?.dispose();
}
