// Dot grid animation for hero section
(function () {
  const canvas = document.getElementById('dot-grid');
  const ctx = canvas.getContext('2d');
  let dots = [];
  let mouse = { x: -1000, y: -1000 };
  let raf;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
  }

  function initDots() {
    dots = [];
    const spacing = 40;
    const cols = Math.ceil(canvas.width / spacing) + 1;
    const rows = Math.ceil(canvas.height / spacing) + 1;
    const offsetX = (canvas.width - (cols - 1) * spacing) / 2;
    const offsetY = (canvas.height - (rows - 1) * spacing) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: offsetX + c * spacing,
          y: offsetY + r * spacing,
          baseAlpha: 0.06 + Math.random() * 0.04,
          alpha: 0.06,
          radius: 2,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const dx = mouse.x - d.x;
      const dy = mouse.y - d.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 180;

      if (dist < maxDist) {
        const t = 1 - dist / maxDist;
        d.alpha += (d.baseAlpha + t * 0.35 - d.alpha) * 0.15;
        d.radius += (2 + t * 2.5 - d.radius) * 0.15;
      } else {
        d.alpha += (d.baseAlpha - d.alpha) * 0.05;
        d.radius += (2 - d.radius) * 0.05;
      }

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
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

  window.addEventListener('resize', resize);
  resize();
  draw();

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Fade-in sections on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.section').forEach((section) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
})();

// CSS class for visible sections
const style = document.createElement('style');
style.textContent = '.section.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
