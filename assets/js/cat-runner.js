/**
 * ==============================================================================
 * 🐱 CAT RUNNER - 2D SPRITE-BASED CHARACTER ANIMATION RUNNER
 * ==============================================================================
 * Features:
 * - Real 2D illustrated character sprites (Tabby Cat with 4-leg run cycle)
 * - 4-Frame Running Cycle: Contact A -> Passing A -> Contact B -> Passing B
 * - 4-Frame Jump Sequence: Takeoff -> Airborne -> Peak -> Landing
 * - Happy Fish reaction with purring smile ^ ‿ ^ and +100 text
 * - Dynamic 10 FPS sprite cadence on 60 FPS physics canvas
 * - Parabolic velocity + gravity physics
 * - Web Audio API acoustic feline meow synthesizer
 * - Countryside daytime parallax scenery matching 2D game illustration
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundFx {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('cat_runner_muted') === 'true';
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
      localStorage.setItem('cat_runner_muted', this.muted);
      return this.muted;
    }

    playJump() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
      } catch (e) {}
    }

    playCoin() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
      } catch (e) {}
    }

    playMeow(isPlayful = false) {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        
        // Authentic Acoustic Feline Meow Synthesizer
        const pitchVariation = 0.96 + Math.random() * 0.08;
        const duration = isPlayful ? 0.42 : 0.65;
        const baseFreq = (isPlayful ? 460 : 390) * pitchVariation;
        const peakFreq = (isPlayful ? 920 : 840) * pitchVariation;
        const endFreq = (isPlayful ? 430 : 340) * pitchVariation;
        const peakTime = isPlayful ? 0.12 : 0.18;

        const oscSaw = this.ctx.createOscillator();
        const oscTri = this.ctx.createOscillator();
        const oscSub = this.ctx.createOscillator(); // warm vocal sub-harmonic
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        oscSaw.type = 'sawtooth';
        oscTri.type = 'triangle';
        oscSub.type = 'sine';

        // Organic Feline Vocal Vibrato
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(isPlayful ? 7.2 : 6.0, now);
        lfoGain.gain.setValueAtTime(14, now);
        lfo.connect(oscSaw.frequency);
        lfo.connect(oscTri.frequency);
        lfo.start(now);
        lfo.stop(now + duration);

        [oscSaw, oscTri].forEach(osc => {
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(peakFreq, now + peakTime);
          osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration - 0.04);
        });

        oscSub.frequency.setValueAtTime(baseFreq * 0.5, now);
        oscSub.frequency.exponentialRampToValueAtTime(peakFreq * 0.5, now + peakTime);
        oscSub.frequency.exponentialRampToValueAtTime(endFreq * 0.5, now + duration - 0.04);

        // Dual Formant Bandpass Filters (F1 & F2 vowel articulation: "m-eee-o-www")
        const f1 = this.ctx.createBiquadFilter();
        f1.type = 'bandpass';
        f1.Q.value = 3.6;
        f1.frequency.setValueAtTime(680, now);
        f1.frequency.exponentialRampToValueAtTime(1180, now + peakTime);
        f1.frequency.exponentialRampToValueAtTime(460, now + duration - 0.04);

        const f2 = this.ctx.createBiquadFilter();
        f2.type = 'bandpass';
        f2.Q.value = 4.2;
        f2.frequency.setValueAtTime(1650, now);
        f2.frequency.exponentialRampToValueAtTime(2450, now + peakTime);
        f2.frequency.exponentialRampToValueAtTime(780, now + duration - 0.04);

        const warmthFilter = this.ctx.createBiquadFilter();
        warmthFilter.type = 'lowpass';
        warmthFilter.frequency.setValueAtTime(3600, now);

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime(0.06, now);

        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.30, now + 0.07);
        masterGain.gain.setValueAtTime(0.30, now + peakTime + 0.08);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        oscSaw.connect(f1);
        oscTri.connect(f2);
        oscSub.connect(subGain);
        subGain.connect(warmthFilter);
        f1.connect(warmthFilter);
        f2.connect(warmthFilter);
        warmthFilter.connect(masterGain);
        masterGain.connect(this.ctx.destination);

        oscSaw.start(now);
        oscTri.start(now);
        oscSub.start(now);
        oscSaw.stop(now + duration);
        oscTri.stop(now + duration);
        oscSub.stop(now + duration);
      } catch (e) {}
    }

    playFish() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        
        // Realistic Acoustic Meow Synthesizer
        const pitchVariation = 0.96 + Math.random() * 0.08;
        const baseFreq = 410 * pitchVariation;
        const peakFreq = 860 * pitchVariation;
        const endFreq = 330 * pitchVariation;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(6.5, now);
        lfoGain.gain.setValueAtTime(12, now);
        lfo.connect(osc1.frequency);
        lfo.connect(osc2.frequency);
        lfo.start(now);
        lfo.stop(now + 0.42);

        [osc1, osc2].forEach(osc => {
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.11);
          osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.40);
        });

        const f1 = this.ctx.createBiquadFilter();
        f1.type = 'bandpass';
        f1.Q.value = 3.2;
        f1.frequency.setValueAtTime(650, now);
        f1.frequency.exponentialRampToValueAtTime(1120, now + 0.11);
        f1.frequency.exponentialRampToValueAtTime(460, now + 0.40);

        const f2 = this.ctx.createBiquadFilter();
        f2.type = 'bandpass';
        f2.Q.value = 3.8;
        f2.frequency.setValueAtTime(1600, now);
        f2.frequency.exponentialRampToValueAtTime(2350, now + 0.11);
        f2.frequency.exponentialRampToValueAtTime(760, now + 0.40);

        const warmthFilter = this.ctx.createBiquadFilter();
        warmthFilter.type = 'lowpass';
        warmthFilter.frequency.setValueAtTime(3800, now);

        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.24, now + 0.06);
        masterGain.gain.setValueAtTime(0.24, now + 0.18);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        osc1.connect(f1);
        osc2.connect(f2);
        f1.connect(warmthFilter);
        f2.connect(warmthFilter);
        warmthFilter.connect(masterGain);
        masterGain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.42);
        osc2.stop(now + 0.42);

        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(1567.98, now + 0.04);
        chime.frequency.setValueAtTime(2093.00, now + 0.12);
        chimeGain.gain.setValueAtTime(0.05, now + 0.04);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.30);
        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(now + 0.04);
        chime.stop(now + 0.30);
      } catch (e) {}
    }

    playHit() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.35);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) {}
    }

    playBestScore() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startTime = now + idx * 0.08;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.2, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.25);
        });
      } catch (e) {}
    }
  }

  // ==============================================================================
  // 🐾 SPRITE FRAME EXTRACTOR & LOADER (OFFICIAL SPRITE SHEETS)
  // ==============================================================================
  class CatSpriteBaker {
    constructor(onReadyCallback) {
      this.width = 120;
      this.height = 90;
      this.sprites = {};
      this.onReady = onReadyCallback;
      this.isLoaded = false;

      // 1. Procedural vector fallback
      this.bakeVectorFrames();

      // 2. Load the official 2D sprite frames from cat_run.png, cat_jump.png, cat_land.png
      this.loadAllSpriteSheets();
    }

    loadAllSpriteSheets() {
      // 12 Run frames, 5 Jump frames, 5 Land frames
      const runCount = 12;
      const jumpCount = 5;
      const landCount = 5;
      let totalToLoad = runCount + jumpCount + landCount;
      let loadedCount = 0;

      const onFrameLoaded = () => {
        loadedCount++;
        if (loadedCount >= totalToLoad) {
          this.isLoaded = true;
          this.sprites['cat-idle'] = this.sprites['cat-run-00'];
          this.sprites['cat-gameover'] = this.sprites['cat-land-01'] || this.sprites['cat-jump-04'];
          if (typeof this.onReady === 'function') this.onReady();
        }
      };

      // A. Load Run Frames (run_0.png to run_11.png)
      for (let i = 0; i < runCount; i++) {
        const key = `cat-run-${i.toString().padStart(2, '0')}`;
        const img = new Image();
        img.src = `assets/cat/frames/run_${i}.png`;
        img.onload = () => {
          this.sprites[key] = img;
          onFrameLoaded();
        };
        img.onerror = () => {
          // Fallback to legacy spritesheet if individual frame missing
          onFrameLoaded();
        };
      }

      // B. Load Jump Frames (jump_0.png to jump_4.png)
      for (let i = 0; i < jumpCount; i++) {
        const key = `cat-jump-${i.toString().padStart(2, '0')}`;
        const img = new Image();
        img.src = `assets/cat/frames/jump_${i}.png`;
        img.onload = () => {
          this.sprites[key] = img;
          onFrameLoaded();
        };
        img.onerror = () => {
          onFrameLoaded();
        };
      }

      // C. Load Land Frames (land_0.png to land_4.png)
      for (let i = 0; i < landCount; i++) {
        const key = `cat-land-${i.toString().padStart(2, '0')}`;
        const img = new Image();
        img.src = `assets/cat/frames/land_${i}.png`;
        img.onload = () => {
          this.sprites[key] = img;
          onFrameLoaded();
        };
        img.onerror = () => {
          onFrameLoaded();
        };
      }

      // Also preload Happy reaction frame
      const happyImg = new Image();
      happyImg.src = 'assets/images/cat-happy-spritesheet.jpg';
      happyImg.onload = () => {
        this.sprites['cat-happy'] = this.sliceAndMatte(happyImg, 350, 520, 330, 450);
      };
    }

    sliceAndMatte(img, sx, sy, sw, sh) {
      const c = document.createElement('canvas');
      c.width = 160;
      c.height = 120;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
      const imgData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const isDarkBg = (r < 65 && g < 85 && b < 110 && Math.abs(r - 43) < 22 && Math.abs(g - 61) < 24);
        if (isDarkBg) {
          data[i + 3] = 0;
        } else if (r < 80 && g < 100 && b < 125 && Math.abs(r - 43) < 35) {
          const diff = Math.max(Math.abs(r - 43), Math.abs(g - 61), Math.abs(b - 82));
          data[i + 3] = Math.min(255, Math.max(0, (diff - 12) * 16));
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return c;
    }

    bakeVectorFrames() {
      // Initial vector fallback
      const frames = [
        { key: 'cat-run-01', bodyOffsetY: 2, flLeg: 0.65, frLeg: -0.60, blLeg: -0.62, brLeg: 0.55, tailWave: -0.25 },
        { key: 'cat-run-02', bodyOffsetY: -3, flLeg: -0.15, frLeg: 0.18, blLeg: 0.20, brLeg: -0.18, tailWave: 0.40 },
        { key: 'cat-run-03', bodyOffsetY: 2, flLeg: -0.60, frLeg: 0.65, blLeg: 0.55, brLeg: -0.62, tailWave: -0.25 },
        { key: 'cat-run-04', bodyOffsetY: -3, flLeg: 0.18, frLeg: -0.15, blLeg: -0.18, brLeg: 0.20, tailWave: 0.40 },
        { key: 'cat-jump-01', bodyOffsetY: 4, flLeg: -0.20, frLeg: -0.15, blLeg: -0.45, brLeg: -0.40, tailWave: -0.5 },
        { key: 'cat-jump-02', bodyOffsetY: -2, flLeg: 0.75, frLeg: 0.85, blLeg: -0.70, brLeg: -0.65, tailWave: 0.2 },
        { key: 'cat-jump-03', bodyOffsetY: 0, flLeg: 0.15, frLeg: 0.20, blLeg: -0.25, brLeg: -0.20, tailWave: 0.6 },
        { key: 'cat-jump-04', bodyOffsetY: 5, flLeg: 0.10, frLeg: 0.12, blLeg: 0.08, brLeg: 0.10, tailWave: -0.4 },
        { key: 'cat-happy', bodyOffsetY: -4, flLeg: 0.30, frLeg: -0.25, blLeg: -0.28, brLeg: 0.26, tailWave: 0.75, isHappy: true },
        { key: 'cat-idle', bodyOffsetY: 0, flLeg: 0, frLeg: 0, blLeg: 0, brLeg: 0, tailWave: 0.1 },
        { key: 'cat-gameover', bodyOffsetY: 6, flLeg: -0.4, frLeg: 0.4, blLeg: 0.4, brLeg: -0.4, tailWave: -0.6, isGameOver: true }
      ];

      frames.forEach(f => {
        this.sprites[f.key] = this.renderVectorFrame(f);
      });
    }

    renderVectorFrame(cfg) {
      const c = document.createElement('canvas');
      c.width = 160;
      c.height = 120;
      const ctx = c.getContext('2d');

      const cOrangeDark = '#9a3412';
      const cOrangeBase = '#ea580c';
      const cOrangeMid = '#f97316';
      const cOrangeLight = '#fb923c';
      const cOrangeSoft = '#fdba74';
      const cCream = '#ffffff';
      const cPinkNose = '#f472b6';
      const cCollarBlue = '#0284c7';
      const cGoldTag = '#fbbf24';
      const cEyeEmerald = '#10b981';

      const ox = 75;
      const oy = 85;

      const bodyX = ox - 20;
      const bodyY = oy - 24 + (cfg.bodyOffsetY || 0);
      const headX = ox + 8;
      const headY = oy - 35 + (cfg.bodyOffsetY ? cfg.bodyOffsetY * 0.7 : 0);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Background legs
      ctx.fillStyle = cOrangeDark;
      ctx.strokeStyle = cOrangeDark;

      ctx.save();
      ctx.translate(bodyX - 10, bodyY + 3);
      ctx.rotate(cfg.blLeg || 0);
      ctx.lineWidth = 7.0;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-5, 14);
      ctx.lineTo(3, 22);
      ctx.stroke();
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.ellipse(4, 22.5, 5.0, 3.8, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(bodyX + 14, bodyY + 4);
      ctx.rotate(cfg.flLeg || 0);
      ctx.lineWidth = 6.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(4, 13);
      ctx.lineTo(8, 21);
      ctx.stroke();
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.ellipse(9, 21.5, 5.0, 3.8, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Tail
      ctx.save();
      const tailBaseX = bodyX - 16;
      const tailBaseY = bodyY - 2;
      const tWave = cfg.tailWave || 0;

      const t1x = tailBaseX - 10;
      const t1y = tailBaseY - 8 + tWave * 8;
      const t2x = tailBaseX - 20 + tWave * 10;
      const t2y = tailBaseY - 20 + tWave * 12;
      const t3x = tailBaseX - 14 + tWave * 14;
      const t3y = tailBaseY - 32 + tWave * 14;

      ctx.strokeStyle = cOrangeMid;
      ctx.lineWidth = 10.0;
      ctx.beginPath();
      ctx.moveTo(tailBaseX, tailBaseY);
      ctx.bezierCurveTo(t1x, t1y, t2x, t2y, t3x, t3y);
      ctx.stroke();

      ctx.strokeStyle = cCream;
      ctx.lineWidth = 10.5;
      ctx.beginPath();
      ctx.moveTo((t2x + t3x) / 2, (t2y + t3y) / 2);
      ctx.lineTo(t3x, t3y);
      ctx.stroke();

      ctx.fillStyle = cCream;
      ctx.beginPath();
      ctx.arc(t3x, t3y, 6.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Torso
      const bodyGrad = ctx.createLinearGradient(bodyX - 18, bodyY - 16, bodyX + 22, bodyY + 16);
      bodyGrad.addColorStop(0, cOrangeSoft);
      bodyGrad.addColorStop(0.3, cOrangeLight);
      bodyGrad.addColorStop(0.7, cOrangeBase);
      bodyGrad.addColorStop(1, cOrangeDark);

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(bodyX - 18, bodyY);
      ctx.bezierCurveTo(bodyX - 18, bodyY - 15, bodyX + 12, bodyY - 16, bodyX + 22, bodyY - 2);
      ctx.bezierCurveTo(bodyX + 26, bodyY + 10, bodyX + 10, bodyY + 16, bodyX - 4, bodyY + 14);
      ctx.bezierCurveTo(bodyX - 16, bodyY + 14, bodyX - 20, bodyY + 8, bodyX - 18, bodyY);
      ctx.closePath();
      ctx.fill();

      // White chest bib
      ctx.fillStyle = cCream;
      ctx.beginPath();
      ctx.moveTo(bodyX + 9, bodyY - 4);
      ctx.bezierCurveTo(bodyX + 24, bodyY, bodyX + 24, bodyY + 11, bodyX + 13, bodyY + 13);
      ctx.bezierCurveTo(bodyX + 4, bodyY + 14, bodyX - 7, bodyY + 13, bodyX - 10, bodyY + 9);
      ctx.bezierCurveTo(bodyX - 5, bodyY + 6, bodyX + 5, bodyY + 5, bodyX + 9, bodyY - 4);
      ctx.closePath();
      ctx.fill();

      // 4. Foreground legs
      ctx.strokeStyle = cOrangeMid;
      ctx.fillStyle = cOrangeMid;

      // Back-Right
      ctx.save();
      ctx.translate(bodyX - 8, bodyY + 4);
      ctx.rotate(cfg.brLeg || 0);
      ctx.lineWidth = 7.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-5, 14);
      ctx.lineTo(5, 22);
      ctx.stroke();
      ctx.fillStyle = cCream;
      ctx.beginPath();
      ctx.ellipse(6, 22.5, 5.5, 4.0, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Front-Right
      ctx.save();
      ctx.translate(bodyX + 20, bodyY + 5);
      ctx.rotate(cfg.frLeg || 0);
      ctx.lineWidth = 7.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(5, 14);
      ctx.lineTo(12, 21);
      ctx.stroke();
      ctx.fillStyle = cCream;
      ctx.beginPath();
      ctx.ellipse(13, 21.5, 5.5, 4.0, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Collar & Tag
      ctx.save();
      ctx.strokeStyle = cCollarBlue;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(headX - 12, headY + 10);
      ctx.quadraticCurveTo(headX - 1, headY + 18, headX + 9, headY + 12);
      ctx.stroke();

      ctx.fillStyle = cGoldTag;
      ctx.beginPath();
      ctx.arc(headX - 1, headY + 17, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 6. Head & Ears
      ctx.save();
      ctx.fillStyle = cOrangeMid;
      ctx.beginPath();
      ctx.moveTo(headX + 6, headY - 12);
      ctx.lineTo(headX + 15, headY - 30);
      ctx.lineTo(headX + 21, headY - 10);
      ctx.closePath();
      ctx.fill();

      const headGrad = ctx.createRadialGradient(headX + 4, headY - 4, 3, headX, headY, 19);
      headGrad.addColorStop(0, cOrangeSoft);
      headGrad.addColorStop(0.5, cOrangeMid);
      headGrad.addColorStop(1, cOrangeDark);
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(headX, headY, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = cCream;
      ctx.beginPath();
      ctx.arc(headX + 7, headY + 7, 8.5, 0, Math.PI * 2);
      ctx.arc(headX - 2, headY + 7, 8.0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      if (cfg.isHappy) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(headX + 7, headY - 1, 5.0, Math.PI * 1.15, Math.PI * 1.85);
        ctx.arc(headX - 2, headY - 1, 4.4, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();

        ctx.fillStyle = 'rgba(244, 114, 182, 0.7)';
        ctx.beginPath();
        ctx.ellipse(headX + 9.5, headY + 5.0, 4.8, 3.0, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.ellipse(headX + 6.5, headY - 3.0, 7.5, 8.5, 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = cEyeEmerald;
        ctx.beginPath();
        ctx.arc(headX + 7, headY - 3.0, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.ellipse(headX + 7.3, headY - 3.0, 2.8, 4.4, 0.05, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(headX + 5.2, headY - 5.5, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = cPinkNose;
      ctx.beginPath();
      ctx.moveTo(headX + 11.0, headY + 2.5);
      ctx.lineTo(headX + 13.5, headY + 5.0);
      ctx.lineTo(headX + 8.5, headY + 5.0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
      return c;
    }
  }

  // ==============================================================================
  // 🎮 GAME CONSTANTS & STATE
  // ==============================================================================
  const VIRTUAL_WIDTH = 840;
  const VIRTUAL_HEIGHT = 400;
  const GROUND_Y = 320;
  
  // Parabolic Physics Constants
  const GRAVITY = 1600;      // px/s^2
  const JUMP_FORCE = 680;    // initial upward velocity px/s
  const DOUBLE_JUMP_FORCE = 580;

  class CatRunnerGame {
    constructor() {
      this.canvas = document.getElementById('cat-runner-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.container = document.getElementById('cat-runner-game-container');
      this.sound = new SoundFx();

      // Sprite Frame Baker & Illustrated Asset Loader
      this.spriteBaker = new CatSpriteBaker(() => {
        this.render();
      });

      // UI Elements
      this.startScreen = document.getElementById('cat-start-screen');
      this.gameOverScreen = document.getElementById('cat-gameover-screen');
      this.scoreDisplay = document.getElementById('cat-score-text');
      this.distanceDisplay = document.getElementById('cat-distance-text');
      this.coinsDisplay = document.getElementById('cat-coins-text');
      this.bestScoreDisplay = document.getElementById('cat-best-text');
      this.muteBtn = document.getElementById('cat-mute-btn');
      this.startBtn = document.getElementById('cat-start-btn');
      this.restartBtn = document.getElementById('cat-restart-btn');
      
      // Game Over stats
      this.goDistance = document.getElementById('cat-go-distance');
      this.goScore = document.getElementById('cat-go-score');
      this.goCoins = document.getElementById('cat-go-coins');
      this.goNewBest = document.getElementById('cat-go-newbest');

      // State
      this.state = 'START';
      this.score = 0;
      this.distance = 0;
      this.coinsCollected = 0;
      this.fishCollected = 0;
      this.bestScore = parseInt(localStorage.getItem('cat_runner_best_score') || '0', 10);
      this.speed = 5.4;
      this.baseSpeed = 5.4;
      this.maxSpeed = 10.2;
      this.distanceTimer = 0;
      this.spawnTimer = 0;
      this.itemSpawnTimer = 0;
      this.lastTime = 0;
      this.animId = null;
      this.isVisible = true;

      // Parallax offsets
      this.skyOffset = 0;
      this.mountainsOffset = 0;
      this.treesOffset = 0;
      this.groundOffset = 0;

      // Entities
      this.cat = this.createCat();
      this.obstacles = [];
      this.items = [];
      this.particles = [];
      this.floatingTexts = [];
      this.sceneryClouds = [];
      this.sceneryMountains = [];
      this.sceneryTrees = [];
      this.sceneryFlowers = [];

      // Game Over 2-Legged Cat & Butterfly Animation State
      this.gameOverTimer = 0;
      this.butterfly = null;
      this.gameOverCat = null;

      this.initScenery();
      this.setupCanvas();
      this.bindEvents();
      this.updateHUD();
      this.updateMuteIcon();
      this.render();
    }

    createCat() {
      // 12 Run frames, 5 Jump frames, 5 Land frames
      const runFrames = [];
      for (let i = 0; i < 12; i++) {
        runFrames.push(`cat-run-${i.toString().padStart(2, '0')}`);
      }
      const jumpFrames = [];
      for (let i = 0; i < 5; i++) {
        jumpFrames.push(`cat-jump-${i.toString().padStart(2, '0')}`);
      }
      const landFrames = [];
      for (let i = 0; i < 5; i++) {
        landFrames.push(`cat-land-${i.toString().padStart(2, '0')}`);
      }

      return {
        x: 140,              // Anchored around 20%-25% from left side
        catY: 0,            // Height above ground
        velocityY: 0,
        isJumping: false,
        canDoubleJump: true,
        width: 84,
        height: 64,
        
        state: 'RUNNING',   // 'RUNNING', 'JUMPING', 'LANDING'
        runFrames: runFrames,
        jumpFrames: jumpFrames,
        landFrames: landFrames,
        currentRunFrameIndex: 0,
        currentLandFrameIndex: 0,
        animationTimer: 0,
        landProgress: 0,
        landingTimer: 0,
        
        happyTimer: 0,
        squashY: 1,
        stretchX: 1
      };
    }

    initScenery() {
      this.sceneryClouds = [
        { x: 60, y: 45, scale: 1.0, speed: 0.2 },
        { x: 280, y: 80, scale: 1.3, speed: 0.3 },
        { x: 540, y: 40, scale: 0.85, speed: 0.18 },
        { x: 760, y: 65, scale: 1.1, speed: 0.25 }
      ];

      this.sceneryMountains = [
        { x: 0, height: 140, width: 240 },
        { x: 190, height: 180, width: 280 },
        { x: 420, height: 150, width: 230 },
        { x: 610, height: 190, width: 300 },
        { x: 840, height: 160, width: 250 }
      ];

      this.sceneryTrees = [
        { x: 70, height: 85, type: 'tree' },
        { x: 230, height: 48, type: 'bush' },
        { x: 410, height: 95, type: 'tree' },
        { x: 600, height: 52, type: 'bush' },
        { x: 780, height: 90, type: 'tree' }
      ];

      this.sceneryFlowers = [
        { x: 40, color: '#f43f5e' },
        { x: 140, color: '#fbbf24' },
        { x: 280, color: '#38bdf8' },
        { x: 440, color: '#ec4899' },
        { x: 590, color: '#f59e0b' },
        { x: 740, color: '#a855f7' }
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

      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'Enter') {
          if (this.isSectionVisible()) {
            e.preventDefault();
            this.handleAction();
          }
        }
      });

      this.canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.sound.init();
        if (this.state === 'GAMEOVER') {
          // Play a cheerful, cute meow and spawn heart sparkles!
          this.sound.playMeow(true);
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = VIRTUAL_WIDTH / rect.width;
          const scaleY = VIRTUAL_HEIGHT / rect.height;
          const clickX = (e.clientX - rect.left) * scaleX;
          const clickY = (e.clientY - rect.top) * scaleY;
          this.spawnFloatingText('Meow! 💖', clickX, clickY - 15, '#f43f5e');
          for (let i = 0; i < 10; i++) {
            this.particles.push({
              x: clickX + (Math.random() - 0.5) * 20,
              y: clickY + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 3,
              vy: -2 - Math.random() * 3,
              radius: 2 + Math.random() * 3,
              color: Math.random() < 0.5 ? '#fda4af' : '#fde047',
              alpha: 1,
              decay: 0.03
            });
          }
        } else {
          this.handleAction();
        }
      });

      if (this.startBtn) {
        this.startBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.sound.init();
          this.startGame();
        });
      }

      if (this.restartBtn) {
        this.restartBtn.addEventListener('click', (e) => {
          e.stopPropagation();
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

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              this.isVisible = entry.isIntersecting;
              if (this.isVisible && (this.state === 'PLAYING' || this.state === 'GAMEOVER') && !this.animId) {
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
      this.muteBtn.setAttribute('title', this.sound.muted ? 'Unmute Sound' : 'Mute Sound');
    }

    handleAction() {
      if (this.state === 'START') {
        this.startGame();
      } else if (this.state === 'PLAYING') {
        this.jump();
      } else if (this.state === 'GAMEOVER') {
        this.startGame();
      }
    }

    startGame() {
      this.state = 'PLAYING';
      this.score = 0;
      this.distance = 0;
      this.coinsCollected = 0;
      this.fishCollected = 0;
      this.speed = this.baseSpeed;
      this.obstacles = [];
      this.items = [];
      this.particles = [];
      this.floatingTexts = [];
      this.spawnTimer = 70;
      this.itemSpawnTimer = 40;
      this.gameOverTimer = 0;
      this.butterfly = null;
      this.gameOverCat = null;
      this.cat = this.createCat();

      if (this.startScreen) this.startScreen.classList.add('hidden');
      if (this.gameOverScreen) this.gameOverScreen.classList.add('hidden');

      this.updateHUD();
      this.lastTime = performance.now();
      if (!this.animId) {
        this.loop();
      }
    }

    jump() {
      // SPACE pressed: Stop run animation, play cat_jump.png, apply upward physics & gravity
      if (!this.cat.isJumping) {
        this.cat.isJumping = true;
        this.cat.state = 'JUMPING';
        this.cat.landingTimer = 0;
        this.cat.velocityY = JUMP_FORCE;
        this.cat.canDoubleJump = true;
        this.cat.squashY = 1.25;
        this.cat.stretchX = 0.85;
        this.sound.playJump();
        this.spawnDust(this.cat.x + 20, GROUND_Y, 8, '#d1d5db');
      } else if (this.cat.canDoubleJump) {
        this.cat.velocityY = DOUBLE_JUMP_FORCE;
        this.cat.canDoubleJump = false;
        this.cat.squashY = 1.2;
        this.cat.stretchX = 0.88;
        this.sound.playJump();
        this.spawnDust(this.cat.x + 20, GROUND_Y - this.cat.catY + 30, 10, '#38bdf8');
      }
    }

    gameOver() {
      this.state = 'GAMEOVER';
      this.gameOverTimer = 0;

      const startCatX = Math.min(320, Math.max(160, this.cat.x));
      this.gameOverCat = {
        x: startCatX,
        targetX: 240,
        blinkTimer: 0,
        pawSparkleCooldown: 0
      };

      this.butterfly = {
        x: startCatX + 85,
        y: GROUND_Y - 95,
        wingAngle: 0,
        sparkleTimer: 0
      };

      this.sound.playHit();
      // Realistic, authentic Cat Meow sound upon game over
      setTimeout(() => {
        if (this.state === 'GAMEOVER') {
          this.sound.playMeow();
        }
      }, 280);

      this.spawnDust(this.cat.x + 25, GROUND_Y - this.cat.catY - 20, 25, '#f43f5e');

      const isNewBest = this.score > this.bestScore;
      if (isNewBest) {
        this.bestScore = this.score;
        localStorage.setItem('cat_runner_best_score', this.bestScore);
        this.sound.playBestScore();
        this.spawnConfetti();
      }

      if (this.goDistance) this.goDistance.textContent = `${Math.floor(this.distance)}m`;
      if (this.goScore) this.goScore.textContent = this.score.toLocaleString();
      if (this.goCoins) this.goCoins.textContent = (this.coinsCollected + this.fishCollected);
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

      try {
        window.dispatchEvent(new CustomEvent('cat_score_updated', {
          detail: { score: this.score, bestScore: this.bestScore, isNewBest: isNewBest }
        }));
      } catch (e) {}

      // Keep animation loop alive to render 2-legged standing cat & butterfly playing animation
      if (!this.animId) {
        this.loop();
      }
    }

    updateHUD() {
      if (this.scoreDisplay) this.scoreDisplay.textContent = this.score.toString().padStart(4, '0');
      if (this.distanceDisplay) this.distanceDisplay.textContent = `${Math.floor(this.distance)}m`;
      if (this.coinsDisplay) this.coinsDisplay.textContent = this.coinsCollected.toString().padStart(2, '0');
      if (this.bestScoreDisplay) this.bestScoreDisplay.textContent = this.bestScore.toString().padStart(4, '0');

      if (this.score >= 6000) {
        try {
          window.dispatchEvent(new CustomEvent('cat_score_updated', {
            detail: { score: this.score, bestScore: Math.max(this.score, this.bestScore) }
          }));
        } catch (e) {}
      }
    }

    spawnDust(x, y, count = 5, color = '#e2e8f0') {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 6,
          vx: -(this.speed * 0.4) + (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.7) * 2.5,
          radius: 2 + Math.random() * 3.5,
          color: color,
          alpha: 0.8,
          decay: 0.03 + Math.random() * 0.03
        });
      }
    }

    spawnConfetti() {
      const colors = ['#f43f5e', '#fbbf24', '#00f5d4', '#818cf8', '#10b981', '#fb7185'];
      for (let i = 0; i < 60; i++) {
        this.particles.push({
          x: VIRTUAL_WIDTH / 2 + (Math.random() - 0.5) * 300,
          y: VIRTUAL_HEIGHT / 2 + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 8,
          vy: -4 - Math.random() * 6,
          radius: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015,
          gravity: 0.2
        });
      }
    }

    spawnFloatingText(text, x, y, color = '#fbbf24') {
      this.floatingTexts.push({
        text,
        x,
        y,
        color,
        alpha: 1,
        vy: -1.4
      });
    }

    loop(timestamp = performance.now()) {
      if (!this.isVisible && this.state !== 'PLAYING' && this.state !== 'GAMEOVER') {
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
      if (this.state === 'GAMEOVER') {
        this.updateGameOverAnimation(dt);
        return;
      }

      if (this.state !== 'PLAYING') return;

      this.distance += this.speed * 0.05;
      this.score += Math.round(this.speed * 0.08);
      this.speed = Math.min(this.baseSpeed + (this.distance * 0.0035), this.maxSpeed);

      this.distanceTimer++;
      if (this.distanceTimer % 10 === 0) {
        this.updateHUD();
      }

      // 1. Jump Physics & Landing Detection
      if (this.cat.isJumping) {
        this.cat.state = 'JUMPING';
        this.cat.velocityY -= GRAVITY * dt;
        this.cat.catY += this.cat.velocityY * dt;

        // Detect landing
        if (this.cat.catY <= 0) {
          this.cat.catY = 0;
          this.cat.velocityY = 0;
          this.cat.isJumping = false;
          this.cat.state = 'LANDING';
          this.cat.landProgress = 0;
          this.cat.landingTimer = 0.22; // Play 5 land frames sequence over ~0.22s
          this.cat.currentLandFrameIndex = 0;
          this.cat.squashY = 0.82;
          this.cat.stretchX = 1.18;
          this.spawnDust(this.cat.x + 20, GROUND_Y, 7, '#cbd5e1');
        }
      }

      // 2. Landing Sequence Recovery
      if (this.cat.state === 'LANDING') {
        this.cat.landingTimer -= dt;
        this.cat.landProgress += dt / 0.22;
        this.cat.currentLandFrameIndex = Math.min(4, Math.floor(this.cat.landProgress * 5));

        // When land animation completes once -> immediately return to cat_run.png
        if (this.cat.landingTimer <= 0) {
          this.cat.state = 'RUNNING';
          this.cat.landingTimer = 0;
        }
      }

      // 3. Default Running State (Seamless 12-Frame Continuous Loop)
      if (this.cat.state === 'RUNNING' && !this.cat.isJumping) {
        this.cat.animationTimer += dt;
        const fps = 14 * (this.speed / this.baseSpeed);
        const frameDuration = 1 / fps;

        if (this.cat.animationTimer >= frameDuration) {
          this.cat.animationTimer -= frameDuration;
          this.cat.currentRunFrameIndex = (this.cat.currentRunFrameIndex + 1) % this.cat.runFrames.length;
        }

        if (Math.random() < 0.25) {
          this.spawnDust(this.cat.x + 10, GROUND_Y, 2, '#94a3b8');
        }
      }

      this.cat.squashY += (1 - this.cat.squashY) * 0.18;
      this.cat.stretchX += (1 - this.cat.stretchX) * 0.18;

      if (this.cat.happyTimer > 0) this.cat.happyTimer -= dt;

      if (!this.cat.isJumping && Math.random() < 0.25) {
        this.spawnDust(this.cat.x + 10, GROUND_Y, 2, '#94a3b8');
      }

      // Parallax updates
      this.skyOffset += this.speed * 0.05;
      this.mountainsOffset += this.speed * 0.15;
      this.treesOffset += this.speed * 0.45;
      this.groundOffset = (this.groundOffset + this.speed) % 40;

      // Spawning Obstacles
      this.spawnTimer--;
      if (this.spawnTimer <= 0) {
        this.spawnObstacle();
        const minGap = Math.max(55, 95 - (this.speed * 4));
        const maxGap = Math.max(85, 150 - (this.speed * 5));
        this.spawnTimer = Math.floor(minGap + Math.random() * (maxGap - minGap));
      }

      // Spawning Collectibles
      this.itemSpawnTimer--;
      if (this.itemSpawnTimer <= 0) {
        this.spawnItemPattern();
        this.itemSpawnTimer = Math.floor(45 + Math.random() * 70);
      }

      // Update Obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= this.speed;

        if (obs.type === 'bird') {
          obs.wingTimer = (obs.wingTimer || 0) + 0.25;
          obs.y += Math.sin(obs.wingTimer) * 0.8;
        }

        if (this.checkCollision(this.cat, obs)) {
          this.gameOver();
          return;
        }

        if (obs.x + obs.width < -50) {
          this.obstacles.splice(i, 1);
        }
      }

      // Update Collectibles
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        item.x -= this.speed;
        item.floatTimer = (item.floatTimer || 0) + 0.1;

        if (this.checkItemCollision(this.cat, item)) {
          if (item.type === 'coin') {
            this.score += 25;
            this.coinsCollected++;
            this.sound.playCoin();
            this.spawnFloatingText('+25', item.x, item.y, '#fbbf24');
            this.spawnDust(item.x, item.y, 8, '#fbbf24');
          } else if (item.type === 'fish') {
            this.score += 100;
            this.fishCollected++;
            this.sound.playFish();
            this.spawnFloatingText('🐟 ✨ +100', item.x, item.y - 8, '#38bdf8');
            this.spawnDust(item.x, item.y, 16, '#38bdf8');
            this.cat.happyTimer = 0.45;
            this.cat.squashY = 1.22;
            this.cat.stretchX = 0.84;
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

    updateGameOverAnimation(dt) {
      this.gameOverTimer += dt;
      const t = this.gameOverTimer;

      if (!this.gameOverCat) {
        this.gameOverCat = { x: 240, targetX: 240, blinkTimer: 0, pawSparkleCooldown: 0 };
      }
      if (!this.butterfly) {
        this.butterfly = { x: 330, y: GROUND_Y - 95, wingAngle: 0, sparkleTimer: 0 };
      }

      // Smoothly center the standing cat
      this.gameOverCat.x += (this.gameOverCat.targetX - this.gameOverCat.x) * 0.08;
      const cx = this.gameOverCat.x;

      // Update butterfly floating & swooping physics (smooth Lissajous and organic curves)
      this.butterfly.x = cx + 85 + Math.sin(t * 1.6) * 48 + Math.cos(t * 0.7) * 20;
      this.butterfly.y = (GROUND_Y - 80) - Math.abs(Math.sin(t * 2.0)) * 58 - Math.cos(t * 1.2) * 16;
      this.butterfly.wingAngle = Math.sin(t * 26) * 0.85;

      // Butterfly magical sparkle trail
      this.butterfly.sparkleTimer = (this.butterfly.sparkleTimer || 0) + dt;
      if (this.butterfly.sparkleTimer > 0.07) {
        this.butterfly.sparkleTimer = 0;
        this.particles.push({
          x: this.butterfly.x + (Math.random() - 0.5) * 10,
          y: this.butterfly.y + 4 + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.4,
          vy: -0.6 - Math.random() * 1.4,
          radius: 1.5 + Math.random() * 2.4,
          color: Math.random() < 0.4 ? '#38bdf8' : Math.random() < 0.7 ? '#fde047' : '#ec4899',
          alpha: 0.95,
          decay: 0.035
        });
      }

      // Paw batting proximity detection with butterfly
      const pawLTargetX = cx + 16 + Math.sin(t * 4.4) * 22;
      const pawLTargetY = GROUND_Y - 138 + Math.sin(t * 3.6) * 3 + Math.cos(t * 4.4) * 20;
      const pawRTargetX = cx + 46 + Math.sin(t * 4.4 + 1.8) * 24;
      const pawRTargetY = GROUND_Y - 152 + Math.sin(t * 3.6) * 3 + Math.cos(t * 4.4 + 1.8) * 22;

      const distL = Math.hypot(this.butterfly.x - pawLTargetX, this.butterfly.y - pawLTargetY);
      const distR = Math.hypot(this.butterfly.x - pawRTargetX, this.butterfly.y - pawRTargetY);

      this.gameOverCat.pawSparkleCooldown = Math.max(0, (this.gameOverCat.pawSparkleCooldown || 0) - dt);

      if ((distL < 38 || distR < 38) && this.gameOverCat.pawSparkleCooldown <= 0) {
        this.gameOverCat.pawSparkleCooldown = 0.5;
        const hitX = distL < distR ? pawLTargetX : pawRTargetX;
        const hitY = distL < distR ? pawLTargetY : pawRTargetY;
        
        this.spawnFloatingText(Math.random() < 0.5 ? '💖' : '✨', hitX, hitY - 12, '#f43f5e');
        for (let i = 0; i < 7; i++) {
          this.particles.push({
            x: hitX + (Math.random() - 0.5) * 14,
            y: hitY + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 2.8,
            vy: -1.6 - Math.random() * 2.2,
            radius: 1.8 + Math.random() * 2.6,
            color: Math.random() < 0.5 ? '#fda4af' : '#fde047',
            alpha: 1,
            decay: 0.03
          });
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
      const types = ['crate', 'rock', 'bush', 'puddle', 'bird'];
      const availableTypes = this.distance > 80 ? types : ['crate', 'rock', 'bush', 'puddle'];
      const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];

      let obs = {
        type: type,
        x: VIRTUAL_WIDTH + 50,
        y: GROUND_Y,
        width: 38,
        height: 38
      };

      if (type === 'crate') {
        obs.width = 38;
        obs.height = 38;
        obs.y = GROUND_Y - 38;
      } else if (type === 'rock') {
        obs.width = 34;
        obs.height = 24;
        obs.y = GROUND_Y - 24;
      } else if (type === 'bush') {
        obs.width = 42;
        obs.height = 32;
        obs.y = GROUND_Y - 32;
      } else if (type === 'puddle') {
        obs.width = 48;
        obs.height = 12;
        obs.y = GROUND_Y - 8;
      } else if (type === 'bird') {
        obs.width = 32;
        obs.height = 22;
        obs.y = GROUND_Y - (75 + Math.random() * 45);
        obs.wingTimer = Math.random() * Math.PI;
      }

      this.obstacles.push(obs);
    }

    spawnItemPattern() {
      const type = Math.random() < 0.25 ? 'fish' : 'coin';
      const count = type === 'fish' ? 1 : Math.floor(2 + Math.random() * 3);
      const isArc = Math.random() < 0.5;
      const baseHeight = isArc ? GROUND_Y - 95 : GROUND_Y - 45;

      for (let i = 0; i < count; i++) {
        const item = {
          type: type,
          x: VIRTUAL_WIDTH + 60 + (i * 32),
          y: isArc ? baseHeight - Math.sin((i / (count - 1 || 1)) * Math.PI) * 35 : baseHeight,
          width: type === 'fish' ? 30 : 22,
          height: type === 'fish' ? 22 : 22,
          floatTimer: i * 0.4
        };
        this.items.push(item);
      }
    }

    checkCollision(cat, obs) {
      const catBox = {
        x: cat.x + 14,
        y: (GROUND_Y - cat.height - cat.catY) + 10,
        width: cat.width - 24,
        height: cat.height - 14
      };
      const obsBox = {
        x: obs.x + 4,
        y: obs.y + 4,
        width: obs.width - 8,
        height: obs.height - 8
      };
      return (
        catBox.x < obsBox.x + obsBox.width &&
        catBox.x + catBox.width > obsBox.x &&
        catBox.y < obsBox.y + obsBox.height &&
        catBox.y + catBox.height > obsBox.y
      );
    }

    checkItemCollision(cat, item) {
      const catBox = {
        x: cat.x + 8,
        y: GROUND_Y - cat.height - cat.catY,
        width: cat.width - 12,
        height: cat.height
      };
      return (
        catBox.x < item.x + item.width &&
        catBox.x + catBox.width > item.x &&
        catBox.y < item.y + item.height &&
        catBox.y + catBox.height > item.y
      );
    }

    // ==============================================================================
    // 🎨 CANVAS RENDERING PIPELINE
    // ==============================================================================
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      this.drawSky(ctx);
      this.drawMountains(ctx);
      this.drawTrees(ctx);
      this.drawGround(ctx);

      if (this.state === 'GAMEOVER') {
        this.drawObstacles(ctx);
        this.drawGameOverCatPlaying(ctx);
        this.drawParticles(ctx);
        this.drawFloatingTexts(ctx);
        this.drawVignette(ctx);
        return;
      }

      this.drawObstacles(ctx);
      this.drawItems(ctx);
      this.drawCat(ctx);
      this.drawParticles(ctx);
      this.drawFloatingTexts(ctx);
      this.drawVignette(ctx);
    }

    drawSky(ctx) {
      ctx.save();
      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(0.45, '#7dd3fc');
      skyGrad.addColorStop(0.85, '#bae6fd');
      skyGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, GROUND_Y);

      // Sun
      const sunGrad = ctx.createRadialGradient(720, 65, 4, 720, 65, 42);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.25, '#fef08a');
      sunGrad.addColorStop(0.6, '#fde047');
      sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(720, 65, 42, 0, Math.PI * 2);
      ctx.fill();

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      this.sceneryClouds.forEach((cloud) => {
        const cx = (cloud.x - this.skyOffset * cloud.speed) % (VIRTUAL_WIDTH + 160) - 80;
        const cy = cloud.y;
        const s = cloud.scale;

        ctx.beginPath();
        ctx.arc(cx, cy, 20 * s, 0, Math.PI * 2);
        ctx.arc(cx + 18 * s, cy - 9 * s, 25 * s, 0, Math.PI * 2);
        ctx.arc(cx + 40 * s, cy, 18 * s, 0, Math.PI * 2);
        ctx.arc(cx + 22 * s, cy + 7 * s, 20 * s, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    drawMountains(ctx) {
      ctx.save();
      const offset = this.mountainsOffset % 600;

      for (let pass = 0; pass < 3; pass++) {
        const startX = pass * 600 - offset;
        this.sceneryMountains.forEach((m) => {
          const mx = startX + m.x;

          const mGrad = ctx.createLinearGradient(mx, GROUND_Y - m.height, mx, GROUND_Y);
          mGrad.addColorStop(0, '#60a5fa');
          mGrad.addColorStop(0.6, '#93c5fd');
          mGrad.addColorStop(1, '#86efac');

          ctx.fillStyle = mGrad;
          ctx.beginPath();
          ctx.moveTo(mx - m.width / 2, GROUND_Y);
          ctx.lineTo(mx, GROUND_Y - m.height);
          ctx.lineTo(mx + m.width / 2, GROUND_Y);
          ctx.closePath();
          ctx.fill();
        });
      }

      // Windmill
      const windmillX = ((560 - this.mountainsOffset * 0.6) % (VIRTUAL_WIDTH + 200)) - 50;
      const windmillY = GROUND_Y - 75;

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(windmillX - 12, GROUND_Y);
      ctx.lineTo(windmillX - 6, windmillY);
      ctx.lineTo(windmillX + 6, windmillY);
      ctx.lineTo(windmillX + 12, GROUND_Y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.moveTo(windmillX - 8, windmillY);
      ctx.lineTo(windmillX, windmillY - 12);
      ctx.lineTo(windmillX + 8, windmillY);
      ctx.closePath();
      ctx.fill();

      // Windmill Blades
      const bladeRot = performance.now() * 0.0015;
      ctx.save();
      ctx.translate(windmillX, windmillY);
      ctx.rotate(bladeRot);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.2;
      for (let b = 0; b < 4; b++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -36);
        ctx.stroke();
        ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
        ctx.fillRect(2, -34, 7, 20);
      }
      ctx.restore();
      ctx.restore();
    }

    drawTrees(ctx) {
      ctx.save();
      const offset = this.treesOffset % 500;

      for (let pass = 0; pass < 3; pass++) {
        const startX = pass * 500 - offset;

        // Cottage House
        const houseX = startX + 340;
        if (houseX > -80 && houseX < VIRTUAL_WIDTH + 80) {
          ctx.fillStyle = '#fef3c7';
          ctx.fillRect(houseX - 18, GROUND_Y - 30, 36, 30);
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(houseX - 18, GROUND_Y - 30, 36, 30);

          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.moveTo(houseX - 22, GROUND_Y - 30);
          ctx.lineTo(houseX, GROUND_Y - 48);
          ctx.lineTo(houseX + 22, GROUND_Y - 30);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(houseX - 10, GROUND_Y - 22, 8, 8);
          ctx.fillRect(houseX + 2, GROUND_Y - 22, 8, 8);
        }

        // Trees & Bushes
        this.sceneryTrees.forEach((t) => {
          const tx = startX + t.x;
          if (tx < -60 || tx > VIRTUAL_WIDTH + 60) return;

          if (t.type === 'tree') {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(tx - 5, GROUND_Y - t.height, 10, t.height);

            ctx.fillStyle = '#16a34a';
            ctx.beginPath();
            ctx.arc(tx, GROUND_Y - t.height - 10, 24, 0, Math.PI * 2);
            ctx.arc(tx - 14, GROUND_Y - t.height + 4, 18, 0, Math.PI * 2);
            ctx.arc(tx + 14, GROUND_Y - t.height + 4, 18, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(tx - 4, GROUND_Y - t.height - 12, 16, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.arc(tx, GROUND_Y - 14, 16, 0, Math.PI * 2);
            ctx.arc(tx - 10, GROUND_Y - 8, 12, 0, Math.PI * 2);
            ctx.arc(tx + 10, GROUND_Y - 8, 12, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Wooden Split-Rail Fence
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(startX + 40, GROUND_Y - 14);
        ctx.lineTo(startX + 180, GROUND_Y - 14);
        ctx.moveTo(startX + 40, GROUND_Y - 7);
        ctx.lineTo(startX + 180, GROUND_Y - 7);
        ctx.stroke();

        for (let fx = startX + 45; fx <= startX + 175; fx += 25) {
          ctx.fillStyle = '#d97706';
          ctx.fillRect(fx - 2, GROUND_Y - 20, 4, 20);
        }
      }
      ctx.restore();
    }

    drawGround(ctx) {
      ctx.save();
      const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, VIRTUAL_HEIGHT);
      groundGrad.addColorStop(0, '#22c55e');
      groundGrad.addColorStop(0.08, '#16a34a');
      groundGrad.addColorStop(0.18, '#d97706');
      groundGrad.addColorStop(0.35, '#b45309');
      groundGrad.addColorStop(0.7, '#78350f');
      groundGrad.addColorStop(1, '#451a03');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, GROUND_Y, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - GROUND_Y);

      // Scalloped Green Grass Turf Edge
      ctx.fillStyle = '#4ade80';
      const scallopSize = 16;
      const numScallops = Math.ceil(VIRTUAL_WIDTH / scallopSize) + 2;
      const gOffset = this.groundOffset % scallopSize;

      ctx.beginPath();
      ctx.moveTo(-scallopSize, GROUND_Y);
      for (let i = -1; i < numScallops; i++) {
        const sx = i * scallopSize - gOffset;
        ctx.quadraticCurveTo(sx + scallopSize / 2, GROUND_Y + 7, sx + scallopSize, GROUND_Y);
      }
      ctx.lineTo(VIRTUAL_WIDTH + 20, GROUND_Y - 4);
      ctx.lineTo(-20, GROUND_Y - 4);
      ctx.closePath();
      ctx.fill();

      // Flowers
      this.sceneryFlowers.forEach((f) => {
        const fx = (f.x - this.groundOffset * 2.5) % (VIRTUAL_WIDTH + 80) - 30;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(fx, GROUND_Y + 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(fx, GROUND_Y + 8, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // ==============================================================================
    // 🐱 SPRITE CAT RENDERING & SHADOW
    // ==============================================================================
    drawCat(ctx) {
      const cat = this.cat;

      // 1. Dynamic Contact Ground Shadow
      const shadowCenterX = cat.x + cat.width / 2;
      const shadowY = GROUND_Y + 3;
      const heightRatio = Math.min(1, Math.max(0, cat.catY / 220));
      const shadowScale = Math.max(0.35, 1.0 - heightRatio * 0.60);
      const shadowAlpha = Math.max(0.10, 0.40 - heightRatio * 0.30);

      ctx.save();
      ctx.fillStyle = `rgba(15, 23, 42, ${shadowAlpha})`;
      ctx.beginPath();
      ctx.ellipse(shadowCenterX, shadowY, 26 * shadowScale, 6.0 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Select discrete sprite frame
      let frameKey = 'cat-run-00';

      if (this.state === 'GAMEOVER') {
        frameKey = 'cat-gameover';
      } else if (cat.happyTimer > 0) {
        frameKey = 'cat-happy';
      } else if (cat.state === 'LANDING' || cat.landingTimer > 0) {
        const landIdx = Math.min(4, Math.max(0, cat.currentLandFrameIndex || 0));
        frameKey = cat.landFrames[landIdx] || 'cat-land-00';
      } else if (cat.isJumping || cat.state === 'JUMPING') {
        if (cat.velocityY > 400) {
          frameKey = 'cat-jump-00'; // Takeoff push
        } else if (cat.velocityY > 80) {
          frameKey = 'cat-jump-01'; // Ascending
        } else if (cat.velocityY > -220) {
          frameKey = 'cat-jump-02'; // Apex / peak float
        } else if (cat.velocityY > -520) {
          frameKey = 'cat-jump-03'; // Descending
        } else {
          frameKey = 'cat-jump-04'; // Pre-land reach
        }
      } else if (this.state === 'START') {
        frameKey = 'cat-idle';
      } else {
        frameKey = cat.runFrames[cat.currentRunFrameIndex] || 'cat-run-00';
      }

      const spriteAsset = this.spriteBaker.sprites[frameKey] || this.spriteBaker.sprites['cat-run-00'];

      if (spriteAsset) {
        ctx.save();

        const scale = 0.315;
        const nativeW = spriteAsset.naturalWidth || spriteAsset.width || 290;
        const nativeH = spriteAsset.naturalHeight || spriteAsset.height || 220;
        const spriteW = nativeW * scale;
        const spriteH = nativeH * scale;

        const drawCenterX = cat.x + cat.width / 2;
        const drawBottomY = GROUND_Y - cat.catY;
        const renderX = drawCenterX - spriteW / 2;
        const renderY = drawBottomY - spriteH + (4 * scale);

        // Squash & Stretch rooted at bottom contact point
        ctx.translate(drawCenterX, drawBottomY);
        ctx.scale(cat.stretchX, cat.squashY);
        ctx.translate(-drawCenterX, -drawBottomY);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(spriteAsset, renderX, renderY, spriteW, spriteH);

        ctx.restore();
      }
    }

    // ==============================================================================
    // 🦋 GAME OVER 2-LEGGED STANDING CAT & BUTTERFLY PLAYING ANIMATION
    // ==============================================================================
    drawGameOverCatPlaying(ctx) {
      const catX = (this.gameOverCat && this.gameOverCat.x) ? this.gameOverCat.x : 240;
      const groundY = GROUND_Y;
      const t = this.gameOverTimer || 0;
      const bodyBob = Math.sin(t * 3.6) * 3;
      const breath = Math.sin(t * 2.2) * 1.5;
      const bfly = this.butterfly || { x: catX + 90, y: groundY - 110, wingAngle: 0 };

      // 1. Soft Contact Shadows beneath 2 standing feet
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
      ctx.beginPath();
      ctx.ellipse(catX - 16, groundY + 3, 16, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(catX + 16, groundY + 3, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shadow beneath tail tip
      const tailTipX = catX - 60 + Math.sin(t * 2.6) * 16;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
      ctx.beginPath();
      ctx.ellipse(tailTipX, groundY + 3, 10, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Animated Swaying Tabby Tail
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const tailBaseX = catX - 18;
      const tailBaseY = groundY - 40 + bodyBob;
      const tailCp1X = catX - 45 + Math.sin(t * 2.2) * 8;
      const tailCp1Y = groundY - 18;
      const tailCp2X = catX - 70 + Math.sin(t * 2.6) * 14;
      const tailCp2Y = groundY - 48;
      const tailEndX = catX - 58 + Math.sin(t * 3.0) * 18;
      const tailEndY = groundY - 72 + Math.cos(t * 3.0) * 10;

      // Tail base stroke
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 13;
      ctx.beginPath();
      ctx.moveTo(tailBaseX, tailBaseY);
      ctx.bezierCurveTo(tailCp1X, tailCp1Y, tailCp2X, tailCp2Y, tailEndX, tailEndY);
      ctx.stroke();

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(tailBaseX, tailBaseY);
      ctx.bezierCurveTo(tailCp1X, tailCp1Y, tailCp2X, tailCp2Y, tailEndX, tailEndY);
      ctx.stroke();

      // Tail stripes & cream tip
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(tailEndX, tailEndY, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Two Standing Hind Legs & Feet (Standing firmly on 2 feet)
      ctx.save();
      // Left Hind Leg
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(catX - 26, groundY - 48 + bodyBob);
      ctx.quadraticCurveTo(catX - 32, groundY - 24, catX - 28, groundY - 8);
      ctx.lineTo(catX - 8, groundY - 8);
      ctx.quadraticCurveTo(catX - 14, groundY - 32, catX - 12, groundY - 48 + bodyBob);
      ctx.closePath();
      ctx.fill();

      // Left Foot (Planted on ground)
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(catX - 20, groundY - 4, 15, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Left Pink Toe Beans
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.arc(catX - 28, groundY - 3, 2.6, 0, Math.PI * 2);
      ctx.arc(catX - 22, groundY - 6, 2.6, 0, Math.PI * 2);
      ctx.arc(catX - 16, groundY - 6, 2.6, 0, Math.PI * 2);
      ctx.arc(catX - 10, groundY - 3, 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Right Hind Leg
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(catX + 12, groundY - 48 + bodyBob);
      ctx.quadraticCurveTo(catX + 14, groundY - 32, catX + 8, groundY - 8);
      ctx.lineTo(catX + 28, groundY - 8);
      ctx.quadraticCurveTo(catX + 32, groundY - 24, catX + 26, groundY - 48 + bodyBob);
      ctx.closePath();
      ctx.fill();

      // Right Foot (Planted on ground)
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(catX + 20, groundY - 4, 15, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Right Pink Toe Beans
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.arc(catX + 10, groundY - 3, 2.6, 0, Math.PI * 2);
      ctx.arc(catX + 16, groundY - 6, 2.6, 0, Math.PI * 2);
      ctx.arc(catX + 22, groundY - 6, 2.6, 0, Math.PI * 2);
      ctx.arc(catX + 28, groundY - 3, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Standing Fluffy Body / Torso
      ctx.save();
      const torsoY = groundY - 50 + bodyBob;
      const torsoTopY = groundY - 110 + bodyBob;

      // Main Torso Gradient
      const bodyGrad = ctx.createLinearGradient(catX - 30, torsoTopY, catX + 30, torsoY);
      bodyGrad.addColorStop(0, '#fb923c');
      bodyGrad.addColorStop(0.5, '#f97316');
      bodyGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = bodyGrad;

      ctx.beginPath();
      ctx.moveTo(catX - 22, torsoTopY + 12);
      ctx.quadraticCurveTo(catX - 30 - breath, torsoTopY + 38, catX - 26, torsoY + 4);
      ctx.quadraticCurveTo(catX, torsoY + 10, catX + 26, torsoY + 4);
      ctx.quadraticCurveTo(catX + 30 + breath, torsoTopY + 38, catX + 22, torsoTopY + 12);
      ctx.closePath();
      ctx.fill();

      // Tabby Body Stripes
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(catX - 26, torsoTopY + 28);
      ctx.lineTo(catX - 15, torsoTopY + 32);
      ctx.moveTo(catX - 27, torsoTopY + 44);
      ctx.lineTo(catX - 16, torsoTopY + 48);
      ctx.moveTo(catX + 26, torsoTopY + 28);
      ctx.lineTo(catX + 15, torsoTopY + 32);
      ctx.moveTo(catX + 27, torsoTopY + 44);
      ctx.lineTo(catX + 16, torsoTopY + 48);
      ctx.stroke();

      // Soft Fluffy Cream Belly / Bib
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.ellipse(catX, torsoTopY + 42, 17 + breath, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fluffy Chest Tuft
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(catX, torsoTopY + 22, 12, 0, Math.PI * 2);
      ctx.arc(catX - 7, torsoTopY + 26, 9, 0, Math.PI * 2);
      ctx.arc(catX + 7, torsoTopY + 26, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Head & Facial Expressions
      ctx.save();
      const headCenterY = groundY - 118 + bodyBob;
      const headCenterX = catX + 2;

      // Head Tilting towards Butterfly
      const angleToBfly = Math.atan2(bfly.y - headCenterY, bfly.x - headCenterX);
      const headAngle = Math.max(-0.4, Math.min(0.4, (angleToBfly + 0.3) * 0.55));

      ctx.translate(headCenterX, headCenterY);
      ctx.rotate(headAngle);

      // Cute Triangular Ears
      // Left Ear
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(-22, -14);
      ctx.lineTo(-32, -42);
      ctx.lineTo(-6, -26);
      ctx.closePath();
      ctx.fill();
      // Left Inner Ear (Pink)
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.moveTo(-20, -17);
      ctx.lineTo(-28, -38);
      ctx.lineTo(-8, -26);
      ctx.closePath();
      ctx.fill();
      // Ear fluff
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-13, -22, 4, 0, Math.PI * 2);
      ctx.fill();

      // Right Ear
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(6, -26);
      ctx.lineTo(32, -42);
      ctx.lineTo(22, -14);
      ctx.closePath();
      ctx.fill();
      // Right Inner Ear (Pink)
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.moveTo(8, -26);
      ctx.lineTo(28, -38);
      ctx.lineTo(20, -17);
      ctx.closePath();
      ctx.fill();
      // Ear fluff
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(13, -22, 4, 0, Math.PI * 2);
      ctx.fill();

      // Head Base Shape
      const headGrad = ctx.createRadialGradient(0, -2, 6, 0, 0, 30);
      headGrad.addColorStop(0, '#fb923c');
      headGrad.addColorStop(0.8, '#f97316');
      headGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = headGrad;

      ctx.beginPath();
      ctx.ellipse(0, -2, 27, 23, 0, 0, Math.PI * 2);
      ctx.fill();

      // Chubby Cheeks
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.ellipse(-18, 5, 11, 9, -0.2, 0, Math.PI * 2);
      ctx.ellipse(18, 5, 11, 9, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Tabby Forehead "M" marking
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-8, -19);
      ctx.lineTo(-4, -10);
      ctx.lineTo(0, -17);
      ctx.lineTo(4, -10);
      ctx.lineTo(8, -19);
      ctx.stroke();

      // Eyes Tracking Butterfly
      const isBlink = (t % 3.5) < 0.18;
      const eyeL = { x: -11, y: -4 };
      const eyeR = { x: 11, y: -4 };

      // Eye offset towards butterfly
      const eyeLookX = Math.max(-2.5, Math.min(3.5, (bfly.x - headCenterX) * 0.035));
      const eyeLookY = Math.max(-3.5, Math.min(2.5, (bfly.y - headCenterY) * 0.035));

      if (isBlink) {
        // Cute happy closed eye curves ^ ^
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(eyeL.x, eyeL.y, 6, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(eyeR.x, eyeR.y, 6, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      } else {
        // Large Expressive Eyes (Emerald Green with golden ring)
        [eyeL, eyeR].forEach(eye => {
          // Sclera / Eye Base
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(eye.x, eye.y, 7.5, 8.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Iris (Emerald Green)
          const irisGrad = ctx.createRadialGradient(eye.x + eyeLookX, eye.y + eyeLookY, 1, eye.x, eye.y, 6);
          irisGrad.addColorStop(0, '#34d399');
          irisGrad.addColorStop(0.6, '#10b981');
          irisGrad.addColorStop(1, '#047857');
          ctx.fillStyle = irisGrad;
          ctx.beginPath();
          ctx.arc(eye.x + eyeLookX * 0.8, eye.y + eyeLookY * 0.8, 5.8, 0, Math.PI * 2);
          ctx.fill();

          // Pupil (Dilated & Focused on Butterfly)
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.ellipse(eye.x + eyeLookX, eye.y + eyeLookY, 3.2, 4.4, 0.05, 0, Math.PI * 2);
          ctx.fill();

          // Specular Highlights (Sparkling eyes ✨)
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(eye.x + eyeLookX - 1.5, eye.y + eyeLookY - 2.0, 2.0, 0, Math.PI * 2);
          ctx.arc(eye.x + eyeLookX + 1.8, eye.y + eyeLookY + 1.5, 1.1, 0, Math.PI * 2);
          ctx.fill();

          // Upper Eyelash line
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(eye.x, eye.y - 1, 8, Math.PI * 1.2, Math.PI * 1.8);
          ctx.stroke();
        });
      }

      // Cute Pink Button Nose
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo(-3.5, 1.5);
      ctx.lineTo(3.5, 1.5);
      ctx.closePath();
      ctx.fill();

      // Open Playful / Meowing Smile (showing tiny pink tongue)
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(0, 7.5, 4.8, 0, Math.PI);
      ctx.fill();
      // Tiny tongue
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.arc(0, 9.2, 3.0, 0, Math.PI);
      ctx.fill();

      // Mouth outline "3" shape
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(-2.6, 5.8, 3.2, 0.2, Math.PI * 0.95);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.6, 5.8, 3.2, 0.05, Math.PI * 0.8);
      ctx.stroke();

      // Whiskers (6 Long white whiskers twitching)
      const whiskerWiggle = Math.sin(t * 8) * 1.2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 1.2;
      // Left Whiskers
      ctx.beginPath();
      ctx.moveTo(-9, 4); ctx.lineTo(-32, 2 + whiskerWiggle);
      ctx.moveTo(-9, 6); ctx.lineTo(-34, 7);
      ctx.moveTo(-9, 8); ctx.lineTo(-30, 12 - whiskerWiggle);
      // Right Whiskers
      ctx.moveTo(9, 4); ctx.lineTo(32, 2 - whiskerWiggle);
      ctx.moveTo(9, 6); ctx.lineTo(34, 7);
      ctx.moveTo(9, 8); ctx.lineTo(30, 12 + whiskerWiggle);
      ctx.stroke();

      ctx.restore();

      // 6. Two Front Paws Reaching & Batting at Butterfly ("hat diye dhorar chesta")
      ctx.save();
      // Left Front Paw (Swiping upward & forward)
      const pawLShoulderX = catX - 18;
      const pawLShoulderY = torsoTopY + 16;
      const pawLTargetX = catX + 16 + Math.sin(t * 4.4) * 22;
      const pawLTargetY = groundY - 138 + bodyBob + Math.cos(t * 4.4) * 20;

      // Forearm Arm
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 11;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pawLShoulderX, pawLShoulderY);
      ctx.quadraticCurveTo(catX - 6, pawLTargetY + 20, pawLTargetX, pawLTargetY);
      ctx.stroke();

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 8.5;
      ctx.beginPath();
      ctx.moveTo(pawLShoulderX, pawLShoulderY);
      ctx.quadraticCurveTo(catX - 6, pawLTargetY + 20, pawLTargetX, pawLTargetY);
      ctx.stroke();

      // Left Paw Ball & Pink Toe Beans 🐾
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(pawLTargetX, pawLTargetY, 7.5, 0, Math.PI * 2);
      ctx.fill();
      // Pink Paw Pad
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(pawLTargetX + 0.5, pawLTargetY + 0.5, 3.4, 0, Math.PI * 2);
      ctx.fill();
      // 3 Pink Toe beans
      ctx.beginPath();
      ctx.arc(pawLTargetX - 4.5, pawLTargetY - 4.5, 1.8, 0, Math.PI * 2);
      ctx.arc(pawLTargetX, pawLTargetY - 6.5, 1.8, 0, Math.PI * 2);
      ctx.arc(pawLTargetX + 4.5, pawLTargetY - 4.5, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Right Front Paw (Alternate reach towards butterfly)
      const pawRShoulderX = catX + 18;
      const pawRShoulderY = torsoTopY + 16;
      const pawRTargetX = catX + 46 + Math.sin(t * 4.4 + 1.8) * 24;
      const pawRTargetY = groundY - 152 + bodyBob + Math.cos(t * 4.4 + 1.8) * 22;

      // Forearm Arm
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 11;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pawRShoulderX, pawRShoulderY);
      ctx.quadraticCurveTo(catX + 24, pawRTargetY + 20, pawRTargetX, pawRTargetY);
      ctx.stroke();

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 8.5;
      ctx.beginPath();
      ctx.moveTo(pawRShoulderX, pawRShoulderY);
      ctx.quadraticCurveTo(catX + 24, pawRTargetY + 20, pawRTargetX, pawRTargetY);
      ctx.stroke();

      // Right Paw Ball & Pink Toe Beans 🐾
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(pawRTargetX, pawRTargetY, 8, 0, Math.PI * 2);
      ctx.fill();
      // Pink Paw Pad
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(pawRTargetX + 0.5, pawRTargetY + 0.5, 3.6, 0, Math.PI * 2);
      ctx.fill();
      // 3 Pink Toe beans
      ctx.beginPath();
      ctx.arc(pawRTargetX - 4.8, pawRTargetY - 4.8, 2.0, 0, Math.PI * 2);
      ctx.arc(pawRTargetX, pawRTargetY - 7.0, 2.0, 0, Math.PI * 2);
      ctx.arc(pawRTargetX + 4.8, pawRTargetY - 4.8, 2.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. Beautiful Fluttering Butterfly 🦋
      ctx.save();
      const bx = bfly.x;
      const by = bfly.y;
      const wingFlap = Math.cos(t * 24);
      const wingScale = Math.abs(wingFlap);
      const butterflyTilt = Math.sin(t * 2.5) * 0.25;

      ctx.translate(bx, by);
      ctx.rotate(butterflyTilt);

      // Soft magical glow behind butterfly
      const glowGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 24);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
      glowGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.25)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();

      // 4 Butterfly Wings with 3D Fluttering Perspective
      // Left Upper Wing
      ctx.save();
      ctx.scale(wingFlap < 0 ? -wingScale : -wingScale, 1);
      const wingGradL = ctx.createLinearGradient(0, 0, -18, -18);
      wingGradL.addColorStop(0, '#fde047');
      wingGradL.addColorStop(0.5, '#ec4899');
      wingGradL.addColorStop(1, '#38bdf8');
      ctx.fillStyle = wingGradL;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-12, -22, -26, -14, -18, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lower Left Wing
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.bezierCurveTo(-8, 14, -20, 12, -12, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sparkle dots on wing edge
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-18, -12, 1.2, 0, Math.PI * 2);
      ctx.arc(-14, -18, 1.2, 0, Math.PI * 2);
      ctx.arc(-12, 8, 1.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right Upper Wing
      ctx.save();
      ctx.scale(wingScale, 1);
      const wingGradR = ctx.createLinearGradient(0, 0, 18, -18);
      wingGradR.addColorStop(0, '#fde047');
      wingGradR.addColorStop(0.5, '#38bdf8');
      wingGradR.addColorStop(1, '#c084fc');
      ctx.fillStyle = wingGradR;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(12, -22, 26, -14, 18, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lower Right Wing
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.bezierCurveTo(8, 14, 20, 12, 12, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sparkle dots on wing edge
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(18, -12, 1.2, 0, Math.PI * 2);
      ctx.arc(14, -18, 1.2, 0, Math.PI * 2);
      ctx.arc(12, 8, 1.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Butterfly Body & Antennae
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 2.2, 9.0, 0, 0, Math.PI * 2);
      ctx.fill();

      // Antennae
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-1, -7); ctx.quadraticCurveTo(-5, -14, -8, -12);
      ctx.moveTo(1, -7); ctx.quadraticCurveTo(5, -14, 8, -12);
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(-8, -12, 1.2, 0, Math.PI * 2);
      ctx.arc(8, -12, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 8. Cute Floating Speech Bubble / Meow Icon above cat
      const bubbleY = headCenterY - 46 + Math.sin(t * 3.2) * 4;
      const bubbleX = headCenterX + 35;
      
      ctx.save();
      // Speech Bubble Background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(bubbleX - 36, bubbleY - 14, 72, 24, 12);
      } else {
        ctx.arc(bubbleX - 24, bubbleY - 2, 12, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(bubbleX + 24, bubbleY - 2, 12, Math.PI * 1.5, Math.PI * 0.5);
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();

      // Pointer triangle
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.moveTo(bubbleX - 10, bubbleY + 10);
      ctx.lineTo(bubbleX - 18, bubbleY + 18);
      ctx.lineTo(bubbleX - 2, bubbleY + 10);
      ctx.closePath();
      ctx.fill();

      // Text inside bubble
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Meow~ 🐾', bubbleX, bubbleY - 2);
      ctx.restore();
    }

    drawObstacles(ctx) {
      this.obstacles.forEach((obs) => {
        ctx.save();
        if (obs.type === 'crate') {
          ctx.fillStyle = '#d97706';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3.0;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.moveTo(obs.x + obs.width, obs.y);
          ctx.lineTo(obs.x, obs.y + obs.height);
          ctx.stroke();

          ctx.fillStyle = '#451a03';
          const corners = [
            [obs.x + 4, obs.y + 4], [obs.x + obs.width - 4, obs.y + 4],
            [obs.x + 4, obs.y + obs.height - 4], [obs.x + obs.width - 4, obs.y + obs.height - 4]
          ];
          corners.forEach(([nx, ny]) => {
            ctx.beginPath();
            ctx.arc(nx, ny, 1.5, 0, Math.PI * 2);
            ctx.fill();
          });
        } else if (obs.type === 'rock') {
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.ellipse(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.ellipse(obs.x + obs.width / 2, obs.y + 6, 8, 4, -0.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'bush') {
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(obs.x + 14, obs.y + 16, 14, 0, Math.PI * 2);
          ctx.arc(obs.x + 26, obs.y + 12, 13, 0, Math.PI * 2);
          ctx.arc(obs.x + 32, obs.y + 18, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(obs.x + 16, obs.y + 12, 2.5, 0, Math.PI * 2);
          ctx.arc(obs.x + 24, obs.y + 8, 2.5, 0, Math.PI * 2);
          ctx.arc(obs.x + 28, obs.y + 16, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'puddle') {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.ellipse(obs.x + obs.width / 2, obs.y + 5, obs.width / 2, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (obs.type === 'bird') {
          const bx = obs.x + 16;
          const by = obs.y + 11;
          const wingY = Math.sin(obs.wingTimer) * 7;

          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.ellipse(bx, by, 12, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(bx - 4, by);
          ctx.lineTo(bx - 2, by - 12 + wingY);
          ctx.lineTo(bx + 6, by);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(bx - 12, by);
          ctx.lineTo(bx - 18, by + 2);
          ctx.lineTo(bx - 12, by + 4);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(bx - 6, by - 2, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(bx - 7, by - 2, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    drawItems(ctx) {
      this.items.forEach((item) => {
        ctx.save();
        const floatY = Math.sin(item.floatTimer * 3) * 4;

        if (item.type === 'coin') {
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = 'rgba(251, 191, 36, 0.7)';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(item.x + 11, item.y + 11 + floatY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(item.x + 11, item.y + 11 + floatY, 7.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef3c7';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', item.x + 11, item.y + 11 + floatY);
        } else if (item.type === 'fish') {
          const fx = item.x + 15;
          const fy = item.y + 11 + floatY;

          ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
          ctx.shadowBlur = 16;

          const fishGrad = ctx.createLinearGradient(fx - 12, fy - 8, fx + 12, fy + 8);
          fishGrad.addColorStop(0, '#e0f2fe');
          fishGrad.addColorStop(0.4, '#38bdf8');
          fishGrad.addColorStop(1, '#0284c7');
          ctx.fillStyle = fishGrad;

          ctx.beginPath();
          ctx.ellipse(fx, fy, 13, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(fx + 10, fy);
          ctx.lineTo(fx + 18, fy - 8);
          ctx.lineTo(fx + 15, fy);
          ctx.lineTo(fx + 18, fy + 8);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(fx - 2, fy - 7);
          ctx.lineTo(fx + 4, fy - 12);
          ctx.lineTo(fx + 6, fy - 6);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(fx - 6.5, fy - 2.5, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(fx - 7.0, fy - 2.5, 1.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(fx + 2, fy - 2, 1.4, 0, Math.PI * 2);
          ctx.arc(fx - 14, fy - 8, 1.2, 0, Math.PI * 2);
          ctx.arc(fx + 14, fy + 8, 1.2, 0, Math.PI * 2);
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
        ctx.font = 'bold 13px "Outfit", sans-serif';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
    }

    drawVignette(ctx) {
      ctx.save();
      const vignette = ctx.createRadialGradient(
        VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, VIRTUAL_WIDTH * 0.4,
        VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, VIRTUAL_WIDTH * 0.7
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(15, 23, 42, 0.16)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      ctx.restore();
    }
  }

  // Initialize Game on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CatRunnerGame());
  } else {
    new CatRunnerGame();
  }
})();
