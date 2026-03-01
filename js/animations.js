/* ============================================================
   VESPERA — GSAP + ScrollTrigger Animations
   ============================================================ */

export function initAnimations(lenis) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // GSAP not loaded — make all hidden elements visible immediately
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity  = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Set initial hidden state for all data-reveal elements via GSAP
  // (NOT via CSS, so elements are always visible if JS is off or GSAP fails)
  gsap.set('[data-reveal]', { opacity: 0, y: 40 });

  // Wire Lenis → ScrollTrigger proxy if lenis exists
  if (lenis) {
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) { lenis.scrollTo(value, { immediate: true }); }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });
  }

  animateHero();
  animateSections();
  animateCategories();
  animateHowItWorks();
  animateReflections();
  animateBlessed();
  animateNav();

  // Refresh after layout is settled
  window.addEventListener('load', () => {
    setTimeout(() => ScrollTrigger.refresh(), 200);
  });
}

// ── Hero Timeline ────────────────────────────────────────────

function animateHero() {
  const tl = gsap.timeline({ delay: 0.15 });

  tl.from('.hero__eyebrow', {
    opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
  })
  .from('.hero__logo', {
    opacity: 0, scale: 0.82, y: 20, duration: 0.9, ease: 'back.out(1.4)',
  }, '-=0.3')
  .from('.hero__headline', {
    opacity: 0, y: 45, duration: 0.9, ease: 'power3.out',
  }, '-=0.5')
  .from('.hero__sub', {
    opacity: 0, y: 28, duration: 0.75, ease: 'power3.out',
  }, '-=0.45')
  .from('.hero__ctas .btn', {
    opacity: 0, y: 22, scale: 0.92, stagger: 0.12, duration: 0.65, ease: 'back.out(1.4)',
  }, '-=0.35')
  .from('.hero__badges .hero__badge', {
    opacity: 0, y: 12, stagger: 0.07, duration: 0.45, ease: 'power2.out',
  }, '-=0.25')
  .from('.hero__scroll', {
    opacity: 0, y: 12, duration: 0.5, ease: 'power2.out',
  }, '-=0.1');
}

// ── Generic section reveals ──────────────────────────────────

function animateSections() {
  // About: left/right split
  gsap.to('.about__visual', {
    opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
    scrollTrigger: { trigger: '.about__inner', start: 'top 78%', once: true },
  });
  gsap.set('.about__visual', { x: -60 });

  gsap.to('.about__content', {
    opacity: 1, x: 0, duration: 1.0, ease: 'power3.out', delay: 0.1,
    scrollTrigger: { trigger: '.about__inner', start: 'top 78%', once: true },
  });
  gsap.set('.about__content', { x: 60 });

  // Stats
  gsap.to('.stat', {
    opacity: 1, y: 0, stagger: 0.12, duration: 0.65, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.about__stats', start: 'top 86%', once: true },
  });
  gsap.set('.stat', { opacity: 0, y: 22 });

  // Section headers (eyebrow + heading + sub) — generic
  ['.about', '.categories', '.how', '.reflections', '.blessed', '.download-cta'].forEach(sel => {
    const eyebrow = document.querySelector(`${sel} .section__eyebrow`);
    const heading = document.querySelector(`${sel} .section__heading`);
    const sub     = document.querySelector(`${sel} .section__sub`);

    const trigger = document.querySelector(`${sel} .section__header`) || document.querySelector(sel);
    if (!trigger) return;

    if (eyebrow) {
      gsap.set(eyebrow, { opacity: 0, y: 18 });
      gsap.to(eyebrow, {
        opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger, start: 'top 82%', once: true },
      });
    }
    if (heading) {
      gsap.set(heading, { opacity: 0, y: 35 });
      gsap.to(heading, {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.08,
        scrollTrigger: { trigger, start: 'top 82%', once: true },
      });
    }
    if (sub) {
      gsap.set(sub, { opacity: 0, y: 22 });
      gsap.to(sub, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.16,
        scrollTrigger: { trigger, start: 'top 82%', once: true },
      });
    }
  });

  // Reflections: left/right split
  gsap.set('.refl-counter',         { x: -50, scale: 0.93 });
  gsap.set('.reflections__content', { x: 50 });
  gsap.to('.refl-counter', {
    opacity: 1, x: 0, scale: 1, duration: 0.95, ease: 'power3.out',
    scrollTrigger: { trigger: '.reflections__inner', start: 'top 78%', once: true },
  });
  gsap.to('.reflections__content', {
    opacity: 1, x: 0, duration: 0.95, ease: 'power3.out', delay: 0.1,
    scrollTrigger: { trigger: '.reflections__inner', start: 'top 78%', once: true },
  });

  // Download CTA
  gsap.to('.download-cta__logo', {
    opacity: 1, scale: 1, duration: 0.95, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.download-cta', start: 'top 72%', once: true },
  });
  gsap.set('.download-cta__logo', { scale: 0.82 });

  gsap.set(['.download-cta__heading', '.download-cta__sub'], { opacity: 0, y: 30 });
  gsap.to(['.download-cta__heading', '.download-cta__sub'], {
    opacity: 1, y: 0, stagger: 0.14, duration: 0.75, ease: 'power3.out', delay: 0.18,
    scrollTrigger: { trigger: '.download-cta', start: 'top 72%', once: true },
  });

  gsap.set('.download-cta__buttons .btn', { opacity: 0, y: 22, scale: 0.92 });
  gsap.to('.download-cta__buttons .btn', {
    opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.65, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.download-cta__buttons', start: 'top 82%', once: true },
  });
}

