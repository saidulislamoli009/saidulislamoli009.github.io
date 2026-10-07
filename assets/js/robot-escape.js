/**
 * ==============================================================================
 * 🤖 ROBOT ESCAPE - 2D FUTURISTIC CYBER RUNNER MINI-GAME
 * ==============================================================================
 * A fast-paced, unlockable cyber endless runner featuring:
 * - 4-legged articulated Mecha-Quadruped Robot with Jet Thrusters
 * - 3 Action States: Run (4-legged gallop), Jump (thruster boost), Slide (low-profile ground slide)
 * - Ground Obstacles (Electric Barriers, Tech Crates, Plasma Spikes)
 * - Air Obstacles (High Laser Beams, Flying Hunter Drones - require sliding!)
 * - Collectibles (Plasma Energy Cores, Quantum Data Crystals)
 * - Multi-layer Cyberpunk Parallax Skyline & Neon Grid Platform
 * - Dynamic Real-Time Unlock System linked to Cat Runner (threshold: 6,000 pts)
 * - Web Audio API procedural cyber sound synthesizer
 * - Keyboard, Touch, Mobile Buttons & Swipe gestures
 * - IntersectionObserver viewport awareness for 0% idle CPU
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER FOR ROBOT ESCAPE ---
  class RobotSoundFx {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('robot_escape_muted') === 'true';
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
      localStorage.setItem('robot_escape_muted', this.muted);
      return this.muted;
    }

    playJump() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
      } catch (e) {}
    }

    playSlide() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.22);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
      } catch (e) {}
    }

    playEnergyCore() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [587.33, 880, 1174.66].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteTime = now + i * 0.04;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.14, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.14);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 0.14);
        });
      } catch (e) {}
    }

    playCrystal() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [783.99, 1046.50, 1318.51, 1567.98].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteTime = now + i * 0.045;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.16, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.18);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 0.18);
        });
      } catch (e) {}
    }

    playCrash() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      } catch (e) {}
    }

    playUnlock() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [440, 554.37, 659.25, 880, 1108.73].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteTime = now + i * 0.08;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.22, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.28);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 0.28);
        });
      } catch (e) {}
    }
  }

  // --- CONSTANTS & GEOMETRY ---
  const VIRTUAL_WIDTH = 840;
  const VIRTUAL_HEIGHT = 400;
  const GROUND_Y = 325;
  const GRAVITY = 0.64;
  const JUMP_FORCE = -12.6;
  const DOUBLE_JUMP_FORCE = -10.5;
  const SLIDE_DURATION = 32; // frames (~0.53s)
  const UNLOCK_SCORE_THRESHOLD = 6000;

  class RobotEscapeGame {
    constructor() {
      this.canvas = document.getElementById('robot-escape-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.container = document.getElementById('robot-escape-game-container');
      this.section = document.getElementById('robot-escape-section');
      this.sound = new RobotSoundFx();

      // Lock System Elements
      this.lockOverlay = document.getElementById('robot-lock-overlay');
      this.lockBadge = document.getElementById('robot-lock-badge');
      this.lockTitle = document.getElementById('robot-lock-title');
      this.lockSubtitle = document.getElementById('robot-lock-subtitle');
      this.lockScoreText = document.getElementById('robot-lock-score-text');
      this.lockProgressBar = document.getElementById('robot-lock-progress-bar');
      this.quickUnlockBtn = document.getElementById('robot-quick-unlock-btn');

      // In-Game UI
      this.startScreen = document.getElementById('robot-start-screen');
      this.gameOverScreen = document.getElementById('robot-gameover-screen');
      this.scoreDisplay = document.getElementById('robot-score-text');
      this.distanceDisplay = document.getElementById('robot-distance-text');
      this.energyDisplay = document.getElementById('robot-energy-text');
      this.bestScoreDisplay = document.getElementById('robot-best-text');
      this.muteBtn = document.getElementById('robot-mute-btn');
      this.startBtn = document.getElementById('robot-start-btn');
      this.restartBtn = document.getElementById('robot-restart-btn');

      // Game Over stats
      this.goDistance = document.getElementById('robot-go-distance');
      this.goScore = document.getElementById('robot-go-score');
      this.goCores = document.getElementById('robot-go-cores');
      this.goNewBest = document.getElementById('robot-go-newbest');

      // Mobile Touch Controls
      this.jumpTouchBtn = document.getElementById('robot-jump-touch-btn');
      this.slideTouchBtn = document.getElementById('robot-slide-touch-btn');

      // Unlock state - Kept unlocked for direct access
      this.isUnlocked = true;
      localStorage.setItem('robot_escape_unlocked', 'true');

      // Gameplay state
      this.state = 'START'; // 'START', 'PLAYING', 'GAMEOVER'
      this.score = 0;
      this.distance = 0;
      this.energyCores = 0;
      this.bestScore = parseInt(localStorage.getItem('robot_escape_best_score') || '0', 10);
      this.speed = 5.8;
      this.baseSpeed = 5.8;
      this.maxSpeed = 10.8;
      this.distanceTimer = 0;
      this.spawnTimer = 0;
      this.itemSpawnTimer = 0;
      this.lastTime = 0;
      this.animId = null;
      this.isVisible = true;

      // Parallax offsets
      this.skyOffset = 0;
      this.cityFarOffset = 0;
      this.cityMidOffset = 0;
      this.groundOffset = 0;

      // Entities
      this.robot = this.createRobot();
      this.obstacles = [];
      this.items = [];
      this.particles = [];
      this.floatingTexts = [];
      this.cityBuildingsFar = [];
      this.cityBuildingsMid = [];

      this.initCityScape();
      this.setupCanvas();
      this.bindEvents();
      this.checkUnlockStatus();
      this.updateHUD();
      this.updateMuteIcon();
      this.render(); // Initial frame
    }

    createRobot() {
      return {
        x: 110,
        y: GROUND_Y - 42,
        width: 58,
        height: 42,
        normalHeight: 42,
        slideHeight: 22,
        vy: 0,
        isGrounded: true,
        canDoubleJump: true,
        isSliding: false,
        slideTimer: 0,
        runFrame: 0,
        runTimer: 0,
        thrusterPulse: 0,
        eyeScanX: 0,
        eyeScanDir: 1,
        antennaBlink: 0,
        squashY: 1,
        stretchX: 1
      };
    }

    initCityScape() {
      // Distant Neon Megastructures
      this.cityBuildingsFar = [
        { x: 0, width: 90, height: 180, color: '#1e1b4b', windows: true },
        { x: 100, width: 70, height: 230, color: '#0f172a', spire: true },
        { x: 180, width: 110, height: 160, color: '#172554', windows: true },
        { x: 300, width: 85, height: 210, color: '#1e1b4b', logo: 'MEP' },
        { x: 395, width: 120, height: 175, color: '#0f172a', windows: true },
        { x: 525, width: 75, height: 240, color: '#172554', spire: true },
        { x: 610, width: 100, height: 190, color: '#1e1b4b', windows: true },
        { x: 720, width: 130, height: 165, color: '#0f172a', logo: 'CYBER' }
      ];

      // Midground Tech Buildings & Neon Conduits
      this.cityBuildingsMid = [
        { x: 40, width: 65, height: 120, neon: '#00f5d4' },
        { x: 150, width: 80, height: 145, neon: '#f43f5e' },
        { x: 270, width: 60, height: 110, neon: '#818cf8' },
        { x: 370, width: 90, height: 135, neon: '#00f5d4' },
        { x: 500, width: 70, height: 150, neon: '#fbbf24' },
        { x: 620, width: 85, height: 125, neon: '#f43f5e' },
        { x: 740, width: 65, height: 140, neon: '#818cf8' }
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

      // Listen for Cat Runner Score Updates / Milestone Event
      window.addEventListener('cat_score_updated', (e) => {
        const catBest = e.detail.bestScore || e.detail.score || 0;
        this.updateLockProgress(catBest);
        if (catBest >= UNLOCK_SCORE_THRESHOLD && !this.isUnlocked) {
          this.unlockGame(true);
        }
      });

      // Quick Unlock Button
      if (this.quickUnlockBtn) {
        this.quickUnlockBtn.addEventListener('click', () => {
          this.sound.init();
          this.unlockGame(true);
        });
      }

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        if (!this.isUnlocked) return;

        if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          if (this.isSectionVisible()) {
            e.preventDefault();
            this.handleJump();
          }
        } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          if (this.isSectionVisible()) {
            e.preventDefault();
            this.handleSlide();
          }
        }
      });

      // Pointer / Click on Canvas
      this.canvas.addEventListener('pointerdown', (e) => {
        if (!this.isUnlocked) return;
        e.preventDefault();
        this.sound.init();
        if (this.state === 'START' || this.state === 'GAMEOVER') {
          this.startGame();
        } else {
          this.handleJump();
        }
      });

      // Mobile Dedicated Jump & Slide Buttons
      if (this.jumpTouchBtn) {
        this.jumpTouchBtn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.sound.init();
          this.handleJump();
        });
      }

      if (this.slideTouchBtn) {
        this.slideTouchBtn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.sound.init();
          this.handleSlide();
        });
      }

      // Mobile Touch Swipes on Canvas
      let touchStartY = 0;
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      this.canvas.addEventListener('touchend', (e) => {
        if (!this.isUnlocked) return;
        if (e.changedTouches.length > 0) {
          const deltaY = e.changedTouches[0].clientY - touchStartY;
          if (deltaY < -30) {
            // Swipe Up
            this.handleJump();
          } else if (deltaY > 30) {
            // Swipe Down
            this.handleSlide();
          }
        }
      }, { passive: true });

      // Start & Restart Buttons
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

      // Mute Button
      if (this.muteBtn) {
        this.muteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.sound.init();
          this.sound.toggleMute();
          this.updateMuteIcon();
        });
      }

      // Intersection Observer for 0% idle CPU
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

    // --- LOCK & UNLOCK MANAGEMENT ---
    checkUnlockStatus() {
      const catBest = parseInt(localStorage.getItem('cat_runner_best_score') || '0', 10);
      this.updateLockProgress(catBest);

      if (this.isUnlocked || catBest >= UNLOCK_SCORE_THRESHOLD) {
        this.unlockGame(false);
      } else {
        this.lockGame();
      }
    }

    updateLockProgress(currentScore) {
      const pct = Math.min(100, Math.floor((currentScore / UNLOCK_SCORE_THRESHOLD) * 100));
      if (this.lockScoreText) {
        this.lockScoreText.textContent = `${currentScore.toLocaleString()} / ${UNLOCK_SCORE_THRESHOLD.toLocaleString()}`;
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
        this.lockBadge.innerHTML = '<span class="material-symbols-outlined text-xs">lock</span><span class="text-xs font-mono font-bold uppercase tracking-wider">Bonus Game Locked</span>';
      }
      if (this.lockSubtitle) {
        this.lockSubtitle.textContent = '"Reach 6,000 points in Cat Runner to unlock this challenge."';
      }
    }

    unlockGame(playFanfare = true) {
      this.isUnlocked = true;
      localStorage.setItem('robot_escape_unlocked', 'true');

      if (this.lockBadge) {
        this.lockBadge.className = 'inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-lg';
        this.lockBadge.innerHTML = '<span class="material-symbols-outlined text-xs">lock_open</span><span class="text-xs font-mono font-bold uppercase tracking-wider">Bonus Game Unlocked!</span>';
      }
      if (this.lockSubtitle) {
        this.lockSubtitle.textContent = '"You proved your skills. Now survive the future."';
      }

      if (this.lockOverlay) {
        // Unlock animation fade-out & particle burst
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

    handleJump() {
      if (this.state === 'START') {
        this.startGame();
        return;
      }
      if (this.state === 'GAMEOVER') {
        this.startGame();
        return;
      }
      if (this.state !== 'PLAYING') return;

      // Cancel slide if jumping
      if (this.robot.isSliding) {
        this.robot.isSliding = false;
        this.robot.height = this.robot.normalHeight;
        this.robot.y = GROUND_Y - this.robot.normalHeight;
      }

      if (this.robot.isGrounded) {
        this.robot.vy = JUMP_FORCE;
        this.robot.isGrounded = false;
        this.robot.canDoubleJump = true;
        this.robot.squashY = 1.25;
        this.robot.stretchX = 0.85;
        this.sound.playJump();
        this.spawnSparks(this.robot.x + 15, GROUND_Y, 10, '#00f5d4');
      } else if (this.robot.canDoubleJump) {
        this.robot.vy = DOUBLE_JUMP_FORCE;
        this.robot.canDoubleJump = false;
        this.robot.squashY = 1.2;
        this.robot.stretchX = 0.88;
        this.sound.playJump();
        this.spawnSparks(this.robot.x + 15, this.robot.y + 30, 14, '#38bdf8');
      }
    }

    handleSlide() {
      if (this.state !== 'PLAYING' || !this.robot.isGrounded) return;

      if (!this.robot.isSliding) {
        this.robot.isSliding = true;
        this.robot.slideTimer = SLIDE_DURATION;
        this.robot.height = this.robot.slideHeight;
        this.robot.y = GROUND_Y - this.robot.slideHeight;
        this.sound.playSlide();
        this.spawnSparks(this.robot.x + 20, GROUND_Y, 12, '#fbbf24');
      }
    }

    startGame() {
      this.state = 'PLAYING';
      this.score = 0;
      this.distance = 0;
      this.energyCores = 0;
      this.speed = this.baseSpeed;
      this.obstacles = [];
      this.items = [];
      this.particles = [];
      this.floatingTexts = [];
      this.spawnTimer = 65;
      this.itemSpawnTimer = 35;
      this.robot = this.createRobot();

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
      this.sound.playCrash();

      // EMP Shock Blast
      this.spawnSparks(this.robot.x + 25, this.robot.y + 15, 35, '#f43f5e');

      const isNewBest = this.score > this.bestScore;
      if (isNewBest) {
        this.bestScore = this.score;
        localStorage.setItem('robot_escape_best_score', this.bestScore);
        this.spawnConfetti();
      }

      if (this.goDistance) this.goDistance.textContent = `${Math.floor(this.distance)}m`;
      if (this.goScore) this.goScore.textContent = this.score.toLocaleString();
      if (this.goCores) this.goCores.textContent = this.energyCores;
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

      // Dispatch score update event for Space Escape unlock
      try {
        window.dispatchEvent(new CustomEvent('robot_score_updated', {
          detail: {
            score: this.score,
            bestScore: this.bestScore,
            isNewBest: isNewBest
          }
        }));
      } catch (e) {}
    }

    updateHUD() {
      if (this.scoreDisplay) this.scoreDisplay.textContent = this.score.toString().padStart(4, '0');
      if (this.distanceDisplay) this.distanceDisplay.textContent = `${Math.floor(this.distance)}m`;
      if (this.energyDisplay) this.energyDisplay.textContent = this.energyCores.toString().padStart(2, '0');
      if (this.bestScoreDisplay) this.bestScoreDisplay.textContent = this.bestScore.toString().padStart(4, '0');

      // Live dispatch if Space Escape unlock threshold reached during run
      if (this.score >= 10000) {
        try {
          window.dispatchEvent(new CustomEvent('robot_score_updated', {
            detail: { score: this.score, bestScore: Math.max(this.score, this.bestScore) }
          }));
        } catch (e) {}
      }
    }

    spawnSparks(x, y, count = 8, color = '#00f5d4') {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 14,
          y: y + (Math.random() - 0.5) * 6,
          vx: -(this.speed * 0.5) + (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.8) * 3.5,
          radius: 1.5 + Math.random() * 3,
          color: color,
          alpha: 1,
          decay: 0.04 + Math.random() * 0.03
        });
      }
    }

    spawnConfetti() {
      const colors = ['#00f5d4', '#818cf8', '#fbbf24', '#f43f5e', '#38bdf8', '#a855f7'];
      for (let i = 0; i < 60; i++) {
        this.particles.push({
          x: VIRTUAL_WIDTH / 2 + (Math.random() - 0.5) * 350,
          y: VIRTUAL_HEIGHT / 2 + (Math.random() - 0.5) * 120,
          vx: (Math.random() - 0.5) * 8,
          vy: -4 - Math.random() * 7,
          radius: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015,
          gravity: 0.22
        });
      }
    }

    spawnFloatingText(text, x, y, color = '#00f5d4') {
      this.floatingTexts.push({
        text,
        x,
        y,
        color,
        alpha: 1,
        vy: -1.5
      });
    }

    // --- GAME LOOP ---
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

      // Distance & Speed
      this.distance += this.speed * 0.055;
      this.score += Math.round(this.speed * 0.09);
      this.speed = Math.min(this.baseSpeed + (this.distance * 0.004), this.maxSpeed);

      this.distanceTimer++;
      if (this.distanceTimer % 10 === 0) {
        this.updateHUD();
      }

      // Robot Physics
      this.robot.vy += GRAVITY;
      this.robot.y += this.robot.vy;

      // Ground Collision
      const targetY = GROUND_Y - this.robot.height;
      if (this.robot.y >= targetY) {
        this.robot.y = targetY;
        this.robot.vy = 0;
        if (!this.robot.isGrounded) {
          this.robot.isGrounded = true;
          this.robot.squashY = 0.82;
          this.robot.stretchX = 1.18;
          this.spawnSparks(this.robot.x + 15, GROUND_Y, 6, '#00f5d4');
        }
      } else {
        this.robot.isGrounded = false;
      }

      // Slide Timer & Recovery
      if (this.robot.isSliding) {
        this.robot.slideTimer--;
        this.spawnSparks(this.robot.x + 10, GROUND_Y, 2, '#fbbf24');
        if (this.robot.slideTimer <= 0) {
          this.robot.isSliding = false;
          this.robot.height = this.robot.normalHeight;
          this.robot.y = GROUND_Y - this.robot.normalHeight;
        }
      }

      // Squash/Stretch Decay
      this.robot.squashY += (1 - this.robot.squashY) * 0.2;
      this.robot.stretchX += (1 - this.robot.stretchX) * 0.2;

      // Leg Articulation Cycle
      this.robot.runTimer += (this.speed / 5.8) * 0.28;
      this.robot.runFrame = this.robot.runTimer % (Math.PI * 2);
      this.robot.thrusterPulse = Math.sin(this.robot.runTimer * 2) * 0.5 + 0.5;

      // Eye Scanning
      this.robot.eyeScanX += this.robot.eyeScanDir * 0.3;
      if (Math.abs(this.robot.eyeScanX) > 4) {
        this.robot.eyeScanDir *= -1;
      }

      // Parallax Offsets
      this.skyOffset += this.speed * 0.04;
      this.cityFarOffset += this.speed * 0.12;
      this.cityMidOffset += this.speed * 0.35;
      this.groundOffset = (this.groundOffset + this.speed) % 40;

      // Spawning Obstacles
      this.spawnTimer--;
      if (this.spawnTimer <= 0) {
        this.spawnObstacle();
        const minGap = Math.max(50, 90 - (this.speed * 4));
        const maxGap = Math.max(80, 140 - (this.speed * 5));
        this.spawnTimer = Math.floor(minGap + Math.random() * (maxGap - minGap));
      }

      // Spawning Collectibles
      this.itemSpawnTimer--;
      if (this.itemSpawnTimer <= 0) {
        this.spawnItemPattern();
        this.itemSpawnTimer = Math.floor(40 + Math.random() * 65);
      }

      // Update Obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= this.speed;

        // Drone Hover
        if (obs.type === 'drone') {
          obs.hoverTimer = (obs.hoverTimer || 0) + 0.15;
          obs.y += Math.sin(obs.hoverTimer) * 0.8;
        }

        // Collision Check
        if (this.checkCollision(this.robot, obs)) {
          this.gameOver();
          return;
        }

        if (obs.x + obs.width < -60) {
          this.obstacles.splice(i, 1);
        }
      }

      // Update Collectibles
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        item.x -= this.speed;
        item.floatTimer = (item.floatTimer || 0) + 0.12;

        if (this.checkItemCollision(this.robot, item)) {
          if (item.type === 'core') {
            this.score += 50;
            this.energyCores++;
            this.sound.playEnergyCore();
            this.spawnFloatingText('+50 🔋', item.x, item.y, '#00f5d4');
            this.spawnSparks(item.x, item.y, 8, '#00f5d4');
          } else if (item.type === 'crystal') {
            this.score += 100;
            this.energyCores += 2;
            this.sound.playCrystal();
            this.spawnFloatingText('+100 💎', item.x, item.y - 5, '#a855f7');
            this.spawnSparks(item.x, item.y, 14, '#a855f7');
          }
          this.updateHUD();
          this.items.splice(i, 1);
          continue;
        }

        if (item.x + item.width < -50) {
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

    spawnObstacle() {
      // Ground vs Air obstacles
      const groundTypes = ['barrier', 'crate', 'plasma_spike'];
      const airTypes = ['laser_beam', 'drone'];

      let type;
      // Introduce air obstacles (laser beams and drones) after 100m distance
      if (this.distance > 100 && Math.random() < 0.45) {
        type = airTypes[Math.floor(Math.random() * airTypes.length)];
      } else {
        type = groundTypes[Math.floor(Math.random() * groundTypes.length)];
      }

      let obs = {
        type: type,
        x: VIRTUAL_WIDTH + 60,
        y: GROUND_Y,
        width: 36,
        height: 36
      };

      if (type === 'barrier') {
        // Electric Ground Barrier (JUMP OVER)
        obs.width = 34;
        obs.height = 36;
        obs.y = GROUND_Y - 36;
      } else if (type === 'crate') {
        // Tech Titanium Crate (JUMP OVER)
        obs.width = 36;
        obs.height = 36;
        obs.y = GROUND_Y - 36;
      } else if (type === 'plasma_spike') {
        // Plasma Hazard Spikes (JUMP OVER)
        obs.width = 38;
        obs.height = 26;
        obs.y = GROUND_Y - 26;
      } else if (type === 'laser_beam') {
        // High Horizontal Laser Beam (MUST SLIDE UNDER!)
        obs.width = 65;
        obs.height = 16;
        obs.y = GROUND_Y - 48; // Leaves crouch clearance underneath!
      } else if (type === 'drone') {
        // Flying Hunter Drone (SLIDE UNDER OR DUCK)
        obs.width = 38;
        obs.height = 24;
        obs.y = GROUND_Y - 54;
        obs.hoverTimer = Math.random() * Math.PI;
      }

      this.obstacles.push(obs);
    }

    spawnItemPattern() {
      const type = Math.random() < 0.3 ? 'crystal' : 'core';
      const count = type === 'crystal' ? 1 : Math.floor(2 + Math.random() * 3);
      const isHigh = Math.random() < 0.45;
      const baseHeight = isHigh ? GROUND_Y - 90 : GROUND_Y - 40;

      for (let i = 0; i < count; i++) {
        this.items.push({
          type: type,
          x: VIRTUAL_WIDTH + 60 + (i * 32),
          y: baseHeight,
          width: 22,
          height: 22,
          floatTimer: i * 0.4
        });
      }
    }

    checkCollision(robot, obs) {
      const padX = 8;
      const padY = 6;
      const robotBox = {
        left: robot.x + padX,
        right: robot.x + robot.width - padX,
        top: robot.y + padY,
        bottom: robot.y + robot.height - 2
      };

      const obsBox = {
        left: obs.x + 5,
        right: obs.x + obs.width - 5,
        top: obs.y + 4,
        bottom: obs.y + obs.height - 2
      };

      return !(
        robotBox.right < obsBox.left ||
        robotBox.left > obsBox.right ||
        robotBox.bottom < obsBox.top ||
        robotBox.top > obsBox.bottom
      );
    }

    checkItemCollision(robot, item) {
      const robotCenter = { x: robot.x + robot.width / 2, y: robot.y + robot.height / 2 };
      const itemCenter = { x: item.x + item.width / 2, y: item.y + item.height / 2 };
      const dist = Math.hypot(robotCenter.x - itemCenter.x, robotCenter.y - itemCenter.y);
      return dist < 34;
    }

    // --- CANVAS RENDERING ---
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      const isDark = document.documentElement.classList.contains('dark') || 
                    !document.documentElement.classList.contains('light');

      this.drawCyberSky(ctx, isDark);
      this.drawDistantCyberCity(ctx, isDark);
      this.drawMidgroundCity(ctx, isDark);
      this.drawNeonPlatform(ctx, isDark);
      this.drawObstacles(ctx);
      this.drawItems(ctx);
      this.drawRobot(ctx);
      this.drawParticles(ctx);
      this.drawFloatingTexts(ctx);
      this.drawVignette(ctx, isDark);
    }

    drawCyberSky(ctx, isDark) {
      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      if (isDark) {
        skyGrad.addColorStop(0, '#030712');
        skyGrad.addColorStop(0.5, '#0b0f19');
        skyGrad.addColorStop(1, '#1e1b4b');
      } else {
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.5, '#1e1b4b');
        skyGrad.addColorStop(1, '#312e81');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, GROUND_Y);

      // Holographic Digital Cyber Moon
      ctx.save();
      ctx.fillStyle = '#00f5d4';
      ctx.shadowColor = 'rgba(0, 245, 212, 0.7)';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(VIRTUAL_WIDTH - 100, 65, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Cyber Moon Orbit Ring
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(VIRTUAL_WIDTH - 100, 65, 36, 0, Math.PI * 2);
      ctx.stroke();

      // Cyber Grid Lines in Sky
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 30; y < GROUND_Y - 40; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(VIRTUAL_WIDTH, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawDistantCyberCity(ctx, isDark) {
      ctx.save();
      this.cityBuildingsFar.forEach((b) => {
        const bx = ((b.x - this.cityFarOffset) % (VIRTUAL_WIDTH + 160) + VIRTUAL_WIDTH + 160) % (VIRTUAL_WIDTH + 160) - 80;
        
        ctx.fillStyle = b.color;
        ctx.fillRect(bx, GROUND_Y - b.height, b.width, b.height);

        // Neon Spire
        if (b.spire) {
          ctx.strokeStyle = '#00f5d4';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bx + b.width / 2, GROUND_Y - b.height);
          ctx.lineTo(bx + b.width / 2, GROUND_Y - b.height - 25);
          ctx.stroke();
          // Beacons
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(bx + b.width / 2, GROUND_Y - b.height - 25, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Windows Grid
        if (b.windows) {
          ctx.fillStyle = 'rgba(0, 245, 212, 0.15)';
          for (let wy = GROUND_Y - b.height + 15; wy < GROUND_Y - 20; wy += 18) {
            for (let wx = bx + 8; wx < bx + b.width - 8; wx += 14) {
              ctx.fillRect(wx, wy, 6, 8);
            }
          }
        }

        // Logo text
        if (b.logo) {
          ctx.fillStyle = '#00f5d4';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(b.logo, bx + 12, GROUND_Y - b.height + 25);
        }
      });
      ctx.restore();
    }

    drawMidgroundCity(ctx, isDark) {
      ctx.save();
      this.cityBuildingsMid.forEach((b) => {
        const bx = ((b.x - this.cityMidOffset) % (VIRTUAL_WIDTH + 120) + VIRTUAL_WIDTH + 120) % (VIRTUAL_WIDTH + 120) - 60;
        
        ctx.fillStyle = '#090d16';
        ctx.fillRect(bx, GROUND_Y - b.height, b.width, b.height);

        // Neon Edge Highlight
        ctx.strokeStyle = b.neon;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = b.neon;
        ctx.shadowBlur = 8;
        ctx.strokeRect(bx, GROUND_Y - b.height, b.width, b.height);
        ctx.shadowBlur = 0;
      });
      ctx.restore();
    }

    drawNeonPlatform(ctx, isDark) {
      // Top Laser Energy Line
      ctx.fillStyle = '#00f5d4';
      ctx.shadowColor = 'rgba(0, 245, 212, 0.9)';
      ctx.shadowBlur = 12;
      ctx.fillRect(0, GROUND_Y, VIRTUAL_WIDTH, 4);
      ctx.shadowBlur = 0;

      // Cyber Track Body
      const floorGrad = ctx.createLinearGradient(0, GROUND_Y + 4, 0, VIRTUAL_HEIGHT);
      floorGrad.addColorStop(0, '#0a0f1d');
      floorGrad.addColorStop(1, '#020408');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, GROUND_Y + 4, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - GROUND_Y - 4);

      // Moving Grid Line Tiles & Hazard Chevron Stripes
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.25)';
      ctx.lineWidth = 1.5;
      for (let x = -this.groundOffset; x < VIRTUAL_WIDTH + 40; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND_Y + 4);
        ctx.lineTo(x - 20, VIRTUAL_HEIGHT);
        ctx.stroke();

        // Hazard chevron marks
        ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
        ctx.fillRect(x + 5, GROUND_Y + 14, 12, 4);
      }
    }

    // --- CUTE 4-LEGGED MECHA QUADRUPED ROBOT DRAWING ---
    drawRobot(ctx) {
      const r = this.robot;
      ctx.save();

      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;

      ctx.translate(cx, cy);
      ctx.scale(r.stretchX, r.squashY);
      ctx.translate(-cx, -cy);

      const isRunning = r.isGrounded && this.state === 'PLAYING' && !r.isSliding;
      const frame = r.runFrame;

      const robotChassis = '#1e293b';
      const robotArmor = '#334155';
      const robotCyan = '#00f5d4';
      const robotGlow = 'rgba(0, 245, 212, 0.6)';

      if (r.isSliding) {
        // --- SLIDE STATE (Low-profile streamlined cyber-pod) ---
        // Slide Sparks & Jet Exhaust
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(r.x - 12, r.y + 12);
        ctx.lineTo(r.x, r.y + 6);
        ctx.lineTo(r.x, r.y + 18);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Streamlined Body Shell
        ctx.fillStyle = robotArmor;
        ctx.strokeStyle = robotCyan;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(r.x, r.y + 4, r.width + 4, 16, 8);
        ctx.fill();
        ctx.stroke();

        // Glowing Core Line
        ctx.fillStyle = robotCyan;
        ctx.fillRect(r.x + 10, r.y + 10, r.width - 16, 4);

        // Low Visor
        ctx.fillStyle = '#00f5d4';
        ctx.shadowColor = '#00f5d4';
        ctx.shadowBlur = 8;
        ctx.fillRect(r.x + r.width - 14, r.y + 8, 10, 4);
        ctx.shadowBlur = 0;

      } else {
        // --- RUN & JUMP STATE (4-Legged Mecha-Quadruped) ---

        // 1. Dual Jet Thrusters Flame (Back)
        ctx.save();
        ctx.fillStyle = '#00f5d4';
        ctx.shadowColor = robotGlow;
        ctx.shadowBlur = 12;
        const thrusterLen = (r.isGrounded ? 8 : 16) + r.thrusterPulse * 6;
        ctx.beginPath();
        ctx.moveTo(r.x - 4, r.y + 14);
        ctx.lineTo(r.x - 4 - thrusterLen, r.y + 18);
        ctx.lineTo(r.x - 4, r.y + 22);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 2. Back Legs (Left Side & Right Side background)
        ctx.strokeStyle = robotArmor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Back-Left Mechanical Leg
        const bLeg1 = isRunning ? Math.sin(frame + Math.PI) * 0.7 : 0;
        ctx.save();
        ctx.translate(r.x + 12, r.y + 24);
        ctx.rotate(bLeg1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-4, 12);
        ctx.lineTo(4, 18);
        ctx.stroke();
        // Cyan Paw Piston
        ctx.fillStyle = robotCyan;
        ctx.beginPath();
        ctx.arc(4, 18, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Front-Left Mechanical Leg
        const fLeg1 = isRunning ? Math.sin(frame) * 0.7 : 0;
        ctx.save();
        ctx.translate(r.x + 38, r.y + 24);
        ctx.rotate(fLeg1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(2, 12);
        ctx.lineTo(8, 18);
        ctx.stroke();
        ctx.fillStyle = robotCyan;
        ctx.beginPath();
        ctx.arc(8, 18, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Mecha Torso Chassis
        ctx.fillStyle = robotChassis;
        ctx.strokeStyle = robotCyan;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(r.x + 6, r.y + 10, 36, 20, 7);
        ctx.fill();
        ctx.stroke();

        // Armor Plate & Circuit Core
        ctx.fillStyle = robotArmor;
        ctx.beginPath();
        ctx.roundRect(r.x + 10, r.y + 14, 26, 12, 4);
        ctx.fill();

        // Glowing Energy Core
        ctx.fillStyle = robotCyan;
        ctx.shadowColor = robotGlow;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(r.x + 23, r.y + 20, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 4. Front-Right Leg & Back-Right Leg (Foreground)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 4.5;

        // Back-Right Mechanical Leg
        const bLeg2 = isRunning ? Math.sin(frame) * 0.75 : 0;
        ctx.save();
        ctx.translate(r.x + 16, r.y + 24);
        ctx.rotate(bLeg2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-2, 12);
        ctx.lineTo(5, 18);
        ctx.stroke();
        ctx.fillStyle = robotCyan;
        ctx.beginPath();
        ctx.arc(5, 18, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Front-Right Mechanical Leg
        const fLeg2 = isRunning ? Math.sin(frame + Math.PI) * 0.75 : 0;
        ctx.save();
        ctx.translate(r.x + 42, r.y + 24);
        ctx.rotate(fLeg2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(4, 12);
        ctx.lineTo(10, 18);
        ctx.stroke();
        ctx.fillStyle = robotCyan;
        ctx.beginPath();
        ctx.arc(10, 18, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 5. Robotic Head & Visor
        const hx = r.x + 40;
        const hy = r.y + 12;

        // Antenna
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hx + 4, hy - 4);
        ctx.lineTo(hx + 8, hy - 14);
        ctx.stroke();
        // Antenna Tip LED
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(hx + 8, hy - 14, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Head Shell
        ctx.fillStyle = robotChassis;
        ctx.strokeStyle = robotCyan;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(hx - 4, hy - 6, 18, 16, 5);
        ctx.fill();
        ctx.stroke();

        // Glowing Visor Eyes (Scanning LED bar)
        if (this.state === 'GAMEOVER') {
          // Red Glitch X Eyes
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(hx + 2, hy - 1);
          ctx.lineTo(hx + 8, hy + 5);
          ctx.moveTo(hx + 8, hy - 1);
          ctx.lineTo(hx + 2, hy + 5);
          ctx.stroke();
        } else {
          // Cyan Glowing Visor
          ctx.fillStyle = '#00f5d4';
          ctx.shadowColor = robotGlow;
          ctx.shadowBlur = 10;
          ctx.fillRect(hx, hy + 1, 12, 4.5);
          ctx.shadowBlur = 0;

          // Scanning Dot
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(hx + 4 + r.eyeScanX, hy + 1.5, 2.5, 3.5);
        }
      }

      ctx.restore();
    }

    // --- OBSTACLES RENDERING ---
    drawObstacles(ctx) {
      this.obstacles.forEach((obs) => {
        ctx.save();
        if (obs.type === 'barrier') {
          // Electric Ground Barrier
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(obs.x + 4, obs.y + 10, obs.width - 8, obs.height - 10);
          
          // Glowing Electric Arc
          ctx.strokeStyle = '#00f5d4';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(0, 245, 212, 0.9)';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(obs.x + 6, obs.y + 12);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width - 6, obs.y + 12);
          ctx.stroke();
          ctx.shadowBlur = 0;

        } else if (obs.type === 'crate') {
          // Tech Titanium Box
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          // Hazard stripes
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(obs.x + 4, obs.y + 8, obs.width - 8, 4);
          ctx.fillRect(obs.x + 4, obs.y + 22, obs.width - 8, 4);

        } else if (obs.type === 'plasma_spike') {
          // Plasma Spikes
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = 'rgba(244, 63, 94, 0.8)';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + 10, obs.y);
          ctx.lineTo(obs.x + 20, obs.y + obs.height);
          ctx.lineTo(obs.x + 30, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

        } else if (obs.type === 'laser_beam') {
          // High Horizontal Laser Beam (REQUIRE SLIDE)
          // Emitters on sides
          ctx.fillStyle = '#334155';
          ctx.fillRect(obs.x, obs.y - 2, 8, obs.height + 4);
          ctx.fillRect(obs.x + obs.width - 8, obs.y - 2, 8, obs.height + 4);

          // Beam
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = 'rgba(239, 68, 68, 0.95)';
          ctx.shadowBlur = 16;
          ctx.fillRect(obs.x + 6, obs.y + 4, obs.width - 12, 6);
          
          // Core bright line
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x + 6, obs.y + 6, obs.width - 12, 2);
          ctx.shadowBlur = 0;

          // Laser WARNING label
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('SLIDE!', obs.x + 14, obs.y - 4);

        } else if (obs.type === 'drone') {
          // Flying Hunter Drone
          const dx = obs.x + obs.width / 2;
          const dy = obs.y + obs.height / 2;

          // Drone Shell
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(dx, dy, 16, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Red Scan Visor
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(dx - 6, dy, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Scan Light Beam downward
          ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
          ctx.beginPath();
          ctx.moveTo(dx - 6, dy + 6);
          ctx.lineTo(dx - 22, dy + 32);
          ctx.lineTo(dx + 10, dy + 32);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });
    }

    // --- COLLECTIBLES RENDERING ---
    drawItems(ctx) {
      this.items.forEach((item) => {
        ctx.save();
        const floatY = Math.sin(item.floatTimer * 3.5) * 4;

        if (item.type === 'core') {
          // Plasma Energy Core
          const ix = item.x + 11;
          const iy = item.y + 11 + floatY;

          ctx.fillStyle = '#00f5d4';
          ctx.shadowColor = 'rgba(0, 245, 212, 0.9)';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(ix, iy, 7.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Orbiting Electron
          const orbAngle = item.floatTimer * 4;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ix + Math.cos(orbAngle) * 11, iy + Math.sin(orbAngle) * 6, 2.2, 0, Math.PI * 2);
          ctx.fill();

        } else if (item.type === 'crystal') {
          // Quantum Data Crystal
          const cx = item.x + 11;
          const cy = item.y + 11 + floatY;

          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = 'rgba(168, 85, 247, 0.9)';
          ctx.shadowBlur = 14;

          ctx.beginPath();
          ctx.moveTo(cx, cy - 9);
          ctx.lineTo(cx + 8, cy);
          ctx.lineTo(cx, cy + 9);
          ctx.lineTo(cx - 8, cy);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    drawParticles(ctx) {
      this.particles.forEach((p) => {
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
      this.floatingTexts.forEach((ft) => {
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

    drawVignette(ctx, isDark) {
      ctx.save();
      const vignette = ctx.createRadialGradient(
        VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, VIRTUAL_WIDTH * 0.35,
        VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, VIRTUAL_WIDTH * 0.65
      );
      vignette.addColorStop(0, 'rgba(3, 7, 18, 0)');
      vignette.addColorStop(1, 'rgba(3, 7, 18, 0.75)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      ctx.restore();
    }
  }

  // Initialize Robot Game on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new RobotEscapeGame());
  } else {
    new RobotEscapeGame();
  }
})();
