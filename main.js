// GSAP is loaded via <script> tag in HTML
console.log("Valentine's Site Loaded! 🚀");
try {
  // DOM Elements
  const sections = {
    'invitation-section': document.getElementById('invitation-section'),
    'itinerary-section': document.getElementById('itinerary-section')
  };
  const navLinks = document.querySelectorAll('.nav-link');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const backgroundContainer = document.getElementById('background-elements');

  // Cat Elements
  const cat = document.querySelector('.cat');
  const pupils = document.querySelectorAll('.pupil');
  const invitationCard = document.querySelector('#invitation-section .content-wrapper');

  // --- Navigation Logic ---
  function navigateTo(targetId) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-target') === targetId);
    });

    const currentActive = document.querySelector('.active-section');
    if (currentActive && currentActive.id !== targetId) {
      gsap.to(currentActive, {
        opacity: 0,
        duration: 0.5,
        y: -20,
        onComplete: () => {
          currentActive.classList.remove('active-section');
          const targetSection = sections[targetId];
          targetSection.classList.add('active-section');
          gsap.fromTo(targetSection,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }
      });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      navigateTo(target);
    });
  });

  // Helper to trigger happy cat animation
  function makeCatHappy() {
    cat.classList.add('happy');

    // Ensure cat is peeking (visible) to show the face
    gsap.to(cat, {
      yPercent: -150,
      duration: 0.5,
      ease: "back.out(1.2)"
    });

    navigateTo('itinerary-section');
    confettiEffect();
  }

  yesBtn.addEventListener('click', makeCatHappy);

  // --- "No" Button Logic (Becomes Yes) ---
  // --- "No" Button Logic (Becomes Yes) ---
  const noBtnIcon = noBtn.querySelector('i');
  const noBtnText = noBtn.querySelector('span');

  function turnNoToYes() {
    // Switch styles from No (Red) to Yes (Purple/Pink)
    noBtn.classList.remove('btn-neon-no');

    // Animate content
    gsap.to(noBtn, {
      scale: 1.1,
      duration: 0.3,
      onStart: () => {
        noBtnText.innerText = "<YES!/>"; // Updated text
        noBtnIcon.classList.remove('fa-xmark');
        noBtnIcon.classList.add('fa-heart');

        // Override standard hover for the moment to ensure it looks "Yes" immediately
        noBtn.style.borderColor = "#ff69b4";
        noBtn.style.boxShadow = "0 0 10px #C778DD, 0 0 20px #C778DD, 0 0 40px #ff69b4";
        noBtnIcon.style.color = "#ff69b4";

        noBtn.onclick = (e) => {
          e.preventDefault();
          makeCatHappy();
        };
      }
    });
  }

  function resetNoButton() {
    // Revert styles
    noBtn.classList.add('btn-neon-no');

    gsap.to(noBtn, {
      scale: 1,
      duration: 0.3,
      onStart: () => {
        noBtnText.innerText = "<No/>";
        noBtnIcon.classList.remove('fa-heart');
        noBtnIcon.classList.add('fa-xmark');

        // Clear manual overrides
        noBtn.style.borderColor = "";
        noBtn.style.boxShadow = "";
        noBtnIcon.style.color = "";

        noBtn.onclick = null;
      }
    });
  }

  noBtn.addEventListener('mouseover', turnNoToYes);
  noBtn.addEventListener('mouseout', resetNoButton);
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    turnNoToYes();
  });

  // --- Cat Animation Logic ---
  // 1. Peek Logic
  invitationCard.addEventListener('mouseenter', () => {
    gsap.to(cat, {
      yPercent: -150, // Move UP to peek over the top (negative value)
      duration: 0.5,
      ease: "back.out(1.2)"
    });
  });

  invitationCard.addEventListener('mouseleave', () => {
    gsap.to(cat, {
      yPercent: 100, // Move DOWN to hide (reduced from 150 to avoid bottom peek)
      duration: 0.5,
      ease: "power2.in"
    });
  });

  // 2. Eye Tracking Logic
  document.addEventListener('mousemove', (e) => {
    // Only track if section 1 is active? Safe to always track.
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    pupils.forEach(pupil => {
      const eye = pupil.parentElement;
      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      const deltaX = mouseX - eyeCenterX;
      const deltaY = mouseY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);

      const distance = Math.min(6, Math.hypot(deltaX, deltaY) / 15);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      gsap.to(pupil, {
        x: moveX,
        y: moveY,
        duration: 0.1,
        overwrite: true
      });
    });
  });


  // --- Background Elements (GSAP) ---
  function createBackgroundElements() {
    const shapes = ['💚', '🌱', '🍃', '🌿'];
    const count = 15;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.classList.add('floating-heart');
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)];

      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;

      gsap.set(el, {
        x: startX,
        y: startY,
        fontSize: Math.random() * 20 + 20 + "px",
        opacity: Math.random() * 0.3 + 0.1
      });

      backgroundContainer.appendChild(el);
      animateElement(el);
    }
  }

  function animateElement(el) {
    gsap.to(el, {
      x: "+=" + (Math.random() * 100 - 50),
      y: "+=" + (Math.random() * 100 - 50),
      rotation: Math.random() * 360,
      duration: Math.random() * 10 + 5,
      ease: "sine.inOut",
      onComplete: () => animateElement(el)
    });
  }

  // --- Confetti Effect ---
  function confettiEffect() {
    const count = 50;
    const container = document.body;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.style.position = 'absolute';
      dot.style.width = '10px';
      dot.style.height = '10px';
      dot.style.backgroundColor = ['#2e7d32', '#66bb6a', '#ff4081', '#ffffff'][Math.floor(Math.random() * 4)];
      dot.style.borderRadius = '50%';
      dot.style.left = '50%';
      dot.style.top = '50%';
      dot.style.zIndex = '1000';
      container.appendChild(dot);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 200 + 50;

      gsap.to(dot, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => dot.remove()
      });
    }
  }

  // Init
  createBackgroundElements();
  gsap.from(".nav-brand", { y: -50, opacity: 0, duration: 1, delay: 0.5 });
  gsap.from(".content-wrapper", { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)" });

  // --- Timeline Logic ---
  function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');

    function checkTime() {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      let hasActive = false;

      items.forEach(item => {
        const startStr = item.dataset.start;
        const endStr = item.dataset.end;

        if (!startStr || !endStr) return;

        const [startH, startM] = startStr.split(':').map(Number);
        const [endH, endM] = endStr.split(':').map(Number);

        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        // Check if current time is within range
        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          item.classList.add('active');
          hasActive = true;
          // Scroll to active item centered
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          item.classList.remove('active');
        }
      });

      // Optional: Highlight next item if none active?
    }

    // Run on load
    checkTime();
    // Update every minute
    setInterval(checkTime, 60000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeline);
  } else {
    initTimeline();
  }

} catch (e) {
  console.error("Critical Error:", e);
  alert("Something went wrong! " + e.message);
}