// ============================================
// untodo — Landing Page Scripts
// ============================================

(function () {
  'use strict';

  // ---- Hero Dot Grid Animation ----
  const canvas = document.getElementById('dot-grid');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let dots = [];
  let mouse = { x: -1000, y: -1000 };
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
  }

  function initDots() {
    dots = [];
    const spacing = 44;
    const cols = Math.ceil(canvas.width / spacing) + 1;
    const rows = Math.ceil(canvas.height / spacing) + 1;
    const offsetX = (canvas.width - (cols - 1) * spacing) / 2;
    const offsetY = (canvas.height - (rows - 1) * spacing) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: offsetX + c * spacing,
          y: offsetY + r * spacing,
          baseAlpha: 0.04 + Math.random() * 0.03,
          alpha: 0.04,
          radius: 1.5,
        });
      }
    }
  }

  function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const dx = mouse.x - d.x;
      const dy = mouse.y - d.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;

      if (dist < maxDist) {
        const t = 1 - dist / maxDist;
        const ease = t * t;
        d.alpha += (d.baseAlpha + ease * 0.5 - d.alpha) * 0.12;
        d.radius += (1.5 + ease * 3 - d.radius) * 0.12;
      } else {
        d.alpha += (d.baseAlpha - d.alpha) * 0.04;
        d.radius += (1.5 - d.radius) * 0.04;
      }

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
      ctx.fill();
    }

    animFrame = requestAnimationFrame(drawDots);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Touch support
  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', resize);
  resize();
  drawDots();

  // ---- Phone Preview Dot Grid ----
  const phoneCanvas = document.getElementById('phone-dots');
  if (phoneCanvas) {
    const pCtx = phoneCanvas.getContext('2d');

    function drawPhoneDots() {
      const parent = phoneCanvas.parentElement;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      phoneCanvas.width = w * dpr;
      phoneCanvas.height = h * dpr;
      phoneCanvas.style.width = w + 'px';
      phoneCanvas.style.height = h + 'px';
      pCtx.scale(dpr, dpr);

      const cols = 15;
      const spacing = (w - 40) / cols;
      const dotRadius = spacing * 0.18;
      const startY = h * 0.32;
      const endY = h * 0.78;
      const rows = Math.floor((endY - startY) / spacing);
      const totalDots = cols * rows;

      // Simulate: ~40% past (completed), 1 today, rest future
      const pastCount = Math.floor(totalDots * 0.15);
      const todayIndex = pastCount;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = 20 + c * spacing + spacing / 2;
          const y = startY + r * spacing + spacing / 2;

          pCtx.beginPath();
          pCtx.arc(x, y, dotRadius, 0, Math.PI * 2);

          if (i < pastCount) {
            // Past - completed, brighter
            const brightness = 0.25 + Math.random() * 0.2;
            pCtx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
          } else if (i === todayIndex) {
            // Today - white with blue ring
            pCtx.fillStyle = '#ffffff';
            pCtx.fill();
            pCtx.beginPath();
            pCtx.arc(x, y, dotRadius + 3, 0, Math.PI * 2);
            pCtx.strokeStyle = 'rgba(74, 158, 255, 0.6)';
            pCtx.lineWidth = 1.5;
            pCtx.stroke();
            continue;
          } else {
            // Future - very dim
            pCtx.fillStyle = 'rgba(255, 255, 255, 0.06)';
          }

          pCtx.fill();
        }
      }
    }

    drawPhoneDots();
    window.addEventListener('resize', drawPhoneDots);
  }

  // ---- Scroll Animations (Intersection Observer) ----
  const animatedElements = document.querySelectorAll(
    '.section-header, .feature-card, .step-card, .preview-grid, .cta-content, .preview-phone'
  );

  animatedElements.forEach((el) => {
    el.classList.add('fade-in');
  });

  // Add stagger delays to grid items
  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });

  document.querySelectorAll('.step-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close mobile nav if open
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

  // ---- Nav background on scroll ----
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
    } else {
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.06)';
    }
    lastScroll = scrollY;
  }, { passive: true });

})();
