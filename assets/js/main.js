/**
 * SAIDUL ISLAM - SIGNATURE INTERACTIVE ENGINE
 * Features:
 * - Fluid Canvas Constellation & Mouse Particle Flow
 * - Dual Custom Trailing Magnetic Cursor
 * - 3D Gyro Bento Tilt with Glare Refraction
 * - Scroll Reveal System
 * - Dual-Mode (Dark/Light) with State Persistence
 * - Instant 2-Page Executive PDF Exporter
 * - Mobile App Zoom Lightbox & Interactive Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof hydratePortfolioContent === 'function') {
    hydratePortfolioContent();
  }
  initDynamicExperience();
  initInteractiveCursor();
  initHero3DNetwork();
  initParticleCanvas();
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initCounters();
  init3DTilt();
  initExperienceCurvedTrack();
  initScrollReveal();
  initModals();
  initAppLightbox();
  initContactForm();
  initClipboardActions();
  initBackToTop();
});

/* ==========================================================================
   1.2. DYNAMIC S-CURVE ANIMATED LASER TRACK & STEP-BY-STEP EXPERIENCE ENGINE
   ========================================================================== */
let experienceCometAnimationId = null;
let currentActiveStep = 1;

function initExperienceCurvedTrack() {
  updateExperienceLaserPath();
  initStepProgressionGuide();

  window.addEventListener('resize', () => {
    updateExperienceLaserPath();
  }, { passive: true });
  
  window.addEventListener('scroll', () => {
    updateExperienceLaserPath();
  }, { passive: true });
}

function updateExperienceLaserPath() {
  const container = document.querySelector('.experience-vertical-timeline');
  if (!container) return;

  const cards = container.querySelectorAll('.experience-step-card, .bento-card');
  if (cards.length < 3) return;

  const isDesktop = window.innerWidth >= 768;
  const containerRect = container.getBoundingClientRect();

  const c1Rect = cards[0].getBoundingClientRect();
  const c2Rect = cards[1].getBoundingClientRect();
  const c3Rect = cards[2].getBoundingClientRect();

  let d = '';

  if (isDesktop) {
    // Exact S-curve matching user's architecture:
    // Starts from right side of Card 1 (MEP Group)
    const startX = c1Rect.right - containerRect.left;
    const startY = (c1Rect.top + c1Rect.bottom) / 2 - containerRect.top + 30;

    // Sweeps to the right side of Card 2 (System Admin)
    const c2LeftX = c2Rect.left - containerRect.left;
    const c2RightX = c2Rect.right - containerRect.left;
    const c2TopY = c2Rect.top - containerRect.top;
    const c2CenterY = (c2Rect.top + c2Rect.bottom) / 2 - containerRect.top;
    const c2BottomY = c2Rect.bottom - containerRect.top;

    const loopRight = Math.min(containerRect.width - 20, c2RightX + 65);
    const underC2Y = c2BottomY + 40;

    // Sweeps to the left side of Card 3 (Mobile Apps)
    const c3LeftX = c3Rect.left - containerRect.left;
    const c3CenterY = (c3Rect.top + c3Rect.bottom) / 2 - containerRect.top;
    const c3BottomY = c3Rect.bottom - containerRect.top;

    const loopLeft = Math.max(15, c3LeftX - 60);
    const endX = c3LeftX;
    const endY = c3BottomY - 25;

    // Smooth bezier coordinates
    const cp1x = startX + (loopRight - startX) * 0.65;
    const cp1y = startY;
    const cp2x = loopRight;
    const cp2y = c2TopY - 25;
    const p2x = loopRight;
    const p2y = c2CenterY;

    const cp3x = loopRight;
    const cp3y = c2BottomY + 15;
    const cp4x = (c2LeftX + loopRight) / 2;
    const cp4y = underC2Y;
    const p3x = c2LeftX - 25;
    const p3y = underC2Y;

    const cp5x = loopLeft;
    const cp5y = underC2Y + 25;
    const cp6x = loopLeft;
    const cp6y = c3CenterY - 25;
    const p4x = loopLeft;
    const p4y = c3CenterY + 15;

    const cp7x = loopLeft;
    const cp7y = endY + 15;
    const cp8x = endX - 25;
    const cp8y = endY;

    d = `M ${startX} ${startY} ` +
        `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2x} ${p2y} ` +
        `C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${p3x} ${p3y} ` +
        `C ${cp5x} ${cp5y}, ${cp6x} ${cp6y}, ${p4x} ${p4y} ` +
        `C ${cp7x} ${cp7y}, ${cp8x} ${cp8y}, ${endX} ${endY}`;
  } else {
    // Mobile left laser line with subtle pulse curve
    const leftX = 24;
    const y1 = (c1Rect.top + c1Rect.bottom) / 2 - containerRect.top;
    const y2 = (c2Rect.top + c2Rect.bottom) / 2 - containerRect.top;
    const y3 = (c3Rect.top + c3Rect.bottom) / 2 - containerRect.top;

    d = `M ${leftX} ${y1} ` +
        `C ${leftX + 25} ${(y1 + y2) / 2}, ${leftX - 25} ${(y1 + y2) / 2}, ${leftX} ${y2} ` +
        `C ${leftX + 25} ${(y2 + y3) / 2}, ${leftX - 25} ${(y2 + y3) / 2}, ${leftX} ${y3}`;
  }

  const pathBase = document.getElementById('snake-laser-base-path');
  const pathDots = document.getElementById('snake-laser-dots-path');
  const pathGlow = document.getElementById('snake-laser-glow-path');
  const pathCore = document.getElementById('snake-laser-core-path');
  const pathPulse = document.getElementById('snake-laser-pulse-path');

  if (pathBase) pathBase.setAttribute('d', d);
  if (pathDots) pathDots.setAttribute('d', d);
  if (pathGlow) pathGlow.setAttribute('d', d);
  if (pathCore) pathCore.setAttribute('d', d);
  if (pathPulse) pathPulse.setAttribute('d', d);
}

/**
 * Step-by-Step Interactive Guide:
 * Glides a glowing photon comet along the exact laser line from Card 1 -> Card 2 -> Card 3.
 * Activates each milestone node and card as the beam moves across them.
 */
