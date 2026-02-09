// ============================================
// main.js - Site-wide JavaScript
// ============================================

// --- Bootstrap Tooltips ---
document.addEventListener('DOMContentLoaded', function () {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
});

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

// --- Typing Animation (homepage only) ---
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const phrases = ['Human Being', 'Self-Taught Developer', 'Science & AI Enthusiast'];
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
