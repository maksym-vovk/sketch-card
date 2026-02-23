(function () {
    'use strict';

    function formatToCustomString(date, timeZone) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };

      if (timeZone) {
        options.timeZone = timeZone;
      }

      const formatted = new Intl.DateTimeFormat('en-GB', options).format(date);
      return formatted.replace(/\//g, '.').replace(',', ',');
    }
    function formatLocalDate(timestamp) {
      const date = new Date(timestamp);
      return formatToCustomString(date);
    }
    function formatKyivDate(timestamp) {
      const date = new Date(timestamp);
      return formatToCustomString(date, 'Europe/Kiev');
    }

    const AppState = {
      storageKey: 'appState',
      state: null,

      init() {
        this.state = this._loadState() || this._initializeState();
      },

      _initializeState() {
        const now = Date.now();
        const initialState = {
          userId: this._generateUserId(),
          createdAt: formatLocalDate(now),
          createdAtInKyiv: formatKyivDate(now),
          updatedAt: formatLocalDate(now),
          updatedAtInKyiv: formatKyivDate(now),
          data: {}
        };

        this._saveToStorage(initialState);

        return initialState;
      },

      _generateUserId() {
        return Math.random().toString(36).substring(2, 8);
      },

      _loadState() {
        try {
          const stored = localStorage.getItem(this.storageKey);
          return stored ? JSON.parse(stored) : null;
        } catch (error) {
          console.error('Failed to load state:', error);
          return null;
        }
      },

      _saveToStorage(state) {
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (error) {
          console.error('Failed to save state:', error);
        }
      },

      set(data) {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
          console.error('set() expects a plain object');
          return;
        }

        this.state.data = { ...this.state.data,
          ...data
        };
        this.state.updatedAt = formatLocalDate(Date.now());
        this.state.updatedAtInKyiv = formatKyivDate(Date.now());

        this._saveToStorage(this.state);
      },

      get(key) {
        return this.state.data[key];
      },

      getAll() {
        return { ...this.state
        };
      },

      getUserId() {
        return this.state.userId;
      },

      getCreatedAt() {
        return this.state.createdAt;
      },

      getUpdatedAt() {
        return this.state.updatedAt;
      },

      clear() {
        this.state = this._initializeState();
      }

    };

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
    const SUBSCRIBE_PAGE = 'subscribe.html';
    const STATE_KEYS = {
      LANGUAGE: 'language',
      INITIAL_LANG: 'initial_language',
      REDIRECTED_LANG: 'redirected_language'
    };
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
          const response = await fetch(API_URL, {
            signal: controller.signal
          });
          const data = await response.json();
          return COUNTRY_MAP[data.country_code] || '';
        } catch (error) {
          console.warn('Failed to detect language from IP:', error);
          const browserLang = navigator.language.split('-')[0];
          return LANGUAGE_MAP[browserLang] || '';
        }
      },

      extractLanguageFromURL() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);

        if (pathParts.length === 0) {
          return 'en';
        }

        const langFromPath = pathParts[0];

        if (Object.values(LANGUAGE_MAP).includes(langFromPath)) {
          return langFromPath;
        }

        return 'en';
      },

      async getLanguage() {
        const urlLang = this.extractLanguageFromURL();
        const normalizedLang = urlLang === 'en' ? '' : urlLang;
        const savedLang = AppState.get(STATE_KEYS.LANGUAGE);

        if (AppState.get(STATE_KEYS.INITIAL_LANG) === undefined) {
          AppState.set({
            [STATE_KEYS.INITIAL_LANG]: urlLang
          });
        }

        if (savedLang === undefined || savedLang === null) {
          const detectedLang = await this.detectUserLanguage();
          AppState.set({
            [STATE_KEYS.LANGUAGE]: detectedLang
          });
          AppState.set({
            [STATE_KEYS.REDIRECTED_LANG]: detectedLang
          });
          return detectedLang;
        }

        AppState.set({
          [STATE_KEYS.LANGUAGE]: normalizedLang
        });
        return normalizedLang;
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
        AppState.set({
          [STATE_KEYS.LANGUAGE]: code === 'en' ? '' : code
        });
        window.location.href = value + queryParams;
      },

      bindCustomSelect() {
        const custom = document.querySelector(SELECTORS.CUSTOM);
        const selected = document.querySelector(SELECTORS.SELECTED);
        const text = document.querySelector(SELECTORS.TEXT);
        const options = document.querySelectorAll(SELECTORS.OPTIONS);

        if (!custom || !selected) {
          console.warn('No language switcher found');
          return;
        }

        const currentLang = AppState.get(STATE_KEYS.LANGUAGE) || 'en';
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
      AppState.init();
      LanguageSwitcher.init();
      ThankYouPageManager.init();
    }

    main();

}());
//# sourceMappingURL=subscribe.js.map
