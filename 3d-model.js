(function () {
  'use strict';

  const container = document.getElementById('hero-3d-model');
  if (!container) return;

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
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 5;

  // ── Renderer ─────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Target size for the model in the scene. 
    // 👉 TWEAK THIS to make the model bigger or smaller! (e.g. 1.0 for smaller, 2.5 for larger)
    const targetSize = 0.3;
    const scale = targetSize / maxDim;

    // Center the model's geometry relative to its bounding box center
    // 1. Create a group that offsets the raw model to (0,0,0) center
    const centeredGroup = new THREE.Group();
    // Use the model's native origin instead of the bounding box center
    model.position.set(0, 0, 0);
    centeredGroup.add(model);

    // 2. Base Rotation & Scale Group (holds default rotation around exact center)
    const baseGroup = new THREE.Group();
    baseGroup.scale.setScalar(scale);
    baseGroup.add(centeredGroup);

    // 👉 TWEAK THIS to change the model's default orientation/rotation (in degrees)!
    // Y = left/right turn, X = tilt up/down, Z = roll side-to-side
    const defaultRotationX = 0;   // e.g. 10 to tilt up slightly
    const defaultRotationY = -100; // e.g. 45 to turn right 45°, -45 to turn left
    const defaultRotationZ = 0;   // e.g. 15 to tilt sideways

    baseGroup.rotation.x = THREE.MathUtils.degToRad(defaultRotationX);
    baseGroup.rotation.y = THREE.MathUtils.degToRad(defaultRotationY);
    baseGroup.rotation.z = THREE.MathUtils.degToRad(defaultRotationZ);

    // 3. Main Pivot Group (handles mouse movement/parallax around exact center)
    modelGroup = new THREE.Group();
    modelGroup.add(baseGroup);
    scene.add(modelGroup);

    // Setup animations
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      // Assume the first animation is the waving one
      waveAction = mixer.clipAction(gltf.animations[0]);

      waveAction.setLoop(THREE.LoopOnce, 1);
      waveAction.clampWhenFinished = false;

      // Play once on load
      playAnimation();
    }
  }, undefined, (error) => {
    console.error('Error loading 3D model:', error);
  });

  function playAnimation() {
    if (waveAction) {
      waveAction.reset();
      waveAction.play();
    }
  }

  // ── Interactions ─────────────────────────────────────────────────

  // Parallax rotation clamping the back view
  document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates from -1 to 1
    const mouseX = (event.clientX - windowHalfX) / windowHalfX;
    const mouseY = (event.clientY - windowHalfY) / windowHalfY;

    // Clamp rotation to ensure the back is never seen
    // (e.g. max ±30 degrees or ~0.5 radians around Y, ±15 degrees around X)
    targetRotationY = mouseX * 0.5;
    targetRotationX = mouseY * 0.25;
  });

  // ── Greeting Counter ─────────────────────────────────────────────
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

  function getCooldownSecondsLeft() {
    const until = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
    return Math.max(0, Math.ceil((until - Date.now()) / 1000));
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

    // Restore normal state
    popup.classList.remove('is-tired');
    labelEl.textContent = 'Greeted this month';
    countEl.textContent = count;

    // Simple flash animation
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

  // Seed the count on load
  if (countEl) countEl.textContent = getCount();

  function spawnXP() {
    const xp = document.createElement('div');
    xp.className = 'snail-xp-floater';
    xp.textContent = '+1';

    // Randomize position slightly around the center
    const offsetX = (Math.random() - 0.5) * 60; // -30px to 30px
    const offsetY = (Math.random() - 0.5) * 40; // -20px to 20px

    xp.style.left = `calc(50% + ${offsetX}px)`;
    xp.style.top = `calc(50% + ${offsetY}px)`;

    container.appendChild(xp);

    // Remove after animation completes
    setTimeout(() => {
      if (xp.parentNode) xp.parentNode.removeChild(xp);
    }, 1500);
  }

  // Click to play animation + greeting counter
  container.addEventListener('click', () => {
    if (isCoolingDown()) {
      // Still in cooldown — show tired message, block animation
      showTiredPopup();
      return;
    }

    playAnimation();
    spawnXP();

    const sessionCount = getSessionGreetings() + 1;
    setSessionGreetings(sessionCount);
    const newCount = incrementCount();

    if (sessionCount >= GREET_LIMIT) {
      // Hit the limit — start cooldown, show tired message
      startCooldown();
      showTiredPopup();
    } else {
      showNormalPopup(newCount);
    }
  });

  // ── Animation Loop ───────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) {
      mixer.update(delta);
    }

    if (modelGroup) {
      // Smoothly interpolate to target rotation
      modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * 5 * delta;
      modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * 5 * delta;
    }

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize Handler ───────────────────────────────────────────────
  function onResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    if (container && container.clientWidth > 0 && container.clientHeight > 0) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  }

  window.addEventListener('resize', onResize);

  if (window.ResizeObserver && container) {
    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(container);
  }

})();
