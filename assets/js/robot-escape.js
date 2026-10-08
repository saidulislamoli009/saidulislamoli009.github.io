/**
 * ==============================================================================
 * 🪐 ROBOT ESCAPE: TITAN & OLYMPUS MONS - ULTRA-POLISHED SCI-FI ENDLESS RUNNER
 * ==============================================================================
 * A state-of-the-art, high-fidelity 2D/3D-shaded Sci-Fi Endless Runner featuring:
 * - 4-legged articulated Mars/Titan Explorer Mecha-Rover MK-V with Dynamic Suspension
 * - 3 Smooth Action States: Gallop (Kinematic trot), Jet Boost (Jump & Double Jump), Mag-Skid Slide
 * - EPIC CELESTIAL BACKDROP:
 *     * Breathtaking TITAN Planet/Moon with golden-amber volumetric atmosphere & cloud bands
 *     * Colossal Ringed Saturn with multi-layered translucent rings & orbital shadow
 *     * Cosmic Nebulae, glittering multi-spectrum starfields & ionospheric auroras
 * - 🌋 MAJESTIC OLYMPUS MONS & SCI-FI CITADEL:
 *     * The Solar System's Largest Shield Volcano with multi-ringed Summit Caldera
 *     * Planetary Terraforming Ion Pillar shooting into deep space with energy pulses
 *     * Orographic Atmospheric Ice-Haze Cloud Ribbons encircling the volcanic slopes
 *     * Summit Citadel & Space Elevator Tether with laser beacons
 *     * Pulsating Geothermal Lava Fissures & Magma Veins
 * - 🚄 Valles Marineris Canyon Outposts:
 *     * Geodesic Biosphere Domes with glowing structural frames & observation lights
 *     * Trans-Canyon Mag-Lev Skyway with animated hyper-speed transit pods
 *     * Terraforming Vapor Scrubbers puffing illuminated steam
 *     * Laser Communication Relays linking planetary colonies
 * - ⚡ Polished Dynamic Hazards & Collectibles:
 *     * Solar Energy Pylons & High-Voltage Electric Barriers
 *     * Ares Colony Titanium Supply Modules with 3D bevels
 *     * Molten Obsidian Lava Spikes & Alien Crystal Hazards
 *     * Orbital High-Altitude Survey Lasers (Require Sliding!)
 *     * Autonomous Aerial Recon Drones with Volumetric Searchlights
 *     * Pressurized Oxygen Plasma Cells (+50 pts) & Rare Xenocrystals (+100 pts)
 * - Web Audio API procedural sci-fi sound synthesizer
 * - Keyboard, Touch, Mobile Dedicated Buttons & Touch Swipes
 * - IntersectionObserver viewport awareness for 0% idle CPU
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER FOR MARS/TITAN ROBOT ESCAPE ---
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
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.18);

        gain.gain.setValueAtTime(0.2, now);
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
        osc.frequency.setValueAtTime(720, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.24);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.24);
      } catch (e) {}
    }

    playEnergyCore() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [587.33, 880, 1174.66, 1480].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteTime = now + i * 0.038;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.15, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 0.15);
        });
      } catch (e) {}
    }

    playCrystal() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [659.25, 987.77, 1318.51, 1975.53].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteTime = now + i * 0.04;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.18, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 0.2);
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
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);

        gain.gain.setValueAtTime(0.35, now);
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
        [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteTime = now + i * 0.07;

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
      this.maxSpeed = 11.4;
      this.distanceTimer = 0;
      this.spawnTimer = 0;
      this.itemSpawnTimer = 0;
      this.lastTime = 0;
      this.animId = null;
      this.isVisible = true;

      // Parallax offsets
      this.skyOffset = 0;
      this.titanOffset = 0;
      this.olympusOffset = 0;
      this.marsFarOffset = 0;
      this.marsMidOffset = 0;
      this.groundOffset = 0;

      // Entities
      this.robot = this.createRobot();
      this.obstacles = [];
      this.items = [];
      this.particles = [];
      this.floatingTexts = [];

      // Mars / Titan Scenery Data
      this.stars = [];
      this.marsDust = [];
      this.nebulae = [];
      this.maglevPods = [];
      this.marsMountainsFar = [];
      this.marsStructuresMid = [];

      this.initMarsScape();
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

    initMarsScape() {
      // 1. Cosmic Stars & Constellations in Martian Space
      this.stars = [];
      for (let i = 0; i < 65; i++) {
        this.stars.push({
          x: Math.random() * VIRTUAL_WIDTH,
          y: Math.random() * 180,
          radius: 0.5 + Math.random() * 1.5,
          alpha: 0.3 + Math.random() * 0.7,
          twinkleSpeed: 0.02 + Math.random() * 0.04,
          color: Math.random() < 0.25 ? '#67e8f9' : Math.random() < 0.5 ? '#fed7aa' : '#ffffff'
        });
      }

      // 2. Cosmic Nebulae Clouds
      this.nebulae = [
        { x: 140, y: 45, r: 90, color: 'rgba(251, 146, 60, 0.12)' },
        { x: 420, y: 55, r: 130, color: 'rgba(168, 85, 247, 0.10)' },
        { x: 740, y: 35, r: 100, color: 'rgba(6, 182, 212, 0.08)' }
      ];

      // 3. Atmospheric wind-blown golden-red sand & dust motes
      this.marsDust = [];
      for (let i = 0; i < 35; i++) {
        this.marsDust.push({
          x: Math.random() * VIRTUAL_WIDTH,
          y: 15 + Math.random() * (GROUND_Y - 25),
          size: 1 + Math.random() * 2.5,
          speed: 1.4 + Math.random() * 2.8,
          alpha: 0.15 + Math.random() * 0.5,
          color: Math.random() < 0.5 ? '#f97316' : Math.random() < 0.8 ? '#ea580c' : '#fbbf24'
        });
      }

      // 4. Distant Mars Secondary Mountain Ridges & Volcanoes
      this.marsMountainsFar = [
        { x: 0, width: 160, height: 140, color: '#350b07' },
        { x: 180, width: 190, height: 170, color: '#2d0805' },
        { x: 420, width: 170, height: 135, color: '#350b07' },
        { x: 640, width: 220, height: 160, color: '#2d0805' }
      ];

      // 5. Midground Martian Canyons (Valles Marineris), Biosphere Domes & Skyways
      this.marsStructuresMid = [
        { type: 'dome', x: 50, width: 75, height: 50, label: 'TITAN-1' },
        { type: 'maglev_pillar', x: 140, width: 22, height: 110 },
        { type: 'arch', x: 190, width: 95, height: 125 },
        { type: 'tower', x: 310, width: 35, height: 145 },
        { type: 'crater_ridge', x: 380, width: 120, height: 90 },
        { type: 'dome', x: 530, width: 85, height: 58, label: 'ARES-9' },
        { type: 'spire', x: 650, width: 55, height: 135 },
        { type: 'solar_farm', x: 740, width: 100, height: 42 }
      ];

      // 6. Animated Mag-Lev Transport Pods
      this.maglevPods = [
        { x: 100, y: GROUND_Y - 95, speed: 2.2, color: '#06b6d4' },
        { x: 520, y: GROUND_Y - 95, speed: 2.6, color: '#f97316' }
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

      // Listen for Cat Runner Score Updates
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

      // Mobile Touch Swipes
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
            this.handleJump();
          } else if (deltaY > 30) {
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
        this.lockBadge.innerHTML = '<span class="material-symbols-outlined text-xs">lock</span><span class="text-xs font-mono font-bold uppercase tracking-wider">Titan Game Locked</span>';
      }
      if (this.lockSubtitle) {
        this.lockSubtitle.textContent = '"Reach 6,000 points in Cat Runner to unlock this challenge."';
      }
    }

    unlockGame(playFanfare = true) {
      this.isUnlocked = true;
      localStorage.setItem('robot_escape_unlocked', 'true');

      if (this.lockBadge) {
        this.lockBadge.className = 'inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-lg';
        this.lockBadge.innerHTML = '<span class="material-symbols-outlined text-xs">rocket_launch</span><span class="text-xs font-mono font-bold uppercase tracking-wider">Titan Expedition Unlocked!</span>';
      }
      if (this.lockSubtitle) {
        this.lockSubtitle.textContent = '"Titan & Olympus Mons orbital trajectory linked. Rover deployed."';
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

    handleJump() {
      if (this.state === 'START' || this.state === 'GAMEOVER') {
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
        this.spawnSparks(this.robot.x + 15, GROUND_Y, 12, '#f97316');
      } else if (this.robot.canDoubleJump) {
        this.robot.vy = DOUBLE_JUMP_FORCE;
        this.robot.canDoubleJump = false;
        this.robot.squashY = 1.2;
        this.robot.stretchX = 0.88;
        this.sound.playJump();
        this.spawnSparks(this.robot.x + 15, this.robot.y + 30, 16, '#06b6d4');
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
        this.spawnSparks(this.robot.x + 20, GROUND_Y, 14, '#ea580c');
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

      // Mecha Rover Shock Burst
      this.spawnSparks(this.robot.x + 25, this.robot.y + 15, 40, '#f97316');
      this.spawnSparks(this.robot.x + 25, this.robot.y + 15, 20, '#ef4444');

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

    spawnSparks(x, y, count = 8, color = '#f97316') {
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
      const colors = ['#f97316', '#ea580c', '#06b6d4', '#fbbf24', '#ef4444', '#a855f7'];
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

    spawnFloatingText(text, x, y, color = '#f97316') {
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
          this.spawnSparks(this.robot.x + 15, GROUND_Y, 8, '#ea580c');
        }
      } else {
        this.robot.isGrounded = false;
      }

      // Slide Timer & Recovery
      if (this.robot.isSliding) {
        this.robot.slideTimer--;
        this.spawnSparks(this.robot.x + 10, GROUND_Y, 2, '#f97316');
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

      // Dust puffs under galloping feet
      if (this.robot.isGrounded && Math.random() < 0.3) {
        this.particles.push({
          x: this.robot.x + 10 + Math.random() * 20,
          y: GROUND_Y - 2,
          vx: -(this.speed * 0.7) + (Math.random() - 0.5) * 1.5,
          vy: -0.5 - Math.random() * 1.5,
          radius: 2 + Math.random() * 3,
          color: '#c2410c',
          alpha: 0.7,
          decay: 0.05
        });
      }

      // Eye Scanning
      this.robot.eyeScanX += this.robot.eyeScanDir * 0.35;
      if (Math.abs(this.robot.eyeScanX) > 4.5) {
        this.robot.eyeScanDir *= -1;
      }

      // Parallax Offsets
      this.skyOffset += this.speed * 0.015;
      this.titanOffset += this.speed * 0.025; // Smooth slow drift for Titan & Saturn
      this.olympusOffset += this.speed * 0.05; // Majestic slow scroll for Olympus Mons
      this.marsFarOffset += this.speed * 0.14;
      this.marsMidOffset += this.speed * 0.38;
      this.groundOffset = (this.groundOffset + this.speed) % 40;

      // Update atmospheric dust
      this.marsDust.forEach((dust) => {
        dust.x -= dust.speed + (this.speed * 0.25);
        if (dust.x < -10) {
          dust.x = VIRTUAL_WIDTH + 20;
          dust.y = 15 + Math.random() * (GROUND_Y - 25);
        }
      });

      // Update Mag-Lev Pods
      this.maglevPods.forEach((pod) => {
        pod.x -= (pod.speed + this.speed * 0.38);
        if (pod.x < -60) {
          pod.x = VIRTUAL_WIDTH + 60 + Math.random() * 100;
        }
      });

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
            this.spawnFloatingText('+50 🔋', item.x, item.y, '#06b6d4');
            this.spawnSparks(item.x, item.y, 10, '#06b6d4');
          } else if (item.type === 'crystal') {
            this.score += 100;
            this.energyCores += 2;
            this.sound.playCrystal();
            this.spawnFloatingText('+100 💎', item.x, item.y - 5, '#f43f5e');
            this.spawnSparks(item.x, item.y, 16, '#f43f5e');
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
        // Solar Energy Pylon / High-Voltage Barrier (JUMP OVER)
        obs.width = 34;
        obs.height = 36;
        obs.y = GROUND_Y - 36;
      } else if (type === 'crate') {
        // Ares Colony Titanium Supply Container (JUMP OVER)
        obs.width = 36;
        obs.height = 36;
        obs.y = GROUND_Y - 36;
      } else if (type === 'plasma_spike') {
        // Molten Obsidian Lava Spikes (JUMP OVER)
        obs.width = 40;
        obs.height = 28;
        obs.y = GROUND_Y - 28;
      } else if (type === 'laser_beam') {
        // Orbital Survey Laser Grid (MUST SLIDE UNDER!)
        obs.width = 68;
        obs.height = 18;
        obs.y = GROUND_Y - 48;
      } else if (type === 'drone') {
        // Autonomous Recon Drone (SLIDE UNDER)
        obs.width = 40;
        obs.height = 24;
        obs.y = GROUND_Y - 54;
        obs.hoverTimer = Math.random() * Math.PI;
      }

      this.obstacles.push(obs);
    }

    spawnItemPattern() {
      const type = Math.random() < 0.35 ? 'crystal' : 'core';
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

    // --- CANVAS RENDERING (ULTRA-POLISHED SCI-FI TITAN & MARS) ---
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      const isDark = document.documentElement.classList.contains('dark') || 
                    !document.documentElement.classList.contains('light');

      // 1. Cosmic Sky, Auroras, Space Station & Stars
      this.drawMarsSky(ctx, isDark);

      // 2. 🪐 THE MAJESTIC TITAN PLANET & RINGED SATURN SYSTEM
      this.drawTitanPlanet(ctx, isDark);

      // 3. 🌋 THE COLOSSAL OLYMPUS MONS with Terraforming Ion Pillar
      this.drawOlympusMons(ctx, isDark);

      // 4. Distant Mountain Ridges & Calderas
      this.drawDistantMarsMountains(ctx, isDark);

      // 5. Midground Valles Marineris Canyon, Biospheres, Mag-Lev Skyway
      this.drawMidgroundMarsTerrain(ctx, isDark);

      // 6. Rich Ground Platform & Subterranean Strata
      this.drawMarsGround(ctx, isDark);

      // 7. Hazards, Collectibles, Player Mecha-Rover, Particles & FX
      this.drawObstacles(ctx);
      this.drawItems(ctx);
      this.drawRobot(ctx);
      this.drawParticles(ctx);
      this.drawAtmosphericDust(ctx);
      this.drawFloatingTexts(ctx);
      this.drawVignette(ctx, isDark);
    }

    // --- COSMIC SKY, AURORAS, ORBITAL CITADEL & STARS ---
    drawMarsSky(ctx, isDark) {
      const now = Date.now();

      // 1. Deep Cosmic Space to Golden-Ochre Atmospheric Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      if (isDark) {
        skyGrad.addColorStop(0, '#060104');
        skyGrad.addColorStop(0.25, '#120408');
        skyGrad.addColorStop(0.55, '#2e0a08');
        skyGrad.addColorStop(0.82, '#58190b');
        skyGrad.addColorStop(1, '#852810');
      } else {
        skyGrad.addColorStop(0, '#0e0306');
        skyGrad.addColorStop(0.28, '#20070a');
        skyGrad.addColorStop(0.6, '#48130a');
        skyGrad.addColorStop(0.85, '#73230e');
        skyGrad.addColorStop(1, '#9e3714');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, GROUND_Y);

      // 2. Multi-Layer Cosmic Nebulae
      ctx.save();
      this.nebulae.forEach((neb) => {
        const radGrad = ctx.createRadialGradient(neb.x, neb.y, 4, neb.x, neb.y, neb.r);
        radGrad.addColorStop(0, neb.color);
        radGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 3. Twinkling Cosmic Stars
      ctx.save();
      this.stars.forEach((s) => {
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha * (0.6 + Math.sin(now * s.twinkleSpeed) * 0.4);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 4. Sci-Fi Ionospheric Aurora Curtains (Waving Translucent Ribbons)
      ctx.save();
      const wave1 = Math.sin(now * 0.001) * 8;
      const wave2 = Math.cos(now * 0.0014) * 6;
      const auroraGrad = ctx.createLinearGradient(0, 20, 0, 115);
      auroraGrad.addColorStop(0, 'rgba(6, 182, 212, 0.24)');
      auroraGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.16)');
      auroraGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      
      ctx.fillStyle = auroraGrad;
      ctx.beginPath();
      ctx.moveTo(0, 42 + wave1);
      ctx.bezierCurveTo(VIRTUAL_WIDTH * 0.25, 18 + wave2, VIRTUAL_WIDTH * 0.5, 62 - wave1, VIRTUAL_WIDTH * 0.75, 28 + wave2);
      ctx.lineTo(VIRTUAL_WIDTH, 38);
      ctx.lineTo(VIRTUAL_WIDTH, 115);
      ctx.bezierCurveTo(VIRTUAL_WIDTH * 0.75, 88 + wave2, VIRTUAL_WIDTH * 0.5, 118 - wave1, VIRTUAL_WIDTH * 0.25, 82 + wave2);
      ctx.lineTo(0, 95);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 5. "Ares Zenith" Orbital Space Station
      ctx.save();
      const stationX = 135;
      const stationY = 46;
      
      // Solar Wings
      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.fillRect(stationX - 30, stationY - 3, 18, 6);
      ctx.strokeRect(stationX - 30, stationY - 3, 18, 6);
      ctx.fillRect(stationX + 12, stationY - 3, 18, 6);
      ctx.strokeRect(stationX + 12, stationY - 3, 18, 6);

      // Central Hub
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(stationX, stationY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Ring Ellipse
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(stationX, stationY, 14, 5.5, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      // Flashing Navigation Beacon
      ctx.fillStyle = Math.sin(now * 0.005) > 0 ? '#10b981' : '#ef4444';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(stationX, stationY - 5, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // --- 🪐 MAJESTIC TITAN PLANET & SATURN SYSTEM ---
    drawTitanPlanet(ctx, isDark) {
      ctx.save();
      const now = Date.now();

      // Base coordinate in the celestial background
      const titanX = VIRTUAL_WIDTH - 150;
      const titanY = 82;
      const titanRadius = 46;

      // 1. SATURN & TRANSLUCENT PLANETARY RINGS (Distant in the cosmic backdrop)
      const saturnX = titanX - 110;
      const saturnY = 48;
      const saturnR = 24;

      // Saturn Back Ring Half
      ctx.save();
      ctx.strokeStyle = 'rgba(253, 230, 138, 0.45)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(saturnX, saturnY, 52, 14, -Math.PI / 8, Math.PI, 0);
      ctx.stroke();
      ctx.restore();

      // Saturn Planet Body (3D Spherical Shading)
      const saturnGrad = ctx.createRadialGradient(
        saturnX - 8, saturnY - 8, 3,
        saturnX, saturnY, saturnR
      );
      saturnGrad.addColorStop(0, '#fef08a');
      saturnGrad.addColorStop(0.4, '#fde047');
      saturnGrad.addColorStop(0.75, '#ca8a04');
      saturnGrad.addColorStop(1, '#713f12');

      ctx.fillStyle = saturnGrad;
      ctx.beginPath();
      ctx.arc(saturnX, saturnY, saturnR, 0, Math.PI * 2);
      ctx.fill();

      // Saturn Atmospheric Banding
      ctx.strokeStyle = 'rgba(113, 63, 18, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(saturnX, saturnY - 4, saturnR * 0.88, 0.1, Math.PI - 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(saturnX, saturnY + 5, saturnR * 0.85, 0.1, Math.PI - 0.1);
      ctx.stroke();

      // Saturn Front Ring Half (Crossing over the planet body with shadow)
      ctx.save();
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(saturnX, saturnY, 52, 14, -Math.PI / 8, 0, Math.PI);
      ctx.stroke();

      // Cassini Division Dark Gap in Ring
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(saturnX, saturnY, 51, 13.8, -Math.PI / 8, 0, Math.PI);
      ctx.stroke();
      ctx.restore();

      // 2. 🪐 THE COLOSSAL TITAN (Giant Golden-Amber Atmospheric Moon)
      // Titan Outer Atmospheric Corona Glow
      const titanCorona = ctx.createRadialGradient(
        titanX, titanY, titanRadius * 0.8,
        titanX, titanY, titanRadius * 1.8
      );
      titanCorona.addColorStop(0, 'rgba(251, 146, 60, 0.45)');
      titanCorona.addColorStop(0.5, 'rgba(249, 115, 22, 0.18)');
      titanCorona.addColorStop(1, 'rgba(249, 115, 22, 0)');

      ctx.fillStyle = titanCorona;
      ctx.beginPath();
      ctx.arc(titanX, titanY, titanRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Titan 3D Spherical Volume Body (Volumetric dense nitrogen-methane haze)
      const titanSphere = ctx.createRadialGradient(
        titanX - titanRadius * 0.35, titanY - titanRadius * 0.35, titanRadius * 0.1,
        titanX, titanY, titanRadius
      );
      titanSphere.addColorStop(0, '#fef08a');
      titanSphere.addColorStop(0.25, '#fbbf24');
      titanSphere.addColorStop(0.65, '#ea580c');
      titanSphere.addColorStop(0.9, '#9a3412');
      titanSphere.addColorStop(1, '#431407');

      ctx.fillStyle = titanSphere;
      ctx.shadowColor = 'rgba(249, 115, 22, 0.8)';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(titanX, titanY, titanRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Titan Dense Cloud Ribbons & Hydrocarbon Lake Swirls
      ctx.save();
      ctx.clip(); // Clip within Titan's disk

      // Golden Methane Clouds
      ctx.fillStyle = 'rgba(254, 240, 138, 0.28)';
      ctx.beginPath();
      ctx.ellipse(titanX - 5, titanY - 14, titanRadius * 0.8, 8, -Math.PI / 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(251, 191, 36, 0.32)';
      ctx.beginPath();
      ctx.ellipse(titanX + 8, titanY + 12, titanRadius * 0.75, 10, -Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();

      // Dark Hydrocarbon Polar Seas (Kraken Mare feature)
      ctx.fillStyle = 'rgba(67, 20, 7, 0.45)';
      ctx.beginPath();
      ctx.ellipse(titanX - 12, titanY + 22, 16, 8, Math.PI / 8, 0, Math.PI * 2);
      ctx.ellipse(titanX + 14, titanY + 25, 12, 6, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Luminous Rim Light / Specular Sun Highlight on Titan Limb
      const rimGrad = ctx.createLinearGradient(titanX - titanRadius, titanY - titanRadius, titanX, titanY);
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
      rimGrad.addColorStop(0.5, 'rgba(254, 215, 170, 0.2)');
      rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(titanX, titanY, titanRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 3. Phobos (Nearby Martian Moon with 3D Crater Shading)
      const phobosX = titanX + 68;
      const phobosY = titanY + 54;
      const phobosR = 12;

      ctx.fillStyle = '#cbd5e1';
      ctx.shadowColor = 'rgba(254, 215, 170, 0.6)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(phobosX, phobosY, phobosR, phobosR * 0.85, Math.PI / 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Phobos Crater
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(phobosX - 3, phobosY - 1, 3.5, 0, Math.PI * 2);
      ctx.arc(phobosX + 3, phobosY + 2, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // --- 🌋 OLYMPUS MONS: THE SOLAR SYSTEM'S TALLEST VOLCANO ---
    drawOlympusMons(ctx, isDark) {
      ctx.save();
      const now = Date.now();
      
      // Position calculation for smooth majestic parallax
      const olympusWidth = 580;
      const olympusHeight = 245;
      const ox = ((200 - this.olympusOffset) % (VIRTUAL_WIDTH + olympusWidth + 120) + VIRTUAL_WIDTH + olympusWidth + 120) % (VIRTUAL_WIDTH + olympusWidth + 120) - olympusWidth / 2;
      const calderaY = GROUND_Y - olympusHeight + 35; // Summit caldera height (~115px above ground)
      const apexCenterX = ox + olympusWidth * 0.5;

      // 1. SCI-FI TERRAFORMING ION PILLAR (Shooting from Olympus Mons Caldera into space)
      const beamPulse = Math.sin(now * 0.003) * 0.15 + 0.85;
      const beamWidth = 24 * beamPulse;
      
      // Outer Ion Flare with Cyan-Amber Core
      const beamGrad = ctx.createLinearGradient(apexCenterX - beamWidth, 0, apexCenterX + beamWidth, 0);
      beamGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      beamGrad.addColorStop(0.3, 'rgba(6, 182, 212, 0.32)');
      beamGrad.addColorStop(0.5, 'rgba(251, 146, 60, 0.55)');
      beamGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.32)');
      beamGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.fillStyle = beamGrad;
      ctx.fillRect(apexCenterX - beamWidth * 2.2, 0, beamWidth * 4.4, calderaY + 10);

      // Core Intense Laser Beam Column
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 22;
      ctx.fillRect(apexCenterX - 2.5, 0, 5, calderaY + 10);
      ctx.shadowBlur = 0;

      // Ion Particle Energy Rings radiating upward
      const ringOffset = (now * 0.04) % 40;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
      ctx.lineWidth = 1.5;
      for (let ry = calderaY - ringOffset; ry > 10; ry -= 40) {
        const ringScale = 1 - (ry / calderaY) * 0.5;
        ctx.beginPath();
        ctx.ellipse(apexCenterX, ry, 18 * ringScale, 5 * ringScale, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Colossal Olympus Mons Volcanic Shield Slope (Rich 3D Shading)
      const volcanoGrad = ctx.createLinearGradient(ox, calderaY, ox, GROUND_Y);
      volcanoGrad.addColorStop(0, '#5a170b');
      volcanoGrad.addColorStop(0.35, '#420f08');
      volcanoGrad.addColorStop(0.7, '#2c0804');
      volcanoGrad.addColorStop(1, '#1a0402');

      ctx.fillStyle = volcanoGrad;
      ctx.beginPath();
      ctx.moveTo(ox - 70, GROUND_Y);
      
      // Western gentle shield flank with volcanic terraces
      ctx.quadraticCurveTo(ox + olympusWidth * 0.2, GROUND_Y - 80, ox + olympusWidth * 0.38, calderaY + 18);
      
      // Giant Multi-Ring Summit Caldera (80 km crater depression)
      ctx.lineTo(ox + olympusWidth * 0.43, calderaY + 6);
      ctx.lineTo(ox + olympusWidth * 0.47, calderaY + 15); // Caldera bowl floor
      ctx.lineTo(ox + olympusWidth * 0.53, calderaY + 15);
      ctx.lineTo(ox + olympusWidth * 0.57, calderaY + 6);
      ctx.lineTo(ox + olympusWidth * 0.62, calderaY + 18);

      // Eastern shield flank
      ctx.quadraticCurveTo(ox + olympusWidth * 0.8, GROUND_Y - 80, ox + olympusWidth + 70, GROUND_Y);
      ctx.closePath();
      ctx.fill();

      // 3. Volcanic Terraced Ridges & Sunlit Western Slopes (Warm Ochre Sunlight)
      ctx.fillStyle = 'rgba(234, 88, 12, 0.24)';
      ctx.beginPath();
      ctx.moveTo(ox + olympusWidth * 0.43, calderaY + 6);
      ctx.lineTo(ox + olympusWidth * 0.5, calderaY + 15);
      ctx.lineTo(ox + olympusWidth * 0.5, GROUND_Y);
      ctx.lineTo(ox - 70, GROUND_Y);
      ctx.quadraticCurveTo(ox + olympusWidth * 0.2, GROUND_Y - 80, ox + olympusWidth * 0.38, calderaY + 18);
      ctx.closePath();
      ctx.fill();

      // 4. Pulsating Geothermal Magma Fissures & Lava Veins on Olympus Mons
      ctx.save();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 10;
      
      // Lava Vein 1 (Left flank)
      ctx.beginPath();
      ctx.moveTo(ox + olympusWidth * 0.45, calderaY + 16);
      ctx.lineTo(ox + olympusWidth * 0.42, calderaY + 45);
      ctx.lineTo(ox + olympusWidth * 0.38, calderaY + 70);
      ctx.lineTo(ox + olympusWidth * 0.32, calderaY + 115);
      ctx.stroke();

      // Lava Vein 2 (Right flank)
      ctx.beginPath();
      ctx.moveTo(ox + olympusWidth * 0.55, calderaY + 16);
      ctx.lineTo(ox + olympusWidth * 0.58, calderaY + 50);
      ctx.lineTo(ox + olympusWidth * 0.64, calderaY + 85);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 5. Atmospheric Orographic Ice-Haze Clouds encircling Olympus Mons
      ctx.save();
      const cloudGrad = ctx.createLinearGradient(ox, 0, ox + olympusWidth, 0);
      cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      cloudGrad.addColorStop(0.3, 'rgba(207, 250, 254, 0.26)');
      cloudGrad.addColorStop(0.5, 'rgba(254, 215, 170, 0.38)');
      cloudGrad.addColorStop(0.7, 'rgba(207, 250, 254, 0.26)');
      cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      // Mid-slope cloud ribbon
      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.ellipse(apexCenterX, calderaY + 75, olympusWidth * 0.38, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Upper summit cloud ring
      ctx.beginPath();
      ctx.ellipse(apexCenterX, calderaY + 30, olympusWidth * 0.22, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 6. Summit Apex Research Citadel & Orbital Elevator Tether Base
      ctx.save();
      const spireX = ox + olympusWidth * 0.57;
      const spireY = calderaY + 4;

      // Spire Tower
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(spireX - 3, spireY - 24, 6, 24);

      // Skyward Space Elevator Guide Beam to Orbit
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(spireX, spireY - 24);
      ctx.lineTo(spireX, 0);
      ctx.stroke();

      // Flashing Apex Beacon
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(spireX, spireY - 24, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      ctx.restore();
    }

    // --- DISTANT RIDGES & MOUNTAINS ---
    drawDistantMarsMountains(ctx, isDark) {
      ctx.save();
      this.marsMountainsFar.forEach((m) => {
        const mx = ((m.x - this.marsFarOffset) % (VIRTUAL_WIDTH + 240) + VIRTUAL_WIDTH + 240) % (VIRTUAL_WIDTH + 240) - 120;
        
        ctx.fillStyle = m.color || '#350b07';
        ctx.beginPath();
        ctx.moveTo(mx - 40, GROUND_Y);
        ctx.lineTo(mx + m.width * 0.5, GROUND_Y - m.height);
        ctx.lineTo(mx + m.width + 40, GROUND_Y);
        ctx.closePath();
        ctx.fill();

        // Shading on sunlit ridge
        ctx.fillStyle = 'rgba(234, 88, 12, 0.16)';
        ctx.beginPath();
        ctx.moveTo(mx + m.width * 0.5, GROUND_Y - m.height);
        ctx.lineTo(mx + m.width + 40, GROUND_Y);
        ctx.lineTo(mx + m.width * 0.5, GROUND_Y);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    }

    // --- MIDGROUND VALLES MARINERIS CANYONS, BIOSPHERES & MAG-LEV SKYWAY ---
    drawMidgroundMarsTerrain(ctx, isDark) {
      ctx.save();
      const now = Date.now();

      // 1. Trans-Canyon Elevated Mag-Lev Guideway Tube
      const skywayY = GROUND_Y - 95;
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, skywayY);
      ctx.lineTo(VIRTUAL_WIDTH, skywayY);
      ctx.stroke();

      // Glowing Mag-Lev Power Rail
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, skywayY - 1);
      ctx.lineTo(VIRTUAL_WIDTH, skywayY - 1);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Animated Mag-Lev Hyper-Speed Transport Pods
      this.maglevPods.forEach((pod) => {
        ctx.fillStyle = pod.color;
        ctx.shadowColor = pod.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(pod.x, skywayY - 5, 24, 7, 3);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pod Light Trail
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.fillRect(pod.x + 24, skywayY - 4, 18, 5);
      });

      // 3. Terrain Structures, Biospheres, Arches & Towers
      this.marsStructuresMid.forEach((s) => {
        const sx = ((s.x - this.marsMidOffset) % (VIRTUAL_WIDTH + 140) + VIRTUAL_WIDTH + 140) % (VIRTUAL_WIDTH + 140) - 70;

        if (s.type === 'dome') {
          // Mars / Titan Base Pressurized Habitat Dome
          const dy = GROUND_Y - s.height;
          // Habitat Base
          ctx.fillStyle = '#1c1917';
          ctx.fillRect(sx, dy + s.height - 12, s.width, 12);

          // Glass Biosphere Dome with Structural Hex Grid
          const domeGrad = ctx.createLinearGradient(sx, dy, sx, dy + s.height);
          domeGrad.addColorStop(0, 'rgba(6, 182, 212, 0.55)');
          domeGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
          ctx.fillStyle = domeGrad;
          ctx.beginPath();
          ctx.arc(sx + s.width / 2, dy + s.height - 10, s.width / 2, Math.PI, 0);
          ctx.fill();

          // Dome Frame Struts
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(sx + s.width / 2, dy + s.height - 10, s.width / 2, Math.PI, 0);
          ctx.stroke();

          // Amber Observation Lights
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 6;
          for (let lx = sx + 12; lx < sx + s.width - 10; lx += 14) {
            ctx.fillRect(lx, dy + s.height - 18, 4, 3);
          }
          ctx.shadowBlur = 0;

          // Antenna Beacon with Pulsing Red Strobe
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx + s.width / 2, dy + 2);
          ctx.lineTo(sx + s.width / 2, dy - 18);
          ctx.stroke();

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx + s.width / 2, dy - 18, 2.5, 0, Math.PI * 2);
          ctx.fill();

        } else if (s.type === 'maglev_pillar') {
          // High Skyway Structural Support Pylon
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(sx, skywayY, s.width, GROUND_Y - skywayY);

          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1;
          ctx.strokeRect(sx, skywayY, s.width, GROUND_Y - skywayY);

        } else if (s.type === 'arch') {
          // Natural Martian Red Sandstone Arch
          ctx.fillStyle = '#5a190f';
          ctx.beginPath();
          ctx.moveTo(sx, GROUND_Y);
          ctx.lineTo(sx, GROUND_Y - s.height);
          ctx.quadraticCurveTo(sx + s.width / 2, GROUND_Y - s.height - 15, sx + s.width, GROUND_Y - s.height);
          ctx.lineTo(sx + s.width, GROUND_Y);
          ctx.lineTo(sx + s.width - 18, GROUND_Y);
          ctx.lineTo(sx + s.width - 18, GROUND_Y - s.height + 25);
          ctx.quadraticCurveTo(sx + s.width / 2, GROUND_Y - s.height + 15, sx + 18, GROUND_Y - s.height + 25);
          ctx.lineTo(sx + 18, GROUND_Y);
          ctx.closePath();
          ctx.fill();

        } else if (s.type === 'tower') {
          // Terraforming Comms Tower
          ctx.fillStyle = '#1c1917';
          ctx.fillRect(sx + 12, GROUND_Y - s.height, 10, s.height);

          // Tower Trusses
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 1;
          for (let ty = GROUND_Y - s.height + 15; ty < GROUND_Y - 10; ty += 18) {
            ctx.strokeRect(sx + 8, ty, 18, 10);
          }

          // Blinking Laser Relays
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(sx + 17, GROUND_Y - s.height, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

        } else if (s.type === 'crater_ridge') {
          // Sandstone Crater Mesa
          ctx.fillStyle = '#4c150c';
          ctx.beginPath();
          ctx.moveTo(sx, GROUND_Y);
          ctx.lineTo(sx + 20, GROUND_Y - s.height);
          ctx.lineTo(sx + s.width - 20, GROUND_Y - s.height + 10);
          ctx.lineTo(sx + s.width, GROUND_Y);
          ctx.closePath();
          ctx.fill();

        } else if (s.type === 'spire') {
          // Jagged Monolith
          ctx.fillStyle = '#3a0e07';
          ctx.beginPath();
          ctx.moveTo(sx, GROUND_Y);
          ctx.lineTo(sx + s.width / 2, GROUND_Y - s.height);
          ctx.lineTo(sx + s.width, GROUND_Y);
          ctx.closePath();
          ctx.fill();

        } else if (s.type === 'solar_farm') {
          // Solar Collector Array
          for (let p = 0; p < 3; p++) {
            const px = sx + p * 30;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(px + 10, GROUND_Y - 14, 4, 14);

            // Angled Solar Panel
            ctx.fillStyle = '#0284c7';
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, GROUND_Y - 20);
            ctx.lineTo(px + 24, GROUND_Y - 32);
            ctx.lineTo(px + 24, GROUND_Y - 22);
            ctx.lineTo(px, GROUND_Y - 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        }
      });
      ctx.restore();
    }

    // --- GROUND PLATFORM & STRATA ---
    drawMarsGround(ctx, isDark) {
      // 1. Top Red Sand Dunes & Solar Exploration Guideway
      ctx.fillStyle = '#f97316';
      ctx.shadowColor = 'rgba(249, 115, 22, 0.95)';
      ctx.shadowBlur = 10;
      ctx.fillRect(0, GROUND_Y, VIRTUAL_WIDTH, 4);
      ctx.shadowBlur = 0;

      // 2. Rich Strata (Iron Oxide Topsoil down to Basalt Core)
      const floorGrad = ctx.createLinearGradient(0, GROUND_Y + 4, 0, VIRTUAL_HEIGHT);
      floorGrad.addColorStop(0, '#9a3412');
      floorGrad.addColorStop(0.35, '#7c2d12');
      floorGrad.addColorStop(0.7, '#431407');
      floorGrad.addColorStop(1, '#1c0703');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, GROUND_Y + 4, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - GROUND_Y - 4);

      // 3. Rover Tread Marks, Rock Formations & Geothermal Grid
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.35)';
      ctx.lineWidth = 1.5;
      for (let x = -this.groundOffset; x < VIRTUAL_WIDTH + 40; x += 40) {
        // Angled rover tread marks
        ctx.beginPath();
        ctx.moveTo(x, GROUND_Y + 4);
        ctx.lineTo(x - 18, VIRTUAL_HEIGHT);
        ctx.stroke();

        // Embedded Geothermal Energy Nodes
        ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.fillRect(x + 4, GROUND_Y + 12, 10, 3);
        ctx.fillRect(x + 18, GROUND_Y + 34, 14, 3);

        // Subterranean Basalt Rocks
        ctx.fillStyle = '#2a0a04';
        ctx.beginPath();
        ctx.arc(x + 10, GROUND_Y + 50, 5, 0, Math.PI * 2);
        ctx.arc(x + 28, GROUND_Y + 62, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- EXPLORER MECHA-ROVER MK-V (PLAYER) ---
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

      // Rover Palette (Polar White, Carbon Titanium, Ares Orange & Cyan Sensors)
      const roverWhite = '#f8fafc';
      const roverCarbon = '#1e293b';
      const roverOrange = '#f97316';
      const roverCyan = '#06b6d4';
      const roverGlow = 'rgba(6, 182, 212, 0.7)';

      // Dynamic Rover Soft Ground Shadow & Neon Underglow
      if (r.isGrounded) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(cx, GROUND_Y - 1, (r.width * 0.45) * r.stretchX, 4 * r.squashY, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cyan Neon Underglow reflecting on soil
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, GROUND_Y - 1, (r.width * 0.35) * r.stretchX, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (r.isSliding) {
        // --- MAG-SKID SLIDE STATE (Low-profile streamlined rover pod) ---
        // Slide Sparks & Orange Jet Exhaust
        ctx.fillStyle = '#ea580c';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(r.x - 14, r.y + 12);
        ctx.lineTo(r.x, r.y + 4);
        ctx.lineTo(r.x, r.y + 20);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Streamlined White Chassis Shell
        ctx.fillStyle = roverWhite;
        ctx.strokeStyle = roverOrange;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(r.x, r.y + 4, r.width + 4, 16, 8);
        ctx.fill();
        ctx.stroke();

        // Carbon Side Trim
        ctx.fillStyle = roverCarbon;
        ctx.fillRect(r.x + 8, r.y + 10, r.width - 24, 5);

        // Glowing Solar Core Strip
        ctx.fillStyle = roverCyan;
        ctx.fillRect(r.x + 10, r.y + 11, r.width - 28, 3);

        // Low Visor Sensor
        ctx.fillStyle = roverCyan;
        ctx.shadowColor = roverCyan;
        ctx.shadowBlur = 10;
        ctx.fillRect(r.x + r.width - 14, r.y + 8, 10, 4);
        ctx.shadowBlur = 0;

      } else {
        // --- GALLOP & ION JET JUMP (4-Legged Mecha-Rover) ---

        // 1. Dual Ion Jet Thrusters Flame (Orange-Cyan Core)
        ctx.save();
        const thrusterLen = (r.isGrounded ? 10 : 22) + r.thrusterPulse * 8;
        
        // Outer Orange Flame
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(r.x - 4, r.y + 12);
        ctx.lineTo(r.x - 4 - thrusterLen, r.y + 18);
        ctx.lineTo(r.x - 4, r.y + 24);
        ctx.closePath();
        ctx.fill();

        // Inner Cyan Ion Jet Core
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(r.x - 4, r.y + 15);
        ctx.lineTo(r.x - 4 - (thrusterLen * 0.6), r.y + 18);
        ctx.lineTo(r.x - 4, r.y + 21);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 2. Back Legs (Left Side & Right Side background)
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Back-Left Mechanical Leg
        const bLeg1 = isRunning ? Math.sin(frame + Math.PI) * 0.7 : 0;
        ctx.save();
        ctx.translate(r.x + 12, r.y + 24);
        ctx.rotate(bLeg1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, 12);
        ctx.lineTo(4, 18);
        ctx.stroke();
        // Cyan Rover Wheel / Paw
        ctx.fillStyle = roverCyan;
        ctx.beginPath();
        ctx.arc(4, 18, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Front-Left Mechanical Leg
        const fLeg1 = isRunning ? Math.sin(frame) * 0.7 : 0;
        ctx.save();
        ctx.translate(r.x + 38, r.y + 24);
        ctx.rotate(fLeg1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(3, 12);
        ctx.lineTo(9, 18);
        ctx.stroke();
        ctx.fillStyle = roverCyan;
        ctx.beginPath();
        ctx.arc(9, 18, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Mecha Torso Chassis (Polar White + Ares Orange Solar Plate)
        ctx.fillStyle = roverWhite;
        ctx.strokeStyle = roverOrange;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(r.x + 6, r.y + 10, 36, 20, 7);
        ctx.fill();
        ctx.stroke();

        // Carbon Armor Plate & Solar Panel Array
        ctx.fillStyle = roverCarbon;
        ctx.beginPath();
        ctx.roundRect(r.x + 10, r.y + 14, 26, 12, 4);
        ctx.fill();

        // Glowing RTG Energy Core
        ctx.fillStyle = roverOrange;
        ctx.shadowColor = 'rgba(249, 115, 22, 0.95)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(r.x + 23, r.y + 20, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 4. Front-Right Leg & Back-Right Leg (Foreground)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4.5;

        // Back-Right Mechanical Leg
        const bLeg2 = isRunning ? Math.sin(frame) * 0.75 : 0;
        ctx.save();
        ctx.translate(r.x + 16, r.y + 24);
        ctx.rotate(bLeg2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-3, 12);
        ctx.lineTo(5, 18);
        ctx.stroke();
        ctx.fillStyle = roverOrange;
        ctx.beginPath();
        ctx.arc(5, 18, 3.5, 0, Math.PI * 2);
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
        ctx.lineTo(11, 18);
        ctx.stroke();
        ctx.fillStyle = roverOrange;
        ctx.beginPath();
        ctx.arc(11, 18, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 5. Rover Head & LIDAR Visor
        const hx = r.x + 40;
        const hy = r.y + 12;

        // High-Gain Comms Antenna with Relay LED
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hx + 4, hy - 4);
        ctx.lineTo(hx + 9, hy - 15);
        ctx.stroke();
        // Antenna LED Beacon
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(hx + 9, hy - 15, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Head Shell
        ctx.fillStyle = roverWhite;
        ctx.strokeStyle = roverOrange;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(hx - 4, hy - 6, 18, 16, 5);
        ctx.fill();
        ctx.stroke();

        // Glowing Visor Eyes (LIDAR Scanner)
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
          ctx.fillStyle = roverCyan;
          ctx.shadowColor = roverGlow;
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

    // --- HAZARDS & OBSTACLES ---
    drawObstacles(ctx) {
      this.obstacles.forEach((obs) => {
        ctx.save();
        if (obs.type === 'barrier') {
          // Solar Energy Pylon / High-Voltage Electric Barrier
          ctx.fillStyle = '#1c1917';
          ctx.fillRect(obs.x + 4, obs.y + 10, obs.width - 8, obs.height - 10);
          
          // Hazard Stripes
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(obs.x + 6, obs.y + 14, obs.width - 12, 3);
          ctx.fillRect(obs.x + 6, obs.y + 24, obs.width - 12, 3);

          // Pulsating Electric Arc
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(249, 115, 22, 0.95)';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(obs.x + 6, obs.y + 12);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width - 6, obs.y + 12);
          ctx.stroke();
          ctx.shadowBlur = 0;

        } else if (obs.type === 'crate') {
          // Titanium Supply Module
          ctx.fillStyle = '#292524';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 2;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          // Hazard Emblem & Solar Top
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, 4);

          ctx.fillStyle = '#f97316';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('ARES', obs.x + 6, obs.y + 22);

        } else if (obs.type === 'plasma_spike') {
          // Molten Obsidian Lava Spikes & Alien Crystals
          ctx.fillStyle = '#dc2626';
          ctx.shadowColor = 'rgba(220, 38, 38, 0.9)';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + 10, obs.y);
          ctx.lineTo(obs.x + 20, obs.y + obs.height);
          ctx.lineTo(obs.x + 30, obs.y - 4);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          // Glowing lava crystal vein
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(obs.x + 30, obs.y + 4, 2.5, 0, Math.PI * 2);
          ctx.fill();

        } else if (obs.type === 'laser_beam') {
          // High Orbital Survey Laser (REQUIRE SLIDE)
          ctx.fillStyle = '#475569';
          ctx.fillRect(obs.x, obs.y - 2, 8, obs.height + 4);
          ctx.fillRect(obs.x + obs.width - 8, obs.y - 2, 8, obs.height + 4);

          // Crimson Laser Beam
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = 'rgba(239, 68, 68, 0.95)';
          ctx.shadowBlur = 16;
          ctx.fillRect(obs.x + 6, obs.y + 4, obs.width - 12, 6);
          
          // Core bright orange-white beam
          ctx.fillStyle = '#fff7ed';
          ctx.fillRect(obs.x + 6, obs.y + 6, obs.width - 12, 2);
          ctx.shadowBlur = 0;

          // Warning label
          ctx.fillStyle = '#f97316';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('SLIDE!', obs.x + 15, obs.y - 4);

        } else if (obs.type === 'drone') {
          // Autonomous Recon Drone
          const dx = obs.x + obs.width / 2;
          const dy = obs.y + obs.height / 2;

          // Twin Micro-Rotors
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(dx - 18, dy - 8);
          ctx.lineTo(dx - 6, dy - 8);
          ctx.moveTo(dx + 6, dy - 8);
          ctx.lineTo(dx + 18, dy - 8);
          ctx.stroke();

          // Drone Aerodynamic Body
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(dx, dy, 16, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Ground Scanning Searchlight
          ctx.fillStyle = '#f97316';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(dx - 6, dy, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Downward Scanning Light Cone
          ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
          ctx.beginPath();
          ctx.moveTo(dx - 6, dy + 6);
          ctx.lineTo(dx - 24, dy + 34);
          ctx.lineTo(dx + 12, dy + 34);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });
    }

    // --- COLLECTIBLES ---
    drawItems(ctx) {
      this.items.forEach((item) => {
        ctx.save();
        const floatY = Math.sin(item.floatTimer * 3.5) * 4;

        if (item.type === 'core') {
          // Oxygen / Energy Cell (🔋)
          const ix = item.x + 11;
          const iy = item.y + 11 + floatY;

          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = 'rgba(6, 182, 212, 0.95)';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(ix, iy, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Orbiting Energy Ring
          const orbAngle = item.floatTimer * 4;
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(ix + Math.cos(orbAngle) * 12, iy + Math.sin(orbAngle) * 6, 2.5, 0, Math.PI * 2);
          ctx.fill();

        } else if (item.type === 'crystal') {
          // Rare Xenocrystal (💎)
          const cx = item.x + 11;
          const cy = item.y + 11 + floatY;

          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = 'rgba(244, 63, 94, 0.95)';
          ctx.shadowBlur = 15;

          ctx.beginPath();
          ctx.moveTo(cx, cy - 10);
          ctx.lineTo(cx + 9, cy);
          ctx.lineTo(cx, cy + 10);
          ctx.lineTo(cx - 9, cy);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          // Diamond sparkle center
          ctx.fillStyle = '#fff7ed';
          ctx.beginPath();
          ctx.arc(cx, cy, 2.8, 0, Math.PI * 2);
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

    drawAtmosphericDust(ctx) {
      ctx.save();
      this.marsDust.forEach((d) => {
        ctx.globalAlpha = d.alpha;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
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
      vignette.addColorStop(0, 'rgba(13, 4, 7, 0)');
      vignette.addColorStop(1, 'rgba(13, 4, 7, 0.72)');
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
