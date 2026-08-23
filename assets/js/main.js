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
  initDynamicExperience();
  initInteractiveCursor();
  initParticleCanvas();
  initThemeToggle();
  initMobileNav();
  initCounters();
  init3DTilt();
  initScrollReveal();
  initModals();
  initAppLightbox();
  initContactForm();
  initClipboardActions();
  initBackToTop();
});

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
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let particles = [];
  const maxParticles = 45;
  let mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Spawn 1-2 glowing micro-particles on movement
    if (particles.length < maxParticles) {
      particles.push(new Particle(mouse.x, mouse.y));
    }
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2.5 + 1;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      // Gold & Cyan dual tone
      this.isGold = Math.random() > 0.4;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      if (this.size > 0.2) this.size -= 0.02;
    }

    draw() {
      const isDark = document.documentElement.classList.contains('dark');
      const goldColor = isDark ? '#f59e0b' : '#d97706';
      const cyanColor = isDark ? '#00f0ff' : '#0284c7';

      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.isGold ? goldColor : cyanColor;
      ctx.shadowColor = this.isGold ? goldColor : cyanColor;
      ctx.shadowBlur = 8;
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

        if (dist < 80) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          const goldRgba = isDark 
            ? `rgba(245, 158, 11, ${particles[i].life * 0.25})`
            : `rgba(217, 119, 6, ${particles[i].life * 0.25})`;
          const cyanRgba = isDark
            ? `rgba(0, 240, 255, ${particles[i].life * 0.25})`
            : `rgba(2, 132, 199, ${particles[i].life * 0.25})`;

          ctx.strokeStyle = particles[i].isGold ? goldRgba : cyanRgba;
          ctx.lineWidth = 0.8;
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
   4. 3D TILT WITH GLARE REFRACTION
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.bento-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
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
   7. ANIMATED METRICS COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  const speed = 100;

  const animate = (counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    let count = 0;
    const step = target / speed;

    const update = () => {
      count += step;
      if (count < target) {
        counter.innerText = isDecimal ? count.toFixed(1) : Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        counter.innerText = isDecimal ? target.toFixed(1) : target;
      }
    };
    update();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
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
              allowTaint: true,
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
   9. APP LIGHTBOX / ZOOM VIEWER
   ========================================================================== */
function initAppLightbox() {
  const appCards = document.querySelectorAll('.app-preview-trigger');
  if (appCards.length === 0) return;

  const lightbox = document.createElement('div');
  lightbox.id = 'app-lightbox-modal';
  lightbox.className = 'fixed inset-0 z-[110] hidden items-center justify-center p-4 modal-backdrop';
  lightbox.innerHTML = `
    <div class="relative max-w-lg w-full max-h-[90vh] bg-[#070b14] border border-white/15 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-4 overflow-hidden">
      <button id="close-lightbox" class="absolute top-4 right-4 size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer z-20">
        <span class="material-symbols-outlined text-lg">close</span>
      </button>
      <div class="w-full h-auto max-h-[70vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
        <img id="lightbox-img" src="" alt="App Preview" class="w-full h-full object-contain max-h-[68vh]">
      </div>
      <div class="w-full text-center">
        <h4 id="lightbox-title" class="text-white font-bold font-heading text-lg"></h4>
        <p id="lightbox-desc" class="text-xs text-primary font-mono mt-0.5"></p>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = document.getElementById('lightbox-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbDesc = document.getElementById('lightbox-desc');
  const closeLb = document.getElementById('close-lightbox');

  const close = () => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  };

  appCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-img');
      const title = card.getAttribute('data-title') || 'Mobile Application';
      const desc = card.getAttribute('data-desc') || 'Engineered with Flutter & Firebase';

      if (src && lbImg) {
        lbImg.src = src;
        lbTitle.textContent = title;
        lbDesc.textContent = desc;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeLb) closeLb.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
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
   13. DYNAMIC REAL-TIME CAREER EXPERIENCE CALCULATOR
   ========================================================================== */
function initDynamicExperience() {
  // Career started November 2021 (AL-Mugni Information & Tech - ISP Operations)
  const careerStartDate = new Date('2021-11-01');
  const now = new Date();

  // Total months difference
  let totalMonths = (now.getFullYear() - careerStartDate.getFullYear()) * 12 + (now.getMonth() - careerStartDate.getMonth());
  if (now.getDate() < careerStartDate.getDate()) {
    totalMonths = Math.max(0, totalMonths - 1);
  }

  const rawYears = totalMonths / 12;
  const exactYears = Math.max(4.0, parseFloat(rawYears.toFixed(1)));
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

