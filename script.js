// ============================================
// untodo — Landing Page Scripts
// ============================================

(function () {
  'use strict';

  // ---- Hero Dot Grid ----
  const heroCanvas = document.getElementById('dot-grid');
  if (!heroCanvas) return;

  const heroCtx = heroCanvas.getContext('2d');
  let dots = [];
  let mouse = { x: -1000, y: -1000 };
  let raf;

  function resizeHero() {
    const dpr = window.devicePixelRatio || 1;
    heroCanvas.width = window.innerWidth * dpr;
    heroCanvas.height = window.innerHeight * dpr;
    heroCanvas.style.width = window.innerWidth + 'px';
    heroCanvas.style.height = window.innerHeight + 'px';
    heroCtx.scale(dpr, dpr);
    initDots();
  }

  function initDots() {
    dots = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const spacing = w < 640 ? 36 : 48;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    const ox = (w - (cols - 1) * spacing) / 2;
    const oy = (h - (rows - 1) * spacing) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: ox + c * spacing,
          y: oy + r * spacing,
          baseAlpha: 0.025 + Math.random() * 0.025,
          alpha: 0.025,
          radius: 1.2,
          targetRadius: 1.2,
        });
      }
    }
  }

  function drawHero() {
    const dpr = window.devicePixelRatio || 1;
    heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    heroCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const dx = mouse.x - d.x;
      const dy = mouse.y - d.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 180;

      if (dist < maxDist) {
        const t = 1 - dist / maxDist;
        const ease = t * t * t;
        d.alpha += (d.baseAlpha + ease * 0.6 - d.alpha) * 0.1;
        d.targetRadius = 1.2 + ease * 3.5;
      } else {
        d.alpha += (d.baseAlpha - d.alpha) * 0.04;
        d.targetRadius = 1.2;
      }

      d.radius += (d.targetRadius - d.radius) * 0.08;

      heroCtx.beginPath();
      heroCtx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      heroCtx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
      heroCtx.fill();
    }

    raf = requestAnimationFrame(drawHero);
  }

  heroCanvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  heroCanvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  heroCanvas.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
  }, { passive: true });

  heroCanvas.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    const dpr = window.devicePixelRatio || 1;
    heroCtx.setTransform(1, 0, 0, 1, 0, 0);
    heroCanvas.width = window.innerWidth * dpr;
    heroCanvas.height = window.innerHeight * dpr;
    heroCanvas.style.width = window.innerWidth + 'px';
    heroCanvas.style.height = window.innerHeight + 'px';
    heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initDots();
    drawHero();
  });

  resizeHero();
  drawHero();

  // ---- Phone Canvas Dot Grids ----
  const themeConfigs = {
    minimal: {
      bg: '#0a0a0a',
      past: (r) => `rgba(68, 68, 68, ${0.4 + r * 0.4})`,
      today: '#ffffff',
      todayRing: 'rgba(74, 158, 255, 0.5)',
      future: 'rgba(255, 255, 255, 0.04)',
    },
    terminal: {
      bg: '#040a04',
      past: (r) => `rgba(0, 255, 65, ${0.2 + r * 0.3})`,
      today: '#00ff41',
      todayRing: 'rgba(0, 255, 65, 0.3)',
      future: 'rgba(0, 255, 65, 0.03)',
    },
    neon: {
      bg: '#0a0410',
      past: (r) => `rgba(191, 95, 255, ${0.2 + r * 0.35})`,
      today: '#bf5fff',
      todayRing: 'rgba(191, 95, 255, 0.4)',
      future: 'rgba(191, 95, 255, 0.03)',
    },
    cosmic: {
      bg: '#06060f',
      past: (r) => `rgba(122, 162, 255, ${0.2 + r * 0.3})`,
      today: '#7aa2ff',
      todayRing: 'rgba(122, 162, 255, 0.3)',
      future: 'rgba(122, 162, 255, 0.03)',
    },
    blueprint: {
      bg: '#04080e',
      past: (r) => `rgba(90, 175, 255, ${0.2 + r * 0.3})`,
      today: '#5aafff',
      todayRing: 'rgba(90, 175, 255, 0.3)',
      future: 'rgba(90, 175, 255, 0.03)',
    },
  };

  function drawPhoneCanvas(canvas) {
    const theme = canvas.dataset.theme || 'minimal';
    const config = themeConfigs[theme];
    const parent = canvas.parentElement;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = config.bg;
    ctx.fillRect(0, 0, w, h);

    // Dot grid
    const cols = 13;
    const padding = 20;
    const spacing = (w - padding * 2) / cols;
    const dotR = spacing * 0.17;
    const startY = h * 0.30;
    const endY = h * 0.80;
    const rows = Math.floor((endY - startY) / spacing);
    const total = cols * rows;
    const pastCount = Math.floor(total * 0.18);
    const todayIdx = pastCount;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const x = padding + c * spacing + spacing / 2;
        const y = startY + r * spacing + spacing / 2;

        ctx.beginPath();
        ctx.arc(x, y, dotR, 0, Math.PI * 2);

        if (i < pastCount) {
          ctx.fillStyle = config.past(Math.random());
        } else if (i === todayIdx) {
          ctx.fillStyle = config.today;
          ctx.fill();
          // Ring
          ctx.beginPath();
          ctx.arc(x, y, dotR + 3, 0, Math.PI * 2);
          ctx.strokeStyle = config.todayRing;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          continue;
        } else {
          ctx.fillStyle = config.future;
        }

        ctx.fill();
      }
    }
  }

  document.querySelectorAll('.phone-canvas').forEach((canvas) => {
    drawPhoneCanvas(canvas);
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.phone-canvas').forEach(drawPhoneCanvas);
  });

  // ---- CTA Dot Grid ----
  const ctaCanvas = document.getElementById('cta-dots');
  if (ctaCanvas) {
    function drawCtaDots() {
      const parent = ctaCanvas.parentElement;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      const dpr = window.devicePixelRatio || 1;

      ctaCanvas.width = w * dpr;
      ctaCanvas.height = h * dpr;
      ctaCanvas.style.width = w + 'px';
      ctaCanvas.style.height = h + 'px';

      const ctx = ctaCanvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const spacing = 40;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const ox = (w - (cols - 1) * spacing) / 2;
      const oy = (h - (rows - 1) * spacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * spacing;
          const y = oy + r * spacing;
          // Radial fade from center
          const dx = x - w / 2;
          const dy = y - h / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.max(w, h) * 0.5;
          const fade = Math.max(0, 1 - dist / maxDist);
          const alpha = 0.015 + fade * 0.05;

          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }
    }

    drawCtaDots();
    window.addEventListener('resize', drawCtaDots);
  }

  // ---- Heatmap Mini ----
  const heatmapRow = document.querySelector('.heatmap-row');
  if (heatmapRow) {
    for (let i = 0; i < 91; i++) {
      const dot = document.createElement('div');
      dot.className = 'heatmap-dot';
      // Random intensity for visual effect
      const rand = Math.random();
      if (rand > 0.7) {
        dot.style.background = `rgba(255, 255, 255, ${0.15 + Math.random() * 0.3})`;
      } else if (rand > 0.4) {
        dot.style.background = `rgba(255, 255, 255, ${0.06 + Math.random() * 0.08})`;
      }
      heatmapRow.appendChild(dot);
    }
  }

  // ---- Scroll Reveal ----
  const revealElements = document.querySelectorAll('[data-reveal], .section-header');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Stagger bento cards
  document.querySelectorAll('.bento-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      const navLinks = document.querySelector('.nav-links');
      const toggle = document.querySelector('.nav-mobile-toggle');
      if (navLinks) navLinks.classList.remove('open');
      if (toggle) toggle.classList.remove('active');
    });
  });

  // ---- Mobile Nav Toggle ----
  const toggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // ---- Nav scroll effect ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
    } else {
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.04)';
    }
  }, { passive: true });

  // ---- Animate progress ring on reveal ----
  const ringFill = document.querySelector('.progress-ring-fill');
  if (ringFill) {
    const ringObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ringFill.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            ringFill.style.strokeDashoffset = '72';
            ringObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    // Start with full offset, animate to 72
    ringFill.style.strokeDashoffset = '327';
    ringObserver.observe(ringFill.closest('.bento-card'));
  }

  // ---- Focus ring animation ----
  const focusRingProgress = document.querySelector('.focus-ring-progress');
  if (focusRingProgress) {
    const focusObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            focusRingProgress.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            focusRingProgress.style.strokeDashoffset = '141';
            focusObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    focusRingProgress.style.strokeDashoffset = '565';
    focusObserver.observe(focusRingProgress.closest('.focus-visual'));
  }

})();
