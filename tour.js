import './i18n.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Select DOM items
const slides = document.querySelectorAll('.wt-slide');
const textCards = document.querySelectorAll('.wt-text-card');
const dots = document.querySelectorAll('.wt-dot');
const totalSlides = slides.length;

// Set up timelines
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#walkthrough-pin-section',
    start: 'top top',
    end: '+=850%',
    scrub: 1.2,
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      // Calculate active index based on scroll progress
      const progress = self.progress;
      const index = Math.min(
        Math.floor(progress * totalSlides),
        totalSlides - 1
      );
      
      // Update progress dots active state
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }
});

// Configure initial states for all slides except the first one
gsap.set(slides, { autoAlpha: 0 });
gsap.set(slides[0], { autoAlpha: 1, scale: 1 });
gsap.set(textCards, { autoAlpha: 0, y: 30, display: 'none' });
gsap.set(textCards[0], { autoAlpha: 1, y: 0, display: 'block' });

// We want to loop over slides and add transitions
const slideDuration = 1.0;
const transitionOverlap = 0.3; // overlap for crossfades

for (let i = 0; i < totalSlides; i++) {
  const currentSlide = slides[i];
  const nextSlide = slides[i + 1];
  const currentCard = textCards[i];
  const nextCard = textCards[i + 1];
  
  const img = currentSlide.querySelector('.wt-slide-img');
  
  // Scale active image
  if (img) {
    tl.to(img, {
      scale: 1.12,
      duration: slideDuration,
      ease: 'none'
    }, i * (slideDuration - transitionOverlap));
  }
  
  // Crossfade to next slide
  if (i < totalSlides - 1) {
    // Fade out current card
    tl.to(currentCard, {
      autoAlpha: 0,
      y: -30,
      duration: transitionOverlap,
      display: 'none'
    }, (i + 1) * slideDuration - transitionOverlap - transitionOverlap);
    
    // Crossfade slide backgrounds: fade out current, fade in next
    tl.to(currentSlide, {
      autoAlpha: 0,
      duration: transitionOverlap,
      ease: 'power1.inOut'
    }, (i + 1) * slideDuration - transitionOverlap);

    tl.to(nextSlide, {
      autoAlpha: 1,
      duration: transitionOverlap,
      ease: 'power1.inOut'
    }, (i + 1) * slideDuration - transitionOverlap);
    
    // Fade in next card
    tl.to(nextCard, {
      display: 'block',
      autoAlpha: 1,
      y: 0,
      duration: transitionOverlap,
      ease: 'power2.out'
    }, (i + 1) * slideDuration - transitionOverlap);
  }
}

// Dot navigation click functionality
dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    // Retrieve ScrollTrigger to calculate target scroll position
    const allTriggers = ScrollTrigger.getAll();
    const pinTrigger = allTriggers.find(st => st.trigger === '#walkthrough-pin-section');
    if (pinTrigger) {
      const totalScrollHeight = pinTrigger.end - pinTrigger.start;
      const targetScrollPos = pinTrigger.start + (idx / (totalSlides - 1)) * totalScrollHeight;
      lenis.scrollTo(targetScrollPos, {
        duration: 1.5,
        immediate: false
      });
    }
  });
});

// Skip button functionality
const skipBtn = document.querySelector('.wt-skip-btn');
if (skipBtn) {
  skipBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const finalSection = document.getElementById('360-interactive');
    if (finalSection) {
      lenis.scrollTo(finalSection, {
        duration: 1.5,
        immediate: false
      });
    }
  });
}
