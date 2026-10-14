/* =========================================================================
   WINDOWS 3.1 DESKTOP & WINDOW MANAGER ENGINE
   Handles drag, focus z-index, minimize, maximize, and taskbar synchronization
   ========================================================================= */

class Win31WindowManager {
  constructor() {
    this.windows = new Map();
    this.activeWindow = null;
    this.highestZ = 10;
    this.dragTarget = null;
    this.dragOffset = { x: 0, y: 0 };
    
    this.initDOM();
    this.initGlobalEvents();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  initDOM() {
    this.taskbarWindows = document.getElementById('taskbarWindows');
    this.startBtn = document.getElementById('startBtn');
    this.startMenu = document.getElementById('startMenu');
    this.desktopArea = document.querySelector('.desktop-area');

    // Register all initial windows
    document.querySelectorAll('.window').forEach(winEl => {
      this.registerWindow(winEl);
    });

    // Start Menu Toggle
    if (this.startBtn && this.startMenu) {
      this.startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleStartMenu();
      });

      document.addEventListener('click', () => {
        this.closeStartMenu();
      });

      this.startMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Desktop icons binding
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        const targetId = icon.getAttribute('data-target');
        if (targetId) {
          this.openWindow(targetId);
        }
      });
    });

    // Sticky Note Gadget Setup
    this.initStickyNote();
  }

  initStickyNote() {
    const stickyNote = document.getElementById('stickyNote');
    const langBtn = document.getElementById('stickyLangBtn');
    const textEn = document.getElementById('stickyTextEn');
    const textId = document.getElementById('stickyTextId');

    if (langBtn && textEn && textId) {
      let isIndo = false;
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isIndo = !isIndo;
        if (isIndo) {
          textEn.style.display = 'none';
          textId.style.display = 'block';
          langBtn.innerText = 'EN 🇬🇧';
        } else {
          textEn.style.display = 'block';
          textId.style.display = 'none';
          langBtn.innerText = 'ID 🇮🇩';
        }
      });
    }

    if (stickyNote) {
      const header = stickyNote.querySelector('.sticky-header');
      if (header) {
        header.addEventListener('mousedown', (e) => {
          if (e.target.closest('.sticky-lang-toggle')) return;
          this.startDrag(stickyNote, e);
        });
      }
      stickyNote.addEventListener('mousedown', () => {
        this.highestZ += 1;
        stickyNote.style.zIndex = this.highestZ;
      });
    }
  }

  registerWindow(winEl) {
    const id = winEl.id;
    const titleText = winEl.querySelector('.window-title span')?.innerText || id;
    let iconSrc = winEl.querySelector('.window-title-icon')?.getAttribute('src') || '';

    // If no window icon set, check if corresponding desktop icon has an image
    if (!iconSrc) {
      const desktopIconImg = document.querySelector(`.desktop-icon[data-target="${id}"] .icon-graphic img`);
      if (desktopIconImg) {
        iconSrc = desktopIconImg.getAttribute('src');
      }
    }

    const winData = {
      el: winEl,
      id: id,
      title: titleText,
      icon: iconSrc,
      isMinimized: winEl.classList.contains('minimized'),
      isMaximized: winEl.classList.contains('maximized'),
      prevBounds: null
    };

    this.windows.set(id, winData);

    // Setup window controls
    const titlebar = winEl.querySelector('.window-titlebar');
    const minBtn = winEl.querySelector('.win-btn-min');
    const maxBtn = winEl.querySelector('.win-btn-max');
    const closeBtn = winEl.querySelector('.win-btn-close');

    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeWindow(id);
      });
    }

    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximize(id);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWindow(id);
      });
    }

    // Bring to front on click
    winEl.addEventListener('mousedown', () => {
      this.focusWindow(id);
    });

    // Setup dragging via titlebar
    if (titlebar) {
      titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.win-ctrl-btn')) return;
        this.startDrag(winEl, e);
      });
    }

    this.createTaskbarItem(winData);
  }

  createTaskbarItem(winData) {
    const item = document.createElement('button');
    item.className = 'taskbar-item bevel-outset';
    item.id = `tb-${winData.id}`;
    item.innerHTML = `
      ${winData.icon ? `<img src="${winData.icon}" width="14" height="14" alt="" />` : ''}
      <span>${winData.title}</span>
    `;

    item.addEventListener('click', () => {
      if (winData.isMinimized) {
        this.restoreWindow(winData.id);
        this.focusWindow(winData.id);
      } else if (this.activeWindow === winData.id) {
        this.minimizeWindow(winData.id);
      } else {
        this.focusWindow(winData.id);
      }
    });

    this.taskbarWindows.appendChild(item);
  }

  focusWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    this.highestZ += 1;
    winData.el.style.zIndex = this.highestZ;

    // Remove active state from all
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
    document.querySelectorAll('.taskbar-item').forEach(tb => tb.classList.remove('active'));

    winData.el.classList.remove('minimized');
    winData.el.classList.add('active');
    winData.isMinimized = false;

    if (id === 'win-rupa' && window.RupaApp) {
      window.RupaApp.startLoop();
    }

    const tbItem = document.getElementById(`tb-${id}`);
    if (tbItem) {
      tbItem.classList.add('active');
    }

    this.activeWindow = id;
  }

  openWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    winData.el.style.display = 'flex';
    winData.el.classList.remove('minimized');
    winData.isMinimized = false;
    this.focusWindow(id);
  }

  closeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    winData.el.style.display = 'none';
    winData.isMinimized = true;

    const tbItem = document.getElementById(`tb-${id}`);
    if (tbItem) {
      tbItem.classList.remove('active');
    }

    if (this.activeWindow === id) {
      this.activeWindow = null;
    }
  }

  minimizeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    winData.el.classList.add('minimized');
    winData.isMinimized = true;

    const tbItem = document.getElementById(`tb-${id}`);
    if (tbItem) {
      tbItem.classList.remove('active');
    }

    if (this.activeWindow === id) {
      this.activeWindow = null;
    }
  }

  restoreWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    winData.el.style.display = 'flex';
    winData.el.classList.remove('minimized');
    winData.isMinimized = false;
  }

  toggleMaximize(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (winData.isMaximized) {
      // Restore prev
      winData.el.classList.remove('maximized');
      if (winData.prevBounds) {
        winData.el.style.top = winData.prevBounds.top;
        winData.el.style.left = winData.prevBounds.left;
        winData.el.style.width = winData.prevBounds.width;
        winData.el.style.height = winData.prevBounds.height;
      }
      winData.isMaximized = false;
    } else {
      // Save bounds
      winData.prevBounds = {
        top: winData.el.style.top,
        left: winData.el.style.left,
        width: winData.el.style.width,
        height: winData.el.style.height
      };
      winData.el.classList.add('maximized');
      winData.isMaximized = true;
    }
  }

  startDrag(winEl, e) {
    if (winEl.classList.contains('maximized')) return;
    this.dragTarget = winEl;
    const rect = winEl.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;
  }

  initGlobalEvents() {
    window.addEventListener('mousemove', (e) => {
      if (!this.dragTarget) return;

      const x = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - this.dragOffset.x));
      const y = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - this.dragOffset.y));

      this.dragTarget.style.left = `${x}px`;
      this.dragTarget.style.top = `${y}px`;
    });

    window.addEventListener('mouseup', () => {
      this.dragTarget = null;
    });
  }

  toggleStartMenu() {
    this.startMenu.classList.toggle('open');
  }

  closeStartMenu() {
    if (this.startMenu) {
      this.startMenu.classList.remove('open');
    }
  }

  updateClock() {
    const clockEl = document.getElementById('taskbarClock');
    if (clockEl) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      clockEl.innerText = `${hours}:${mins}`;
    }
  }
}

// Global instance exposed
window.Win31 = null;
document.addEventListener('DOMContentLoaded', () => {
  window.Win31 = new Win31WindowManager();
});
