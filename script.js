// === Количество мест ===
let spots = 8;
const spotsEl = document.getElementById("spots");
if (spotsEl) {
  setInterval(() => {
    if (spots > 1) {
      spots--;
      spotsEl.textContent = `Залишилось: ${spots} місць`;
    }
  }, 60000); // каждые 60 секунд
}

// === Таймер обратного отсчёта ===
function startCountdown(duration, display) {
  let timer = duration, minutes, seconds;
  const countdownInterval = setInterval(function () {
    minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    seconds = String(timer % 60).padStart(2, '0');
    display.textContent = minutes + ":" + seconds;
    if (--timer < 0) {
      clearInterval(countdownInterval);
      display.textContent = "00:00";
    }
  }, 1000);
}

// === Слайдер отзывов ===
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const sliderTrack = document.querySelector(".slider-track");
const dotsContainer = document.getElementById("sliderDots");
const sliderContainer = document.querySelector('.slider-container');

function goToSlide(index) {
  if (!sliderTrack) return;
  currentSlide = index;
  sliderTrack.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  goToSlide(currentSlide);
}

function updateDots() {
  if (!dotsContainer) return;
  Array.from(dotsContainer.children).forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

let autoSlide = setInterval(nextSlide, 5000);
function resetAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, 5000);
}

if (sliderContainer) {
  sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
  sliderContainer.addEventListener('mouseleave', () => resetAutoSlide());
}

if (dotsContainer) {
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => {
      goToSlide(i);
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });
}

// === Частицы (анимация) ===
const canvas = document.getElementById('particles-canvas');
if (!canvas) {
  console.error("particles-canvas не найден в DOM!");
} else {
  console.log("canvas найден:", canvas);
}
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = document.querySelector(".hero").offsetHeight;

const mouse = {
  x: null,
  y: null,
  radius: 100
};

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});
canvas.addEventListener('click', (e) => {
  for (let i = 0; i < 5; i++) {
    const size = 2 + Math.random() * 2;
    const directionX = (Math.random() - 0.5) * 2;
    const directionY = (Math.random() - 0.5) * 2;
    particlesArray.push(new Particle(e.x, e.y, directionX, directionY, size, '#ff4d4d'));
  }
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
    if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
      if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
      if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function init() {
  particlesArray = [];
  const numberOfParticles = (canvas.width * canvas.height) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    const size = 2 + Math.random() * 2;
    const x = Math.random() * (canvas.width - size * 2);
    const y = Math.random() * (canvas.height - size * 2);
    const directionX = (Math.random() - 0.5) * 1;
    const directionY = (Math.random() - 0.5) * 1;
    const color = '#ff4d4d';
    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function connect() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a + 1; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distance = dx * dx + dy * dy;

      if (distance < 10000) {
        const opacity = 1 - distance / 10000;
        const mouseDx = mouse.x - particlesArray[a].x;
        const mouseDy = mouse.y - particlesArray[a].y;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        const lineWidth = mouseDistance < 150 ? 2 : 1;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 77, 77, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => p.update());
  connect();
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = document.querySelector(".hero").offsetHeight;
  init();
});

init();
animate();

const canvas2 = document.getElementById('particles-bg');
if (canvas2) {
  const ctx2 = canvas2.getContext('2d');
  let particles = [];

  function resizeCanvas2() {
    canvas2.width = canvas2.offsetWidth;
    canvas2.height = canvas2.offsetHeight;
  }
  window.addEventListener("resize", resizeCanvas2);
  resizeCanvas2();

  class GlowParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas2.width;
      this.y = Math.random() * canvas2.height;
      this.radius = Math.random() * 1.5 + 1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.dx = (Math.random() - 0.5) * 0.3;
      this.dy = (Math.random() - 0.5) * 0.3;
    }

    update() {
      this.x += this.dx;
      this.y += this.dy;

      if (this.x < 0 || this.x > canvas2.width || this.y < 0 || this.y > canvas2.height) {
        this.reset();
      }

      ctx2.beginPath();
      ctx2.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx2.fillStyle = `rgba(255, 77, 77, ${this.alpha})`;
      ctx2.fill();
    }
  }

  function initParticles2() {
    particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new GlowParticle());
    }
  }

  function animateParticles2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    particles.forEach(p => p.update());
    requestAnimationFrame(animateParticles2);
  }

  initParticles2();
  animateParticles2();
}

const canvasModules = document.getElementById('modules-particles');
if (canvasModules) {
  const ctx = canvasModules.getContext('2d');
  let particles = [];

  function resizeCanvasModules() {
    canvasModules.width = canvasModules.offsetWidth;
    canvasModules.height = canvasModules.offsetHeight;
  }
  window.addEventListener("resize", resizeCanvasModules);
  resizeCanvasModules();

  class ModuleParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvasModules.width;
      this.y = Math.random() * canvasModules.height;
      this.radius = Math.random() * 1.5 + 1;
      this.alpha = Math.random() * 0.3 + 0.1;
      this.dx = (Math.random() - 0.5) * 0.2;
      this.dy = (Math.random() - 0.5) * 0.2;
    }

    update() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < 0 || this.x > canvasModules.width || this.y < 0 || this.y > canvasModules.height) {
        this.reset();
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initModuleParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push(new ModuleParticle());
    }
  }

  function animateModuleParticles() {
    ctx.clearRect(0, 0, canvasModules.width, canvasModules.height);
    particles.forEach(p => p.update());
    requestAnimationFrame(animateModuleParticles);
  }

  initModuleParticles();
  animateModuleParticles();
}


