/* ============================================================
   VESPERA — Interactions: Custom Cursor, Magnetic Buttons,
             3D Card Tilt, Mobile Nav
   ============================================================ */

// ── Custom Cursor ────────────────────────────────────────────

export function initCursor() {
  // Skip on touch devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
  let currentX = 0, currentY = 0;

  const lerp = (a, b, t) => a + (b - a) * t;

  document.addEventListener('mousemove', e => {
    currentX = e.clientX;
    currentY = e.clientY;
  });

  function animateCursor() {
    dotX = currentX;
    dotY = currentY;

    ringX = lerp(ringX, currentX, 0.12);
    ringY = lerp(ringY, currentY, 0.12);

    dot.style.transform  = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hoverable elements
  const hoverEls = document.querySelectorAll(
    'a, button, .btn, .cat-card, .nav__link--blessed, .footer__link, .footer__store-btn, [data-magnetic]'
  );

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });

  // Hide on leave
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

// ── Magnetic Buttons ─────────────────────────────────────────

export function initMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const magnetEls = document.querySelectorAll('[data-magnetic]');

  magnetEls.forEach(el => {
    let rect = el.getBoundingClientRect();
    let rafId;

    // Update rect on scroll (debounced)
    const updateRect = () => { rect = el.getBoundingClientRect(); };
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });

    el.addEventListener('mousemove', e => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = Math.max(rect.width, rect.height) * 0.8;

        if (dist < radius) {
          const strength = 0.35;
          const tx = dx * strength;
          const ty = dy * strength;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        }
      });
    });

    el.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
}

// ── 3D Card Tilt ─────────────────────────────────────────────

export function initCardTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    let rect = card.getBoundingClientRect();
    let rafId;
    let currentRX = 0, currentRY = 0;
    let targetRX  = 0, targetRY  = 0;

    const lerp = (a, b, t) => a + (b - a) * t;

    const updateRect = () => { rect = card.getBoundingClientRect(); };
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });

    function tiltLoop() {
      currentRX = lerp(currentRX, targetRX, 0.1);
      currentRY = lerp(currentRY, targetRY, 0.1);

      card.style.transform = `perspective(800px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale3d(1.03, 1.03, 1.03)`;

      // Update glow position
      const glow = card.querySelector('.cat-card__glow');
      if (glow) {
        const mx = ((currentRY / 12) + 0.5) * 100;
        const my = ((-currentRX / 8) + 0.5) * 100;
        glow.style.setProperty('--mx', mx + '%');
        glow.style.setProperty('--my', my + '%');
      }

      if (Math.abs(currentRX - targetRX) > 0.01 || Math.abs(currentRY - targetRY) > 0.01) {
        rafId = requestAnimationFrame(tiltLoop);
      }
    }

    card.addEventListener('mousemove', e => {
      updateRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      targetRX = -(dy / (rect.height / 2)) * 8;
      targetRY =  (dx / (rect.width  / 2)) * 12;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tiltLoop);
    });

    card.addEventListener('mouseleave', () => {
      targetRX = 0;
      targetRY = 0;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tiltLoop);

      // Reset after easing back
      setTimeout(() => {
        card.style.transform = '';
      }, 600);
    });

    card.addEventListener('mouseenter', () => {
      updateRect();
    });
  });
}

// ── Mobile Navigation ─────────────────────────────────────────

export function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (!toggle || !mobile) return;

  let isOpen = false;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    toggle.classList.toggle('is-open', isOpen);
    mobile.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false;
      toggle.classList.remove('is-open');
      mobile.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (isOpen && !e.target.closest('#nav')) {
      isOpen = false;
      toggle.classList.remove('is-open');
      mobile.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Smooth anchor scrolling ───────────────────────────────────

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      const offset = target.getBoundingClientRect().top + window.scrollY - navH - 20;

      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

// ── Animated counter on viewport enter ───────────────────────
// (backup for when GSAP isn't loaded)
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el   = entry.target;
      const end  = parseInt(el.dataset.count, 10);
      const dur  = 1500;
      const step = end / (dur / 16);
      let current = 0;

      const timer = setInterval(() => {
        current = Math.min(current + step, end);
        el.textContent = Math.round(current);
        if (current >= end) clearInterval(timer);
      }, 16);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}