function initStepProgressionGuide() {
  const cometGroup = document.getElementById('snake-laser-comet-group');
  const pathPulse = document.getElementById('snake-laser-pulse-path') || document.getElementById('snake-laser-core-path');
  const stepPills = document.querySelectorAll('#experience-step-nav .step-phase-pill, .step-phase-pill');
  const stepNodes = document.querySelectorAll('.step-milestone-node');
  const stepCards = document.querySelectorAll('.experience-step-card, .bento-card[data-step]');

  // 1. Interactive Phase Pill & Node Click Handlers
  const setActiveStep = (stepNum, shouldScroll = false) => {
    currentActiveStep = stepNum;

    // Update Pills
    stepPills.forEach((pill, idx) => {
      const pStep = parseInt(pill.getAttribute('data-step') || (idx + 1));
      if (pStep === stepNum) {
        pill.classList.add('active');
        const ping = pill.querySelector('.animate-ping');
        if (!ping) {
          const dot = pill.querySelector('span:first-child');
          if (dot) dot.classList.add('animate-ping');
        }
      } else {
        pill.classList.remove('active');
        const dot = pill.querySelector('span:first-child');
        if (dot) dot.classList.remove('animate-ping');
      }
    });

    // Update Milestone Nodes
    stepNodes.forEach((node, idx) => {
      const nStep = parseInt(node.getAttribute('data-step-node') || (idx + 1));
      if (nStep === stepNum) {
        node.classList.add('is-active');
      } else {
        node.classList.remove('is-active');
      }
    });

    // Update Cards
    stepCards.forEach((card, idx) => {
      const cStep = parseInt(card.getAttribute('data-step') || (idx + 1));
      if (cStep === stepNum) {
        card.classList.add('is-active-step');
      } else {
        card.classList.remove('is-active-step');
      }
    });

    if (shouldScroll) {
      const targetCard = document.getElementById(`experience-card-${stepNum}`) || stepCards[stepNum - 1];
      if (targetCard) {
        const topPos = targetCard.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    }
  };

  stepPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const step = parseInt(pill.getAttribute('data-step') || 1);
      setActiveStep(step, true);
    });
  });

  stepNodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const step = parseInt(node.getAttribute('data-step-node') || 1);
      setActiveStep(step, true);
    });
  });

  // 2. Scroll Intersection Observer for Automatic In-View Step Sync
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepAttr = entry.target.getAttribute('data-step');
          if (stepAttr) {
            const step = parseInt(stepAttr);
            setActiveStep(step, false);
          }
        }
      });
    }, { threshold: 0.5 });

    stepCards.forEach(card => observer.observe(card));
  }

  // 3. Smooth Photon Comet Head RAF Animation Loop
  let progress = 0;
  const loopDurationMs = 4000; // 4 second full cycle through steps 1 -> 2 -> 3
  let lastTimestamp = performance.now();

  function animateLaserComet(timestamp) {
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    progress = (progress + (delta / loopDurationMs)) % 1;

    if (cometGroup && pathPulse) {
      const totalLen = pathPulse.getTotalLength ? pathPulse.getTotalLength() : 0;
      if (totalLen > 0) {
        const pt = pathPulse.getPointAtLength(progress * totalLen);
        cometGroup.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);

        // Automatically trigger subtle step highlight when photon passes milestones
        if (progress < 0.33 && currentActiveStep !== 1) {
          setActiveStep(1, false);
        } else if (progress >= 0.33 && progress < 0.68 && currentActiveStep !== 2) {
          setActiveStep(2, false);
        } else if (progress >= 0.68 && currentActiveStep !== 3) {
          setActiveStep(3, false);
        }
      }
    }

    experienceCometAnimationId = requestAnimationFrame(animateLaserComet);
  }

  if (experienceCometAnimationId) {
    cancelAnimationFrame(experienceCometAnimationId);
  }
  experienceCometAnimationId = requestAnimationFrame(animateLaserComet);
}

/* ==========================================================================
   1.5. THREE.JS 3D INTERACTIVE GLOBAL NETWORK MESH & ERP CONSTELLATION
   ========================================================================== */
function initHero3DNetwork() {
  const container = document.getElementById('global-3d-canvas-container') || document.getElementById('hero-3d-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Clear previous canvas if re-initialized
  container.innerHTML = '';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1500);
  camera.position.z = 240;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group for overall 3D rotation & scroll parallax
  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  // Generate 3D Enterprise Node Mesh (ERP, MicroTik, Cloud Nodes)
  const nodeCount = 85;
  const positions = new Float32Array(nodeCount * 3);
  const colors = new Float32Array(nodeCount * 3);
  const nodeVelocities = [];
  const spreadX = 360;
  const spreadY = 220;
  const spreadZ = 200;

  // Color Palette Definitions
  const colorCyan = new THREE.Color(0x00f5d4);
  const colorIndigo = new THREE.Color(0x818cf8);
  const colorEmerald = new THREE.Color(0x10b981);
  const colorGold = new THREE.Color(0xf59e0b);

  const colorLightBlue = new THREE.Color(0x0284c7);
  const colorLightIndigo = new THREE.Color(0x4f46e5);
  const colorLightEmerald = new THREE.Color(0x059669);
  const colorLightAmber = new THREE.Color(0xd97706);

  const isDark = document.documentElement.classList.contains('dark');
  const palette = isDark 
    ? [colorCyan, colorIndigo, colorEmerald, colorGold] 
    : [colorLightBlue, colorLightIndigo, colorLightEmerald, colorLightAmber];

  for (let i = 0; i < nodeCount; i++) {
    const x = (Math.random() - 0.5) * spreadX;
    const y = (Math.random() - 0.5) * spreadY;
    const z = (Math.random() - 0.5) * spreadZ;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const chosenColor = palette[i % palette.length];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;

    nodeVelocities.push({
      x: (Math.random() - 0.5) * 0.18,
      y: (Math.random() - 0.5) * 0.18,
      z: (Math.random() - 0.5) * 0.18
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 4.8,
    vertexColors: true,
    transparent: true,
    opacity: isDark ? 0.90 : 0.75,
    blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  networkGroup.add(particleSystem);

  // Dynamic Line Segments
  const maxConnections = nodeCount * nodeCount;
  const linePositions = new Float32Array(maxConnections * 6);
  const lineColors = new Float32Array(maxConnections * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: isDark ? 0.30 : 0.20,
    blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
  });

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  networkGroup.add(lines);

  // Mouse & Scroll interaction lerp
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollY = window.scrollY;
  let targetScrollY = scrollY;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.05;
    mouseY = (e.clientY - windowHalfY) * 0.05;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Theme synchronization hook
  window.update3DTheme = (dark) => {
    const curPalette = dark 
      ? [colorCyan, colorIndigo, colorEmerald, colorGold] 
      : [colorLightBlue, colorLightIndigo, colorLightEmerald, colorLightAmber];

    const cArray = geometry.attributes.color.array;
    for (let i = 0; i < nodeCount; i++) {
      const c = curPalette[i % curPalette.length];
      cArray[i * 3] = c.r;
      cArray[i * 3 + 1] = c.g;
      cArray[i * 3 + 2] = c.b;
    }
    geometry.attributes.color.needsUpdate = true;

    if (particleMaterial) {
      particleMaterial.opacity = dark ? 0.90 : 0.75;
      particleMaterial.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    }
    if (lineMaterial) {
      lineMaterial.opacity = dark ? 0.30 : 0.20;
      lineMaterial.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    }
  };

  // 60FPS Render Loop
  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;
    targetScrollY += (scrollY - targetScrollY) * 0.05;

    networkGroup.rotation.y += 0.0010;
    networkGroup.rotation.x = targetY * 0.005 + targetScrollY * 0.0003;
    networkGroup.rotation.z = targetX * 0.003;
    networkGroup.position.y = -targetScrollY * 0.05;

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < nodeCount; i++) {
      pos[i * 3] += nodeVelocities[i].x;
      pos[i * 3 + 1] += nodeVelocities[i].y;
      pos[i * 3 + 2] += nodeVelocities[i].z;

      if (pos[i * 3] < -spreadX * 0.6 || pos[i * 3] > spreadX * 0.6) nodeVelocities[i].x = -nodeVelocities[i].x;
      if (pos[i * 3 + 1] < -spreadY * 0.6 || pos[i * 3 + 1] > spreadY * 0.6) nodeVelocities[i].y = -nodeVelocities[i].y;
      if (pos[i * 3 + 2] < -spreadZ * 0.6 || pos[i * 3 + 2] > spreadZ * 0.6) nodeVelocities[i].z = -nodeVelocities[i].z;
    }
    geometry.attributes.position.needsUpdate = true;

    // Connect close nodes with lines & gradient colors
    let lineIdx = 0;
    const lPos = lineGeometry.attributes.position.array;
    const lCol = lineGeometry.attributes.color.array;
    const cArr = geometry.attributes.color.array;
    const connectDist = 65;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectDist) {
          lPos[lineIdx * 3] = pos[i * 3];
          lPos[lineIdx * 3 + 1] = pos[i * 3 + 1];
          lPos[lineIdx * 3 + 2] = pos[i * 3 + 2];
          lCol[lineIdx * 3] = cArr[i * 3];
          lCol[lineIdx * 3 + 1] = cArr[i * 3 + 1];
          lCol[lineIdx * 3 + 2] = cArr[i * 3 + 2];
          lineIdx++;

          lPos[lineIdx * 3] = pos[j * 3];
          lPos[lineIdx * 3 + 1] = pos[j * 3 + 1];
          lPos[lineIdx * 3 + 2] = pos[j * 3 + 2];
          lCol[lineIdx * 3] = cArr[j * 3];
          lCol[lineIdx * 3 + 1] = cArr[j * 3 + 1];
          lCol[lineIdx * 3 + 2] = cArr[j * 3 + 2];
          lineIdx++;
        }
      }
    }
    lineGeometry.setDrawRange(0, lineIdx);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();
}

