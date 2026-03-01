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

// ── DOMContentLoaded ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lenis smooth scroll
  initLenis();

  // 2. Three.js WebGL background
  initScene();

  // 3. GSAP scroll animations
  initAnimations();

  // 4. Interaction layer
  initCursor();
  initMagnetic();
  initCardTilt();
  initMobileNav();
  initSmoothScroll();
  initCounters();

  // 5. Miscellaneous
  initPageEffects();
});

// ── Lenis smooth scroll ───────────────────────────────────────

function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Integrate with GSAP ticker if available
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add(time => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback: own rAF loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

// ── Page-level effects ────────────────────────────────────────

function initPageEffects() {
  // Fade in body on load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  // Parallax for hero orbs
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const orb1 = document.querySelector('.hero__orb--1');
    const orb2 = document.querySelector('.hero__orb--2');
    const orb3 = document.querySelector('.hero__orb--3');

    if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
    if (orb2) orb2.style.transform = `translateY(${scrollY * -0.10}px)`;
    if (orb3) orb3.style.transform = `translateY(${scrollY * 0.08}px)`;
  }, { passive: true });

  // Active nav link on scroll (highlight current section)
  initActiveSectionHighlight();
}

// ── Active section tracking ───────────────────────────────────

function initActiveSectionHighlight() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const navLink = document.querySelector(`.nav__mobile-link[href="#${id}"]`);
      if (!navLink) return;

      if (entry.isIntersecting) {
        document.querySelectorAll('.nav__mobile-link').forEach(l => l.style.color = '');
        navLink.style.color = 'var(--gold)';
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
  });

  sections.forEach(s => observer.observe(s));
}
