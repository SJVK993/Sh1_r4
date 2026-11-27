document.addEventListener("DOMContentLoaded", () => {
  // === Automatic Footer Year ===
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // === Mobile Navigation ===
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // === Fullscreen Lightbox ===
  const cards = Array.from(document.querySelectorAll(".art-card"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const btnClose = document.getElementById("lightbox-close");
  const btnPrev = document.getElementById("lightbox-prev");
  const btnNext = document.getElementById("lightbox-next");

  let activeIndex = 0;

  function renderLightbox() {
    const img = cards[activeIndex].querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightboxCounter.textContent = `${activeIndex + 1} of ${cards.length}`;
  }

  function openLightbox(index) {
    activeIndex = index;
    renderLightbox();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showNext() {
    activeIndex = (activeIndex + 1) % cards.length;
    renderLightbox();
  }

  function showPrev() {
    activeIndex = (activeIndex - 1 + cards.length) % cards.length;
    renderLightbox();
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", () => openLightbox(index));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (btnClose) btnClose.addEventListener("click", closeLightbox);
  if (btnNext) btnNext.addEventListener("click", showNext);
  if (btnPrev) btnPrev.addEventListener("click", showPrev);

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") showNext();
    if (event.key === "ArrowLeft") showPrev();
  });

  // === Subtle Scroll Reveal ===
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // === Floating Gold Dust & Crimson Ember Particles ===
  const canvas = document.getElementById("gold-particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let particles = [];

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticle(randomY = true) {
    const isCrimson = Math.random() < 0.14;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 10,
      radius: isCrimson ? Math.random() * 1.6 + 0.8 : Math.random() * 2.1 + 0.6,
      speedY: -(Math.random() * 0.34 + 0.12),
      driftX: (Math.random() - 0.5) * 0.25,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.015 + 0.005,
      alpha: Math.random() * 0.55 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.006,
      twinklePhase: Math.random() * Math.PI * 2,
      color: isCrimson ? "196, 36, 58" : "238, 206, 134"
    };
  }

  function initParticles() {
    const count = Math.min(75, Math.max(36, Math.floor((width * height) / 22000)));
    particles = Array.from({ length: count }, () => createParticle(true));
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.swayPhase += p.swaySpeed;
      p.twinklePhase += p.twinkleSpeed;

      p.y += p.speedY;
      p.x += p.driftX + Math.sin(p.swayPhase) * 0.18;

      if (p.y < -12) {
        particles[i] = createParticle(false);
        continue;
      }
      if (p.x < -12) p.x = width + 10;
      if (p.x > width + 12) p.x = -10;

      const glowAlpha = Math.max(0.08, p.alpha * (0.65 + 0.35 * Math.sin(p.twinklePhase)));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${glowAlpha.toFixed(3)})`;
      ctx.shadowBlur = p.radius * 4.5;
      ctx.shadowColor = `rgba(${p.color}, 0.75)`;
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 180);
  });
});
