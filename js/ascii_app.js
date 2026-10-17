/* =========================================================================
   ASCII SCRAMBLE CONTROLLER FOR RUPA.EXE WINDOW
   Integrated with Windows 3.1 controls: scramble, freeze, CRT toggle
   ========================================================================= */

const MATRIX_CHARS = "0123456789ABCDEF$#@%&*+=~;:/?!|<>[]{}XYZWVUTSRQPONMLKJIHGFEDCBA";

class MatrixAsciiApp {
  constructor(canvasId, artData, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas || !artData) return;

    this.ctx = this.canvas.getContext("2d");
    this.artData = artData;
    this.cols = artData.width;
    this.rows = artData.height;
    this.cellW = options.cellW || 6;
    this.cellH = options.cellH || 10;
    this.fontSize = options.fontSize || 9;

    this.canvas.width = this.cols * this.cellW;
    this.canvas.height = this.rows * this.cellH;
    this.ctx.font = `${this.fontSize}px "JetBrains Mono", Consolas, monospace`;

    this.mouse = { x: -9999, y: -9999 };
    this.mouseRadiusSq = (options.mouseRadius || 80) ** 2;
    this.isHovered = false;
    this.isFrozen = false;
    this.animFrameId = null;
    this.isLoopRunning = false;
    this.lastRenderTime = 0;
    this.FRAME_INTERVAL = 1000 / 30;

    this.initParticles();
    this.initEvents();
    this.startLoop();
  }

  initParticles() {
    this.particles = this.artData.pixels.map(([x, y, targetChar, r, g, b]) => ({
      posX: x * this.cellW,
      posY: (y + 1) * this.cellH,
      targetChar: targetChar,
      currentChar: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
      colorStr: `rgb(${r}, ${g}, ${b})`,
      resolved: false,
      frameCounter: 0,
      delay: Math.floor((y / this.rows) * 25 + (x / this.cols) * 15 + Math.random() * 10),
      scrambleTicks: 16 + Math.floor(Math.random() * 18),
    }));
  }

  initEvents() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.x) * scaleX;
      this.mouse.y = (e.clientY - rect.y) * scaleY;
      this.isHovered = true;
      this.startLoop();
    }, { passive: true });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.isHovered = false;
    }, { passive: true });

    // Click Shockwave Burst
    this.canvas.addEventListener("click", () => {
      this.particles.forEach(p => {
        if (Math.random() < 0.25) {
          p.resolved = false;
          p.frameCounter = 0;
          p.scrambleTicks = 8 + Math.floor(Math.random() * 10);
        }
      });
      this.startLoop();
    });
  }

  triggerScramble() {
    this.particles.forEach(p => {
      p.resolved = false;
      p.frameCounter = 0;
      p.scrambleTicks = 14 + Math.floor(Math.random() * 20);
      p.currentChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    });
    this.startLoop();
  }

  toggleFreeze() {
    this.isFrozen = !this.isFrozen;
    const btn = document.getElementById('btnFreeze');
    if (btn) {
      btn.innerText = this.isFrozen ? "▶ Resume" : "⏸ Freeze";
    }
    if (!this.isFrozen) {
      this.startLoop();
    }
  }

  startLoop() {
    if (!this.isLoopRunning && !this.isFrozen) {
      this.isLoopRunning = true;
      this.animFrameId = requestAnimationFrame((t) => this.render(t));
    }
  }

  render(currentTime) {
    if (this.isFrozen) {
      this.isLoopRunning = false;
      return;
    }

    if (currentTime - this.lastRenderTime < this.FRAME_INTERVAL) {
      this.animFrameId = requestAnimationFrame((t) => this.render(t));
      return;
    }
    this.lastRenderTime = currentTime;

    this.ctx.fillStyle = "#141210";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = `${this.fontSize}px "JetBrains Mono", Consolas, monospace`;
    this.ctx.textBaseline = "bottom";

    let stillActive = false;

    // Render grouped by color to minimize fillStyle switches
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Mouse proximity interaction
      if (this.isHovered) {
        const dx = p.posX - this.mouse.x;
        const dy = p.posY - this.mouse.y;
        if (dx * dx + dy * dy < this.mouseRadiusSq) {
          p.resolved = false;
          p.currentChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          stillActive = true;
        }
      }

      // Scramble phase resolution
      if (!p.resolved) {
        p.frameCounter++;
        if (p.frameCounter < p.delay) {
          stillActive = true;
          continue;
        }

        if (p.frameCounter < p.delay + p.scrambleTicks) {
          p.currentChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          stillActive = true;
        } else {
          p.resolved = true;
          p.currentChar = p.targetChar;
        }
      }

      this.ctx.fillStyle = p.colorStr;
      this.ctx.fillText(p.currentChar, p.posX, p.posY);
    }

    if (stillActive || this.isHovered) {
      this.animFrameId = requestAnimationFrame((t) => this.render(t));
    } else {
      this.isLoopRunning = false;
    }
  }
}

// Initialize on DOM Ready
window.RupaApp = null;
document.addEventListener("DOMContentLoaded", () => {
  const artData = (typeof ASCII_ART_DATA !== "undefined") ? ASCII_ART_DATA : (typeof ASCII_ART !== "undefined" ? ASCII_ART : null);
  if (artData) {
    window.RupaApp = new MatrixAsciiApp("matrixCanvas", artData, {
      cellW: 6,
      cellH: 10,
      fontSize: 9,
      mouseRadius: 75
    });

    const scrambleBtn = document.getElementById("btnScramble");
    if (scrambleBtn) {
      scrambleBtn.addEventListener("click", () => window.RupaApp.triggerScramble());
    }

    const freezeBtn = document.getElementById("btnFreeze");
    if (freezeBtn) {
      freezeBtn.addEventListener("click", () => window.RupaApp.toggleFreeze());
    }

    const crtBtn = document.getElementById("btnCrtToggle");
    if (crtBtn) {
      crtBtn.addEventListener("click", () => {
        document.body.classList.toggle("no-crt");
        crtBtn.innerText = document.body.classList.contains("no-crt") ? "CRT: OFF" : "CRT: ON";
      });
    }
  }
});
