// i18n.js

// Self-invoking anonymous function to encapsulate the logic
(function(window) {
  'use strict';

  let translations = {};

  // Function to fetch translation file
  async function fetchTranslations(lang) {
    try {
      const response = await fetch(`${lang}.json`);
      if (!response.ok) {
        throw new Error(`Could not load ${lang}.json`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      // Fallback to English if the requested language file is not found
      if (lang !== 'en') {
        return fetchTranslations('en');
      }
      return {};
    }
  }

  // Function to apply translations to the DOM
  function applyTranslations(trans) {
    translations = trans;
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[key]) {
        element.textContent = translations[key];
      }
    });

    // Set default values for city and country inputs
    if (translations.default_city) {
      $('.input-cidade').val(translations.default_city);
    }
    if (translations.default_country) {
      $('.input-pais').val(translations.default_country);
    }
  }

  // Function to determine language from browser settings
  function getLangFromBrowser() {
    const lang = navigator.language.slice(0, 2);
    if (lang === 'pt') {
      return 'pt';
    }
    if (lang === 'es') {
      return 'es';
    }
    return 'en';
  }

  // Main initialization function
  async function init() {
    const lang = getLangFromBrowser();
    const loadedTranslations = await fetchTranslations(lang);
    applyTranslations(loadedTranslations);
  }

  // Expose a global function to get a translation by key
  window.getTranslation = function(key) {
    return translations[key] || key;
  };

  // Expose the init function to be called manually
  window.initI18n = init;

})(window);
