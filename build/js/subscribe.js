(function () {
    'use strict';

    const SELECTORS = {
      CUSTOM: '.lang-switcher__custom',
      SELECTED: '.lang-switcher__selected',
      TEXT: '.lang-switcher__text',
      OPTIONS: '.lang-switcher__option'
    };
    const CSS_CLASSES = {
      ACTIVE: 'active',
      SELECTED: 'selected'
    };
    const STORAGE_KEY = 'language';
    const SUBSCRIBE_PAGE = 'subscribe.html';
    const COUNTRY_MAP = {
      HR: 'hr',
      SI: 'sl'
    };
    const LANGUAGE_MAP = {
      hr: 'hr',
      sl: 'sl'
    };
    const API_URL = 'https://ipapi.co/json/';
    const LanguageSwitcher = {
      async detectUserLanguage() {
        try {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 500);
          const response = await fetch(API_URL);
          const data = await response.json();
          return COUNTRY_MAP[data.country_code] || '';
        } catch (error) {
          console.warn('Failed to detect language from IP:', error);
          const browserLang = navigator.language.split('-')[0];
          return LANGUAGE_MAP[browserLang] || '';
        }
      },

      async getLanguage() {
        let savedLang = localStorage.getItem(STORAGE_KEY);

        if (savedLang === null) {
          savedLang = await this.detectUserLanguage();
          localStorage.setItem(STORAGE_KEY, savedLang);
        }

        return savedLang;
      },

      redirectIfNeeded(savedLang) {
        const currentPath = window.location.pathname;
        const isSubscribePage = currentPath.includes(SUBSCRIBE_PAGE);
        const queryParams = window.location.search;

        if (savedLang && !currentPath.includes(`/${savedLang}/`)) {
          window.location.href = isSubscribePage ? `/${savedLang}/${SUBSCRIBE_PAGE}${queryParams}` : `/${savedLang}/${queryParams}`;
          return true;
        }

        return false;
      },

      toggleDropdown(custom) {
        custom.classList.toggle(CSS_CLASSES.ACTIVE);
      },

      closeDropdown(custom) {
        custom.classList.remove(CSS_CLASSES.ACTIVE);
      },

      setSelectedLanguage(text, options, currentLang) {
        const currentOption = Array.from(options).find(opt => opt.dataset.code === currentLang);
        text.textContent = currentOption?.textContent || 'EN';
        currentOption?.classList.add(CSS_CLASSES.SELECTED);
      },

      handleOptionClick(option, text, options, custom) {
        const value = option.dataset.value;
        const code = option.dataset.code;
        const queryParams = window.location.search;
        text.textContent = option.textContent;
        options.forEach(opt => opt.classList.remove(CSS_CLASSES.SELECTED));
        option.classList.add(CSS_CLASSES.SELECTED);
        this.closeDropdown(custom);
        localStorage.setItem(STORAGE_KEY, code === 'en' ? '' : code);
        window.location.href = value + queryParams;
      },

      // bug fix. EN - HR
      bindCustomSelect() {
        const custom = document.querySelector(SELECTORS.CUSTOM);
        const selected = document.querySelector(SELECTORS.SELECTED);
        const text = document.querySelector(SELECTORS.TEXT);
        const options = document.querySelectorAll(SELECTORS.OPTIONS);

        if (!custom || !selected) {
          console.warn('No language switcher found');
          return;
        }

        const currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
        this.setSelectedLanguage(text, options, currentLang);
        selected.addEventListener('click', e => {
          e.stopPropagation();
          this.toggleDropdown(custom);
        });
        options.forEach(option => {
          option.addEventListener('click', () => {
            this.handleOptionClick(option, text, options, custom);
          });
        });
        document.addEventListener('click', () => {
          this.closeDropdown(custom);
        });
      },

      async init() {
        try {
          const savedLang = await this.getLanguage();
          const redirected = this.redirectIfNeeded(savedLang);

          if (!redirected) {
            this.bindCustomSelect();
          }
        } catch (error) {
          console.error('LanguageSwitcher initialization failed:', error);
          this.bindCustomSelect();
        }
      }

    };

    const SELECTORS$1 = {
      CALL_TEXT: '.thank-you__text--callback',
      ORDER_TEXT: '.thank-you__text--order'
    };
    const CSS_CLASSES$1 = {
      HIDDEN: 'hidden'
    };
    const ThankYouPageManager = {
      setCongratulationText() {
        const queryParams = new URLSearchParams(window.location.search);
        const redirectType = queryParams.get('redirect');
        const callText = document.querySelector(SELECTORS$1.CALL_TEXT);
        const orderText = document.querySelector(SELECTORS$1.ORDER_TEXT);

        if (!callText || !orderText) {
          console.warn('Congratulation text elements not found');
          return;
        }

        switch (redirectType) {
          case 'call_request':
            callText.classList.remove(CSS_CLASSES$1.HIDDEN);
            orderText.classList.add(CSS_CLASSES$1.HIDDEN);
            break;

          case 'order':
            orderText.classList.remove(CSS_CLASSES$1.HIDDEN);
            callText.classList.add(CSS_CLASSES$1.HIDDEN);
            break;

          default:
            console.warn('Unknown redirect type, showing default text');
        }
      },

      init() {
        this.setCongratulationText();
      }

    };

    function main() {
      LanguageSwitcher.init();
      ThankYouPageManager.init();
    }

    main(); // if (document.documentElement.clientWidth < 480) {
    //     window.addEventListener('scroll',
    //         function () {
    //             return setTimeout(main, 1000);
    //         }, {
    //             once: true
    //         });
    // } else {
    //     main();
    // }

}());
