let currentSlide = 0;
const totalSlides = document.querySelectorAll('.slide').length;
const slider = document.getElementById('slider');

function updateSlide() {
  slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
  runTypewriter(currentSlide);
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlide();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlide();
  }
}

function tanyaMauKetemu() {
  Swal.fire({
    title: 'Kamu mau gak jumpa sama aku? 🥹',
    showDenyButton: true,
    confirmButtonText: 'Mau 😄',
    denyButtonText: 'Enggak 😢',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Yey 😄', 'Aku juga ga sabar 😭', 'success');
    } else if (result.isDenied) {
      Swal.fire({
        title: 'Kenapa? 😭',
        input: 'text',
        inputPlaceholder: 'Tulis alasannya di sini...',
        confirmButtonText: 'Kirim',
        showCancelButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          Swal.fire('Makasih udah jujur 😌', 'Semoga suatu saat berubah pikiran ya...', 'info');
        }
      });
    }
  });
}

function runTypewriter(slideIndex) {
  const slide = document.querySelectorAll('.slide')[slideIndex];
  const targets = slide.querySelectorAll('[data-typing]');
  targets.forEach(el => {
    const fullText = el.getAttribute('data-typing');
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += fullText[i];
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 40);
  });

  // Jika masuk slide ke-2, munculkan popup
  if (slideIndex === 1) {
    setTimeout(tanyaMauKetemu, 5000); // 3 detik setelah animasi ketik
  }
}


function showSurprise() {
  const canvas = document.getElementById('fireworks');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.getElementById('bgm').pause();
  const music = document.getElementById('surprise-music');
  music.currentTime = 0;
  music.play();

  const boom = document.getElementById('boom');
  boom.currentTime = 0;
  boom.play();

  let ctx = canvas.getContext('2d');
  let fireworks = [];

  class Firework {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = Math.random() * canvas.height / 2;
      this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
      this.exploded = false;
      this.particles = [];
    }
    update() {
      if (!this.exploded) {
        this.y -= 5;
        if (this.y <= this.targetY) {
          this.exploded = true;
          this.explode();
        }
      }
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.alpha > 0);
    }
    draw() {
      if (!this.exploded) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      this.particles.forEach(p => p.draw());
    }
    explode() {
      for (let i = 0; i < 50; i++) {
        this.particles.push(new Particle(this.x, this.y, this.color));
      }
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 5;
      this.vy = (Math.random() - 0.5) * 5;
      this.alpha = 1;
      this.color = color;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.01;
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function launchFirework() {
    fireworks.push(new Firework());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach(fw => {
      fw.update();
      fw.draw();
    });
    fireworks = fireworks.filter(fw => fw.exploded || fw.particles.length > 0);
    requestAnimationFrame(animate);
  }

  animate();
  for (let i = 0; i < 7; i++) {
    setTimeout(launchFirework, i * 300);
  }

  setTimeout(() => {
    Swal.fire({
      title: '✨ Ulang Tahunmu ✨',
      text: 'Masukkan keinginan kamu di ulang tahun ini 😊',
      input: 'text',
      inputPlaceholder: 'Aku pengen...',
      confirmButtonText: 'Kirim',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed && result.value) {
        Swal.fire('Terkirim!', 'Semoga harapanmu terkabul ya 💖', 'success');
      }
    });
  }, 800);
}

function jawabanIya() {
  Swal.fire({
    title: "Kenapa tuh?",
    input: "text",
    inputPlaceholder: "Coba jawab...",
    showCancelButton: true,
    confirmButtonText: "Jawab",
  }).then((result) => {
    if (result.isConfirmed) {
      const jawaban = result.value.toLowerCase();
      if (jawaban.includes("ulang tahun") || jawaban.includes("glo")) {
        Swal.fire({ title: "Yess kamu benar! 🎉", confirmButtonText: "Lanjut" }).then(() => nextSlide());
      } else {
        Swal.fire({
          title: "Yahh salah 😅",
          text: "Mau tau gak alasannya kenapa?",
          showCancelButton: true,
          confirmButtonText: "MAU"
        }).then((r) => {
          if (r.isConfirmed) nextSlide();
        });
      }
    }
  });
}

function jawabanTidak() {
  Swal.fire({
    title: "Yahhh kok ga inget sih 😭",
    text: "Coba jawab ulang ya!",
    confirmButtonText: "Balik ke awal"
  }).then(() => {
    currentSlide = 0;
    updateSlide();
  });
}

function startWebsite() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('bgm').play();
  runTypewriter(0);
}
