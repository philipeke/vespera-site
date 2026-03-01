/* ============================================================
   VESPERA — GSAP + ScrollTrigger Animations
   ============================================================ */

export function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[Vespera] GSAP or ScrollTrigger not loaded.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  animateHero();
  animateSections();
  animateCategories();
  animateHowItWorks();
  animateReflections();
  animateBlessed();
  animateNav();
}

// ── Hero Timeline ────────────────────────────────────────────

function animateHero() {
  const tl = gsap.timeline({ delay: 0.2 });

  tl.from('.hero__eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
  })
  .from('.hero__logo', {
    opacity: 0,
    scale: 0.8,
    y: 20,
    duration: 1.0,
    ease: 'back.out(1.4)',
  }, '-=0.4')
  .from('.hero__headline', {
    opacity: 0,
    y: 50,
    duration: 1.0,
    ease: 'power3.out',
  }, '-=0.6')
  .from('.hero__sub', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.5')
  .from('.hero__ctas .btn', {
    opacity: 0,
    y: 25,
    scale: 0.9,
    stagger: 0.12,
    duration: 0.7,
    ease: 'back.out(1.4)',
  }, '-=0.4')
  .from('.hero__badges .hero__badge', {
    opacity: 0,
    y: 15,
    stagger: 0.08,
    duration: 0.5,
    ease: 'power2.out',
  }, '-=0.3')
  .from('.hero__scroll', {
    opacity: 0,
    y: 15,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.1');
}

// ── Generic section reveals ──────────────────────────────────

function animateSections() {
  const sections = ['.about', '.how', '.reflections', '.download-cta'];

  sections.forEach(sel => {
    // Section eyebrow + heading
    gsap.from(`${sel} .section__eyebrow`, {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: `${sel} .section__header`,
        start: 'top 80%',
        once: true,
      },
    });

    gsap.from(`${sel} .section__heading`, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.1,
      scrollTrigger: {
        trigger: `${sel} .section__header`,
        start: 'top 80%',
        once: true,
      },
    });

    gsap.from(`${sel} .section__sub`, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2,
      scrollTrigger: {
        trigger: `${sel} .section__header`,
        start: 'top 80%',
        once: true,
      },
    });
  });

  // About: split left/right reveal
  gsap.from('.about__visual', {
    opacity: 0,
    x: -60,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about__inner',
      start: 'top 75%',
      once: true,
    },
  });

  gsap.from('.about__content', {
    opacity: 0,
    x: 60,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about__inner',
      start: 'top 75%',
      once: true,
    },
  });

  // Stats counter
  gsap.from('.stat', {
    opacity: 0,
    y: 25,
    stagger: 0.12,
    duration: 0.7,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.about__stats',
      start: 'top 85%',
      once: true,
    },
  });

  // Reflections: split left/right
  gsap.from('.refl-counter', {
    opacity: 0,
    x: -60,
    scale: 0.92,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.reflections__inner',
      start: 'top 75%',
      once: true,
    },
  });

  gsap.from('.reflections__content', {
    opacity: 0,
    x: 60,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.reflections__inner',
      start: 'top 75%',
      once: true,
    },
  });

  // Download CTA
  gsap.from('.download-cta__logo', {
    opacity: 0,
    scale: 0.8,
    duration: 1.0,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.download-cta',
      start: 'top 70%',
      once: true,
    },
  });

  gsap.from(['.download-cta__heading', '.download-cta__sub'], {
    opacity: 0,
    y: 35,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.download-cta',
      start: 'top 70%',
      once: true,
    },
    delay: 0.2,
  });

  gsap.from('.download-cta__buttons .btn', {
    opacity: 0,
    y: 25,
    scale: 0.9,
    stagger: 0.12,
    duration: 0.7,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.download-cta__buttons',
      start: 'top 80%',
      once: true,
    },
  });
}

// ── Categories grid ──────────────────────────────────────────

function animateCategories() {
  // Header
  gsap.from('.categories .section__eyebrow', {
    opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.categories .section__header', start: 'top 80%', once: true },
  });

  gsap.from('.categories .section__heading', {
    opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', delay: 0.1,
    scrollTrigger: { trigger: '.categories .section__header', start: 'top 80%', once: true },
  });

  gsap.from('.categories .section__sub', {
    opacity: 0, y: 25, duration: 0.7, ease: 'power3.out', delay: 0.2,
    scrollTrigger: { trigger: '.categories .section__header', start: 'top 80%', once: true },
  });

  // Cards staggered
  gsap.from('.cat-card', {
    opacity: 0,
    y: 50,
    scale: 0.90,
    stagger: {
      each: 0.09,
      grid: 'auto',
      from: 'start',
    },
    duration: 0.75,
    ease: 'back.out(1.2)',
    scrollTrigger: {
      trigger: '.categories__grid',
      start: 'top 80%',
      once: true,
    },
  });
}

// ── How It Works ─────────────────────────────────────────────

function animateHowItWorks() {
  gsap.from('.how .section__eyebrow', {
    opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.how .section__header', start: 'top 80%', once: true },
  });

  gsap.from('.how .section__heading', {
    opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', delay: 0.1,
    scrollTrigger: { trigger: '.how .section__header', start: 'top 80%', once: true },
  });

  // Steps reveal
  gsap.from('.step', {
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.how__steps',
      start: 'top 80%',
      once: true,
    },
  });

  // Connector lines scale in
  gsap.from('.step__connector-line', {
    scaleX: 0,
    transformOrigin: 'left center',
    stagger: 0.2,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.how__steps',
      start: 'top 75%',
      once: true,
    },
    delay: 0.4,
  });
}

// ── Reflections counter animation ────────────────────────────

function animateReflections() {
  // Animate counter value
  ScrollTrigger.create({
    trigger: '.refl-counter',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      const el = document.getElementById('reflCounterVal');
      if (!el) return;
      gsap.fromTo(el,
        { innerText: 0 },
        {
          innerText: 12,
          duration: 1.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate() {
            el.textContent = Math.round(this.targets()[0].innerText);
          },
        }
      );
    },
  });

  // Gauge fill animation
  ScrollTrigger.create({
    trigger: '.refl-counter__gauge',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.from('.refl-counter__fill', {
        width: '0%',
        duration: 1.8,
        ease: 'power3.out',
        delay: 0.3,
      });
    },
  });
}

// ── Blessed card ─────────────────────────────────────────────

function animateBlessed() {
  gsap.from('.blessed .section__eyebrow', {
    opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.blessed', start: 'top 80%', once: true },
  });

  gsap.from('.blessed__card', {
    opacity: 0,
    y: 60,
    scale: 0.94,
    duration: 1.1,
    ease: 'back.out(1.2)',
    scrollTrigger: {
      trigger: '.blessed',
      start: 'top 75%',
      once: true,
    },
  });

  gsap.from('.blessed__feature', {
    opacity: 0,
    x: -20,
    stagger: 0.08,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.blessed__features',
      start: 'top 80%',
      once: true,
    },
    delay: 0.3,
  });

  gsap.from('.blessed__ctas .btn', {
    opacity: 0,
    y: 20,
    scale: 0.9,
    stagger: 0.1,
    duration: 0.7,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.blessed__ctas',
      start: 'top 85%',
      once: true,
    },
  });
}

// ── Nav scroll effect ─────────────────────────────────────────

function animateNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 'top -80px',
    end: 'max',
    onUpdate: self => {
      if (self.progress > 0) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    },
  });
}
