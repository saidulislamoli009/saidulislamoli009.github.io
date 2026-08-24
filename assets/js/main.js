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
  initParticleCanvas();
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
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
      document.querySelectorAll('a[href*="tel:"]').forEach((a, idx) => {
        if (idx === 0) {
          a.href = `tel:${p.phone1.replace(/\s+/g, '')}`;
          a.textContent = p.phone1;
        } else if (p.phone2) {
          a.href = `tel:${p.phone2.replace(/\s+/g, '')}`;
          a.textContent = p.phone2;
        }
      });
      document.querySelectorAll('button[data-copy*="+880"]').forEach(b => {
        b.setAttribute('data-copy', p.phone1);
      });
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
    if (appsGrid) {
      appsGrid.innerHTML = data.apps.map(app => {
        const tagsHtml = (app.tags || []).map((t, idx) => `
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 ${idx === 0 ? 'text-brand-cyan' : 'text-slate-300'}">${t}</span>
        `).join('');

        return `
          <div class="bento-card rounded-3xl p-6 flex flex-col gap-5 border border-white/10 hover:border-brand-cyan/40 group app-preview-trigger cursor-pointer" data-img="${app.image || 'assets/images/app-zenpdf.jpg'}" data-title="${app.modalTitle || app.name}" data-desc="${app.modalSubtitle || app.description}">
            <div class="relative w-full aspect-[9/16] rounded-2xl overflow-hidden border border-white/15 bg-[#0b0f19] shadow-2xl group-hover:scale-[1.02] transition-all duration-500">
              <img src="${app.image || 'assets/images/app-zenpdf.jpg'}" alt="${app.name}" class="w-full h-full object-cover object-top">
              <div class="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span class="text-xs font-mono font-bold text-brand-cyan bg-brand-cyan/10 px-3 py-1.5 rounded-lg border border-brand-cyan/30 backdrop-blur-md">
                  Click to Enlarge
                </span>
                <span class="material-symbols-outlined text-brand-cyan bg-white/10 rounded-full p-1 text-sm">fullscreen</span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="size-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <span class="material-symbols-outlined text-base">${app.icon || 'picture_as_pdf'}</span>
                  </div>
                  <h3 class="text-xl font-bold text-white font-heading">${app.name}</h3>
                </div>
                <span class="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
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

        const cardContent = `
          <div class="bento-card p-6 md:p-8 rounded-3xl border border-white/10 hover:border-primary/50 shadow-2xl relative overflow-hidden group">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="size-12 rounded-xl bg-gradient-to-br from-primary/20 via-brand-cyan/20 to-transparent border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0">
                  ${iconHtml}
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white font-heading group-hover:text-primary transition-colors">${exp.role}</h3>
                  <div class="text-primary text-xs font-bold font-mono uppercase">${exp.company}</div>
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
            <div class="relative flex flex-col md:flex-row items-center justify-between w-full group">
              <div class="w-full md:w-[45%] flex flex-col relative z-20 pl-10 md:pl-0">
                ${cardContent}
              </div>
              <div class="timeline-node"></div>
              <div class="w-full md:w-[45%] hidden md:block"></div>
            </div>
          `;
        } else {
          return `
            <div class="relative flex flex-col md:flex-row items-center justify-between w-full group">
              <div class="w-full md:w-[45%] hidden md:block"></div>
              <div class="timeline-node"></div>
              <div class="w-full md:w-[45%] flex flex-col relative z-20 pl-10 md:pl-0">
                ${cardContent}
              </div>
            </div>
          `;
        }
      }).join('');

      timeline.innerHTML = `
        <div class="timeline-laser-track"></div>
        ${itemsHtml}
      `;
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
    setText('cv-phone2', data.profile?.phone2);
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