const countdownCanvas = document.getElementById('countdown-canvas');
if (countdownCanvas) {
  const ctx = countdownCanvas.getContext('2d');
  let sparks = [];

  function resizeCountdownCanvas() {
    countdownCanvas.width = countdownCanvas.offsetWidth;
    countdownCanvas.height = countdownCanvas.offsetHeight;
  }
  window.addEventListener("resize", resizeCountdownCanvas);
  resizeCountdownCanvas();

  class Spark {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * countdownCanvas.width;
      this.y = Math.random() * countdownCanvas.height;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.2 + 0.1;
      this.dy = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.y += this.dy;
      if (this.y > countdownCanvas.height) {
        this.reset();
        this.y = 0;
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 77, 77, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initSparks() {
    sparks = [];
    for (let i = 0; i < 80; i++) {
      sparks.push(new Spark());
    }
  }

  function animateSparks() {
    ctx.clearRect(0, 0, countdownCanvas.width, countdownCanvas.height);
    sparks.forEach(s => s.update());
    requestAnimationFrame(animateSparks);
  }

  initSparks();
  animateSparks();
}

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

const faqCanvas = document.getElementById("faq-canvas");
if (faqCanvas) {
  const ctxFaq = faqCanvas.getContext("2d");
  let faqParticles = [];

  function resizeFaqCanvas() {
    faqCanvas.width = faqCanvas.offsetWidth;
    faqCanvas.height = faqCanvas.offsetHeight;
  }

  window.addEventListener("resize", resizeFaqCanvas);
  resizeFaqCanvas();

  for (let i = 0; i < 50; i++) {
    faqParticles.push({
      x: Math.random() * faqCanvas.width,
      y: Math.random() * faqCanvas.height,
      radius: Math.random() * 3 + 1,
      opacity: Math.random(),
      speedY: Math.random() * 0.5 + 0.2
    });
  }

  function animateFaqParticles() {
    ctxFaq.clearRect(0, 0, faqCanvas.width, faqCanvas.height);
    for (let p of faqParticles) {
      ctxFaq.beginPath();
      ctxFaq.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctxFaq.fillStyle = `rgba(255, 77, 77, ${p.opacity})`;
      ctxFaq.fill();
      p.y -= p.speedY;
      if (p.y < -10) {
        p.y = faqCanvas.height + 10;
        p.x = Math.random() * faqCanvas.width;
      }
    }
    requestAnimationFrame(animateFaqParticles);
  }

  animateFaqParticles();
}


const pricingCanvas = document.getElementById("pricing-canvas");
if (pricingCanvas) {
  const ctx = pricingCanvas.getContext("2d");
  let bubbles = [];

  function resizeCanvas() {
    pricingCanvas.width = pricingCanvas.offsetWidth;
    pricingCanvas.height = pricingCanvas.offsetHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 40; i++) {
    bubbles.push({
      x: Math.random() * pricingCanvas.width,
      y: Math.random() * pricingCanvas.height,
      radius: Math.random() * 4 + 1,
      speedY: Math.random() * 0.4 + 0.2,
      alpha: Math.random()
    });
  }

  function animatepricing() {
    ctx.clearRect(0, 0, pricingCanvas.width, pricingCanvas.height);
    for (let b of bubbles) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 77, 77, ${b.alpha})`;
      ctx.fill();
      b.y -= b.speedY;
      if (b.y < -10) {
        b.y = pricingCanvas.height + 10;
        b.x = Math.random() * pricingCanvas.width;
      }
    }
    requestAnimationFrame(animatepricing);
  }

  animatepricing();
}

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("reviews-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.4 + 0.2;
      this.dx = (Math.random() - 0.5) * 0.5;
      this.dy = (Math.random() - 0.5) * 0.5;
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 77, 77, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  resizeCanvas();
  initParticles();
  animateParticles();
});

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("about-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class GoldParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.4 + 0.2;
      this.dx = (Math.random() - 0.5) * 0.3;
      this.dy = (Math.random() - 0.5) * 0.3;
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${this.alpha})`; // gold
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push(new GoldParticle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  resizeCanvas();
  initParticles();
  animateParticles();
});


// === Инициализация при загрузке ===
window.onload = function () {
  const countdown = document.getElementById('timer');
  if (countdown) startCountdown(600, countdown); // 10 минут
  goToSlide(0);
};
console.log("Canvas:", canvas);
console.log("Hero section:", hero);
