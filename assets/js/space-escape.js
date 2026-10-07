/**
 * ==============================================================================
 * 🚀 SPACE ESCAPE - 2D COSMIC SURVIVAL MINI-GAME (GAME 3 / FINAL CHAPTER)
 * ==============================================================================
 * The epic finale of the portfolio arcade trilogy:
 * - Cute Mini Astronaut in an Agile Sci-Fi Rocket Pod / Spacecraft
 * - Dynamic 2D free-flight movement with realistic pitch tilting & plasma thrusters
 * - Multi-layered Deep Space Parallax: Nebulae, Distant Galaxies, Parallax Stars & Cosmic Dust
 * - Procedural Rotating Asteroids: Small, Medium, Massive Craters, Fast Comets, Glowing Plasma Asteroids
 * - Collectibles: ⭐ Golden Stars (+25 pts), 🔋 Energy Cells (+50 pts), 💎 Quantum Hyper-Crystals (+150 pts)
 * - Progressive difficulty: Speed smoothly accelerates from 5.5 to 11.5 with distance
 * - Unlock System linked to Robot Escape (requires Robot Score >= 10,000 pts)
 * - Procedural Sci-Fi Web Audio API sound synthesizer (Engine hum, Star Chimes, Shield Collision, Victory)
 * - Touch Joystick / Swipe / Keyboard (W/A/S/D / Arrows)
 * - 60 FPS requestAnimationFrame with IntersectionObserver viewport awareness
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- UNLOCK CONFIGURATION ---
  const UNLOCKS = {
    robotEscape: 6000,
    spaceEscape: 10000
  };

  // --- SCI-FI WEB AUDIO SYNTHESIZER ---
  class SpaceSoundFx {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('portfolio_arcade_muted') === 'true' || 
                   localStorage.getItem('space_escape_muted') === 'true';
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('portfolio_arcade_muted', this.muted);
      localStorage.setItem('space_escape_muted', this.muted);
      localStorage.setItem('cat_runner_muted', this.muted);
      localStorage.setItem('robot_escape_muted', this.muted);
      return this.muted;
    }

    playThruster() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(320, now + 0.12);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
      } catch (e) {}
    }

    playStar() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1046.50, now); // C6
        osc.frequency.setValueAtTime(1567.98, now + 0.06); // G6

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
      } catch (e) {}
    }

    playEnergyCell() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [523.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + idx * 0.04;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.005, t + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.15);
        });
      } catch (e) {}
    }

    playCrystal() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [880, 1108.73, 1318.51, 1760, 2093].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + idx * 0.035;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.22);
        });
      } catch (e) {}
    }

    playImpact() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
      } catch (e) {}
    }

    playUnlock() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        chords.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + i * 0.07;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.005, t + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.35);
        });
      } catch (e) {}
    }
  }

  // --- GAME CONSTANTS ---
  const VIRTUAL_WIDTH = 840;
  const VIRTUAL_HEIGHT = 400;

  class SpaceEscapeGame {
    constructor() {
      this.canvas = document.getElementById('space-escape-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.container = document.getElementById('space-escape-game-container');
      this.section = document.getElementById('space-escape-section');
      this.sound = new SpaceSoundFx();

      // Unlock UI
      this.lockOverlay = document.getElementById('space-lock-overlay');
      this.lockBadge = document.getElementById('space-lock-badge');
      this.lockTitle = document.getElementById('space-lock-title');
      this.lockSubtitle = document.getElementById('space-lock-subtitle');
      this.lockScoreText = document.getElementById('space-lock-score-text');
      this.lockProgressBar = document.getElementById('space-lock-progress-bar');
      this.quickUnlockBtn = document.getElementById('space-quick-unlock-btn');

      // In-game HUD
      this.startScreen = document.getElementById('space-start-screen');
      this.gameOverScreen = document.getElementById('space-gameover-screen');
      this.scoreDisplay = document.getElementById('space-score-text');
      this.distanceDisplay = document.getElementById('space-distance-text');
      this.energyDisplay = document.getElementById('space-energy-text');
      this.bestScoreDisplay = document.getElementById('space-best-text');
      this.muteBtn = document.getElementById('space-mute-btn');
      this.startBtn = document.getElementById('space-start-btn');
      this.restartBtn = document.getElementById('space-restart-btn');

      // Game Over stats
      this.goDistance = document.getElementById('space-go-distance');
      this.goScore = document.getElementById('space-go-score');
      this.goEnergy = document.getElementById('space-go-energy');
      this.goNewBest = document.getElementById('space-go-newbest');

      // Mobile Touchpad
      this.touchUpBtn = document.getElementById('space-touch-up');
      this.touchDownBtn = document.getElementById('space-touch-down');
      this.touchLeftBtn = document.getElementById('space-touch-left');
      this.touchRightBtn = document.getElementById('space-touch-right');

      // Unlock status - Kept unlocked for now as requested
      this.isUnlocked = true;
      localStorage.setItem('space_escape_unlocked', 'true');

      // Gameplay state
      this.state = 'START'; // 'START', 'PLAYING', 'GAMEOVER'
      this.score = 0;
      this.distance = 0;
      this.energyCollected = 0;
      this.bestScore = parseInt(localStorage.getItem('space_escape_best_score') || '0', 10);
      this.speed = 6.0;
      this.baseSpeed = 6.0;
      this.maxSpeed = 12.0;
      this.distanceTimer = 0;
      this.spawnTimer = 0;
      this.itemSpawnTimer = 0;
      this.lastTime = 0;
      this.animId = null;
      this.isVisible = true;

      // Inputs
      this.keys = {
        up: false,
        down: false,
        left: false,
        right: false
      };

      // Spacecraft Entity
      this.ship = this.createShip();
      this.asteroids = [];
      this.items = [];
      this.particles = [];
      this.floatingTexts = [];
      this.starsFar = [];
      this.starsMid = [];
      this.starsNear = [];
      this.shootingStars = [];
      this.nebulae = [];

      this.initSpaceBackground();
      this.setupCanvas();
      this.bindEvents();
      this.checkUnlockStatus();
      this.updateHUD();
      this.updateMuteIcon();
      this.render(); // Initial static frame
    }

    createShip() {
      return {
        x: 100,
        y: VIRTUAL_HEIGHT / 2 - 16,
        width: 48,
        height: 32,
        vx: 0,
        vy: 0,
        tilt: 0,
        targetTilt: 0,
        speed: 5.5,
        engineFlameTimer: 0,
        bobTimer: 0,
        invulnerable: 0,
        shieldPulse: 0
      };
    }

    initSpaceBackground() {
      // Far Stars (Layer 1 - slow)
      this.starsFar = [];
      for (let i = 0; i < 70; i++) {
        this.starsFar.push({
          x: Math.random() * VIRTUAL_WIDTH,
          y: Math.random() * VIRTUAL_HEIGHT,
          radius: 0.8 + Math.random() * 0.8,
          alpha: 0.3 + Math.random() * 0.5,
          twinkleSpeed: 0.02 + Math.random() * 0.04
        });
      }

      // Mid Stars (Layer 2 - medium)
      this.starsMid = [];
      for (let i = 0; i < 40; i++) {
        this.starsMid.push({
          x: Math.random() * VIRTUAL_WIDTH,
          y: Math.random() * VIRTUAL_HEIGHT,
          radius: 1.4 + Math.random() * 1.2,
          color: Math.random() < 0.3 ? '#38bdf8' : (Math.random() < 0.5 ? '#f472b6' : '#ffffff'),
          alpha: 0.6 + Math.random() * 0.4,
          twinkleSpeed: 0.03 + Math.random() * 0.05
        });
      }

      // Near Cosmic Particles (Layer 3 - fast streaks)
      this.starsNear = [];
      for (let i = 0; i < 25; i++) {
        this.starsNear.push({
          x: Math.random() * VIRTUAL_WIDTH,
          y: Math.random() * VIRTUAL_HEIGHT,
          length: 6 + Math.random() * 14,
          speed: 1.2 + Math.random() * 1.5,
          color: '#00f5d4'
        });
      }

      // Glowing Nebulae Clouds
      this.nebulae = [
        { x: 150, y: 100, radius: 140, color: 'rgba(168, 85, 247, 0.12)' },
        { x: 550, y: 280, radius: 180, color: 'rgba(56, 189, 248, 0.10)' },
        { x: 750, y: 90, radius: 120, color: 'rgba(244, 63, 94, 0.08)' }
      ];
    }

    setupCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = VIRTUAL_WIDTH * dpr;
      this.canvas.height = VIRTUAL_HEIGHT * dpr;
      this.ctx.scale(dpr, dpr);
    }

    bindEvents() {
      window.addEventListener('resize', () => this.setupCanvas());

      // Listen for Robot Escape Milestone Score
      window.addEventListener('robot_score_updated', (e) => {
        const robotBest = e.detail.bestScore || e.detail.score || 0;
        this.updateLockProgress(robotBest);
        if (robotBest >= UNLOCKS.spaceEscape && !this.isUnlocked) {
          this.unlockGame(true);
        }
      });

      // Quick unlock button
      if (this.quickUnlockBtn) {
        this.quickUnlockBtn.addEventListener('click', () => {
          this.sound.init();
          this.unlockGame(true);
        });
      }

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        if (!this.isUnlocked) return;

        if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          if (this.isSectionVisible()) e.preventDefault();
          this.keys.up = true;
        } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          if (this.isSectionVisible()) e.preventDefault();
          this.keys.down = true;
        } else if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          if (this.isSectionVisible()) e.preventDefault();
          this.keys.left = true;
        } else if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          if (this.isSectionVisible()) e.preventDefault();
          this.keys.right = true;
        } else if (e.code === 'Space') {
          if (this.isSectionVisible()) e.preventDefault();
          if (this.state === 'START' || this.state === 'GAMEOVER') {
            this.sound.init();
            this.startGame();
          }
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = false;
        if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = false;
        if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
        if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      });

      // Mobile Touchpad Directional Buttons
      const bindTouch = (elem, dir) => {
        if (!elem) return;
        const start = (e) => {
          e.preventDefault();
          this.sound.init();
          this.keys[dir] = true;
        };
        const end = (e) => {
          e.preventDefault();
          this.keys[dir] = false;
        };
        elem.addEventListener('pointerdown', start);
        elem.addEventListener('pointerup', end);
        elem.addEventListener('pointercancel', end);
        elem.addEventListener('pointerleave', end);
      };

      bindTouch(this.touchUpBtn, 'up');
      bindTouch(this.touchDownBtn, 'down');
      bindTouch(this.touchLeftBtn, 'left');
      bindTouch(this.touchRightBtn, 'right');

      // Direct Canvas Drag / Pointer Follow on Touch
      let pointerActive = false;
      this.canvas.addEventListener('pointerdown', (e) => {
        if (!this.isUnlocked) return;
        e.preventDefault();
        this.sound.init();
        if (this.state === 'START' || this.state === 'GAMEOVER') {
          this.startGame();
        } else {
          pointerActive = true;
          this.updatePointerTarget(e);
        }
      });

      this.canvas.addEventListener('pointermove', (e) => {
        if (pointerActive && this.state === 'PLAYING') {
          this.updatePointerTarget(e);
        }
      });

      const stopPointer = () => { pointerActive = false; };
      window.addEventListener('pointerup', stopPointer);
      window.addEventListener('pointercancel', stopPointer);

      // Buttons
      if (this.startBtn) {
        this.startBtn.addEventListener('click', () => {
          this.sound.init();
          this.startGame();
        });
      }

      if (this.restartBtn) {
        this.restartBtn.addEventListener('click', () => {
          this.sound.init();
          this.startGame();
        });
      }

      if (this.muteBtn) {
        this.muteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.sound.init();
          this.sound.toggleMute();
          this.updateMuteIcon();
        });
      }

      // Viewport Intersection Observer
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              this.isVisible = entry.isIntersecting;
              if (this.isVisible && this.state === 'PLAYING' && !this.animId) {
                this.lastTime = performance.now();
                this.loop();
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(this.container || this.canvas);
      }
    }

    updatePointerTarget(e) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = VIRTUAL_WIDTH / rect.width;
      const scaleY = VIRTUAL_HEIGHT / rect.height;
      const touchX = (e.clientX - rect.left) * scaleX;
      const touchY = (e.clientY - rect.top) * scaleY;

      // Smooth guidance toward finger position
      const dy = touchY - (this.ship.y + this.ship.height / 2);
      const dx = touchX - (this.ship.x + this.ship.width / 2);

      this.keys.up = dy < -12;
      this.keys.down = dy > 12;
      this.keys.left = dx < -15;
      this.keys.right = dx > 15;
    }

    isSectionVisible() {
      if (!this.container) return false;
      const rect = this.container.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }

    updateMuteIcon() {
      if (!this.muteBtn) return;
      const icon = this.muteBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = this.sound.muted ? 'volume_off' : 'volume_up';
      }
    }

    // --- LOCK / UNLOCK SYSTEM ---
    checkUnlockStatus() {
      const robotBest = parseInt(localStorage.getItem('robot_escape_best_score') || '0', 10);
      this.updateLockProgress(robotBest);

      if (this.isUnlocked || robotBest >= UNLOCKS.spaceEscape) {
        this.unlockGame(false);
      } else {
        this.lockGame();
      }
    }

    updateLockProgress(currentScore) {
      const target = UNLOCKS.spaceEscape;
      const pct = Math.min(100, Math.floor((currentScore / target) * 100));
      if (this.lockScoreText) {
        this.lockScoreText.textContent = `${currentScore.toLocaleString()} / ${target.toLocaleString()}`;
      }
      if (this.lockProgressBar) {
        this.lockProgressBar.style.width = `${pct}%`;
      }
    }

    lockGame() {
      this.isUnlocked = false;
      if (this.lockOverlay) this.lockOverlay.classList.remove('hidden');
      if (this.lockBadge) {
        this.lockBadge.className = 'inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400';
        this.lockBadge.innerHTML = '<span class="material-symbols-outlined text-xs">lock</span><span class="text-xs font-mono font-bold uppercase tracking-wider">Final Challenge Locked</span>';
      }
      if (this.lockSubtitle) {
        this.lockSubtitle.textContent = `"Reach 10,000 points in Robot Escape to unlock the final challenge."`;
      }
    }

    unlockGame(playFanfare = true) {
      this.isUnlocked = true;
      localStorage.setItem('space_escape_unlocked', 'true');

      if (this.lockBadge) {
        this.lockBadge.className = 'inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-xl';
        this.lockBadge.innerHTML = '<span class="material-symbols-outlined text-xs">rocket_launch</span><span class="text-xs font-mono font-bold uppercase tracking-wider">Final Challenge Unlocked!</span>';
      }
      if (this.lockSubtitle) {
        this.lockSubtitle.textContent = `"You've mastered the ground. You've survived the future. Now escape into space."`;
      }

      if (this.lockOverlay) {
        this.lockOverlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          this.lockOverlay.classList.add('hidden');
        }, 500);
      }

      if (playFanfare) {
        this.sound.playUnlock();
        this.spawnConfetti();
      }

      this.render();
    }

    startGame() {
      this.state = 'PLAYING';
      this.score = 0;
      this.distance = 0;
      this.energyCollected = 0;
      this.speed = this.baseSpeed;
      this.asteroids = [];
      this.items = [];
      this.particles = [];
      this.floatingTexts = [];
      this.spawnTimer = 45;
      this.itemSpawnTimer = 30;
      this.ship = this.createShip();

      if (this.startScreen) this.startScreen.classList.add('hidden');
      if (this.gameOverScreen) this.gameOverScreen.classList.add('hidden');

      this.updateHUD();
      this.lastTime = performance.now();
      if (!this.animId) {
        this.loop();
      }
    }

    gameOver() {
      this.state = 'GAMEOVER';
      this.sound.playImpact();

      // Cosmic explosion particles
      this.spawnExplosion(this.ship.x + 20, this.ship.y + 16, 45, '#38bdf8');
      this.spawnExplosion(this.ship.x + 20, this.ship.y + 16, 30, '#f43f5e');

      const isNewBest = this.score > this.bestScore;
      if (isNewBest) {
        this.bestScore = this.score;
        localStorage.setItem('space_escape_best_score', this.bestScore);
        this.spawnConfetti();
      }

      if (this.goDistance) this.goDistance.textContent = `${Math.floor(this.distance)}m`;
      if (this.goScore) this.goScore.textContent = this.score.toLocaleString();
      if (this.goEnergy) this.goEnergy.textContent = this.energyCollected;
      if (this.goNewBest) {
        if (isNewBest && this.score > 50) {
          this.goNewBest.classList.remove('hidden');
        } else {
          this.goNewBest.classList.add('hidden');
        }
      }

      if (this.gameOverScreen) {
        this.gameOverScreen.classList.remove('hidden');
      }

      this.updateHUD();
    }

    updateHUD() {
      if (this.scoreDisplay) this.scoreDisplay.textContent = this.score.toString().padStart(4, '0');
      if (this.distanceDisplay) this.distanceDisplay.textContent = `${Math.floor(this.distance)}m`;
      if (this.energyDisplay) this.energyDisplay.textContent = this.energyCollected.toString().padStart(2, '0');
      if (this.bestScoreDisplay) this.bestScoreDisplay.textContent = this.bestScore.toString().padStart(4, '0');
    }

    spawnExplosion(x, y, count = 25, color = '#38bdf8') {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 1 + Math.random() * 6;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          radius: 1.5 + Math.random() * 4,
          color,
          alpha: 1,
          decay: 0.025 + Math.random() * 0.03
        });
      }
    }

    spawnConfetti() {
      const colors = ['#38bdf8', '#00f5d4', '#f43f5e', '#fbbf24', '#a855f7', '#ffffff'];
      for (let i = 0; i < 70; i++) {
        this.particles.push({
          x: VIRTUAL_WIDTH / 2 + (Math.random() - 0.5) * 400,
          y: VIRTUAL_HEIGHT / 2 + (Math.random() - 0.5) * 150,
          vx: (Math.random() - 0.5) * 9,
          vy: -3 - Math.random() * 6,
          radius: 2.5 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.012,
          gravity: 0.15
        });
      }
    }

    spawnFloatingText(text, x, y, color = '#38bdf8') {
      this.floatingTexts.push({
        text,
        x,
        y,
        color,
        alpha: 1,
        vy: -1.4
      });
    }

    // --- MAIN GAME LOOP ---
    loop(timestamp = performance.now()) {
      if (!this.isVisible && this.state !== 'PLAYING') {
        this.animId = null;
        return;
      }

      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;

      this.update(dt);
      this.render();

      this.animId = requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
      if (this.state !== 'PLAYING') return;

      // Distance & Speed Acceleration
      this.distance += this.speed * 0.06;
      this.score += Math.round(this.speed * 0.1);
      this.speed = Math.min(this.baseSpeed + (this.distance * 0.0035), this.maxSpeed);

      this.distanceTimer++;
      if (this.distanceTimer % 10 === 0) {
        this.updateHUD();
      }

      // Spacecraft Motion & Dynamics
      let moveY = 0;
      let moveX = 0;

      if (this.keys.up) moveY -= 1;
      if (this.keys.down) moveY += 1;
      if (this.keys.left) moveX -= 1;
      if (this.keys.right) moveX += 1;

      // Sound on thrust
      if (moveY !== 0 || moveX > 0) {
        if (Math.random() < 0.1) this.sound.playThruster();
      }

      // Smooth acceleration / velocity
      const targetVy = moveY * this.ship.speed;
      const targetVx = moveX * (this.ship.speed * 0.8);

      this.ship.vy += (targetVy - this.ship.vy) * 0.2;
      this.ship.vx += (targetVx - this.ship.vx) * 0.2;

      this.ship.y += this.ship.vy;
      this.ship.x += this.ship.vx;

      // Screen boundaries
      this.ship.y = Math.max(10, Math.min(VIRTUAL_HEIGHT - this.ship.height - 10, this.ship.y));
      this.ship.x = Math.max(20, Math.min(VIRTUAL_WIDTH * 0.65, this.ship.x));

      // Ship Pitch Tilt
      this.ship.targetTilt = (this.ship.vy / this.ship.speed) * 0.35;
      this.ship.tilt += (this.ship.targetTilt - this.ship.tilt) * 0.2;

      // Subtle idle bobbing
      this.ship.bobTimer += 0.06;

      // Engine Flame Particle Trail
      this.ship.engineFlameTimer += 0.3;
      if (Math.random() < 0.85) {
        const flameY = this.ship.y + this.ship.height / 2 + Math.sin(this.ship.tilt) * 4;
        this.particles.push({
          x: this.ship.x - 4,
          y: flameY + (Math.random() - 0.5) * 6,
          vx: -(this.speed * 0.6) - Math.random() * 3,
          vy: (Math.random() - 0.5) * 1.5,
          radius: 2 + Math.random() * 3,
          color: Math.random() < 0.5 ? '#00f5d4' : (Math.random() < 0.8 ? '#38bdf8' : '#ffffff'),
          alpha: 0.9,
          decay: 0.05
        });
      }

      // Parallax Stars Updates
      this.starsFar.forEach(s => {
        s.x -= this.speed * 0.15;
        if (s.x < 0) s.x = VIRTUAL_WIDTH;
      });

      this.starsMid.forEach(s => {
        s.x -= this.speed * 0.45;
        if (s.x < 0) s.x = VIRTUAL_WIDTH;
      });

      this.starsNear.forEach(s => {
        s.x -= this.speed * s.speed;
        if (s.x < -s.length) s.x = VIRTUAL_WIDTH + 20;
      });

      // Spawning Asteroids
      this.spawnTimer--;
      if (this.spawnTimer <= 0) {
        this.spawnAsteroid();
        const minGap = Math.max(28, 55 - (this.speed * 2.5));
        const maxGap = Math.max(45, 95 - (this.speed * 3));
        this.spawnTimer = Math.floor(minGap + Math.random() * (maxGap - minGap));
      }

      // Spawning Collectibles
      this.itemSpawnTimer--;
      if (this.itemSpawnTimer <= 0) {
        this.spawnItemPattern();
        this.itemSpawnTimer = Math.floor(35 + Math.random() * 50);
      }

      // Update Asteroids
      for (let i = this.asteroids.length - 1; i >= 0; i--) {
        const ast = this.asteroids[i];
        ast.x -= (this.speed * ast.speedMult);
        ast.y += ast.vy;
        ast.angle += ast.rotSpeed;

        // Collision Check
        if (this.checkAsteroidCollision(this.ship, ast)) {
          this.gameOver();
          return;
        }

        if (ast.x + ast.radius * 2 < -60) {
          this.asteroids.splice(i, 1);
        }
      }

      // Update Collectibles
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        item.x -= this.speed;
        item.floatTimer = (item.floatTimer || 0) + 0.1;

        if (this.checkItemCollision(this.ship, item)) {
          if (item.type === 'star') {
            this.score += 25;
            this.sound.playStar();
            this.spawnFloatingText('+25 ⭐', item.x, item.y, '#fbbf24');
            this.spawnExplosion(item.x, item.y, 8, '#fbbf24');
          } else if (item.type === 'energy') {
            this.score += 60;
            this.energyCollected++;
            this.sound.playEnergyCell();
            this.spawnFloatingText('+60 🔋', item.x, item.y, '#00f5d4');
            this.spawnExplosion(item.x, item.y, 10, '#00f5d4');
          } else if (item.type === 'crystal') {
            this.score += 150;
            this.energyCollected += 2;
            this.sound.playCrystal();
            this.spawnFloatingText('+150 💎', item.x, item.y - 5, '#a855f7');
            this.spawnExplosion(item.x, item.y, 16, '#a855f7');
          }
          this.updateHUD();
          this.items.splice(i, 1);
          continue;
        }

        if (item.x < -50) {
          this.items.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }

      // Update Floating Texts
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.025;
        if (ft.alpha <= 0) {
          this.floatingTexts.splice(i, 1);
        }
      }
    }

    spawnAsteroid() {
      // Asteroid types: small, medium, large, fast_comet, glowing_plasma
      const rand = Math.random();
      let type = 'medium';
      let radius = 22;
      let speedMult = 1.0;
      let vy = (Math.random() - 0.5) * 0.8;

      if (rand < 0.35) {
        type = 'small';
        radius = 14 + Math.random() * 4;
        speedMult = 1.15;
      } else if (rand < 0.7) {
        type = 'medium';
        radius = 22 + Math.random() * 6;
        speedMult = 1.0;
      } else if (rand < 0.88) {
        type = 'large';
        radius = 34 + Math.random() * 10;
        speedMult = 0.85;
      } else if (rand < 0.95) {
        type = 'fast_comet';
        radius = 16 + Math.random() * 4;
        speedMult = 1.45;
        vy = (Math.random() - 0.5) * 1.2;
      } else {
        type = 'glowing_plasma';
        radius = 26 + Math.random() * 6;
        speedMult = 1.1;
      }

      // Irregular shape vertices
      const numVertices = 8 + Math.floor(Math.random() * 4);
      const vertices = [];
      for (let i = 0; i < numVertices; i++) {
        const angle = (i / numVertices) * Math.PI * 2;
        const r = radius * (0.8 + Math.random() * 0.4);
        vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
      }

      this.asteroids.push({
        type,
        x: VIRTUAL_WIDTH + radius + 30,
        y: Math.max(radius + 15, Math.min(VIRTUAL_HEIGHT - radius - 15, Math.random() * VIRTUAL_HEIGHT)),
        radius,
        vertices,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        speedMult,
        vy
      });
    }

    spawnItemPattern() {
      const rand = Math.random();
      const type = rand < 0.45 ? 'star' : (rand < 0.8 ? 'energy' : 'crystal');
      const count = type === 'crystal' ? 1 : Math.floor(2 + Math.random() * 3);
      const startY = 50 + Math.random() * (VIRTUAL_HEIGHT - 100);

      for (let i = 0; i < count; i++) {
        this.items.push({
          type,
          x: VIRTUAL_WIDTH + 50 + (i * 36),
          y: startY + Math.sin(i * 0.8) * 20,
          radius: type === 'crystal' ? 14 : 10,
          floatTimer: i * 0.5
        });
      }
    }

    checkAsteroidCollision(ship, ast) {
      // Circle collision against ship center with forgiving hitbox
      const shipCenterX = ship.x + ship.width / 2;
      const shipCenterY = ship.y + ship.height / 2;
      const dist = Math.hypot(shipCenterX - ast.x, shipCenterY - ast.y);
      return dist < (ast.radius * 0.8 + ship.height * 0.38);
    }

    checkItemCollision(ship, item) {
      const shipCenterX = ship.x + ship.width / 2;
      const shipCenterY = ship.y + ship.height / 2;
      const dist = Math.hypot(shipCenterX - item.x, shipCenterY - item.y);
      return dist < 36;
    }

    // --- CANVAS RENDERING ---
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      this.drawSpaceSky(ctx);
      this.drawNebulae(ctx);
      this.drawStars(ctx);
      this.drawCollectibles(ctx);
      this.drawAsteroids(ctx);
      this.drawSpacecraft(ctx);
      this.drawParticles(ctx);
      this.drawFloatingTexts(ctx);
      this.drawVignette(ctx);
    }

    drawSpaceSky(ctx) {
      const sky = ctx.createLinearGradient(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      sky.addColorStop(0, '#030712');
      sky.addColorStop(0.5, '#090d1a');
      sky.addColorStop(1, '#0f172a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }

    drawNebulae(ctx) {
      ctx.save();
      this.nebulae.forEach(n => {
        const rad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        rad.addColorStop(0, n.color);
        rad.addColorStop(1, 'transparent');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    drawStars(ctx) {
      ctx.save();
      // Far Stars
      this.starsFar.forEach(s => {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Mid Stars
      this.starsMid.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Near Cosmic Particles
      this.starsNear.forEach(s => {
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.length, s.y);
        ctx.stroke();
      });
      ctx.restore();
    }

    // --- ASTEROIDS RENDERING ---
    drawAsteroids(ctx) {
      this.asteroids.forEach(ast => {
        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.angle);

        if (ast.type === 'glowing_plasma') {
          // Glowing Rare Plasma Asteroid
          ctx.shadowColor = 'rgba(168, 85, 247, 0.9)';
          ctx.shadowBlur = 18;
          ctx.fillStyle = '#7e22ce';
          ctx.strokeStyle = '#c084fc';
        } else if (ast.type === 'fast_comet') {
          // Fiery Comet Asteroid
          ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
          ctx.shadowBlur = 14;
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#38bdf8';
        } else {
          // Standard Rocky Crater Asteroid
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#64748b';
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        ast.vertices.forEach((v, idx) => {
          if (idx === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Craters on Asteroid surface
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.beginPath();
        ctx.arc(ast.radius * 0.25, ast.radius * 0.2, ast.radius * 0.28, 0, Math.PI * 2);
        ctx.arc(-ast.radius * 0.35, -ast.radius * 0.15, ast.radius * 0.22, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    }

    // --- COLLECTIBLES RENDERING ---
    drawCollectibles(ctx) {
      this.items.forEach(item => {
        ctx.save();
        const floatY = Math.sin(item.floatTimer * 3) * 4;

        if (item.type === 'star') {
          // Golden Star
          const sx = item.x;
          const sy = item.y + floatY;

          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
          ctx.shadowBlur = 14;

          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const rOuter = 10;
            const rInner = 4.5;
            const ox = sx + Math.cos(angle) * rOuter;
            const oy = sy + Math.sin(angle) * rOuter;
            if (i === 0) ctx.moveTo(ox, oy);
            else ctx.lineTo(ox, oy);

            const iAngle = angle + Math.PI / 5;
            ctx.lineTo(sx + Math.cos(iAngle) * rInner, sy + Math.sin(iAngle) * rInner);
          }
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

        } else if (item.type === 'energy') {
          // Plasma Energy Cell
          const ex = item.x;
          const ey = item.y + floatY;

          ctx.fillStyle = '#00f5d4';
          ctx.shadowColor = 'rgba(0, 245, 212, 0.9)';
          ctx.shadowBlur = 14;

          ctx.beginPath();
          ctx.roundRect(ex - 6, ey - 9, 12, 18, 4);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Lightning Bolt in Energy Cell
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(ex + 1, ey - 6);
          ctx.lineTo(ex - 3, ey);
          ctx.lineTo(ex + 1, ey);
          ctx.lineTo(ex - 1, ey + 6);
          ctx.lineTo(ex + 3, ey);
          ctx.lineTo(ex - 1, ey);
          ctx.closePath();
          ctx.fill();

        } else if (item.type === 'crystal') {
          // Quantum Cosmic Crystal
          const cx = item.x;
          const cy = item.y + floatY;

          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = 'rgba(168, 85, 247, 0.95)';
          ctx.shadowBlur = 16;

          ctx.beginPath();
          ctx.moveTo(cx, cy - 12);
          ctx.lineTo(cx + 9, cy);
          ctx.lineTo(cx, cy + 12);
          ctx.lineTo(cx - 9, cy);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
    }

    // --- CUTE ASTRONAUT & SPACECRAFT RENDERING ---
    drawSpacecraft(ctx) {
      const ship = this.ship;
      ctx.save();

      const cx = ship.x + ship.width / 2;
      const cy = ship.y + ship.height / 2;

      ctx.translate(cx, cy);
      ctx.rotate(ship.tilt);
      ctx.translate(-cx, -cy);

      // 1. Dual Plasma Thruster Flames
      const flameLen = 14 + Math.sin(ship.engineFlameTimer * 3) * 6;
      ctx.fillStyle = '#00f5d4';
      ctx.shadowColor = 'rgba(0, 245, 212, 0.9)';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.moveTo(ship.x + 2, ship.y + 11);
      ctx.lineTo(ship.x - flameLen, ship.y + 16);
      ctx.lineTo(ship.x + 2, ship.y + 21);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner Core Flame
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(ship.x + 2, ship.y + 13);
      ctx.lineTo(ship.x - flameLen * 0.5, ship.y + 16);
      ctx.lineTo(ship.x + 2, ship.y + 19);
      ctx.closePath();
      ctx.fill();

      // 2. Rocket Pod Hull
      ctx.fillStyle = '#f8fafc'; // White aerospace ceramic hull
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(ship.x + ship.width, ship.y + 16); // Nose cone
      ctx.quadraticCurveTo(ship.x + 18, ship.y - 2, ship.x + 4, ship.y + 6);
      ctx.lineTo(ship.x + 4, ship.y + 26);
      ctx.quadraticCurveTo(ship.x + 18, ship.y + 34, ship.x + ship.width, ship.y + 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Wing Fins
      ctx.fillStyle = '#0284c7';
      // Top Fin
      ctx.beginPath();
      ctx.moveTo(ship.x + 8, ship.y + 5);
      ctx.lineTo(ship.x - 2, ship.y - 4);
      ctx.lineTo(ship.x + 18, ship.y + 5);
      ctx.closePath();
      ctx.fill();
      // Bottom Fin
      ctx.beginPath();
      ctx.moveTo(ship.x + 8, ship.y + 27);
      ctx.lineTo(ship.x - 2, ship.y + 36);
      ctx.lineTo(ship.x + 18, ship.y + 27);
      ctx.closePath();
      ctx.fill();

      // 3. Glowing Glass Cockpit Bubble & Mini Astronaut
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(ship.x + 26, ship.y + 16, 11, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Mini Cute Astronaut Helmet Visor inside Cockpit
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(ship.x + 27, ship.y + 16, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Visor Glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ship.x + 29, ship.y + 14.5, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 4. Aerospace Decals & MEP Badge
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(ship.x + 12, ship.y + 14, 4, 4);

      ctx.restore();
    }

    drawParticles(ctx) {
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    drawFloatingTexts(ctx) {
      this.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 13px "Outfit", monospace';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
    }

    drawVignette(ctx) {
      ctx.save();
      const vignette = ctx.createRadialGradient(
        VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, VIRTUAL_WIDTH * 0.35,
        VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, VIRTUAL_WIDTH * 0.65
      );
      vignette.addColorStop(0, 'rgba(3, 7, 18, 0)');
      vignette.addColorStop(1, 'rgba(3, 7, 18, 0.8)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      ctx.restore();
    }
  }

  // Initialize Game on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SpaceEscapeGame());
  } else {
    new SpaceEscapeGame();
  }
})();
