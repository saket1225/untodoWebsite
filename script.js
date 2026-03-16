// ============================================
// untodo — Landing Page Scripts
// Interactive features + animations
// ============================================

(function () {
  'use strict';

  // ============================================
  // Confetti System
  // ============================================

  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiParticles = [];
  let confettiRunning = false;

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function burstConfetti(x, y, count) {
    count = count || 35;
    const colors = ['#4ade80', '#ffffff', '#4a9eff', '#bf5fff', '#facc15', '#f87171', '#60a5fa'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const velocity = 4 + Math.random() * 8;
      confettiParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 4,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        gravity: 0.15 + Math.random() * 0.1,
        decay: 0.012 + Math.random() * 0.008,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }
    if (!confettiRunning) animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiRunning = true;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles = confettiParticles.filter(function (p) { return p.alpha > 0.01; });

    for (let i = 0; i < confettiParticles.length; i++) {
      const p = confettiParticles[i];
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.alpha -= p.decay;
      p.rotation += p.rotSpeed;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation);
      confettiCtx.globalAlpha = Math.max(0, p.alpha);
      confettiCtx.fillStyle = p.color;

      if (p.shape === 'rect') {
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }

      confettiCtx.restore();
    }

    if (confettiParticles.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiRunning = false;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  resizeConfetti();
  window.addEventListener('resize', resizeConfetti);

  // ============================================
  // Hero Dot Grid — Enhanced with click
  // ============================================

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
          toggled: false,
          toggleAlpha: 0,
          ripple: 0,
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

      // Handle toggled state
      if (d.toggled) {
        d.toggleAlpha += (0.7 - d.toggleAlpha) * 0.08;
      } else {
        d.toggleAlpha += (0 - d.toggleAlpha) * 0.06;
      }

      // Ripple effect
      if (d.ripple > 0) {
        d.ripple *= 0.92;
        if (d.ripple < 0.01) d.ripple = 0;
      }

      const finalAlpha = Math.max(d.alpha, d.toggleAlpha);
      const finalRadius = d.radius + d.ripple * 4;

      heroCtx.beginPath();
      heroCtx.arc(d.x, d.y, finalRadius, 0, Math.PI * 2);
      if (d.toggled) {
        heroCtx.fillStyle = 'rgba(74, 222, 128, ' + finalAlpha + ')';
      } else {
        heroCtx.fillStyle = 'rgba(255, 255, 255, ' + finalAlpha + ')';
      }
      heroCtx.fill();

      // Draw ripple ring
      if (d.ripple > 0.05) {
        heroCtx.beginPath();
        heroCtx.arc(d.x, d.y, finalRadius + d.ripple * 12, 0, Math.PI * 2);
        heroCtx.strokeStyle = 'rgba(74, 222, 128, ' + (d.ripple * 0.5) + ')';
        heroCtx.lineWidth = 1;
        heroCtx.stroke();
      }
    }

    raf = requestAnimationFrame(drawHero);
  }

  // Mouse/touch events for hero
  heroCanvas.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  heroCanvas.addEventListener('mouseleave', function () {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  heroCanvas.addEventListener('touchmove', function (e) {
    var t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
  }, { passive: true });

  heroCanvas.addEventListener('touchend', function () {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Click to toggle dots
  heroCanvas.addEventListener('click', function (e) {
    const clickX = e.clientX;
    const clickY = e.clientY;
    let closest = null;
    let closestDist = Infinity;

    for (let i = 0; i < dots.length; i++) {
      const dx = dots[i].x - clickX;
      const dy = dots[i].y - clickY;
      const dist = dx * dx + dy * dy;
      if (dist < closestDist) {
        closestDist = dist;
        closest = dots[i];
      }
    }

    if (closest && closestDist < 900) { // within ~30px
      closest.toggled = !closest.toggled;
      closest.ripple = 1;

      // Ripple effect on nearby dots
      for (let i = 0; i < dots.length; i++) {
        const dx = dots[i].x - closest.x;
        const dy = dots[i].y - closest.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          dots[i].ripple = Math.max(dots[i].ripple, (1 - dist / 120) * 0.5);
        }
      }

      if (closest.toggled) {
        burstConfetti(clickX, clickY, 12);
      }
    }
  });

  // Touch tap for mobile
  heroCanvas.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const clickX = touch.clientX;
      const clickY = touch.clientY;
      let closest = null;
      let closestDist = Infinity;

      for (let i = 0; i < dots.length; i++) {
        const dx = dots[i].x - clickX;
        const dy = dots[i].y - clickY;
        const dist = dx * dx + dy * dy;
        if (dist < closestDist) {
          closestDist = dist;
          closest = dots[i];
        }
      }

      if (closest && closestDist < 1600) {
        closest.toggled = !closest.toggled;
        closest.ripple = 1;
        if (closest.toggled) {
          burstConfetti(clickX, clickY, 12);
        }
      }
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    var dpr = window.devicePixelRatio || 1;
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

  // ============================================
  // Phone Canvas Dot Grids — with pulse
  // ============================================

  var themeConfigs = {
    minimal: {
      bg: '#0a0a0a',
      past: function (r) { return 'rgba(68, 68, 68, ' + (0.4 + r * 0.4) + ')'; },
      today: '#ffffff',
      todayRing: 'rgba(74, 158, 255, 0.5)',
      future: 'rgba(255, 255, 255, 0.04)',
    },
    terminal: {
      bg: '#040a04',
      past: function (r) { return 'rgba(0, 255, 65, ' + (0.2 + r * 0.3) + ')'; },
      today: '#00ff41',
      todayRing: 'rgba(0, 255, 65, 0.3)',
      future: 'rgba(0, 255, 65, 0.03)',
    },
    neon: {
      bg: '#0a0410',
      past: function (r) { return 'rgba(191, 95, 255, ' + (0.2 + r * 0.35) + ')'; },
      today: '#bf5fff',
      todayRing: 'rgba(191, 95, 255, 0.4)',
      future: 'rgba(191, 95, 255, 0.03)',
    },
    cosmic: {
      bg: '#06060f',
      past: function (r) { return 'rgba(122, 162, 255, ' + (0.2 + r * 0.3) + ')'; },
      today: '#7aa2ff',
      todayRing: 'rgba(122, 162, 255, 0.3)',
      future: 'rgba(122, 162, 255, 0.03)',
    },
    blueprint: {
      bg: '#04080e',
      past: function (r) { return 'rgba(90, 175, 255, ' + (0.2 + r * 0.3) + ')'; },
      today: '#5aafff',
      todayRing: 'rgba(90, 175, 255, 0.3)',
      future: 'rgba(90, 175, 255, 0.03)',
    },
  };

  var phonePulseTime = 0;
  var phoneCanvases = [];

  function drawPhoneCanvas(canvas, pulsePhase) {
    var theme = canvas.dataset.theme || 'minimal';
    var config = themeConfigs[theme];
    var parent = canvas.parentElement;
    var w = parent.offsetWidth;
    var h = parent.offsetHeight;
    var dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    ctx.fillStyle = config.bg;
    ctx.fillRect(0, 0, w, h);

    var cols = 13;
    var padding = 20;
    var spacing = (w - padding * 2) / cols;
    var dotR = spacing * 0.17;
    var startY = h * 0.30;
    var endY = h * 0.80;
    var rows = Math.floor((endY - startY) / spacing);
    var total = cols * rows;
    var pastCount = Math.floor(total * 0.18);
    var todayIdx = pastCount;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var i = r * cols + c;
        var x = padding + c * spacing + spacing / 2;
        var y = startY + r * spacing + spacing / 2;

        ctx.beginPath();

        if (i < pastCount) {
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = config.past(Math.random());
          ctx.fill();
        } else if (i === todayIdx) {
          // Pulsing today dot
          var pulse = pulsePhase !== undefined ? (Math.sin(pulsePhase) * 0.5 + 0.5) : 1;
          var pulseRadius = dotR + pulse * 2;

          // Outer glow
          ctx.beginPath();
          ctx.arc(x, y, pulseRadius + 4 + pulse * 3, 0, Math.PI * 2);
          ctx.fillStyle = config.todayRing.replace(/[\d.]+\)$/, (0.1 + pulse * 0.15) + ')');
          ctx.fill();

          // Ring
          ctx.beginPath();
          ctx.arc(x, y, pulseRadius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = config.todayRing;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Dot
          ctx.beginPath();
          ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
          ctx.fillStyle = config.today;
          ctx.fill();
        } else {
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = config.future;
          ctx.fill();
        }
      }
    }
  }

  function initPhoneCanvases() {
    phoneCanvases = [];
    document.querySelectorAll('.phone-canvas').forEach(function (canvas) {
      phoneCanvases.push(canvas);
      drawPhoneCanvas(canvas, 0);
    });
  }

  // Animate phone canvases with pulsing today dot
  function animatePhones() {
    phonePulseTime += 0.03;
    for (var i = 0; i < phoneCanvases.length; i++) {
      // Only redraw if the phone is visible (active or nearby)
      var mockup = phoneCanvases[i].closest('.phone-mockup');
      if (mockup && mockup.classList.contains('active')) {
        drawPhoneCanvas(phoneCanvases[i], phonePulseTime);
      }
    }
    requestAnimationFrame(animatePhones);
  }

  initPhoneCanvases();
  animatePhones();

  window.addEventListener('resize', function () {
    phoneCanvases.forEach(function (c) { drawPhoneCanvas(c, phonePulseTime); });
  });

  // ============================================
  // Wallpaper Theme Tabs
  // ============================================

  var themeTabs = document.querySelectorAll('.theme-tab');
  var phoneMockups = document.querySelectorAll('.phone-mockup');
  var wallpaperTrack = document.getElementById('wallpaper-track');

  themeTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var theme = this.dataset.theme;

      // Update active tab
      themeTabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      // Update active phone mockup
      phoneMockups.forEach(function (m) {
        if (m.dataset.themeId === theme) {
          m.classList.add('active');
          // Scroll into view
          if (wallpaperTrack) {
            var trackRect = wallpaperTrack.getBoundingClientRect();
            var mockupRect = m.getBoundingClientRect();
            var scrollLeft = wallpaperTrack.scrollLeft + (mockupRect.left - trackRect.left) - (trackRect.width / 2) + (mockupRect.width / 2);
            wallpaperTrack.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
          // Redraw this canvas with pulse
          var canvas = m.querySelector('.phone-canvas');
          if (canvas) drawPhoneCanvas(canvas, phonePulseTime);
        } else {
          m.classList.remove('active');
        }
      });
    });
  });

  // Click phone mockup to select
  phoneMockups.forEach(function (mockup) {
    mockup.addEventListener('click', function () {
      var themeId = this.dataset.themeId;
      phoneMockups.forEach(function (m) { m.classList.remove('active'); });
      this.classList.add('active');
      themeTabs.forEach(function (t) {
        t.classList.toggle('active', t.dataset.theme === themeId);
      });
      var canvas = this.querySelector('.phone-canvas');
      if (canvas) drawPhoneCanvas(canvas, phonePulseTime);
    });
  });

  // ============================================
  // CTA Dot Grid
  // ============================================

  var ctaCanvas = document.getElementById('cta-dots');
  if (ctaCanvas) {
    function drawCtaDots() {
      var parent = ctaCanvas.parentElement;
      var w = parent.offsetWidth;
      var h = parent.offsetHeight;
      var dpr = window.devicePixelRatio || 1;

      ctaCanvas.width = w * dpr;
      ctaCanvas.height = h * dpr;
      ctaCanvas.style.width = w + 'px';
      ctaCanvas.style.height = h + 'px';

      var ctx = ctaCanvas.getContext('2d');
      ctx.scale(dpr, dpr);

      var spacing = 40;
      var cols = Math.ceil(w / spacing) + 1;
      var rows = Math.ceil(h / spacing) + 1;
      var ox = (w - (cols - 1) * spacing) / 2;
      var oy = (h - (rows - 1) * spacing) / 2;

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var x = ox + c * spacing;
          var y = oy + r * spacing;
          var dx = x - w / 2;
          var dy = y - h / 2;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var maxDist = Math.max(w, h) * 0.5;
          var fade = Math.max(0, 1 - dist / maxDist);
          var alpha = 0.015 + fade * 0.05;

          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
          ctx.fill();
        }
      }
    }

    drawCtaDots();
    window.addEventListener('resize', drawCtaDots);
  }

  // ============================================
  // Heatmap — with tooltips & fake data
  // ============================================

  var heatmapRow = document.getElementById('heatmap-row');
  if (heatmapRow) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date();

    for (var i = 0; i < 91; i++) {
      var dot = document.createElement('div');
      dot.className = 'heatmap-dot';

      // Generate fake completion data
      var daysAgo = 90 - i;
      var date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      var completion = Math.floor(Math.random() * 100);

      // Visual intensity
      if (completion > 80) {
        dot.style.background = 'rgba(74, 222, 128, ' + (0.3 + (completion / 100) * 0.5) + ')';
      } else if (completion > 50) {
        dot.style.background = 'rgba(255, 255, 255, ' + (0.12 + (completion / 100) * 0.2) + ')';
      } else if (completion > 20) {
        dot.style.background = 'rgba(255, 255, 255, ' + (0.05 + (completion / 100) * 0.08) + ')';
      }

      // Tooltip with date and completion
      var dateStr = months[date.getMonth()] + ' ' + date.getDate();
      dot.setAttribute('data-tooltip', dateStr + ' \u2014 ' + completion + '% done');

      // Today marker
      if (daysAgo === 0) {
        dot.style.background = '#4ade80';
        dot.style.boxShadow = '0 0 6px rgba(74, 222, 128, 0.4)';
        dot.setAttribute('data-tooltip', dateStr + ' \u2014 Today');
      }

      heatmapRow.appendChild(dot);
    }
  }

  // ============================================
  // Task Management — Interactive
  // ============================================

  var taskDemo = document.getElementById('task-demo');
  var gradeDisplay = document.getElementById('task-grade-display');
  var progressPercent = document.getElementById('progress-percent');
  var progressRingFill = document.querySelector('.progress-ring-fill');

  function getTaskItems() {
    return taskDemo ? taskDemo.querySelectorAll('.task-item') : [];
  }

  function updateProgress() {
    var items = getTaskItems();
    var total = items.length;
    if (total === 0) return;

    var completed = 0;
    items.forEach(function (item) {
      if (item.classList.contains('completed')) completed++;
    });

    var pct = Math.round((completed / total) * 100);

    // Update ring
    if (progressRingFill) {
      var circumference = 327;
      var offset = circumference - (pct / 100) * circumference;
      progressRingFill.style.strokeDashoffset = offset;
    }

    // Update percentage text
    if (progressPercent) {
      progressPercent.textContent = pct + '%';
    }

    // Update grade
    var grade, gradeClass;
    if (pct >= 90) { grade = 'A'; gradeClass = 'grade-a'; }
    else if (pct >= 75) { grade = 'B'; gradeClass = 'grade-b'; }
    else if (pct >= 55) { grade = 'C'; gradeClass = 'grade-c'; }
    else if (pct >= 35) { grade = 'D'; gradeClass = 'grade-d'; }
    else { grade = 'F'; gradeClass = 'grade-f'; }

    if (gradeDisplay) {
      gradeDisplay.textContent = grade;
      gradeDisplay.className = 'task-grade ' + gradeClass;
    }
  }

  // Task check click handler
  if (taskDemo) {
    taskDemo.addEventListener('click', function (e) {
      var check = e.target.closest('.task-check');
      if (!check) return;

      var item = check.closest('.task-item');
      if (!item) return;

      var wasCompleted = item.classList.contains('completed');

      if (wasCompleted) {
        // Uncomplete
        item.classList.remove('completed');
        check.classList.remove('checked');
        item.classList.add('uncompleting');
        setTimeout(function () { item.classList.remove('uncompleting'); }, 300);
      } else {
        // Complete with confetti
        item.classList.add('completed', 'completing');
        check.classList.add('checked');

        // Confetti burst from the checkbox
        var rect = check.getBoundingClientRect();
        burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);

        setTimeout(function () { item.classList.remove('completing'); }, 400);
      }

      updateProgress();
    });

    // Task input — add new tasks
    var taskInput = taskDemo.querySelector('.task-input');
    if (taskInput) {
      taskInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && this.value.trim()) {
          addTask(this.value.trim());
          this.value = '';
        }
      });
    }
  }

  function addTask(title) {
    var inputWrap = taskDemo.querySelector('.task-input-wrap');
    if (!inputWrap) return;

    var item = document.createElement('div');
    item.className = 'task-item task-new';
    item.setAttribute('data-priority', 'normal');
    item.innerHTML =
      '<div class="task-priority-bar priority-normal"></div>' +
      '<div class="task-check">' +
      '<svg class="check-icon" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</div>' +
      '<div class="task-info">' +
      '<span class="task-title">' + escapeHtml(title) + '</span>' +
      '<span class="task-meta">Just added</span>' +
      '</div>';

    taskDemo.insertBefore(item, inputWrap);

    // Remove animation class after it plays
    setTimeout(function () { item.classList.remove('task-new'); }, 400);

    updateProgress();
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // Pomodoro Timer — Functional
  // ============================================

  var timerDemo = document.getElementById('timer-demo');
  var timerMin = document.getElementById('timer-min');
  var timerSec = document.getElementById('timer-sec');
  var timerPlay = document.getElementById('timer-play');
  var timerPresets = document.getElementById('timer-presets');

  var timerState = {
    running: false,
    total: 25 * 60,
    remaining: 25 * 60,
    interval: null,
  };

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return { min: m < 10 ? '0' + m : '' + m, sec: s < 10 ? '0' + s : '' + s };
  }

  function updateTimerDisplay() {
    var t = formatTime(timerState.remaining);
    if (timerMin) timerMin.textContent = t.min;
    if (timerSec) timerSec.textContent = t.sec;
  }

  function startTimer() {
    if (timerState.remaining <= 0) {
      timerState.remaining = timerState.total;
    }
    timerState.running = true;
    if (timerDemo) timerDemo.classList.add('running');

    timerState.interval = setInterval(function () {
      timerState.remaining--;
      updateTimerDisplay();

      if (timerState.remaining <= 0) {
        pauseTimer();
        // Flash effect on completion
        if (timerDemo) {
          timerDemo.style.animation = 'none';
          setTimeout(function () {
            timerState.remaining = timerState.total;
            updateTimerDisplay();
          }, 1000);
        }
        // Celebration confetti
        if (timerPlay) {
          var rect = timerPlay.getBoundingClientRect();
          burstConfetti(rect.left + rect.width / 2, rect.top, 40);
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    timerState.running = false;
    if (timerDemo) timerDemo.classList.remove('running');
    if (timerState.interval) {
      clearInterval(timerState.interval);
      timerState.interval = null;
    }
  }

  if (timerPlay) {
    timerPlay.addEventListener('click', function () {
      if (timerState.running) {
        pauseTimer();
      } else {
        startTimer();
      }
    });
  }

  // Timer presets
  if (timerPresets) {
    timerPresets.addEventListener('click', function (e) {
      var tag = e.target.closest('.preset-tag');
      if (!tag) return;

      var minutes = parseInt(tag.dataset.minutes, 10);
      if (isNaN(minutes)) return;

      // Stop current timer
      pauseTimer();

      // Update active state
      timerPresets.querySelectorAll('.preset-tag').forEach(function (t) {
        t.classList.remove('active');
      });
      tag.classList.add('active');

      // Set new time
      timerState.total = minutes * 60;
      timerState.remaining = minutes * 60;
      updateTimerDisplay();
    });
  }

  // ============================================
  // AI Chat — Interactive
  // ============================================

  var aiMessages = document.getElementById('ai-messages');
  var aiInput = document.getElementById('ai-input');
  var aiSend = document.getElementById('ai-send');
  var aiTyping = document.getElementById('ai-typing');

  var aiResponses = {
    hello: "Hey. Let's skip small talk \u2014 what's on your plate today?",
    hi: "Hey. Let's skip small talk \u2014 what's on your plate today?",
    hey: "Hey. Let's skip small talk \u2014 what's on your plate today?",
    help: "I can manage your tasks, track your time, write daily summaries, and call you out when you're slacking. Try me.",
    tasks: "You've got tasks to do. 2 done, 2 to go. The clock is ticking. Don't make me send a nudge.",
    motivate: "You don't need motivation. You need discipline. Close this tab and start the next task.",
    motivation: "You don't need motivation. You need discipline. Close this tab and start the next task.",
    timer: "Want a 25-minute focus session? I'll keep you honest. Hit that play button above.",
    focus: "Focus mode: screen goes dark, timer starts, distractions die. That's the untodo way.",
    wallpaper: "Your wallpaper updates every day. Each dot is a day you either showed up or didn't. No hiding.",
    streak: "12 days and counting. Break it and I'll know. I always know.",
    grade: "Your grade is based on task completion. 90%+ is an A. Anything below 35%... we need to talk.",
    who: "I'm Silicon. Your AI accountability partner. I don't do pep talks. I do results.",
    what: "I'm the AI inside untodo. I manage tasks, send nudges, write summaries, and hold you accountable.",
    sleep: "Sleep is important. But are your tasks done? If not, you know what to do first.",
    procrastinate: "I see you typing instead of working. Interesting strategy. Let me know how that works out.",
    procrastinating: "The fact that you're chatting with me instead of doing your tasks tells me everything I need to know.",
    bored: "Bored? That's your brain looking for easy dopamine. Open your task list instead.",
    tired: "Rest when the work is done. Or at least rest after finishing one more task.",
    quit: "You can quit the app. You can't quit the accountability. I'll still be here tomorrow.",
    thanks: "Don't thank me. Show me a completed task list.",
    thank: "Don't thank me. Show me a completed task list.",
    nice: "Flattery won't get your tasks done. But I appreciate it. Now get back to work.",
  };

  var defaultResponses = [
    "Interesting. But is it getting your tasks done?",
    "I hear you. Now let's channel that energy into something productive.",
    "Noted. Want me to add that to your task list?",
    "That's cool and all, but have you checked your task list today?",
    "I'm an AI, not a therapist. But I can help you get things done.",
    "Every second you spend here is a second not spent on your tasks. Just saying.",
    "I process your words. I judge your productivity. Let's focus on the latter.",
  ];

  function getAIResponse(input) {
    var lower = input.toLowerCase().replace(/[^a-z ]/g, '');
    var words = lower.split(/\s+/);

    for (var i = 0; i < words.length; i++) {
      if (aiResponses[words[i]]) {
        return aiResponses[words[i]];
      }
    }

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  function sendAIMessage() {
    if (!aiInput || !aiMessages) return;
    var text = aiInput.value.trim();
    if (!text) return;

    aiInput.value = '';

    // Add user message
    var userMsg = document.createElement('div');
    userMsg.className = 'ai-message ai-outgoing';
    userMsg.innerHTML = '<span>' + escapeHtml(text) + '</span>';
    aiMessages.appendChild(userMsg);

    // Scroll to bottom
    aiMessages.scrollTop = aiMessages.scrollHeight;

    // Show typing indicator
    if (aiTyping) aiTyping.classList.add('visible');
    aiMessages.scrollTop = aiMessages.scrollHeight;

    // AI response after delay
    var delay = 800 + Math.random() * 1200;
    setTimeout(function () {
      if (aiTyping) aiTyping.classList.remove('visible');

      var response = getAIResponse(text);
      var aiMsg = document.createElement('div');
      aiMsg.className = 'ai-message ai-incoming';
      aiMsg.innerHTML = '<span class="ai-label">Silicon</span><span>' + escapeHtml(response) + '</span>';
      aiMessages.appendChild(aiMsg);
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }, delay);
  }

  if (aiInput) {
    aiInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendAIMessage();
      }
    });
  }

  if (aiSend) {
    aiSend.addEventListener('click', sendAIMessage);
  }

  // ============================================
  // Focus Section — Interactive Presets
  // ============================================

  var focusPresets = document.getElementById('focus-presets');
  var focusTimerTime = document.getElementById('focus-timer-time');
  var focusTimerLabel = document.getElementById('focus-timer-label');
  var focusTimerBig = document.getElementById('focus-timer-big');
  var focusRingProgress = document.querySelector('.focus-ring-progress');

  var focusState = {
    running: false,
    total: 25 * 60,
    remaining: 25 * 60,
    interval: null,
    presetName: 'Classic Pomodoro',
  };

  var presetNames = {
    15: 'Spark Session',
    25: 'Classic Pomodoro',
    50: 'Coder Block',
    52: 'DeskTime Method',
    90: 'Deep Work Block',
  };

  function updateFocusDisplay() {
    var t = formatTime(focusState.remaining);
    if (focusTimerTime) focusTimerTime.textContent = t.min + ':' + t.sec;

    // Update ring progress
    if (focusRingProgress && focusState.total > 0) {
      var circumference = 565;
      var pct = focusState.remaining / focusState.total;
      var offset = circumference * (1 - pct);
      focusRingProgress.style.strokeDashoffset = offset;
    }
  }

  if (focusPresets) {
    focusPresets.addEventListener('click', function (e) {
      var item = e.target.closest('.focus-preset-item');
      if (!item) return;

      var minutes = parseInt(item.dataset.focusMinutes, 10);

      // Update active
      focusPresets.querySelectorAll('.focus-preset-item').forEach(function (p) {
        p.classList.remove('active');
      });
      item.classList.add('active');

      // Stop running timer
      if (focusState.interval) {
        clearInterval(focusState.interval);
        focusState.interval = null;
      }
      focusState.running = false;
      if (focusTimerBig) focusTimerBig.classList.remove('running');

      if (minutes > 0) {
        focusState.total = minutes * 60;
        focusState.remaining = minutes * 60;
        focusState.presetName = presetNames[minutes] || item.querySelector('.fp-name').textContent;
        if (focusTimerLabel) focusTimerLabel.textContent = focusState.presetName;
        updateFocusDisplay();
      }
    });
  }

  // Click the big timer to start/pause
  if (focusTimerBig) {
    focusTimerBig.addEventListener('click', function () {
      if (focusState.running) {
        // Pause
        focusState.running = false;
        focusTimerBig.classList.remove('running');
        if (focusState.interval) {
          clearInterval(focusState.interval);
          focusState.interval = null;
        }
        if (focusTimerLabel) focusTimerLabel.textContent = 'Paused';
      } else {
        // Start
        if (focusState.remaining <= 0) {
          focusState.remaining = focusState.total;
        }
        focusState.running = true;
        focusTimerBig.classList.add('running');
        if (focusTimerLabel) focusTimerLabel.textContent = focusState.presetName;

        focusState.interval = setInterval(function () {
          focusState.remaining--;
          updateFocusDisplay();

          if (focusState.remaining <= 0) {
            clearInterval(focusState.interval);
            focusState.interval = null;
            focusState.running = false;
            focusTimerBig.classList.remove('running');
            if (focusTimerLabel) focusTimerLabel.textContent = 'Complete!';

            // Celebration
            var rect = focusTimerBig.getBoundingClientRect();
            burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

            setTimeout(function () {
              focusState.remaining = focusState.total;
              updateFocusDisplay();
              if (focusTimerLabel) focusTimerLabel.textContent = focusState.presetName;
            }, 3000);
          }
        }, 1000);
      }
    });
  }

  // ============================================
  // Scroll Reveal
  // ============================================

  var revealElements = document.querySelectorAll('[data-reveal], .section-header');

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach(function (el) { revealObserver.observe(el); });

  // Stagger bento cards
  document.querySelectorAll('.bento-card').forEach(function (card, i) {
    card.style.transitionDelay = i * 0.1 + 's';
  });

  // ============================================
  // Progress Ring — Scroll animation + reactivity
  // ============================================

  if (progressRingFill) {
    var ringObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Animate to current task completion state
            updateProgress();
            ringObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    // Start with full offset
    progressRingFill.style.strokeDashoffset = '327';
    var progressCard = document.getElementById('progress-card');
    if (progressCard) ringObserver.observe(progressCard);
  }

  // ============================================
  // Focus Ring — Scroll animation
  // ============================================

  if (focusRingProgress) {
    var focusObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            focusRingProgress.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            updateFocusDisplay();
            focusObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    focusRingProgress.style.strokeDashoffset = '565';
    var focusVisual = document.querySelector('.focus-visual');
    if (focusVisual) focusObserver.observe(focusVisual);
  }

  // ============================================
  // Smooth Scroll
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      var navLinksList = document.querySelector('.nav-links');
      var navToggle = document.querySelector('.nav-mobile-toggle');
      if (navLinksList) navLinksList.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
    });
  });

  // ============================================
  // Mobile Nav Toggle
  // ============================================

  var toggle = document.querySelector('.nav-mobile-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // ============================================
  // Nav scroll effect
  // ============================================

  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
    } else {
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.04)';
    }
  }, { passive: true });

})();