/* ==========================================================================
   3. LIGHT / DARK MODE SWITCHER
   ========================================================================== */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  const storedTheme = localStorage.getItem('saidul-theme');
  const isDark = storedTheme ? storedTheme === 'dark' : true;

  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('saidul-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('saidul-theme', 'light');
    }

    if (typeof window.update3DTheme === 'function') {
      window.update3DTheme(dark);
    }

    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = dark ? 'light_mode' : 'dark_mode';
      }
      btn.setAttribute('title', dark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('aria-label', dark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  };

  applyTheme(isDark);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentIsDark = document.documentElement.classList.contains('dark');
      applyTheme(!currentIsDark);
    });
  });
}

/* ==========================================================================
   4. 3D TILT WITH PERSPECTIVE & SPECULAR HIGHLIGHT
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.bento-card, .competency-card, .erp-card, .network-card, .stat-card, .experience-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   5. SCROLL REVEAL (FRAMER-STYLE)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, idx * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-close-btn');
  const navDrawer = document.getElementById('mobile-nav-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!openBtn || !navDrawer) return;

  const openDrawer = () => {
    navDrawer.classList.remove('translate-x-full', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    navDrawer.classList.add('translate-x-full', 'pointer-events-none');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   7. ANIMATED METRICS COUNTERS (SMOOTH EASING UPON SCROLL)
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  const animate = (counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    if (isNaN(target)) return;
    const isDecimal = target % 1 !== 0;
    const duration = 1400; // ms
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const count = easeProgress * target;

      counter.innerText = isDecimal ? count.toFixed(1) : Math.ceil(count);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.innerText = isDecimal ? target.toFixed(1) : target;
      }
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   1. INTERACTIVE MOUSE CURSOR, TRAILING RING & AMBIENT SPOTLIGHT
   ========================================================================== */
function initInteractiveCursor() {
  const glowMesh = document.getElementById('mouse-glow-mesh');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  // Check if touch device; skip custom cursor if touch-only
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  let dot = null;
  let ring = null;
  let ringX = mouseX;
  let ringY = mouseY;

  if (!isTouch) {
    dot = document.createElement('div');
    dot.id = 'custom-cursor-dot';
    ring = document.createElement('div');
    ring.id = 'custom-cursor-ring';

    document.body.appendChild(dot);
    document.body.appendChild(ring);
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
  });

  function renderAnimationLoop() {
    // Smooth lerp for background ambient spotlight
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    
    if (glowMesh) {
      glowMesh.style.setProperty('--mouse-x', `${glowX}px`);
      glowMesh.style.setProperty('--mouse-y', `${glowY}px`);
    }

    if (ring && !isTouch) {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(renderAnimationLoop);
  }
  renderAnimationLoop();

  if (!isTouch) {
    // Hover detection over interactive elements
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .bento-card, .app-preview-trigger, .theme-toggle-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE FLUID MOUSE PARTICLE CONSTELLATION CANVAS
   ========================================================================== */
function initParticleCanvas() {
  let canvas = document.getElementById('cursor-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let particles = [];
  const maxParticles = 60;
  let mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Spawn 1-2 glowing micro-particles on movement
    if (particles.length < maxParticles) {
      particles.push(new Particle(mouse.x, mouse.y));
    }
  }, { passive: true });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2.8 + 1.2;
      this.speedX = (Math.random() - 0.5) * 1.8;
      this.speedY = (Math.random() - 0.5) * 1.8;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.012;
      // Palette selection: 0: Cyan/Blue, 1: Rose/Red, 2: Amber/Gold, 3: Emerald
      this.colorIdx = Math.floor(Math.random() * 4);
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      if (this.size > 0.2) this.size -= 0.02;
    }

    getColor(isDark) {
      const darkPalette = ['#00f5d4', '#fb7185', '#f59e0b', '#10b981'];
      const lightPalette = ['#0284c7', '#e11d48', '#d97706', '#059669'];
      return (isDark ? darkPalette : lightPalette)[this.colorIdx];
    }

    draw() {
      const isDark = document.documentElement.classList.contains('dark');
      const col = this.getColor(isDark);

      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.classList.contains('dark');

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect nearby particles with subtle glowing filament lines
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          const col = particles[i].getColor(isDark);
          ctx.strokeStyle = col;
          ctx.globalAlpha = particles[i].life * 0.35 * (1 - dist / 90);
          ctx.lineWidth = 0.9;
          ctx.stroke();
          ctx.restore();
        }
      }

      if (particles[i].life <= 0) {
        particles.splice(i, 1);
        i--;
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   8. MODALS & DIRECT 2-PAGE PDF EXPORTER
   ========================================================================== */
function initModals() {
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-btn');

  const bioModal = document.getElementById('bio-modal');
  const openBioBtns = document.querySelectorAll('.open-bio-btn');
  const closeBioBtn = document.getElementById('close-bio-btn');

  const open = (modal) => {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  const close = (modal) => {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  openResumeBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    open(resumeModal);
  }));

  if (closeResumeBtn) {
    closeResumeBtn.addEventListener('click', () => close(resumeModal));
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) close(resumeModal);
    });
  }

  openBioBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    open(bioModal);
  }));

  if (closeBioBtn) {
    closeBioBtn.addEventListener('click', () => close(bioModal));
  }

  if (bioModal) {
    bioModal.addEventListener('click', (e) => {
      if (e.target === bioModal) close(bioModal);
    });
  }

  const printCvBtn = document.getElementById('print-cv-btn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const downloadPdfBtn = document.getElementById('download-cv-pdf-btn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', async () => {
      const element = document.getElementById('printable-cv-area');
      const resumeModalDiv = document.querySelector('#resume-modal > div');
      if (!element) return;

      const origText = downloadPdfBtn.innerHTML;
      downloadPdfBtn.disabled = true;
      downloadPdfBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span> Generating HD PDF...';

      // Save previous inline styles to restore after export
      const prevElementOverflow = element.style.overflow;
      const prevElementMaxHeight = element.style.maxHeight;
      const prevElementHeight = element.style.height;
      const prevModalMaxHeight = resumeModalDiv ? resumeModalDiv.style.maxHeight : '';
      const prevModalOverflow = resumeModalDiv ? resumeModalDiv.style.overflow : '';

      try {
        // Ensure avatar image uses non-tainting Base64 data URI to support file:// and offline export
        const avatarImg = document.getElementById('cv-avatar-img') || element.querySelector('img');
        if (avatarImg && typeof CV_AVATAR_BASE64 !== 'undefined') {
          avatarImg.src = CV_AVATAR_BASE64;
        }

        // Expand the element so html2canvas renders the FULL 2 pages without scroll clipping
        if (resumeModalDiv) {
          resumeModalDiv.style.maxHeight = 'none';
          resumeModalDiv.style.overflow = 'visible';
        }
        element.style.overflow = 'visible';
        element.style.maxHeight = 'none';
        element.style.height = 'auto';
        element.scrollTop = 0;

        // Wait for all web fonts to load completely to avoid font blurriness / layout shifts
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        if (typeof html2pdf !== 'undefined') {
          const opt = {
            margin:       0,
            filename:     'Saidul_Islam_Executive_CV.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
              scale: 2.5, 
              useCORS: true, 
              letterRendering: true, 
              logging: false, 
              scrollY: 0, 
              scrollX: 0
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['css', 'legacy'] }
          };

          await html2pdf().set(opt).from(element).save();
        } else {
          window.print();
        }
      } catch (err) {
        console.error('PDF generation error, falling back to print:', err);
        window.print();
      } finally {
        // Restore previous modal scroll styles
        if (resumeModalDiv) {
          resumeModalDiv.style.maxHeight = prevModalMaxHeight;
          resumeModalDiv.style.overflow = prevModalOverflow;
        }
        element.style.overflow = prevElementOverflow;
        element.style.maxHeight = prevElementMaxHeight;
        element.style.height = prevElementHeight;

        downloadPdfBtn.disabled = false;
        downloadPdfBtn.innerHTML = origText;
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close(resumeModal);
      close(bioModal);
    }
  });
}

