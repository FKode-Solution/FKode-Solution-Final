// === Theme Switcher ===
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    html.classList.toggle('dark', savedTheme === 'dark');
  } else {
    html.classList.toggle('dark', systemPrefersDark);
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      html.classList.toggle('dark', e.matches);
    }
  });

  // === Mobile Menu ===
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu?.querySelectorAll('a');

  mobileMenuToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!mobileMenuToggle?.contains(e.target) && !mobileMenu?.contains(e.target)) {
      mobileMenu?.classList.remove('open');
    }
  });

  mobileLinks?.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
    });
  });

  // === Scroll Animations ===
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  animatedElements.forEach(el => {
    if (!el.style.animationName) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    observer.observe(el);
  });

  // === Nav Menu Scroll & Close ===
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenuAlt = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('#mobile-menu a[href^="#"]');

  menuToggle?.addEventListener('click', () => {
    mobileMenuAlt?.classList.toggle('hidden');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        mobileMenuAlt?.classList.add('hidden');
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    });
  });

  // === Button Scroll (Contact / Offer) ===
  document.getElementById('btn-contact')?.addEventListener('click', () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('btn-offer')?.addEventListener('click', () => {
    document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // === Feedback Carousel ===
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.feedback-card');
  let index = 0;

  function showNext() {
    if (!cards.length) return;

    cards[index].classList.remove('active');
    cards[index].classList.add('prev');
    index = (index + 1) % cards.length;

    cards.forEach((card, i) => {
      if (i !== index) {
        card.classList.remove('active', 'prev');
      }
    });

    cards[index].classList.add('active');
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  // Optional: Set carousel auto-play
  // setInterval(showNext, 5000);

  // === Dropdown Checkboxes ===
  const dropdownBtn = document.getElementById('dropdownButton');
  const dropdownOptions = document.getElementById('dropdownOptions');

  dropdownBtn?.addEventListener('click', () => {
    dropdownOptions?.classList.toggle('hidden');
  });

  const checkboxes = dropdownOptions?.querySelectorAll('input[type="checkbox"]');
  checkboxes?.forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = Array.from(checkboxes)
        .filter(i => i.checked)
        .map(i => i.value);
      dropdownBtn.innerText = selected.length ? selected.join(', ') : 'Select Project Type';
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdownBtn?.contains(e.target) && !dropdownOptions?.contains(e.target)) {
      dropdownOptions?.classList.add('hidden');
    }
  });

  // === Google Form Submit ===
  const scriptURL = "https://script.google.com/macros/s/AKfycbyuTYsSTI1FzJ55W0WJRoh_jxCKYxNNEHuD3rwliadCegfwhmH_K6GIdEvtSjUJRDParg/exec";
  const form = document.getElementById("contactForm");
  const modal = document.getElementById("successModal");

  form?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
    const selectedProjects = Array.from(
      form.querySelectorAll('input[name="project"]:checked')
    ).map(cb => cb.value);

    if (!name || !email || !phone || selectedProjects.length === 0 || !message) {
      alert("Please fill all required fields before submitting.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("phone", phone);
    formDataToSend.append("project", selectedProjects.join(", "));
    formDataToSend.append("message", message);

    try {
      const res = await fetch(scriptURL, {
        method: "POST",
        body: formDataToSend
      });

      const data = await res.text();
      console.log("Response from server:", data);

      if (data.trim() === "Success") {
        modal?.classList.remove("hidden");
        form.reset();
        document.getElementById('dropdownButton').innerText = "Select Project Type";

        setTimeout(() => {
          modal?.classList.add("hidden");
        }, 3000);
      } else {
        alert("Something went wrong. Try again.");
      }
    } catch (err) {
      console.error("Error occurred:", err);
      alert("Something went wrong. Try again.");
    }
  });

  modal?.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
});

// particles
particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    color: { value: "#22d3ee" },
    shape: { type: "circle" },
    opacity: { value: 0.3 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 120,
      color: "#22d3ee",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      out_mode: "bounce"
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: false }
    }
  },
  retina_detect: true
});
