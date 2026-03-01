/* ============================================================
   VESPERA — Main Entry Point
   ============================================================ */

import { initScene }     from './scene.js';
import { initAnimations } from './animations.js';
import {
  initCursor,
  initMagnetic,
  initCardTilt,
  initMobileNav,
  initSmoothScroll,
  initCounters,
} from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Fade in body immediately (avoids flash)
  document.body.style.opacity = '1';

  // 2. Canvas 2D particle background
  initScene();

  // 3. Lenis smooth scroll — MUST be initialized before GSAP animations
  //    so that ScrollTrigger can receive scroll events correctly
  const lenis = initLenis();

  // 4. GSAP animations — pass lenis so we can wire it to ScrollTrigger
  initAnimations(lenis);

  // 5. Interactions
  initCursor();
  initMagnetic();
  initCardTilt();
  initMobileNav();
  initSmoothScroll();
  initCounters();

  // 6. Hero orb parallax on scroll
  window.addEventListener('scroll', onScroll, { passive: true });
});

// ── Lenis smooth scroll ───────────────────────────────────────

function initLenis() {
  if (typeof Lenis === 'undefined') return null;

  const lenis = new Lenis({
    duration:        1.1,
    easing:          t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth:          true,
    smoothTouch:     false,
  });

  // Critical: wire Lenis scroll events → ScrollTrigger so it updates correctly
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }

  // Drive Lenis via GSAP ticker (single rAF loop)
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback: own rAF loop
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  return lenis;
}

// ── Hero orb parallax ────────────────────────────────────────

function onScroll() {
  const y = window.scrollY;
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');
  const orb3 = document.querySelector('.hero__orb--3');
  if (orb1) orb1.style.transform = `translateY(${y * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${y * -0.10}px)`;
  if (orb3) orb3.style.transform = `translateY(${y * 0.08}px)`;
}
