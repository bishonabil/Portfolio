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

    const hoverTargets = 'a, button, .pcard, .sskill-card, input, textarea, .skill-group, .about-stat, h1, h2, h3, h4, img, .hero-stat-card';
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

  /* ── Skill bars animate on enter (Ultra-Reliable Multi-Trigger) ── */
  const skillsSection = document.getElementById('skills');
  const skillsGrid = document.querySelector('.skills-grid');
  const skillBars = document.querySelectorAll('.skill-bar');

  function activateAllSkillBars() {
    skillBars.forEach(bar => {
      const level = parseFloat(bar.dataset.level || 100) / 100;
      bar.style.setProperty('--skill-scale', level);
      bar.classList.add('in-view');
    });
    if (skillsSection) skillsSection.classList.add('is-visible');
    if (skillsGrid) skillsGrid.classList.add('visible');
  }

  if ('IntersectionObserver' in window) {
    // 1. Broad observer on the entire skills section & grid with lookahead margin
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activateAllSkillBars();
          sectionObserver.disconnect();
        }
      });
    }, { threshold: 0.05, rootMargin: '120px 0px 120px 0px' });

    if (skillsSection) sectionObserver.observe(skillsSection);
    if (skillsGrid) sectionObserver.observe(skillsGrid);

    // 2. Individual bar observer with zero threshold as backup
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const level = parseFloat(entry.target.dataset.level || 100) / 100;
          entry.target.style.setProperty('--skill-scale', level);
          entry.target.classList.add('in-view');
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '60px 0px 60px 0px' });

    skillBars.forEach(bar => skillObserver.observe(bar));
  } else {
    activateAllSkillBars();
  }

  // 3. Viewport proximity check for instant loads, refreshes & fast scrolling
  function checkSkillsInView() {
    if (!skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight + 120 && rect.bottom > -80) {
      activateAllSkillBars();
    }
  }

  checkSkillsInView();
  window.addEventListener('scroll', checkSkillsInView, { passive: true });
  window.addEventListener('hashchange', checkSkillsInView);
  window.addEventListener('load', checkSkillsInView);
  setTimeout(checkSkillsInView, 150);
  setTimeout(checkSkillsInView, 500);

  /* ── Smooth scroll for anchor links ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      closeMobileNav();
      if (id === 'skills') activateAllSkillBars();
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

      // Real Formspree submission via AJAX (seamless, no page redirect)
      const submitBtn = form.querySelector('#contact-submit');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      const formData = new FormData(form);

      fetch(form.action || 'https://formspree.io/f/xljewdzw', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          showFeedback('Message received! I will get back to you within 24h.', 'success');
          form.reset();
        } else {
          response.json().then(data => {
            if (data && data.errors) {
              const errMsgs = data.errors.map(err => err.message).join(', ');
              showFeedback(`Submission error: ${errMsgs}`, 'error');
            } else {
              showFeedback('Oops! There was a problem sending your message. Please try emailing me directly.', 'error');
            }
          }).catch(() => {
            showFeedback('Oops! There was a problem sending your message.', 'error');
          });
        }
      })
      .catch(error => {
        showFeedback('Network error. Please check your connection or reach out on WhatsApp / Email.', 'error');
      })
      .finally(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
    });
  }

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.style.display = 'block';
    feedback.style.color = type === 'success' ? 'var(--clr-accent-3)' : 'var(--clr-accent-2)';
    feedback.style.borderColor = type === 'success' ? 'var(--clr-accent-3)' : 'var(--clr-accent-2)';
    setTimeout(() => { feedback.style.display = 'none'; }, 6000);
  }

  /* ── Project card scroll progress tracker ──────────────────────── */
  const progressCurrent = document.getElementById('progressCurrent');
  const pcards = document.querySelectorAll('.pcard');

  if (progressCurrent && pcards.length) {
    function updateProjectProgress() {
      const threshold = window.innerHeight * 0.5;
      let active = 1;
      pcards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= threshold) {
          active = index + 1;
        }
      });
      progressCurrent.textContent = active.toString().padStart(2, '0');
    }

    window.addEventListener('scroll', updateProjectProgress, { passive: true });
    updateProjectProgress();
  }

  /* ── Side-Skills Swiss Knife Interaction Engine ──────────────── */
  const sideSkills = document.getElementById('sideSkills');
  if (sideSkills) {
    sideSkills.setAttribute('data-js-ready', 'true');
    const cards = Array.from(sideSkills.querySelectorAll('.sskill-card'));
    let activeIndex = -1;
    let isLocked = false;
    let leaveTimer = null;

    function setActiveBlade(index) {
      if (index === activeIndex) return;
      activeIndex = index;

      cards.forEach((card, i) => {
        const isActive = (i === activeIndex);
        const isPrev = (activeIndex !== -1 && i < activeIndex);
        const isNext = (activeIndex !== -1 && i > activeIndex);

        card.classList.toggle('is-active', isActive);
        card.classList.toggle('is-pushed-prev', isPrev);
        card.classList.toggle('is-pushed-next', isNext);
        card.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      });

      sideSkills.dataset.active = activeIndex.toString();
    }

    cards.forEach((card, idx) => {
      // Enter card immediately: activate and cancel any leave timer
      const activate = () => {
        if (!isLocked) {
          clearTimeout(leaveTimer);
          setActiveBlade(idx);
        }
      };

      card.addEventListener('pointerenter', activate);
      card.addEventListener('mouseenter', activate);

      // Click toggles lock state for reading inspection
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeIndex === idx && isLocked) {
          isLocked = false;
          setActiveBlade(-1);
        } else {
          isLocked = true;
          setActiveBlade(idx);
        }
      });

      // Keyboard navigation
      card.addEventListener('focus', () => {
        if (!isLocked) setActiveBlade(idx);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          isLocked = !isLocked;
          setActiveBlade(idx);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = (idx - 1 + cards.length) % cards.length;
          cards[prev].focus();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const next = (idx + 1) % cards.length;
          cards[next].focus();
        } else if (e.key === 'Escape') {
          isLocked = false;
          setActiveBlade(-1);
          card.blur();
        }
      });
    });

    // When pointer leaves the widget, wait 240ms buffer before closing.
    // If pointer enters another blade during this grace window, timer is cancelled.
    const handleWidgetLeave = () => {
      if (!isLocked) {
        clearTimeout(leaveTimer);
        leaveTimer = setTimeout(() => {
          if (isLocked) return;
          const isStillHovered = sideSkills.matches(':hover') || cards.some(c => c.matches(':hover'));
          if (!isStillHovered) {
            setActiveBlade(-1);
          }
        }, 240);
      }
    };

    const handleWidgetEnter = () => {
      clearTimeout(leaveTimer);
    };

    sideSkills.addEventListener('mouseleave', handleWidgetLeave);
    sideSkills.addEventListener('pointerleave', handleWidgetLeave);
    sideSkills.addEventListener('mouseenter', handleWidgetEnter);
    sideSkills.addEventListener('pointerenter', handleWidgetEnter);

    // Clicking anywhere outside unlocks and resets
    document.addEventListener('click', (e) => {
      if (isLocked && !sideSkills.contains(e.target)) {
        isLocked = false;
        setActiveBlade(-1);
      }
    });
  }

  /* ── Cleanup on page unload ───────────────────────────────────── */
  window.addEventListener('unload', () => { cancelAnimationFrame(rafId); });

})();
