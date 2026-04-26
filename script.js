/* =====================================================
   ASHU MISHRA — PORTFOLIO SCRIPTS (ANIMATED v2)
   Features: typewriter, number counters, scroll reveals,
             nav behaviour, mobile menu, ripple
   ===================================================== */

/* =====================================================
   1. NAV — add shadow/border on scroll
   ===================================================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


/* =====================================================
   2. MOBILE MENU — toggle
   ===================================================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});


/* =====================================================
   3. SMOOTH SCROLL — for all anchor links
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* =====================================================
   4. TYPEWRITER EFFECT — hero tagline
   ===================================================== */
const typewriterEl = document.getElementById('typewriter');
const words = ['Impact Driver.', 'Value Creator.', 'Growth Leader.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWrite() {
  const current = words[wordIndex];

  if (isDeleting) {
    typewriterEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    // Finished typing — pause then start deleting
    speed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting — move to next word
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 400;
  }

  setTimeout(typeWrite, speed);
}

// Start after the hero animation delay
setTimeout(typeWrite, 800);


/* =====================================================
   5. SCROLL REVEAL — generic reveal classes
   ===================================================== */
const revealClasses = ['.reveal-up', '.reveal-left', '.reveal-right', '.reveal-scale'];
const revealEls = document.querySelectorAll(revealClasses.join(','));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* Skill cards: stagger by card-delay CSS variable */
document.querySelectorAll('.skill-card').forEach(card => {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = getComputedStyle(card).getPropertyValue('--card-delay').trim() || '0s';
        setTimeout(() => {
          card.classList.add('visible');
        }, parseFloat(delay) * 1000);
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.1 });
  cardObserver.observe(card);
});


/* =====================================================
   6. ANIMATED NUMBER COUNTERS — stats section
   ===================================================== */
function animateCounter(el, target, decimals, prefix, suffix) {
  const duration = 1800; // ms
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;

    const formatted = decimals > 0
      ? value.toFixed(decimals)
      : Math.floor(value);

    el.textContent = formatted;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
    }
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statItem = entry.target;
      statItem.classList.add('visible');

      const target   = parseFloat(statItem.dataset.target);
      const decimals = parseInt(statItem.dataset.decimals || '0');
      const prefix   = statItem.dataset.prefix || '';
      const counterEl = statItem.querySelector('.counter');

      // Prepend prefix to the stat number (e.g. "$" or "₹")
      const numEl = statItem.querySelector('.stat-number');
      if (prefix && !numEl.querySelector('.stat-prefix')) {
        const prefixSpan = document.createElement('span');
        prefixSpan.className = 'stat-prefix';
        prefixSpan.textContent = prefix;
        numEl.insertBefore(prefixSpan, counterEl);
      }

      animateCounter(counterEl, target, decimals);
      statsObserver.unobserve(statItem);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));


/* =====================================================
   7. TIMELINE — stagger reveal with delay
   ===================================================== */
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

timelineItems.forEach(item => timelineObserver.observe(item));


/* =====================================================
   8. WIN TAGS — animate in one by one on hover enter
   ===================================================== */
document.querySelectorAll('.timeline-content').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const tags = card.querySelectorAll('.win-tag');
    tags.forEach((tag, i) => {
      tag.style.transitionDelay = `${i * 40}ms`;
    });
  });
  card.addEventListener('mouseleave', () => {
    card.querySelectorAll('.win-tag').forEach(tag => {
      tag.style.transitionDelay = '0ms';
    });
  });
});


/* =====================================================
   9. CURSOR GLOW (subtle) — follows mouse in hero
   ===================================================== */
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });
}