/* ==========================================================================
   9. APP LIGHTBOX / ZOOM VIEWER WITH FULL GALLERY SUPPORT & ARROW CONTROLS
   ========================================================================== */
const LightboxGalleryState = {
  screenshots: [],
  currentIndex: 0,
  titles: {
    'enterprise-network-topology.jpg': 'Enterprise Multi-Area Network Architecture • Cisco Packet Tracer',
    'app-fixbd.jpg': 'Screen 1/4 • Home Categories & 24/7 Emergency Dispatch',
    'app-fixbd-tracking.jpg': 'Screen 2/4 • Real-time Live GPS Map & Technician Tracking',
    'app-fixbd-payment.jpg': 'Screen 3/4 • Digital Payment (bKash / Nagad / Rocket / Cash)',
    'app-fixbd-success.jpg': 'Screen 4/4 • Payment Confirmation & Digital Service Receipt',
    'app-zenservice.jpg': 'Screen 1/4 • Home Categories & 24/7 Emergency Dispatch',
    'app-zenservice-tracking.jpg': 'Screen 2/4 • Real-time Live GPS Map & Technician Tracking',
    'app-zenservice-payment.jpg': 'Screen 3/4 • Digital Payment (bKash / Nagad / Rocket / Cash)',
    'app-zenservice-success.jpg': 'Screen 4/4 • Payment Confirmation & Digital Service Receipt'
  },
  pillNames: ['1. Home', '2. Live Tracking', '3. Payment', '4. Receipt']
};

