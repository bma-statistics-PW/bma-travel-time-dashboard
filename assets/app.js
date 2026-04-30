/* ═══════════════════════════════════════════════════════════════
   BMA Travel Time Dashboard — App Script
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Dark mode toggle ── */
  const themeBtn = document.getElementById('themeToggle');
  const html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    html.setAttribute('color-scheme', theme);
    try {
      localStorage.setItem('bma-theme', theme);
    } catch (e) {
      console.warn('Could not persist theme preference:', e);
    }
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeBtn.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀' : '◐';
    }
  }

  function initTheme() {
    let saved;
    try {
      saved = localStorage.getItem('bma-theme');
    } catch (e) {
      console.warn('Could not read theme preference:', e);
    }
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved || preferred);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  initTheme();


  /* ── Reveal on scroll ── */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!window.IntersectionObserver) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { obs.observe(el); });
  }

  initReveal();


  /* ── Back-to-top button ── */
  var toTopBtn = document.getElementById('to-top');
  if (toTopBtn) {
    window.addEventListener('scroll', function () {
      toTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ── Print button ── */
  var printBtn = document.getElementById('printReport');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

})();
