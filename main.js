import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// LENIS SMOOTH SCROLL SETUP
// ==========================================================================

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  infinite: false,
});

// Hook Lenis into GSAP Ticker
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Global Scroll Progress Bar
lenis.on('scroll', () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
});

// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      lenis.scrollTo(targetElement, {
        offset: -40,
        duration: 1.5,
        immediate: false,
      });
    }
  });
});

// ==========================================================================
// CINEMATIC HERO ENTRANCE
// ==========================================================================

window.addEventListener('DOMContentLoaded', () => {
  // Set default starting theme
  document.body.setAttribute('data-active-theme', 'dark');

  // Background Image scale out (reveal)
  gsap.fromTo('.hero-bg-img', 
    { scale: 1.15 },
    { scale: 1.02, duration: 2.5, ease: 'power3.out' }
  );

  // Text Reveal animations
  gsap.from('.hero-subtitle', {
    y: 20,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.1
  });

  gsap.from('.hero-title span', {
    y: 50,
    opacity: 0,
    duration: 1.4,
    ease: 'power3.out',
    stagger: 0.2,
    delay: 0.3
  });

  gsap.from('.hero-intro', {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.7
  });

  gsap.from('.hero-ctas', {
    y: 20,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.9
  });
  
  gsap.from('.hero-scroll-indicator', {
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out',
    delay: 1.4
  });
});

// ==========================================================================
// DAY TO NIGHT SCROLL METAMORPHOSIS
// ==========================================================================

const dayNightTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '#day-night-transition',
    start: 'top top',
    end: '+=150%', // duration of scroll-pinning
    scrub: true,
    pin: true,
    anticipatePin: 1
  }
});

// Fade in the night image
dayNightTimeline.to('#day-night-transition .night-img', {
  opacity: 1,
  ease: 'none'
}, 0);

// Slide indicator knob
dayNightTimeline.to('#day-night-transition .ind-slider-knob', {
  left: '100%',
  ease: 'none'
}, 0);

// Dim day label, highlight night label
dayNightTimeline.to('#day-night-transition .ind-day', {
  opacity: 0.4,
  color: '#ffffff',
  ease: 'none'
}, 0);

dayNightTimeline.to('#day-night-transition .ind-night', {
  opacity: 1,
  color: 'var(--accent-gold)',
  ease: 'none'
}, 0);

// ==========================================================================
// THEME SCROLL SWITCHER (Fluid Background Transitions)
// ==========================================================================

const themedElements = document.querySelectorAll('[data-theme]');
themedElements.forEach((el) => {
  const theme = el.getAttribute('data-theme');
  
  ScrollTrigger.create({
    trigger: el,
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => {
      document.body.setAttribute('data-active-theme', theme);
    },
    onEnterBack: () => {
      document.body.setAttribute('data-active-theme', theme);
    }
  });
});

// ==========================================================================
// STICKY HEADER ACTIONS
// ==========================================================================

const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Nav item active indicator matching sections
const sectionsToTrack = [
  { id: 'hero', trigger: '#hero' },
  { id: 'story-start', trigger: '#story-start' },
  { id: 'story-start', trigger: '#storytelling-container' },
  { id: 'zones-section', trigger: '#zones-section' },
  { id: 'contact', trigger: '#contact' }
];

sectionsToTrack.forEach(item => {
  ScrollTrigger.create({
    trigger: item.trigger,
    start: 'top 40%',
    end: 'bottom 40%',
    onToggle: (self) => {
      if (self.isActive) {
        document.querySelectorAll('.nav-item').forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-sec') === item.id);
        });
      }
    }
  });
});

// ==========================================================================
// CHAPTER CINEMATIC REVEALS
// ==========================================================================

// Parallax scrolling effect on images
const chapterImages = document.querySelectorAll('.chapter-image-wrapper');
chapterImages.forEach(wrapper => {
  const img = wrapper.querySelector('.chapter-img');
  if (img) {
    gsap.fromTo(img,
      { yPercent: -8, scale: 1.05 },
      {
        yPercent: 8,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }
});

// Text reveal fade-up chapter by chapter
const chapters = document.querySelectorAll('.story-chapter');
chapters.forEach(chapter => {
  const textCol = chapter.querySelector('.chapter-text-content');
  if (textCol) {
    gsap.from(textCol.children, {
      scrollTrigger: {
        trigger: textCol,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 45,
      opacity: 0,
      duration: 1.2,
      stagger: 0.18,
      ease: 'power3.out'
    });
  }
});

// Prologue text highlight reveal
const prologueText = document.querySelector('.prologue-quote');
if (prologueText) {
  gsap.from(prologueText, {
    scrollTrigger: {
      trigger: prologueText,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 30,
    duration: 1.5,
    ease: 'power3.out'
  });
}

// ==========================================================================
// ENDLESS ZONES INTERACTIVE EXPLORER (Dashboard Logic)
// ==========================================================================

const zoneItems = document.querySelectorAll('.zones-menu-item');
const zoneDetails = document.querySelectorAll('.zone-details');
const zoneSlides = document.querySelectorAll('.zone-image-slide');

let activeZoneIndex = 0;
const zoneKeys = ['flow', 'sunset', 'recovery', 'energy', 'nature', 'connection', 'taste', 'night'];
let autoCycleTimer = null;

function activateZone(zoneName) {
  // Update state tracking index
  activeZoneIndex = zoneKeys.indexOf(zoneName);

  // Update tabs
  zoneItems.forEach(item => {
    if (item.getAttribute('data-zone') === zoneName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update details text with GSAP fade
  zoneDetails.forEach(detail => {
    if (detail.getAttribute('data-zone') === zoneName) {
      detail.classList.add('active');
      gsap.fromTo(detail, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
    } else {
      detail.classList.remove('active');
    }
  });

  // Update image slides with seamless crossfade
  zoneSlides.forEach(slide => {
    if (slide.getAttribute('data-zone') === zoneName) {
      slide.classList.add('active');
      const img = slide.querySelector('.zone-img');
      gsap.fromTo(img, { scale: 1.05 }, { scale: 1, duration: 1.2, ease: 'power2.out' });
    } else {
      slide.classList.remove('remove');
      slide.classList.remove('active');
    }
  });
}

// Start auto cycle timer
function startAutoCycle() {
  stopAutoCycle();
  autoCycleTimer = setInterval(() => {
    activeZoneIndex = (activeZoneIndex + 1) % zoneKeys.length;
    activateZone(zoneKeys[activeZoneIndex]);
  }, 6500); // 6.5 seconds per zone
}

function stopAutoCycle() {
  if (autoCycleTimer) {
    clearInterval(autoCycleTimer);
    autoCycleTimer = null;
  }
}

// Attach click listeners to zone selector menu
zoneItems.forEach(item => {
  item.addEventListener('click', () => {
    stopAutoCycle(); // Stop auto-running on user interaction
    const zoneName = item.getAttribute('data-zone');
    activateZone(zoneName);
  });
});

// Auto-play explorer when it scrolls into view
ScrollTrigger.create({
  trigger: '#zones-section',
  start: 'top 60%',
  onEnter: () => startAutoCycle(),
  onLeave: () => stopAutoCycle(),
  onEnterBack: () => startAutoCycle(),
  onLeaveBack: () => stopAutoCycle()
});

// ==========================================================================
// MOBILE MENU TOGGLE
// ==========================================================================

const menuToggle = document.querySelector('.mobile-nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-item, .mobile-btn');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      menuToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      lenis.start();
    } else {
      menuToggle.classList.add('open');
      mobileMenu.classList.add('open');
      lenis.stop();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      lenis.start();
    });
  });
}
