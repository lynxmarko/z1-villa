import { translations } from './translations.js';

// Get language from localStorage, or default to English
let currentLang = localStorage.getItem('villa_z1_lang') || 'en';

// Set language select elements active state
function updateSwitcherUI(lang) {
  document.querySelectorAll('.lang-select').forEach(select => {
    select.value = lang;
  });
}

export function translatePage(lang = currentLang) {
  currentLang = lang;
  localStorage.setItem('villa_z1_lang', lang);
  
  // Set html tag lang attribute
  document.documentElement.setAttribute('lang', lang);
  
  // Update select switcher dropdown elements
  updateSwitcherUI(lang);
  
  const dict = translations[lang] || translations['en'];
  
  // Find all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!dict[key]) return;
    
    // Check if select options need translating
    if (el.tagName === 'SELECT' && typeof dict[key] === 'object') {
      const select = el;
      const optionsDict = dict[key];
      Array.from(select.options).forEach((opt, idx) => {
        if (optionsDict[idx] !== undefined) {
          opt.textContent = optionsDict[idx];
        }
      });
    } 
    // Check if input/textarea placeholder needs translating
    else if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.placeholder !== undefined) {
      el.placeholder = dict[key];
    } 
    // Normal HTML text elements
    else {
      el.innerHTML = dict[key];
    }
  });

  // Re-adjust layouts (updates GSAP and Lenis page heights if translations change content heights)
  window.dispatchEvent(new Event('resize'));
  
  // Custom event trigger if pages need to listen for language updates
  const event = new CustomEvent('langChanged', { detail: { lang } });
  window.dispatchEvent(event);
}

// Initialize on DOM load or immediately if already loaded
function initI18n() {
  translatePage();
  
  // Attach change listener to any language select menus (handles dropdown change events)
  document.body.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('lang-select')) {
      translatePage(e.target.value);
    }
  });
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
