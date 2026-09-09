(function () {
  'use strict';

  const container = document.getElementById('hero-3d-model');
  if (!container) return;

  const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);

  // ── Dynamic Script Loader (Loads Three.js asynchronously on demand) ─
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (window.THREE && (!src.includes('GLTFLoader') || window.THREE.GLTFLoader)) return resolve();
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensureThreeLoaded() {
    if (window.THREE && window.THREE.GLTFLoader) {
      return Promise.resolve();
    }
    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'));
  }

  // ── 3D Engine Setup ──────────────────────────────────────────────
  let playWaveAnimation = null;

  function init3D() {
    if (!window.THREE || !window.THREE.GLTFLoader) return;

    // Cache initial dimensions to avoid forced layout thrashing
    const initialWidth = container.clientWidth || 300;
    const initialHeight = container.clientHeight || 400;

    // ── Scene Setup ──────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Lighting ─────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight2.position.set(-10, 5, -10);
    scene.add(dirLight2);

    // ── Camera ───────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 0.1, 100);
    camera.position.z = 5;

    // ── Renderer (Optimized for Mobile) ──────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // Disable MSAA on mobile for massive GPU fill-rate boost
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp'
    });
    renderer.setSize(initialWidth, initialHeight);
    // Force DPR = 1.0 on mobile to cut pixel workload by up to 9x, 1.5 on desktop
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // ── State Variables ──────────────────────────────────────────────
    let modelGroup;
    let mixer;
    let waveAction;

    let targetRotationX = 0;
    let targetRotationY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    // ── Load Model ───────────────────────────────────────────────────
    const loader = new THREE.GLTFLoader();
    loader.load('Assets/Boxy%20Snail%20V1.2.glb', (gltf) => {
      const model = gltf.scene;

      // Automatically scale and center the model
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      const targetSize = 0.3;
      const scale = targetSize / maxDim;

      const centeredGroup = new THREE.Group();
      model.position.set(0, 0, 0);
      centeredGroup.add(model);

      const baseGroup = new THREE.Group();
      baseGroup.scale.setScalar(scale);
      baseGroup.add(centeredGroup);

      const defaultRotationX = 0;
      const defaultRotationY = -100;
      const defaultRotationZ = 0;

      baseGroup.rotation.x = THREE.MathUtils.degToRad(defaultRotationX);
      baseGroup.rotation.y = THREE.MathUtils.degToRad(defaultRotationY);
      baseGroup.rotation.z = THREE.MathUtils.degToRad(defaultRotationZ);

      modelGroup = new THREE.Group();
      modelGroup.add(baseGroup);
      scene.add(modelGroup);

      // Setup animations
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        waveAction = mixer.clipAction(gltf.animations[0]);
        waveAction.setLoop(THREE.LoopOnce, 1);
        waveAction.clampWhenFinished = false;

        playWaveAnimation = function () {
          if (waveAction) {
            waveAction.reset();
            waveAction.play();
          }
        };

        // Play once on load
        playWaveAnimation();
      }
    }, undefined, (error) => {
      console.error('Error loading 3D model:', error);
    });

    // ── Desktop Parallax Mouse Movement ──────────────────────────────
    if (!isMobile) {
      document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX - windowHalfX) / windowHalfX;
        const mouseY = (event.clientY - windowHalfY) / windowHalfY;
        targetRotationY = mouseX * 0.5;
        targetRotationX = mouseY * 0.25;
      }, { passive: true });
    }

    // ── Animation Loop (Scroll-aware & FPS throttled on mobile) ───────
    const clock = new THREE.Clock();
    let isVisible = true;
    let isAnimating = false;
    let isScrolling = false;
    let scrollEndTimer = null;
    let lastFrameTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    function animate(timestamp) {
      if (!isVisible || isScrolling) {
        isAnimating = false;
        return;
      }
      requestAnimationFrame(animate);

      // Cap at 30 FPS on mobile to halve GPU load and eliminate thermal throttling
      if (isMobile && timestamp) {
        const elapsed = timestamp - lastFrameTime;
        if (elapsed < frameInterval) return;
        lastFrameTime = timestamp - (elapsed % frameInterval);
      }

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      if (modelGroup) {
        modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * 5 * delta;
        modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * 5 * delta;
      }

      renderer.render(scene, camera);
    }

    // Pause rendering when hero is scrolled out of viewport
    if ('IntersectionObserver' in window) {
      const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !isAnimating && !isScrolling) {
            isAnimating = true;
            clock.getDelta();
            requestAnimationFrame(animate);
          }
        });
      }, { threshold: 0.05 });
      visibilityObserver.observe(container);
    }

    // ⚡ INSTANT SCROLL FIX: Pause WebGL completely while user is scrolling/touching
    const handleScrollStart = () => {
      isScrolling = true;
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        isScrolling = false;
        if (isVisible && !isAnimating) {
          isAnimating = true;
          clock.getDelta();
          requestAnimationFrame(animate);
        }
      }, 120);
    };

    window.addEventListener('scroll', handleScrollStart, { passive: true });
    window.addEventListener('touchmove', handleScrollStart, { passive: true });

    isAnimating = true;
    animate();

    // ── Resize Handler (Debounced) ───────────────────────────────────
    let resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        if (container && container.clientWidth > 0 && container.clientHeight > 0) {
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        }
      }, 80);
    }

    window.addEventListener('resize', onResize, { passive: true });
  }

  // ── Scheduling: Start loading Three.js & Model on idle/after-paint ──
  function scheduleLoad() {
    if (isMobile) {
      // On mobile: load after page load + idle to give 100% bandwidth & CPU to FCP/LCP
      const trigger = () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => ensureThreeLoaded().then(init3D), { timeout: 2500 });
        } else {
          setTimeout(() => ensureThreeLoaded().then(init3D), 400);
        }
      };

      if (document.readyState === 'complete') {
        trigger();
      } else {
        window.addEventListener('load', trigger, { once: true });
      }
    } else {
      // Desktop: load on idle
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => ensureThreeLoaded().then(init3D), { timeout: 1200 });
      } else {
        setTimeout(() => ensureThreeLoaded().then(init3D), 100);
      }
    }
  }

  scheduleLoad();

  // ── Greeting Counter & Popup UI (Works immediately even before 3D loads) ─
  const popup = document.getElementById('snail-greeting-popup');
  const countEl = document.getElementById('greetingCount');
  const labelEl = popup ? popup.querySelector('.greeting-label') : null;
  let popupTimer = null;

  const COOLDOWN_KEY = 'snail_cooldown_until';
  const SESSION_KEY = 'snail_session_greetings';
  const COOLDOWN_MS = 60 * 1000; // 1 minute
  const GREET_LIMIT = 10;

  function getMonthKey() {
    const now = new Date();
    return `snail_greetings_${now.getFullYear()}_${now.getMonth()}`;
  }

  function getCount() {
    return parseInt(localStorage.getItem(getMonthKey()) || '0', 10);
  }

  function getSessionGreetings() {
    return parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
  }

  function setSessionGreetings(n) {
    sessionStorage.setItem(SESSION_KEY, n);
  }

  function isCoolingDown() {
    const until = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
    return Date.now() < until;
  }

  function startCooldown() {
    localStorage.setItem(COOLDOWN_KEY, Date.now() + COOLDOWN_MS);
    setSessionGreetings(0);
  }

  function incrementCount() {
    const key = getMonthKey();
    const next = getCount() + 1;
    localStorage.setItem(key, next);
    return next;
  }

  function showNormalPopup(count) {
    if (!popup || !countEl || !labelEl) return;

    popup.classList.remove('is-tired');
    labelEl.textContent = 'Greeted this month';
    countEl.textContent = count;

    countEl.classList.remove('bump');
    void countEl.offsetWidth;
    countEl.classList.add('bump');
    setTimeout(() => countEl.classList.remove('bump'), 300);

    popup.classList.add('is-visible');
    clearTimeout(popupTimer);
    popupTimer = setTimeout(() => popup.classList.remove('is-visible'), 3000);
  }

  function showTiredPopup() {
    if (!popup || !labelEl) return;

    popup.classList.add('is-visible', 'is-tired');
    labelEl.textContent = 'Snail is tired — come back later 💤';

    clearTimeout(popupTimer);
    popupTimer = setTimeout(() => {
      popup.classList.remove('is-visible');
    }, 4000);
  }

  if (countEl) countEl.textContent = getCount();

  function spawnXP() {
    const xp = document.createElement('div');
    xp.className = 'snail-xp-floater';
    xp.textContent = '+1';

    const offsetX = (Math.random() - 0.5) * 60;
    const offsetY = (Math.random() - 0.5) * 40;

    xp.style.left = `calc(50% + ${offsetX}px)`;
    xp.style.top = `calc(50% + ${offsetY}px)`;

    container.appendChild(xp);

    setTimeout(() => {
      if (xp.parentNode) xp.parentNode.removeChild(xp);
    }, 1500);
  }

  container.addEventListener('click', () => {
    if (isCoolingDown()) {
      showTiredPopup();
      return;
    }

    if (playWaveAnimation) {
      playWaveAnimation();
    }
    spawnXP();

    const sessionCount = getSessionGreetings() + 1;
    setSessionGreetings(sessionCount);
    const newCount = incrementCount();

    if (sessionCount >= GREET_LIMIT) {
      startCooldown();
      showTiredPopup();
    } else {
      showNormalPopup(newCount);
    }
  });

})();
