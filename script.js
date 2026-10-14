/**
 * ============================================================================
 * 🌸 THIỆP 20/10 RẠNG RỠ - HIỆU ỨNG PHONG BÌ & BÙNG NỔ HOA BAY
 * ============================================================================
 * Chú thích:
 * - Tập trung bùng nổ: Hoa cúc hoạ mi, hoa hồng nhỏ, bó hoa ruy băng, cánh hoa.
 * - Tuyệt đối hạn chế tối đa trái tim (tập trung 100% vào các loài hoa thanh khiết).
 * - Tự động chuyển giao diện sau khi hoa bay kết thúc.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const envelopeScreen = document.getElementById('envelope-screen');
  const cardScreen = document.getElementById('card-screen');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const bouncingArrow = document.querySelector('.bouncing-arrow-wrapper');
  
  // Canvas Elements
  const canvas = document.getElementById('flower-canvas');
  const ctx = canvas.getContext('2d');

  // Audio Elements
  const musicBtn = document.getElementById('music-toggle-btn');
  const bgAudio = document.getElementById('bg-audio');

  // Card Content & Buttons
  const replayBtn = document.getElementById('replay-btn');
  const toastNotification = document.getElementById('toast-notification');

  // State
  let isEnvelopeOpened = false;
  let particles = [];
  let ambientParticles = [];
  let isAnimationRunning = false;
  let isMusicPlaying = false;

  // Resize Canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ==========================================================================
  // HỆ THỐNG VẼ HOA CANVAS (HOA CÚC, HOA HỒNG NHỎ, BÓ HOA, CÁNH HOA, ÁNH SAO)
  // ==========================================================================

  // 1. Vẽ Hoa Cúc (Daisy) - Cánh trắng tinh khôi, nhụy vàng rực rỡ
  function drawDaisy(ctx, size) {
    const petalCount = 10;
    const petalLength = size * 0.48;
    const petalWidth = size * 0.18;

    ctx.save();
    // Vẽ cánh hoa cúc xung quanh
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 2 * Math.PI) / petalCount;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(petalLength * 0.6, 0, petalLength * 0.5, petalWidth, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 2;
      ctx.fill();
      ctx.restore();
    }

    // Nhụy hoa cúc vàng rực rỡ ở giữa
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, size * 0.22);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.6, '#f59e0b');
    grad.addColorStop(1, '#d97706');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  // 2. Vẽ Hoa Hồng Nhỏ (Mini Rose) - Từng lớp cánh cuộn tròn lãng mạn
  function drawMiniRose(ctx, size, colorBase = '#f43f5e') {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = colorBase;
    ctx.fill();

    // Các lớp cánh hồng xoắn tròn
    ctx.lineWidth = size * 0.1;
    ctx.strokeStyle = '#ffe4e6';
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.28, 0.4, 2.8);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.18, 2.4, 5.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = '#fff1f2';
    ctx.fill();

    ctx.restore();
  }

  // 3. Vẽ Bó Hoa Rực Rỡ (Flower Bouquet 💐)
  function drawBouquet(ctx, size) {
    ctx.save();
    // Giấy gói hoa hình chóp nón (kraft paper cone)
    ctx.beginPath();
    ctx.moveTo(0, size * 0.45);
    ctx.lineTo(-size * 0.28, -size * 0.05);
    ctx.lineTo(size * 0.28, -size * 0.05);
    ctx.closePath();
    ctx.fillStyle = '#d97706';
    ctx.fill();

    // Ruy băng thắt nơ
    ctx.beginPath();
    ctx.arc(0, size * 0.2, size * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Các bông hoa cúc và hoa hồng bung xòe bên trên bó hoa
    // Bông hoa cúc chính giữa
    ctx.save();
    ctx.translate(0, -size * 0.18);
    drawDaisy(ctx, size * 0.4);
    ctx.restore();

    // Bông hoa hồng mini bên trái
    ctx.save();
    ctx.translate(-size * 0.2, -size * 0.1);
    drawMiniRose(ctx, size * 0.35, '#ec4899');
    ctx.restore();

    // Bông hoa hồng mini bên phải
    ctx.save();
    ctx.translate(size * 0.2, -size * 0.1);
    drawMiniRose(ctx, size * 0.35, '#f43f5e');
    ctx.restore();

    ctx.restore();
  }

  // 4. Vẽ Cánh Hoa Bay (Fluttering Petal)
  function drawPetal(ctx, size, color = '#fbcfe8') {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.bezierCurveTo(size * 0.4, -size * 0.3, size * 0.4, size * 0.3, 0, size * 0.5);
    ctx.bezierCurveTo(-size * 0.4, size * 0.3, -size * 0.4, -size * 0.3, 0, -size * 0.5);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  // 5. Vẽ Bụi Sao Vàng Lấp Lánh (Golden Sparkle)
  function drawSparkle(ctx, size) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(0, -size);
      ctx.lineTo(size * 0.2, -size * 0.2);
    }
    ctx.closePath();
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  // ==========================================================================
  // KHỞI TẠO CÁC HẠT HOA BÙNG NỔ (BURST PARTICLES)
  // ==========================================================================
  function createFlowerExplosion(originX, originY) {
    particles = [];
    const particleCount = 140; // 140 hạt hoa bay ngợp màn hình rực rỡ

    for (let i = 0; i < particleCount; i++) {
      // Tỉ lệ xuất hiện:
      // - 40% Hoa cúc (Daisy)
      // - 30% Hoa hồng nhỏ (Mini Rose)
      // - 15% Bó hoa (Bouquet)
      // - 15% Cánh hoa bay & bụi sao lấp lánh
      // Tuyệt đối không dùng trái tim
      const randType = Math.random();
      let type = 'daisy';
      let size = Math.random() * 18 + 18;

      if (randType < 0.38) {
        type = 'daisy';
        size = Math.random() * 16 + 22;
      } else if (randType < 0.68) {
        type = 'rose';
        size = Math.random() * 14 + 18;
      } else if (randType < 0.85) {
        type = 'bouquet';
        size = Math.random() * 16 + 28;
      } else if (randType < 0.95) {
        type = 'petal';
        size = Math.random() * 10 + 12;
      } else {
        type = 'sparkle';
        size = Math.random() * 8 + 8;
      }

      // Vận tốc bắn lên từ miệng phong bì hình phễu tỏa ra
      const angle = (Math.random() * 120 + 30) * (Math.PI / 180); // Từ 30 độ đến 150 độ hướng lên
      const speed = Math.random() * 14 + 7;

      particles.push({
        x: originX + (Math.random() - 0.5) * 80,
        y: originY,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1) * 0.85,
        vy: -Math.sin(angle) * speed * 1.3,
        gravity: 0.22,
        drag: 0.985,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        size: size,
        alpha: 1,
        fadeSpeed: Math.random() * 0.003 + 0.005,
        type: type,
        color: type === 'rose' 
          ? (Math.random() > 0.5 ? '#f43f5e' : '#fb7185') 
          : (Math.random() > 0.5 ? '#fce7f3' : '#fed7aa'),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.08 + 0.04
      });
    }

    if (!isAnimationRunning) {
      isAnimationRunning = true;
      requestAnimationFrame(renderLoop);
    }
  }

  // Khởi tạo các cánh hoa bay nhẹ nhàng nền màn hình sau khi mở thiệp
  function createAmbientPetals() {
    ambientParticles = [];
    const count = 25;
    for (let i = 0; i < count; i++) {
      ambientParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 1.2 - 0.6,
        vy: Math.random() * 1.2 + 0.8,
        size: Math.random() * 12 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        type: Math.random() > 0.6 ? 'daisy' : 'petal',
        color: '#fbcfe8',
        alpha: Math.random() * 0.4 + 0.35,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03
      });
    }
  }

  // VÒNG LẶP RENDER CHÍNH (60FPS)
  function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Render các hạt hoa bùng nổ
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;

      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.alpha -= p.fadeSpeed;

      if (p.alpha <= 0 || p.y > canvas.height + 60) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      // Hiệu ứng lật 3D nhẹ khi rơi trong gió
      ctx.scale(Math.cos(p.wobble), 1);
      ctx.rotate(p.rotation);

      if (p.type === 'daisy') {
        drawDaisy(ctx, p.size);
      } else if (p.type === 'rose') {
        drawMiniRose(ctx, p.size, p.color);
      } else if (p.type === 'bouquet') {
        drawBouquet(ctx, p.size);
      } else if (p.type === 'petal') {
        drawPetal(ctx, p.size, p.color);
      } else if (p.type === 'sparkle') {
        drawSparkle(ctx, p.size);
      }

      ctx.restore();
    }

    // 2. Render các cánh hoa bay nền nhẹ nhàng (khi đã mở thiệp)
    if (isEnvelopeOpened && ambientParticles.length > 0) {
      for (let i = 0; i < ambientParticles.length; i++) {
        const ap = ambientParticles[i];
        ap.x += ap.vx + Math.sin(ap.wobble) * 0.5;
        ap.y += ap.vy;
        ap.rotation += ap.rotationSpeed;
        ap.wobble += ap.wobbleSpeed;

        if (ap.y > canvas.height + 20) {
          ap.y = -20;
          ap.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.globalAlpha = ap.alpha;
        ctx.translate(ap.x, ap.y);
        ctx.scale(Math.cos(ap.wobble), 1);
        ctx.rotate(ap.rotation);

        if (ap.type === 'daisy') {
          drawDaisy(ctx, ap.size);
        } else {
          drawPetal(ctx, ap.size, ap.color);
        }

        ctx.restore();
      }
    }

    if (particles.length > 0 || (isEnvelopeOpened && ambientParticles.length > 0)) {
      requestAnimationFrame(renderLoop);
    } else {
      isAnimationRunning = false;
    }
  }

  // ==========================================================================
  // HÀNH ĐỘNG MỞ PHONG BÌ THƯ
  // ==========================================================================
  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // 1. Mở nắp phong bì bằng CSS 3D
    envelopeWrapper.classList.add('open');

    // 2. Ẩn mũi tên màu xanh dương
    if (bouncingArrow) {
      bouncingArrow.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      bouncingArrow.style.opacity = '0';
      bouncingArrow.style.transform = 'translateY(-20px)';
    }

    // 3. Tính toán toạ độ miệng phong bì để hoa bùng nổ chính xác
    const rect = envelopeWrapper.getBoundingClientRect();
    const burstX = rect.left + rect.width / 2;
    const burstY = rect.top + rect.height * 0.35;

    // 4. Kích hoạt bùng nổ hoa bay
    createFlowerExplosion(burstX, burstY);

    // Tự động phát nhạc nền nếu chưa bật
    tryPlayMusic();

    // 5. Sau khi hiệu ứng hoa bung xòe rực rỡ kết thúc (~2.4 giây), tự động chuyển sang nội dung thiệp
    setTimeout(() => {
      // Ẩn màn hình phong bì
      envelopeScreen.classList.remove('active');

      // Hiện màn hình thiệp với nền tone đỏ đô ấm áp, sang trọng
      cardScreen.classList.add('active');

      // Khởi động các cánh hoa bay nhẹ nhàng nền màn hình
      createAmbientPetals();
      if (!isAnimationRunning) {
        isAnimationRunning = true;
        requestAnimationFrame(renderLoop);
      }

      // Thông báo nhỏ xinh
      showToast('Chúc cậu 20/10 ngập tràn niềm vui và rạng rỡ! 💐');
    }, 2400);
  }

  envelopeWrapper.addEventListener('click', openEnvelope);
  envelopeWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  // ==========================================================================
  // XEM LẠI KHOẢNH KHẮC MỞ THIỆP
  // ==========================================================================
  replayBtn.addEventListener('click', () => {
    isEnvelopeOpened = false;
    envelopeWrapper.classList.remove('open');
    ambientParticles = [];

    // Chuyển lại màn hình phong bì
    cardScreen.classList.remove('active');
    envelopeScreen.classList.add('active');

    if (bouncingArrow) {
      bouncingArrow.style.opacity = '1';
      bouncingArrow.style.transform = 'translateY(0)';
    }

    showToast('Hãy chạm lại vào phong bì để ngắm hoa bung tỏa nhó! 🌼');
  });



  // ==========================================================================
  // NHẠC NỀN LÃNG MẠN (PHÁT LẶP VÔ HẠN - INFINITE LOOP)
  // ==========================================================================
  if (bgAudio) {
    // 1. Cài đặt phát lặp vô hạn trực tiếp
    bgAudio.loop = true;

    // 2. Dự phòng: Khi kết thúc bài, lập tức tua về 0 và phát lại (vòng lặp vô hạn)
    bgAudio.addEventListener('ended', () => {
      bgAudio.currentTime = 0;
      bgAudio.play().catch(() => {});
    });

    // 3. Tự động đồng bộ giao diện nút bấm theo trạng thái audio thực tế
    bgAudio.addEventListener('play', () => {
      isMusicPlaying = true;
      if (musicBtn) musicBtn.classList.add('playing');
    });

    bgAudio.addEventListener('pause', () => {
      isMusicPlaying = false;
      if (musicBtn) musicBtn.classList.remove('playing');
    });
  }

  function tryPlayMusic() {
    if (!bgAudio) return;
    bgAudio.volume = 0.55;
    bgAudio.play().then(() => {
      isMusicPlaying = true;
      if (musicBtn) musicBtn.classList.add('playing');
    }).catch(() => {
      // Trình duyệt chặn autoplay khi chưa có tương tác trực tiếp
    });
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!bgAudio) return;
      if (isMusicPlaying) {
        bgAudio.pause();
        showToast('Đã tắt giai điệu');
      } else {
        bgAudio.play().then(() => {
          showToast('Đang phát giai điệu lãng mạn 🎵');
        }).catch(() => {
          showToast('Không thể phát nhạc, hãy kiểm tra file âm thanh!');
        });
      }
    });
  }

  // Tự động kích hoạt phát nhạc ngay từ tương tác chạm/nhấp chuột đầu tiên bất kỳ trên trang
  const handleFirstInteraction = () => {
    tryPlayMusic();
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
  };
  document.addEventListener('click', handleFirstInteraction, { once: true });
  document.addEventListener('touchstart', handleFirstInteraction, { once: true });

  // ==========================================================================
  // TOAST THÔNG BÁO NHẸ
  // ==========================================================================
  let toastTimer = null;
  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }
});
