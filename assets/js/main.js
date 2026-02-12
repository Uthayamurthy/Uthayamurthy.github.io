// ============================================
// main.js - Site-wide JavaScript
// ============================================

// --- Bootstrap Tooltips ---
document.addEventListener('DOMContentLoaded', function () {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
});

function showEasterToast(message, duration) {
  const lifetime = typeof duration === 'number' ? duration : 2400;
  let container = document.getElementById('easter-toast-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'easter-toast-container';
    container.className = 'easter-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'easter-toast';
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(function () {
    toast.classList.add('is-visible');
  });

  window.setTimeout(function () {
    toast.classList.remove('is-visible');
    window.setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      if (container && !container.children.length && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 220);
  }, lifetime);
}

// --- Dark Mode Toggle ---
(function () {
  const STORAGE_KEY = 'theme-preference';

  function getColorPreference() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    // Default to light mode instead of following OS preference
    return 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill';
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      icon.className = 'bi bi-moon-fill';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-bs-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  // Set theme immediately to prevent flash
  setTheme(getColorPreference());

  // Bind toggle button after DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
      updateToggleIcon(getColorPreference());
    }
  });

  // Listen for OS theme changes (only if user hasn't set a preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // User hasn't set preference, keep it as light by default
      setTheme('light');
    }
  });
})();

// --- Copyright Year ---
document.addEventListener('DOMContentLoaded', function () {
  const el = document.getElementById('copyright-year');
  if (el) el.innerText = new Date().getFullYear();
});



// --- Profile Picture Easter Egg (homepage only) ---
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const profilePic = document.querySelector('.profile-pic');
    if (!profilePic) return;

    function triggerProfileEgg() {
      profilePic.classList.remove('profile-pic-spin');
      void profilePic.offsetWidth;
      profilePic.classList.add('profile-pic-spin');
      showEasterToast("It's not a bug, it's a feature", 2600);
    }

    profilePic.addEventListener('dblclick', triggerProfileEgg);
    profilePic.addEventListener('animationend', function (event) {
      if (event.animationName === 'profilePicSpin') {
        profilePic.classList.remove('profile-pic-spin');
      }
    });
  });
})();

// --- Typing Animation (homepage only) ---
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const phrases = ['Human Being', 'Passionate Builder', 'Science & AI Enthusiast'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];
      typingElement.textContent = current.substring(0, charIndex);

      if (!isDeleting) {
        if (charIndex < current.length) {
          charIndex++;
          setTimeout(type, 100);
        } else {
          isDeleting = true;
          setTimeout(type, 2000);
        }
      } else {
        if (charIndex > 0) {
          charIndex--;
          setTimeout(type, 50);
        } else {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400);
        }
      }
    }

    type();
  });
})();

// --- Scroll Animations (IntersectionObserver) ---
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  });
})();

// --- Project Type Filter (projects page only) ---
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const filterBtns = document.querySelectorAll('[data-filter]');
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');

        // Update active state on buttons
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        // Filter project cards
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(function (card) {
          const type = card.getAttribute('data-project-type');
          if (filter === 'all' || type === filter) {
            card.style.display = '';
            // Re-trigger animation
            card.classList.remove('is-visible');
            void card.offsetWidth; // force reflow
            card.classList.add('is-visible');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });
})();