// ── Categories ───────────────────────────────────────────────

function animateCategories() {
  gsap.set('.cat-card', { opacity: 0, y: 45, scale: 0.92 });
  gsap.to('.cat-card', {
    opacity: 1, y: 0, scale: 1,
    stagger: { each: 0.07, grid: 'auto', from: 'start' },
    duration: 0.7,
    ease: 'back.out(1.2)',
    scrollTrigger: { trigger: '.categories__grid', start: 'top 82%', once: true },
  });
}

// ── How It Works ─────────────────────────────────────────────

function animateHowItWorks() {
  gsap.set('.step', { opacity: 0, y: 45 });
  gsap.to('.step', {
    opacity: 1, y: 0,
    stagger: 0.18,
    duration: 0.85,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.how__steps', start: 'top 80%', once: true },
  });

  gsap.set('.step__connector-line', { scaleX: 0, transformOrigin: 'left center' });
  gsap.to('.step__connector-line', {
    scaleX: 1,
    stagger: 0.18,
    duration: 0.75,
    ease: 'power2.out',
    delay: 0.35,
    scrollTrigger: { trigger: '.how__steps', start: 'top 78%', once: true },
  });
}

// ── Reflections counter animation ────────────────────────────

function animateReflections() {
  // Counter number count-up
  ScrollTrigger.create({
    trigger: '.refl-counter',
    start: 'top 78%',
    once: true,
    onEnter: () => {
      const el = document.getElementById('reflCounterVal');
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 12,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(obj.val); },
      });
    },
  });

  // Gauge fill
  ScrollTrigger.create({
    trigger: '.refl-counter__gauge',
    start: 'top 82%',
    once: true,
    onEnter: () => {
      gsap.fromTo('.refl-counter__fill',
        { width: '0%' },
        { width: '75%', duration: 1.8, ease: 'power3.out', delay: 0.3 }
      );
    },
  });
}

// ── Blessed card ─────────────────────────────────────────────

function animateBlessed() {
  gsap.to('.blessed__card', {
    opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'back.out(1.15)',
    scrollTrigger: { trigger: '.blessed', start: 'top 76%', once: true },
  });
  gsap.set('.blessed__card', { scale: 0.95 });

  gsap.set('.blessed__feature', { opacity: 0, x: -18 });
  gsap.to('.blessed__feature', {
    opacity: 1, x: 0,
    stagger: 0.07,
    duration: 0.55,
    ease: 'power2.out',
    delay: 0.28,
    scrollTrigger: { trigger: '.blessed__features', start: 'top 82%', once: true },
  });

  gsap.set('.blessed__ctas .btn', { opacity: 0, y: 18, scale: 0.92 });
  gsap.to('.blessed__ctas .btn', {
    opacity: 1, y: 0, scale: 1,
    stagger: 0.1,
    duration: 0.6,
    ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.blessed__ctas', start: 'top 86%', once: true },
  });
}

// ── Nav scroll effect ─────────────────────────────────────────

function animateNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 80,
    end: 'max',
    onUpdate: self => {
      nav.classList.toggle('is-scrolled', self.scroll() > 80);
    },
  });
}