function initAppLightbox() {
  let lightbox = document.getElementById('app-lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'app-lightbox-modal';
    lightbox.className = 'fixed inset-0 z-[120] hidden items-center justify-center p-3 sm:p-5 modal-backdrop bg-black/90 backdrop-blur-2xl transition-all duration-300';
    lightbox.innerHTML = `
      <div id="lightbox-dialog-box" class="relative max-w-md md:max-w-lg w-full max-h-[96vh] bg-[#070b14] border border-white/20 rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 overflow-hidden" onclick="event.stopPropagation()">
        
        <!-- Top Action Bar -->
        <div class="w-full flex items-center justify-between pb-1 border-b border-white/10">
          <div class="flex items-center gap-2">
            <span class="size-2.5 rounded-full bg-brand-emerald animate-pulse"></span>
            <span id="lightbox-badge" class="text-[11px] font-mono font-bold text-brand-cyan tracking-wider uppercase">Architecture Preview</span>
          </div>
          <button id="close-lightbox" class="size-8 sm:size-9 rounded-full bg-white/10 hover:bg-rose-500 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90" title="Close Viewer (Esc)">
            <span class="material-symbols-outlined text-xl pointer-events-none">close</span>
          </button>
        </div>
        
        <!-- Image Stage with Floating Arrows -->
        <div class="relative w-full h-[60vh] sm:h-[65vh] rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center select-none border border-white/10">
          <img id="lightbox-img" src="" alt="App Preview" class="w-full h-full object-contain max-h-[60vh] sm:max-h-[65vh] transition-all duration-200">
          
          <!-- Previous Arrow Button -->
          <button id="lb-prev-btn" type="button" class="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 size-10 sm:size-11 rounded-full bg-black/75 hover:bg-brand-cyan hover:text-black text-white border border-white/30 flex items-center justify-center cursor-pointer shadow-2xl z-40 transition-all active:scale-90" title="Previous Screenshot" aria-label="Previous">
            <span class="material-symbols-outlined text-2xl pointer-events-none -ml-0.5">chevron_left</span>
          </button>
          
          <!-- Next Arrow Button -->
          <button id="lb-next-btn" type="button" class="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 size-10 sm:size-11 rounded-full bg-black/75 hover:bg-brand-cyan hover:text-black text-white border border-white/30 flex items-center justify-center cursor-pointer shadow-2xl z-40 transition-all active:scale-90" title="Next Screenshot" aria-label="Next">
            <span class="material-symbols-outlined text-2xl pointer-events-none -mr-0.5">chevron_right</span>
          </button>
        </div>

        <!-- Interactive Screen Switcher Pills -->
        <div id="lb-gallery-tabs" class="w-full flex items-center justify-center gap-1.5 flex-wrap py-0.5"></div>

        <!-- Title & Subtitle -->
        <div class="w-full text-center px-2">
          <h4 id="lightbox-title" class="text-white font-bold font-heading text-base sm:text-lg"></h4>
          <p id="lightbox-desc" class="text-xs text-brand-cyan font-mono mt-0.5 max-w-sm mx-auto line-clamp-1"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);

    // Global Key Listener for Lightbox (Esc, Left, Right)
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('app-lightbox-modal');
      if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeLightboxModal();
        if (e.key === 'ArrowLeft') changeLightboxScreen(LightboxGalleryState.currentIndex - 1);
        if (e.key === 'ArrowRight') changeLightboxScreen(LightboxGalleryState.currentIndex + 1);
      }
    });
  }

  // Setup click listener on backdrop
  lightbox.onclick = closeLightboxModal;

  const closeLb = document.getElementById('close-lightbox');
  if (closeLb) closeLb.onclick = closeLightboxModal;

  const prevBtn = document.getElementById('lb-prev-btn');
  const nextBtn = document.getElementById('lb-next-btn');

  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      changeLightboxScreen(LightboxGalleryState.currentIndex - 1);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      changeLightboxScreen(LightboxGalleryState.currentIndex + 1);
    };
  }

  // Attach card triggers
  const appCards = document.querySelectorAll('.app-preview-trigger');
  appCards.forEach(card => {
    card.onclick = (e) => {
      e.preventDefault();
      const src = card.getAttribute('data-img');
      const rawScreenshots = card.getAttribute('data-screenshots');
      const title = card.getAttribute('data-title') || 'Architecture & Mobile Solutions';
      const desc = card.getAttribute('data-desc') || 'Engineered by Saidul Islam';

      let screenshots = [];
      try {
        screenshots = rawScreenshots ? JSON.parse(rawScreenshots) : (src ? [src] : []);
      } catch (err) {
        screenshots = src ? [src] : [];
      }
      if (!screenshots || screenshots.length === 0) {
        screenshots = src ? [src] : [];
      }

      openLightboxModal(screenshots, 0, title, desc);
    };
  });
}

function openLightboxModal(screenshots, initialIndex, title, desc) {
  const lightbox = document.getElementById('app-lightbox-modal');
  const dialogBox = document.getElementById('lightbox-dialog-box');
  const lbTitle = document.getElementById('lightbox-title');
  const lbDesc = document.getElementById('lightbox-desc');
  const prevBtn = document.getElementById('lb-prev-btn');
  const nextBtn = document.getElementById('lb-next-btn');
  const galleryTabs = document.getElementById('lb-gallery-tabs');

  LightboxGalleryState.screenshots = screenshots;
  LightboxGalleryState.modalTitle = title;
  LightboxGalleryState.modalDesc = desc;

  if (lbTitle) lbTitle.textContent = title;
  if (lbDesc) lbDesc.textContent = desc;

  // Auto adjust width for landscape diagrams vs portrait mobile screens
  if (dialogBox) {
    const isLandscape = screenshots.some(s => s.toLowerCase().includes('topology') || s.toLowerCase().includes('network'));
    if (isLandscape) {
      dialogBox.className = 'relative max-w-4xl lg:max-w-6xl w-full max-h-[96vh] bg-[#070b14] border border-white/20 rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 overflow-hidden';
    } else {
      dialogBox.className = 'relative max-w-md md:max-w-lg w-full max-h-[96vh] bg-[#070b14] border border-white/20 rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 overflow-hidden';
    }
  }

  if (screenshots.length > 1) {
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    if (galleryTabs) {
      galleryTabs.style.display = 'flex';
      galleryTabs.innerHTML = screenshots.map((url, i) => {
        const label = LightboxGalleryState.pillNames[i] || `Screen ${i+1}`;
        return `
          <button type="button" class="gallery-pill-btn text-[11px] font-mono px-3 py-1 rounded-full border transition-all cursor-pointer ${i === 0 ? 'bg-brand-cyan text-black font-bold border-brand-cyan' : 'bg-white/5 text-slate-300 border-white/10 hover:border-brand-cyan/50'}" data-index="${i}">
            ${label}
          </button>
        `;
      }).join('');

      galleryTabs.querySelectorAll('.gallery-pill-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
          changeLightboxScreen(targetIdx);
        };
      });
    }
  } else {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (galleryTabs) {
      galleryTabs.style.display = 'none';
      galleryTabs.innerHTML = '';
    }
  }

  changeLightboxScreen(initialIndex);

  if (lightbox) {
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function changeLightboxScreen(newIndex) {
  const screenshots = LightboxGalleryState.screenshots;
  if (!screenshots || screenshots.length === 0) return;

  const total = screenshots.length;
  LightboxGalleryState.currentIndex = (newIndex + total) % total;
  const currentUrl = screenshots[LightboxGalleryState.currentIndex];

  const lbImg = document.getElementById('lightbox-img');
  const lbBadge = document.getElementById('lightbox-badge');
  const galleryTabs = document.getElementById('lb-gallery-tabs');

  if (lbImg) {
    lbImg.src = currentUrl;
  }

  if (lbBadge) {
    const fileName = currentUrl.split('/').pop();
    const screenTitle = LightboxGalleryState.titles[fileName] || `Screen ${LightboxGalleryState.currentIndex + 1} of ${total}`;
    lbBadge.textContent = screenTitle;
  }

  if (galleryTabs) {
    const pills = galleryTabs.querySelectorAll('.gallery-pill-btn');
    pills.forEach((pill, idx) => {
      if (idx === LightboxGalleryState.currentIndex) {
        pill.className = 'gallery-pill-btn text-[11px] font-mono px-3 py-1 rounded-full border transition-all cursor-pointer bg-brand-cyan text-black font-bold border-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)]';
      } else {
        pill.className = 'gallery-pill-btn text-[11px] font-mono px-3 py-1 rounded-full border transition-all cursor-pointer bg-white/5 text-slate-300 border-white/10 hover:border-brand-cyan/50';
      }
    });
  }
}

function closeLightboxModal() {
  const lightbox = document.getElementById('app-lightbox-modal');
  if (lightbox) {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   10. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const msgFeedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span> Transmitting...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = origText;
      if (msgFeedback) {
        msgFeedback.innerHTML = `
          <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
            <span class="material-symbols-outlined text-2xl">check_circle</span>
            <div>
              <p class="font-bold text-sm">Message Transmitted Successfully!</p>
              <p class="text-xs text-emerald-300">Thank you! Saidul will get in touch with you shortly.</p>
            </div>
          </div>
        `;
        msgFeedback.classList.remove('hidden');
      }
      form.reset();

      setTimeout(() => {
        if (msgFeedback) msgFeedback.classList.add('hidden');
      }, 7000);
    }, 1200);
  });
}

/* ==========================================================================
   11. CLIPBOARD ACTIONS
   ========================================================================== */
function initClipboardActions() {
  const copyBtns = document.querySelectorAll('.copy-trigger');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const origTitle = btn.getAttribute('title') || 'Copy';
        btn.setAttribute('title', 'Copied!');
        
        const badge = document.createElement('span');
        badge.className = 'fixed bottom-8 right-8 z-[100] px-4 py-2 bg-[#f59e0b] text-slate-950 text-xs font-black rounded-xl shadow-2xl animate-bounce';
        badge.textContent = `Copied: ${textToCopy}`;
        document.body.appendChild(badge);

        setTimeout(() => {
          btn.setAttribute('title', origTitle);
          badge.remove();
        }, 2500);
      });
    });
  });
}

/* ==========================================================================
   12. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top-btn');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.remove('opacity-0', 'pointer-events-none');
      topBtn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      topBtn.classList.add('opacity-0', 'pointer-events-none');
      topBtn.classList.remove('opacity-100', 'pointer-events-auto');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   12.5. ACTIVE SCROLL-SPY NAVBAR HIGHLIGHT
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link-pill[href^="#"]');
  if (navLinks.length === 0) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 200;
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (!currentId && window.scrollY < 250) {
      currentId = 'home';
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   13. DYNAMIC REAL-TIME CAREER EXPERIENCE CALCULATOR
   ========================================================================== */
function initDynamicExperience() {
  const data = typeof getPortfolioData === 'function' ? getPortfolioData() : null;
  const careerStartDateStr = data?.stats?.careerStartDate || '2021-11-01';
  const autoCalc = data?.stats?.autoCalcExp !== false;
  const manualYears = data?.stats?.manualYearsExp || '4.8';

  let exactYears = 4.8;

  if (autoCalc) {
    const careerStartDate = new Date(careerStartDateStr);
    const now = new Date();
    let totalMonths = (now.getFullYear() - careerStartDate.getFullYear()) * 12 + (now.getMonth() - careerStartDate.getMonth());
    if (now.getDate() < careerStartDate.getDate()) {
      totalMonths = Math.max(0, totalMonths - 1);
    }
    const rawYears = totalMonths / 12;
    exactYears = Math.max(1.0, parseFloat(rawYears.toFixed(1)));
  } else {
    exactYears = parseFloat(manualYears) || 4.8;
  }

  const shortExp = `${exactYears}+`;
  const textExp = `${exactYears}+ Years`;
  const summaryExp = `${exactYears}+ years of experience`;
  const badgeExp = `(${exactYears}+ Years)`;

  // 1. Update counter target attribute before counter animation runs
  const expCounter = document.querySelector('.dynamic-exp-counter');
  if (expCounter) {
    expCounter.setAttribute('data-target', exactYears.toString());
  }

  // 2. Update short labels (e.g. Hero Live Status Badge, Section 7 description)
  document.querySelectorAll('.dynamic-exp-short').forEach(el => {
    el.textContent = shortExp;
  });

  // 3. Update full text labels
  document.querySelectorAll('.dynamic-exp-text').forEach(el => {
    el.textContent = textExp;
  });

  // 4. Update CV Professional Summary
  document.querySelectorAll('.dynamic-exp-summary').forEach(el => {
    el.textContent = summaryExp;
  });

  // 5. Update CV Work Experience Header badge
  document.querySelectorAll('.dynamic-exp-badge').forEach(el => {
    el.textContent = badgeExp;
  });
}

/* ==========================================================================
   14. DYNAMIC PORTFOLIO CONTENT HYDRATION ENGINE
   ========================================================================== */
function hydratePortfolioContent() {
  if (typeof getPortfolioData !== 'function') return;
  const data = getPortfolioData();
  if (!data) return;

  // 1. Profile & Hero
  if (data.profile) {
    const p = data.profile;
    
    // Page Title
    if (p.name && p.primaryTitle) {
      document.title = `${p.name} | ${p.primaryTitle}`;
    }

    // Hero Live Status Badge
    const liveBadge = document.querySelector('#home .inline-flex.items-center.gap-3 span.font-mono');
    if (liveBadge && p.heroBadge) {
      liveBadge.innerHTML = `${p.heroBadge} &bull; <span class="dynamic-exp-short">4.8+</span> Yrs Exp`;
    }

    // Hero Headline
    const heroH1 = document.querySelector('#home h1');
    if (heroH1) {
      heroH1.innerHTML = `
        ${p.heroHeadlinePart1 || 'Architecting Scalable'} <br/>
        <span class="text-gradient-cyan">${p.heroHeadlineGradient || 'ERP Systems & Networks'}</span> <br/>
        ${p.heroHeadlinePart2 || 'For Enterprise Agility.'}
      `;
    }

    // Hero Summary
    const heroSummary = document.querySelector('#home p.text-slate-300');
    if (heroSummary && p.heroSummary) {
      heroSummary.innerHTML = p.heroSummary;
    }

    // Avatar Images
    if (p.avatar) {
      document.querySelectorAll('img[alt*="Saidul Islam"], img[src*="saidul-avatar"]').forEach(img => {
        img.src = p.avatar;
      });
    }

    // WhatsApp Button
    if (p.whatsapp) {
      document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
        a.href = `https://wa.me/${p.whatsapp.replace(/[^0-9]/g, '')}`;
      });
    }

    // Contact Section Info
    if (p.email) {
      document.querySelectorAll('a[href*="mailto:"]').forEach(a => {
        a.href = `mailto:${p.email}`;
        a.textContent = p.email;
      });
      document.querySelectorAll('button[data-copy*="@"]').forEach(b => {
        b.setAttribute('data-copy', p.email);
      });
    }

    if (p.phone1) {
      const contactPhone = document.getElementById('contact-phone');
      if (contactPhone) {
        contactPhone.href = `tel:${p.phone1.replace(/\s+/g, '')}`;
        contactPhone.textContent = p.phone1;
      }
      const cvPhone1 = document.getElementById('cv-phone1');
      if (cvPhone1) {
        cvPhone1.href = `tel:${p.phone1.replace(/\s+/g, '')}`;
      }
      
      document.querySelectorAll('button[data-copy*="+880"]').forEach(b => {
        b.setAttribute('data-copy', p.phone1);
      });
    }

    const cvAvatar = document.getElementById('cv-avatar-img');
    if (cvAvatar && typeof CV_AVATAR_BASE64 !== 'undefined') {
      cvAvatar.src = CV_AVATAR_BASE64;
    }

    if (p.location) {
      const locEl = document.querySelector('#contact .bento-card:nth-child(3) span.font-bold');
      if (locEl) locEl.textContent = p.location;
    }

    if (p.linkedin) {
      document.querySelectorAll('a[href*="linkedin.com"]').forEach(a => {
        a.href = p.linkedin;
      });
    }
  }

  // 2. Stats & Counters
  if (data.stats) {
    const s = data.stats;
    const counters = document.querySelectorAll('#home .bento-card .counter');
    if (counters.length >= 4) {
      if (s.projectsCount) counters[1].setAttribute('data-target', s.projectsCount);
      if (s.goLiveRate) counters[2].setAttribute('data-target', s.goLiveRate);
      if (s.uptimeRate) counters[3].setAttribute('data-target', s.uptimeRate);
    }
  }

  // 3. ERP Modules Grid
  if (data.erpModules && data.erpModules.length > 0) {
    const erpGrid = document.querySelector('#erp-core .grid');
    if (erpGrid) {
      erpGrid.innerHTML = data.erpModules.map(mod => {
        const themeMap = {
          'primary': { text: 'text-primary', border: 'border-primary/40', bg: 'bg-primary/10', glow: 'rgba(245,158,11,0.2)', hover: 'hover:border-primary/50' },
          'accent-cyan': { text: 'text-accent-cyan', border: 'border-accent-cyan/40', bg: 'bg-accent-cyan/10', glow: 'rgba(0,240,255,0.2)', hover: 'hover:border-accent-cyan/50' },
          'emerald': { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', glow: 'rgba(16,185,129,0.2)', hover: 'hover:border-emerald-500/50' },
          'purple': { text: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-500/10', glow: 'rgba(168,85,247,0.2)', hover: 'hover:border-purple-500/50' },
          'sky': { text: 'text-sky-400', border: 'border-sky-500/40', bg: 'bg-sky-500/10', glow: 'rgba(56,189,248,0.2)', hover: 'hover:border-sky-500/50' },
          'amber': { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10', glow: 'rgba(245,158,11,0.2)', hover: 'hover:border-amber-500/50' }
        };
        const th = themeMap[mod.colorTheme] || themeMap['primary'];

        const checksHtml = (mod.checks || []).map(c => `
          <div class="flex items-center gap-1.5 text-slate-300">
            <span class="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>${c}</span>
          </div>
        `).join('');

        const tagsHtml = (mod.tags || []).map((t, idx) => `
          <span class="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 ${idx === 0 ? th.text : 'text-slate-300'}">${t}</span>
        `).join('');

        return `
          <div class="bento-card p-6 sm:p-7 rounded-3xl flex flex-col gap-4 border border-white/10 ${th.hover} group">
            <div class="flex items-center justify-between">
              <div class="size-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent ${th.border} border flex items-center justify-center ${th.text} shadow-[0_0_20px_${th.glow}] group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-2xl">${mod.icon || 'warehouse'}</span>
              </div>
              <span class="text-[10px] font-mono font-bold px-3 py-1 rounded-full ${th.bg} ${th.text} border ${th.border} uppercase tracking-wider">${mod.category || 'ERP'}</span>
            </div>
            <h3 class="text-xl font-bold text-white font-heading group-hover:${th.text} transition-colors">${mod.title}</h3>
            <p class="text-xs sm:text-[13px] text-slate-400 font-light leading-relaxed">
              ${mod.description}
            </p>
            <div class="grid grid-cols-2 gap-2 pt-2 text-xs">
              ${checksHtml}
            </div>
            <div class="mt-auto pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
              ${tagsHtml}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 4. Flutter Mobile Apps
  if (data.apps && data.apps.length > 0) {
    const appsGrid = document.querySelector('#flutter-hub .grid');
    const appsBadge = document.querySelector('#flutter-hub .flex.items-center.gap-3 span.font-mono');
    if (appsBadge) {
      appsBadge.textContent = `${data.apps.length} Featured Apps • Android / iOS`;
    }

    if (appsGrid) {
      if (data.apps.length >= 4) {
        appsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
      } else {
        appsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
      }

      const colorMap = {
        'purple': { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-300', tag: 'text-brand-cyan', hover: 'hover:border-brand-cyan/40', btn: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30' },
        'pink': { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-300', tag: 'text-purple-400', hover: 'hover:border-purple-500/40', btn: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
        'amber': { bg: 'bg-amber-500/20', border: 'border-brand-amber/40', text: 'text-brand-amber', tag: 'text-brand-amber', hover: 'hover:border-brand-amber/40', btn: 'text-brand-amber bg-brand-amber/10 border-brand-amber/30' },
        'emerald': { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', tag: 'text-brand-emerald', hover: 'hover:border-brand-emerald/40', btn: 'text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30' }
      };

      appsGrid.innerHTML = data.apps.map(app => {
        const c = colorMap[app.iconColor] || colorMap['purple'];
        const screenshotsAttr = encodeURIComponent(JSON.stringify(app.screenshots || [app.image]));
        const tagsHtml = (app.tags || []).map((t, idx) => `
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 ${idx === 0 ? c.tag : 'text-slate-300'}">${t}</span>
        `).join('');

        return `
          <div class="bento-card rounded-3xl p-6 flex flex-col gap-5 border border-white/10 ${c.hover} group app-preview-trigger cursor-pointer" data-img="${app.image || 'assets/images/app-zenpdf.jpg'}" data-screenshots='${JSON.stringify(app.screenshots || [app.image])}' data-title="${app.modalTitle || app.name}" data-desc="${app.modalSubtitle || app.description}">
            <div class="relative w-full aspect-[9/16] rounded-2xl overflow-hidden border border-white/15 bg-[#0b0f19] shadow-2xl group-hover:scale-[1.02] transition-all duration-500">
              <img src="${app.image || 'assets/images/app-zenpdf.jpg'}" alt="${app.name}" class="w-full h-full object-cover object-top">
              <div class="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span class="text-xs font-mono font-bold ${c.btn} px-3 py-1.5 rounded-lg border backdrop-blur-md">
                  Click to Enlarge
                </span>
                <span class="material-symbols-outlined ${c.tag} bg-white/10 rounded-full p-1 text-sm">fullscreen</span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="size-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center ${c.text}">
                    <span class="material-symbols-outlined text-base">${app.icon || 'picture_as_pdf'}</span>
                  </div>
                  <h3 class="text-xl font-bold text-white font-heading">${app.name}</h3>
                </div>
                <span class="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${c.btn} border">
                  ${app.badge || 'App'}
                </span>
              </div>
              <p class="text-xs text-slate-400 font-light leading-relaxed">
                ${app.description}
              </p>
            </div>
            <div class="mt-auto pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
              ${tagsHtml}
            </div>
          </div>
        `;
      }).join('');

      // Reinitialize app lightbox listeners for dynamically rendered cards
      if (typeof initAppLightbox === 'function') {
        initAppLightbox();
      }
    }
  }

  // 5. Work Experience Timeline
  if (data.experience && data.experience.length > 0) {
    const timeline = document.querySelector('#experience .experience-vertical-timeline');
    if (timeline) {
      const itemsHtml = data.experience.map((exp, idx) => {
        const isLeft = idx % 2 === 0;
        const respHtml = (exp.responsibilities || []).map(r => `
          <p class="flex items-start gap-2">
            <span class="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">check_circle</span>
            <span>${r}</span>
          </p>
        `).join('');

        const promotionHtml = exp.promotion ? `
          <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 mb-3">
            <span class="material-symbols-outlined text-emerald-400 text-xl">workspace_premium</span>
            <p class="text-xs text-emerald-300 font-semibold">
              <strong>Promotion / Milestone:</strong> ${exp.promotion}
            </p>
          </div>
        ` : '';

        const tagsHtml = (exp.tags || []).map(t => `
          <span class="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-slate-300">${t}</span>
        `).join('');

        const isFlutter = exp.isFontAwesome || exp.icon === 'flutter' || (exp.role && exp.role.toLowerCase().includes('mobile')) || (exp.company && exp.company.toLowerCase().includes('flutter'));
        const iconHtml = isFlutter 
          ? `<svg class="size-6 text-brand-cyan" viewBox="0 0 24 24" fill="currentColor"><path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zM6.02 15.688L2.316 19.39 6.923 24h7.371l-4.57-4.609 3.704-3.703H6.02z"/></svg>`
          : `<span class="material-symbols-outlined text-2xl">${exp.icon || 'apartment'}</span>`;

        const themeClass = idx === 1 ? 'theme-purple' : (idx === 2 ? 'theme-cyan' : '');
        const stepNum = idx + 1;
        const cardContent = `
          <div class="bento-card experience-step-card ${themeClass} ${idx === 0 ? 'is-active-step' : ''} p-6 md:p-8 rounded-3xl border border-white/10 hover:border-primary/50 shadow-2xl relative overflow-hidden group" id="experience-card-${stepNum}" data-step="${stepNum}">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="size-12 rounded-xl bg-gradient-to-br from-primary/20 via-brand-cyan/20 to-transparent border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0">
                  ${iconHtml}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-[9.5px] font-mono font-bold text-primary">STEP 0${stepNum}</span>
                    <h3 class="text-xl font-bold text-white font-heading group-hover:text-primary transition-colors">${exp.role}</h3>
                  </div>
                  <div class="text-primary text-xs font-bold font-mono uppercase mt-0.5">${exp.company}</div>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono font-bold text-primary whitespace-nowrap">
                ${exp.duration}
              </span>
            </div>
            <div class="space-y-2.5 text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-5">
              ${respHtml}
            </div>
            ${promotionHtml}
            <div class="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
              ${tagsHtml}
            </div>
          </div>
        `;

        if (isLeft) {
          return `
            <div class="relative flex flex-col md:flex-row items-center justify-between w-full group" id="exp-row-${stepNum}">
              <div class="w-full md:w-[45%] flex flex-col relative z-20 pl-12 md:pl-0">
                ${cardContent}
              </div>
              <div class="step-milestone-node ${idx === 0 ? 'is-active' : ''}" data-step-node="${stepNum}" title="Phase 0${stepNum} Milestone">0${stepNum}</div>
              <div class="w-full md:w-[45%] hidden md:block"></div>
            </div>
          `;
        } else {
          return `
            <div class="relative flex flex-col md:flex-row items-center justify-between w-full group" id="exp-row-${stepNum}">
              <div class="w-full md:w-[45%] hidden md:block"></div>
              <div class="step-milestone-node ${idx === 0 ? 'is-active' : ''}" data-step-node="${stepNum}" title="Phase 0${stepNum} Milestone">0${stepNum}</div>
              <div class="w-full md:w-[45%] flex flex-col relative z-20 pl-12 md:pl-0">
                ${cardContent}
              </div>
            </div>
          `;
        }
      }).join('');

      timeline.innerHTML = `
        <svg class="experience-snake-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="snake-laser-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00f5d4" stop-opacity="0.95" />
              <stop offset="35%" stop-color="#818cf8" stop-opacity="0.95" />
              <stop offset="70%" stop-color="#fb7185" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.95" />
            </linearGradient>
            <linearGradient id="snake-laser-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.95" />
              <stop offset="35%" stop-color="#4f46e5" stop-opacity="0.95" />
              <stop offset="70%" stop-color="#e11d48" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#059669" stop-opacity="0.95" />
            </linearGradient>
            <filter id="laser-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="beam-pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur2"/>
              <feMerge>
                <feMergeNode in="blur2"/>
                <feMergeNode in="blur2"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path id="snake-laser-base-path" d="" fill="none" stroke="rgba(0, 245, 212, 0.15)" stroke-width="7" stroke-linecap="round"/>
          <path id="snake-laser-dots-path" class="animated-laser-dots" d="" fill="none" stroke="rgba(0, 245, 212, 0.55)" stroke-width="2.5" stroke-linecap="round"/>
          <path id="snake-laser-glow-path" d="" fill="none" stroke="url(#snake-laser-gradient)" stroke-width="3.5" stroke-linecap="round" filter="url(#laser-glow-filter)"/>
          <path id="snake-laser-core-path" d="" fill="none" stroke="url(#snake-laser-gradient)" stroke-width="2" stroke-linecap="round"/>
          <path id="snake-laser-pulse-path" class="animated-laser-beam" d="" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" filter="url(#beam-pulse-glow)"/>
          <g id="snake-laser-comet-group" class="laser-energy-comet" transform="translate(-100, -100)">
            <circle r="14" fill="rgba(0, 245, 212, 0.25)" filter="url(#beam-pulse-glow)"/>
            <circle r="7" fill="url(#snake-laser-gradient)"/>
            <circle r="3.5" fill="#ffffff"/>
          </g>
        </svg>
        ${itemsHtml}
      `;
      setTimeout(() => {
        updateExperienceLaserPath();
        if (typeof initStepProgressionGuide === 'function') {
          initStepProgressionGuide();
        }
      }, 60);
    }
  }

  // 6. Bio Modal & CV Modal Hydration
  if (data.bioData) {
    const b = data.bioData;
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el && val) el.textContent = val;
    };
    setText('cv-name', b.fullName || data.profile?.name);
    setText('cv-title', data.profile?.primaryTitle);
    setText('cv-phone1', data.profile?.phone1);
    setText('cv-email', data.profile?.email);
    setText('cv-portfolio', data.profile?.portfolioUrl?.replace('https://', ''));
    setText('cv-address', b.address || data.profile?.location);
    setText('cv-summary-text', b.cvSummary);
    setText('cv-declaration-text', b.declaration);
    setText('cv-sign-name', b.fullName || data.profile?.name);

    setText('modal-bio-name', b.fullName || data.profile?.name);
    setText('modal-bio-father', b.fatherName);
    setText('modal-bio-mother', b.motherName);
    setText('modal-bio-dob', b.dob);
    setText('modal-bio-nid', b.nid);
    setText('modal-bio-marital', b.maritalStatus);
    setText('modal-bio-nationality', b.nationality);
    setText('modal-bio-address', b.address);

    setText('cv-personal-name', b.fullName || data.profile?.name);
    setText('cv-personal-father', b.fatherName);
    setText('cv-personal-mother', b.motherName);
    setText('cv-personal-dob', b.dob);
    setText('cv-personal-gender', b.gender);
    setText('cv-personal-nationality', b.nationality);
    setText('cv-personal-marital', b.maritalStatus);
    setText('cv-personal-nid', b.nid);
    setText('cv-personal-address', b.address);
  }
}



