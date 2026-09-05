/* ─────────────────────────────────────────────────────────────────
   main.js — Bishoy Nabil Portfolio
   ─────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Custom Cursor ─────────────────────────────────────────────── */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let ringW = 40, ringH = 40;
  let rafId;
  let activeTarget = null;

  function animateCursor() {
    let targetX = mouseX;
    let targetY = mouseY;
    let targetW = 40;
    let targetH = 40;

    if (activeTarget && document.body.classList.contains('cursor-hover')) {
      const rect = activeTarget.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
      targetW = rect.width + 24; // padding around the element
      targetH = rect.height + 24;
    }

    ringX += (targetX - ringX) * 0.15;
    ringY += (targetY - ringY) * 0.15;
    ringW += (targetW - ringW) * 0.15;
    ringH += (targetH - ringH) * 0.15;

    if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
    if (ring) {
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      ring.style.width = ringW + 'px';
      ring.style.height = ringH + 'px';
    }

    // Parallax effect for scribbles (very subtle, ghost-like drift)
    const scribbles = document.querySelectorAll('.scribble');
    if (scribbles.length > 0) {
      const normX = (mouseX / window.innerWidth) * 2 - 1;
      const normY = (mouseY / window.innerHeight) * 2 - 1;

      scribbles.forEach((scribble, index) => {
        const intensity = 2 + (index * 0.8); // whisper-level depth layers
        const moveX = normX * intensity;
        const moveY = normY * intensity;
        scribble.style.setProperty('--tx', `${moveX}px`);
        scribble.style.setProperty('--ty', `${moveY}px`);
      });
    }

    rafId = requestAnimationFrame(animateCursor);
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    animateCursor();

    const hoverTargets = 'a, button, .project-card, input, textarea, .skill-group, .about-stat, h1, h2, h3, h4, img, .hero-stat-card';
    document.addEventListener('mouseover', e => {
      const target = e.target.closest(hoverTargets);
      if (target) {
        activeTarget = target;
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', e => {
      const target = e.target.closest(hoverTargets);
      if (target) {
        activeTarget = null;
        document.body.classList.remove('cursor-hover');
      }
    });
  } else {
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  /* ── Navbar: active link + live clock ────────────────────────── */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const navTime = document.getElementById('navTime');

  // Live clock
  function updateClock() {
    if (!navTime) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    navTime.textContent = h + ':' + m;
  }
  updateClock();
  setInterval(updateClock, 30000);

  function updateNav() {
    const scrollY = window.scrollY;

    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 120) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Mobile Nav ────────────────────────────────────────────────── */
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('navMobile');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function closeMobileNav() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) closeMobileNav();
    });
  }

  /* ── Reveal on scroll ──────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ── Skill bars animate on enter ──────────────────────────────── */
  const skillBars = document.querySelectorAll('.skill-bar');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Drive transform via CSS custom property for layout-thrash-free animation
        const level = parseFloat(entry.target.dataset.level || 100) / 100;
        entry.target.style.setProperty('--skill-scale', level);
        entry.target.classList.add('in-view');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ── Smooth scroll for anchor links ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      closeMobileNav();
      const navH = navbar ? navbar.offsetHeight : 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Hero entrance animation ──────────────────────────────────── */
  // Trigger reveals immediately for elements already in view
  setTimeout(() => {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) el.classList.add('visible');
    });
  }, 100);

  /* ── Contact form ─────────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name = form.querySelector('#contact-name').value.trim();
      const email = form.querySelector('#contact-email-input').value.trim();
      const message = form.querySelector('#contact-message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showFeedback('Please fill in your name, email, and message.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate send (replace with your backend / Formspree / EmailJS)
      const submitBtn = form.querySelector('#contact-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        showFeedback('Message sent! I\'ll get back to you within 24h.', 'success');
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }, 1400);
    });
  }

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.style.display = 'block';
    feedback.style.color = type === 'success' ? 'var(--clr-accent-3)' : 'var(--clr-accent-2)';
    feedback.style.borderColor = type === 'success' ? 'var(--clr-accent-3)' : 'var(--clr-accent-2)';
    setTimeout(() => { feedback.style.display = 'none'; }, 6000);
  }

  /* ── Cleanup on page unload ───────────────────────────────────── */
  window.addEventListener('unload', () => { cancelAnimationFrame(rafId); });

})();
