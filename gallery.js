import './i18n.js';
import Lenis from 'lenis';

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==========================================================================
// CATEGORY FILTERING LOGIC
// ==========================================================================

const filterBtns = document.querySelectorAll('.filter-btn');
const catHeaders = document.querySelectorAll('.gallery-chapter-header');
const catMasonries = document.querySelectorAll('.gallery-masonry');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    
    // Switch active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter content with smooth transitions
    catHeaders.forEach(header => {
      const cat = header.getAttribute('data-cat');
      if (filter === 'all' || filter === cat) {
        header.style.display = 'block';
      } else {
        header.style.display = 'none';
      }
    });

    catMasonries.forEach(masonry => {
      const cat = masonry.getAttribute('data-cat');
      if (filter === 'all' || filter === cat) {
        masonry.style.display = 'grid';
      } else {
        masonry.style.display = 'none';
      }
    });

    // Notify scroll container to recalculate layout size
    lenis.resize();
  });
});

// ==========================================================================
// LIGHTBOX FULLSCREEN LOGIC
// ==========================================================================

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('lightbox-close');
const prevBtn = document.getElementById('lightbox-prev');
const nextBtn = document.getElementById('lightbox-next');

let visibleItems = [];
let currentImgIndex = 0;

function updateVisibleItems() {
  // Grab all currently displayed gallery items based on active filter
  visibleItems = [];
  const activeMasonries = Array.from(catMasonries).filter(m => m.style.display !== 'none');
  activeMasonries.forEach(m => {
    const items = m.querySelectorAll('.gallery-item');
    items.forEach(item => visibleItems.push(item));
  });
}

function openLightbox(index) {
  currentImgIndex = index;
  const item = visibleItems[currentImgIndex];
  if (!item) return;

  const imgSrc = item.getAttribute('data-src');
  const captionText = item.querySelector('.item-overlay span').textContent;

  lightboxImg.src = imgSrc;
  lightboxCaption.textContent = captionText;

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  lenis.stop(); // Stop page scrolling
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  lenis.start(); // Restore page scrolling
}

function showPrevImage() {
  if (visibleItems.length === 0) return;
  currentImgIndex = (currentImgIndex - 1 + visibleItems.length) % visibleItems.length;
  openLightbox(currentImgIndex);
}

function showNextImage() {
  if (visibleItems.length === 0) return;
  currentImgIndex = (currentImgIndex + 1) % visibleItems.length;
  openLightbox(currentImgIndex);
}

// Attach listeners to gallery items
document.querySelector('.gallery-grid-section').addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (!item) return;

  updateVisibleItems();
  const index = visibleItems.indexOf(item);
  if (index !== -1) {
    openLightbox(index);
  }
});

// Navigation events
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });

// Close on clicking overlay background
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
    closeLightbox();
  }
});

// Keyboard navigation bindings
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;

  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    showPrevImage();
  } else if (e.key === 'ArrowRight') {
    showNextImage();
  }
});
