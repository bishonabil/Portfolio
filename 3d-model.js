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
  loader.load('Assets/Boxy%20Snail.glb', (gltf) => {
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
    model.position.set(-center.x, -center.y, -center.z);
    centeredGroup.add(model);

    // 2. Base Rotation & Scale Group (holds default rotation around exact center)
    const baseGroup = new THREE.Group();
    baseGroup.scale.setScalar(scale);
    baseGroup.add(centeredGroup);

    // 👉 TWEAK THIS to change the model's default orientation/rotation (in degrees)!
    // Y = left/right turn, X = tilt up/down, Z = roll side-to-side
    const defaultRotationX = 0;   // e.g. 10 to tilt up slightly
    const defaultRotationY = -90; // e.g. 45 to turn right 45°, -45 to turn left
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

  // Click to play animation
  container.addEventListener('click', () => {
    playAnimation();

    // Optional: add a small reactive scale bump to confirm click
    if (modelGroup) {
      modelGroup.scale.set(1.05, 1.05, 1.05);
      setTimeout(() => {
        modelGroup.scale.set(1, 1, 1);
      }, 150);
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