// --- Konami Mode (site-wide) ---
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const matrixChars = '01<>[]{}$#*+-';
    let sequenceIndex = 0;
    let activeTimer;
    let isActive = false;

    function buildKonamiOverlay() {
      let overlay = document.getElementById('konami-overlay');
      if (overlay) return overlay;

      overlay = document.createElement('div');
      overlay.id = 'konami-overlay';
      overlay.className = 'konami-overlay';
      overlay.setAttribute('aria-hidden', 'true');

      for (let i = 0; i < 42; i++) {
        const char = document.createElement('span');
        char.className = 'konami-char';
        char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        char.style.setProperty('--x', (Math.random() * 100).toFixed(2) + '%');
        char.style.setProperty('--delay', (Math.random() * 1.6).toFixed(2) + 's');
        char.style.setProperty('--duration', (2.6 + (Math.random() * 2.1)).toFixed(2) + 's');
        char.style.setProperty('--opacity', (0.25 + (Math.random() * 0.6)).toFixed(2));
        char.style.setProperty('--size', (0.85 + (Math.random() * 0.9)).toFixed(2) + 'rem');
        overlay.appendChild(char);
      }

      document.body.appendChild(overlay);
      return overlay;
    }

    function deactivateKonamiMode() {
      isActive = false;
      const overlay = document.getElementById('konami-overlay');

      if (!overlay) return;

      overlay.classList.remove('is-visible');
      window.setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 280);
    }

    function activateKonamiMode() {
      const overlay = buildKonamiOverlay();
      if (!overlay) return;

      isActive = true;
      overlay.classList.add('is-visible');
      showEasterToast('Konami mode activated', 1800);

      if (activeTimer) clearTimeout(activeTimer);
      activeTimer = window.setTimeout(deactivateKonamiMode, 6000);
    }

    function normalizeKey(key) {
      return key.length === 1 ? key.toLowerCase() : key;
    }

    document.addEventListener('keydown', function (event) {
      const target = event.target;
      const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
      if (target && (target.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select')) {
        return;
      }

      const key = normalizeKey(event.key);
      const expected = sequence[sequenceIndex];

      if (key === expected) {
        sequenceIndex++;
        if (sequenceIndex === sequence.length) {
          sequenceIndex = 0;
          activateKonamiMode();
        }
        return;
      }

      sequenceIndex = key === sequence[0] ? 1 : 0;

      if (isActive && key === 'Escape') {
        if (activeTimer) clearTimeout(activeTimer);
        deactivateKonamiMode();
      }
    });
  });
})();

// --- Linux Skill Easter Egg (homepage only) ---
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const triggers = document.querySelectorAll('.linux-easter-egg-trigger[data-easter-egg="arch_btw"]');
    const popup = document.getElementById('linux-easter-egg');
    const popupWindow = popup ? popup.querySelector('.linux-terminal-window') : null;
    if (!triggers.length || !popup || !popupWindow) return;

    let hideTimer;
    let lastTrigger = null;

    function positionLinuxEgg(trigger) {
      if (!trigger) return;

      const gap = 12;
      const margin = window.innerWidth < 768 ? 10 : 14;
      const triggerRect = trigger.getBoundingClientRect();
      const popupWidth = popupWindow.offsetWidth;
      const popupHeight = popupWindow.offsetHeight;

      let left = triggerRect.left + (triggerRect.width / 2) - (popupWidth / 2);
      let top = triggerRect.top - popupHeight - gap;

      // If there is not enough room above the chip, place the popup below it.
      if (top < margin) {
        top = triggerRect.bottom + gap;
      }

      left = Math.max(margin, Math.min(left, window.innerWidth - popupWidth - margin));
      top = Math.max(margin, Math.min(top, window.innerHeight - popupHeight - margin));

      popup.style.left = Math.round(left) + 'px';
      popup.style.top = Math.round(top) + 'px';
    }

    function hideLinuxEgg() {
      popup.classList.remove('is-visible');
      popup.setAttribute('aria-hidden', 'true');
      if (hideTimer) clearTimeout(hideTimer);
    }

    function showLinuxEgg(event) {
      lastTrigger = event.currentTarget;
      positionLinuxEgg(lastTrigger);

      popup.classList.remove('is-visible');
      void popup.offsetWidth; // restart CSS animation on repeated clicks
      popup.classList.add('is-visible');
      popup.setAttribute('aria-hidden', 'false');

      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        hideLinuxEgg();
      }, 4200);
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', showLinuxEgg);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') hideLinuxEgg();
    });

    document.addEventListener('click', function (event) {
      if (!popup.classList.contains('is-visible')) return;
      if (event.target.closest('.linux-easter-egg-trigger')) return;
      if (event.target.closest('#linux-easter-egg')) return;
      hideLinuxEgg();
    });

    window.addEventListener('resize', function () {
      if (popup.classList.contains('is-visible') && lastTrigger) {
        positionLinuxEgg(lastTrigger);
      }
    });
  });
})();
