/* ═══════════════════════════════
   LEXFIRM — SHARED JS
═══════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky header shadow ── */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── Mobile nav dropdown ── */
  const burger    = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (burger && mobileNav) {
    // Toggle on hamburger click
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle('open');
    });

    // Close when a link is clicked
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && e.target !== burger) {
        mobileNav.classList.remove('open');
      }
    });
  }

  /* ── Scroll-reveal via IntersectionObserver ── */
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (revealItems.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      el.style.transition = `opacity .7s ${i * 0.08}s cubic-bezier(.25,.46,.45,.94), transform .7s ${i * 0.08}s cubic-bezier(.25,.46,.45,.94)`;
      io.observe(el);
    });

    document.addEventListener('reveal-done', () => {}); // hook
  }

  /* patch for .revealed class */
  const style = document.createElement('style');
  style.textContent = '.revealed { opacity:1 !important; transform:none !important; }';
  document.head.appendChild(style);

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = (Number.isInteger(target)
            ? Math.round(ease * target).toLocaleString()
            : (ease * target).toFixed(0)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countIO.observe(c));
  }

  /* ── Active nav link ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href === page) a.classList.add('active');
  });

  /* ── Tabs (services page) ── */
  document.querySelectorAll('[data-tab-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.tabTrigger;
      const panel = document.querySelector(`[data-tab-panel="${group}"]`);
      document.querySelectorAll('[data-tab-trigger]').forEach(b => b.classList.remove('tab-active'));
      document.querySelectorAll('[data-tab-panel]').forEach(p => p.classList.remove('tab-active'));
      btn.classList.add('tab-active');
      if (panel) panel.classList.add('tab-active');
    });
  });

  /* ── Contact form ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const success = document.getElementById('formSuccess');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        if (success) success.style.display = 'flex';
      }, 1200);
    });
  }

});
