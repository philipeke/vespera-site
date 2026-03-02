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
  document.body.style.opacity = '1';

  initScene();
  initAnimations();   // no Lenis — native scroll only
  initCursor();
  initMagnetic();
  initCardTilt();
  initMobileNav();
  initSmoothScroll();
  initCounters();

  // Cache orb elements once, update on scroll
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');
  const orb3 = document.querySelector('.hero__orb--3');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (orb1) orb1.style.transform = `translateY(${y * 0.15}px)`;
    if (orb2) orb2.style.transform = `translateY(${y * -0.10}px)`;
    if (orb3) orb3.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
});
