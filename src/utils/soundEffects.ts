// Web Audio API based sound synthesizer (No external audio file dependencies, instant playback)

class SoundFX {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. 생크림 짜는 소리 "푸슉~"
  playCream() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Noise buffer for air sound
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.25);
      filter.Q.setValueAtTime(3, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.25);
    } catch {
      // Audio not permitted or supported
    }
  }

  // 2. 과일 얹는 소리 "퐁~!"
  playFruitPop() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio fallback
    }
  }

  // 3. 식빵 뚜껑 덮는 소리 "착!"
  playBreadCover() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio fallback
    }
  }

  // 4. 칼날로 가르는 "스윽- 싹!" 슬라이스 사운드
  playSlash() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // White noise for swoosh
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2500, now);
      filter.frequency.exponentialRampToValueAtTime(6000, now + 0.15);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Add a crisp slicing metallic/crunch tone
      const blade = ctx.createOscillator();
      const bladeGain = ctx.createGain();
      blade.type = 'sawtooth';
      blade.frequency.setValueAtTime(1200, now);
      blade.frequency.exponentialRampToValueAtTime(300, now + 0.2);

      bladeGain.gain.setValueAtTime(0.12, now);
      bladeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      blade.connect(bladeGain);
      bladeGain.connect(ctx.destination);

      blade.start(now);
      blade.stop(now + 0.2);

      noise.start(now);
      noise.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  // 5. 산도 완성 축하 팡파르 "따-라-라-란~ 짠!!"
  playFanfare() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Notes in C Major: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const noteDuration = 0.12;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * noteDuration);

        const startTime = now + i * noteDuration;
        const duration = i === notes.length - 1 ? 0.6 : noteDuration;

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Audio fallback
    }
  }

  // 6. 스크래치 복권 긁는 사운드
  playScratch() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(200 + Math.random() * 300, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback
    }
  }

  // 7. 마법 변신 "뾰로롱~!" 차임 사운드
  playMagicTwinkle() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Sparkling bell / glockenspiel arpeggio
      const sparkleNotes = [659.25, 783.99, 987.77, 1318.51, 1567.98, 1975.53, 2637.02];
      const speed = 0.055;

      sparkleNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * speed);

        const startTime = now + idx * speed;
        const duration = 0.35;

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Audio fallback
    }
  }

  // 8. 75P 과일얹기 "초특급 화려한 뾰로롱~ 팡파르!"
  playFruitMagicGrand() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Grand harp glissando + harmonic sparkle bell
      const notes = [
        523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 1975.53, 2093.0, 2637.02, 3135.96
      ];
      const speed = 0.045;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Alternate between triangle (warm flute/harp) and sine (pure crystal)
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * speed);

        const startTime = now + idx * speed;
        const duration = 0.45;

        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });

      // Add a sparkling shimmer tail chord at the end
      const chord = [1046.5, 1318.51, 1567.98, 2093.0];
      const chordStart = now + notes.length * speed;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordStart);
        gain.gain.setValueAtTime(0.15, chordStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, chordStart + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(chordStart);
        osc.stop(chordStart + 0.6);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sounds = new SoundFX();
