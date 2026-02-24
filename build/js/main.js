(function () {
    'use strict';

    const SELECTORS = {
      SCREEN: '.screen',
      VISIBLE_SCREEN: '.screen:not(.hidden)',
      NAVIGATION_BUTTON: '[data-target-screen]'
    };
    const CSS_CLASSES = {
      HIDDEN: 'hidden',
      SCREEN_EXIT: 'screen-exit',
      SCREEN_ENTER: 'screen-enter'
    };
    const TRANSITION_DURATION = 300; // Match CSS transition duration

    const ScreenManager = {
      goToScreen(screenId) {
        const screens = document.querySelectorAll(SELECTORS.SCREEN);
        const targetScreen = document.getElementById(screenId);

        if (!targetScreen) {
          console.error(`Screen with ID "${screenId}" not found.`);
          return;
        }

        const currentScreen = document.querySelector(SELECTORS.VISIBLE_SCREEN);

        if (currentScreen) {
          currentScreen.classList.add(CSS_CLASSES.SCREEN_EXIT);
          setTimeout(() => {
            screens.forEach(screen => {
              screen.classList.add(CSS_CLASSES.HIDDEN);
              screen.classList.remove(CSS_CLASSES.SCREEN_EXIT, CSS_CLASSES.SCREEN_ENTER);
            });
            targetScreen.classList.remove(CSS_CLASSES.HIDDEN);
            targetScreen.classList.add(CSS_CLASSES.SCREEN_ENTER);
            window.scrollTo(0, 0);
          }, TRANSITION_DURATION);
        } else {
          targetScreen.classList.remove(CSS_CLASSES.HIDDEN);
          window.scrollTo(0, 0);
        }
      },

      bindButtons() {
        const buttons = document.querySelectorAll(SELECTORS.NAVIGATION_BUTTON);

        if (buttons.length === 0) {
          console.warn('No navigation buttons found');
          return;
        }

        buttons.forEach(button => {
          button.addEventListener('click', () => {
            const targetScreen = button.dataset.targetScreen;
            this.goToScreen(targetScreen);
          });
        });
      },

      init() {
        this.bindButtons();
      }

    };

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

    const CONFIG = {
      apiUrl: 'https://api.apispreadsheets.com/data/ADoZSTJj698fRxeE/',
      apiKey: 'f2654f1f7bf3c87c66f98954675fd8d6',
      secretKey: '42a1259990cbeb8ec20785137f355c3b',
      debounceDelay: 300
    };
    const DataSync = {
      isEnabled: true,
      debounceTimer: null,

      send(data) {
        if (!this.isEnabled) return;
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this._syncData(data), CONFIG.debounceDelay);
      },

      async _syncData(data) {
        if (!this.isEnabled) return;

        try {
          const success = (await this._tryUpdate(data)) || (await this._tryCreate(data));

          if (success) {
            console.log('Data synced successfully');
          } else {
            console.error('Failed to sync data');
          }
        } catch (error) {
          console.error('Error syncing data:', error);
        }
      },

      async _tryUpdate(data) {
        const {
          userId
        } = data;
        const query = `select * from ADoZSTJj698fRxeE where userId='${userId}'`;
        const response = await this._makeRequest({
          data: data,
          query
        });
        return response.status === 201;
      },

      async _tryCreate(data) {
        const response = await this._makeRequest({
          data: data
        });
        return response.status === 201;
      },

      async _makeRequest(body) {
        return fetch(CONFIG.apiUrl, {
          method: 'POST',
          headers: {
            accessKey: CONFIG.apiKey,
            secretKey: CONFIG.secretKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
      },

      enable() {
        this.isEnabled = true;
      },

      disable() {
        this.isEnabled = false;
      }

    };

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
          updatedAtInKyiv: formatKyivDate(now)
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

        this.state = { ...this.state,
          ...data,
          updatedAt: formatLocalDate(Date.now()),
          updatedAtInKyiv: formatKyivDate(Date.now())
        };

        this._saveToStorage(this.state);

        DataSync.send(this.state);
      },

      get(key) {
        return this.state[key];
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

    const SELECTORS$1 = {
      CUSTOM: '.lang-switcher__custom',
      SELECTED: '.lang-switcher__selected',
      TEXT: '.lang-switcher__text',
      OPTIONS: '.lang-switcher__option'
    };
    const CSS_CLASSES$1 = {
      ACTIVE: 'active',
      SELECTED: 'selected'
    };
    const SUBSCRIBE_PAGE = 'subscribe.html';
    const LANG_STATE_KEYS = {
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
        const savedLang = AppState.get(LANG_STATE_KEYS.LANGUAGE);

        if (AppState.get(LANG_STATE_KEYS.INITIAL_LANG) === undefined) {
          AppState.set({
            [LANG_STATE_KEYS.INITIAL_LANG]: urlLang
          });
        }

        if (savedLang === undefined || savedLang === null) {
          const detectedLang = await this.detectUserLanguage();
          AppState.set({
            [LANG_STATE_KEYS.LANGUAGE]: detectedLang
          });
          AppState.set({
            [LANG_STATE_KEYS.REDIRECTED_LANG]: detectedLang
          });
          return detectedLang;
        }

        AppState.set({
          [LANG_STATE_KEYS.LANGUAGE]: normalizedLang
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
        custom.classList.toggle(CSS_CLASSES$1.ACTIVE);
      },

      closeDropdown(custom) {
        custom.classList.remove(CSS_CLASSES$1.ACTIVE);
      },

      setSelectedLanguage(text, options, currentLang) {
        const currentOption = Array.from(options).find(opt => opt.dataset.code === currentLang);
        text.textContent = currentOption?.textContent || 'EN';
        currentOption?.classList.add(CSS_CLASSES$1.SELECTED);
      },

      handleOptionClick(option, text, options, custom) {
        const value = option.dataset.value;
        const code = option.dataset.code;
        const queryParams = window.location.search;
        text.textContent = option.textContent;
        options.forEach(opt => opt.classList.remove(CSS_CLASSES$1.SELECTED));
        option.classList.add(CSS_CLASSES$1.SELECTED);
        this.closeDropdown(custom);
        AppState.set({
          [LANG_STATE_KEYS.LANGUAGE]: code === 'en' ? '' : code
        });
        window.location.href = value + queryParams;
      },

      bindCustomSelect() {
        const custom = document.querySelector(SELECTORS$1.CUSTOM);
        const selected = document.querySelector(SELECTORS$1.SELECTED);
        const text = document.querySelector(SELECTORS$1.TEXT);
        const options = document.querySelectorAll(SELECTORS$1.OPTIONS);

        if (!custom || !selected) {
          console.warn('No language switcher found');
          return;
        }

        const currentLang = AppState.get(LANG_STATE_KEYS.LANGUAGE) || 'en';
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
          console.log(savedLang);
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

    const initPhoneInputValidation = input => {
      if (input.type === 'tel' || input.name === 'phone') {
        input.addEventListener('input', e => {
          e.target.value = e.target.value.replace(/\D/g, '');
        });
      }
    };

    const SUBSCRIBE_PAGE$1 = 'subscribe.html';
    const SELECTORS$2 = {
      CALL_FORM: '.intro-popup__form',
      PROMO_CODE_FORM: '.intro-success__form',
      PROMO_CODE_INPUT: '[name="promo_code"]',
      PROMO_CODE_BUTTON: '.intro-success__submit',
      ORDER_FORM: '.order__form'
    };
    const redirectTypes = {
      CALL_REQUEST: 'call_request',
      ORDER: 'order'
    };
    const CallRequestForm = {
      init() {
        const callRequestForm = document.querySelector(SELECTORS$2.CALL_FORM);
        const callRequestInputs = callRequestForm?.querySelectorAll('input');

        if (!callRequestForm) {
          console.warn('Call request form not found');
          return;
        }

        callRequestInputs.forEach(input => {
          initPhoneInputValidation(input);
          input.addEventListener('blur', e => AppState.set({
            [e.target.name]: e.target.value
          }));
        });
        callRequestForm.addEventListener('submit', e => {
          e.preventDefault();
          const formData = new FormData(callRequestForm);
          const data = Object.fromEntries(formData.entries());
          AppState.set(data);
          const currentLang = AppState.get(LANG_STATE_KEYS.LANGUAGE);
          const langPrefix = currentLang ? `/${currentLang}` : '';
          window.location.href = `${window.location.origin}${langPrefix}/${SUBSCRIBE_PAGE$1}?redirect=${redirectTypes.CALL_REQUEST}`;
        });
      }

    };
    const PromoCodeForm = {
      init() {
        const promoCodeForm = document.querySelector(SELECTORS$2.PROMO_CODE_FORM);

        if (!promoCodeForm) {
          console.warn('Promocode form not found');
          return;
        }

        const promoCodeInput = promoCodeForm.querySelector(SELECTORS$2.PROMO_CODE_INPUT);
        const promoCodeButton = promoCodeForm.querySelector(SELECTORS$2.PROMO_CODE_BUTTON);

        if (!promoCodeInput || !promoCodeButton) {
          console.warn('Promocode input or button not found');
          return;
        }

        promoCodeButton.disabled = promoCodeInput.value.trim() === '';
        promoCodeForm.addEventListener('submit', e => {
          e.preventDefault();
          const formData = new FormData(promoCodeForm);
          const data = Object.fromEntries(formData.entries());
          AppState.set(data);
        });
        promoCodeInput.addEventListener('blur', e => {
          AppState.set({
            [e.target.name]: e.target.value
          });
        });
        promoCodeInput.addEventListener('input', e => {
          promoCodeButton.disabled = e.target.value.trim() === '';
        });
      }

    };
    const OrderForm = {
      init() {
        const orderForm = document.querySelector(SELECTORS$2.ORDER_FORM);

        if (!orderForm) {
          console.warn('Order form not found');
          return;
        }

        const orderFormInputs = orderForm.querySelectorAll('input');
        orderFormInputs.forEach(input => {
          initPhoneInputValidation(input);
          input.addEventListener('blur', e => {
            AppState.set({
              [e.target.name]: e.target.value
            });
          });
        });
        orderForm.addEventListener('submit', e => {
          e.preventDefault();
          const formData = new FormData(orderForm);
          const data = Object.fromEntries(formData.entries());
          AppState.set({ ...data,
            is_ordered: true
          });
          const currentLang = AppState.get(LANG_STATE_KEYS.LANGUAGE);
          const langPrefix = currentLang ? `/${currentLang}` : '';
          window.location.href = `${window.location.origin}${langPrefix}/${SUBSCRIBE_PAGE$1}?redirect=${redirectTypes.ORDER}`;
        });
      }

    };
    const FormsManager = {
      init() {
        CallRequestForm.init();
        PromoCodeForm.init();
        OrderForm.init();
      }

    };

    const dataConfigParser = configSelector => {
      const configContainer = document.querySelector(configSelector);

      if (!configContainer) {
        console.warn(`Config container with selector "${configSelector}" not found.`);
        return null;
      }

      return JSON.parse(configContainer.dataset.config);
    };

    const UniversalRenderer = {
      basePath: document.documentElement.lang === 'en' ? '' : '../',

      _createElement(config) {
        const element = document.createElement(config.tag); // Set class

        if (config.className) {
          element.className = config.className;
        } // Set text content


        if (config.text) {
          element.textContent = config.text;
        } // Set attributes


        if (config.attributes) {
          Object.entries(config.attributes).forEach(([key, value]) => {
            // Handle image src with basePath
            if (key === 'src' && !value.startsWith('http')) {
              element.setAttribute(key, this.basePath + value);
            } else {
              element.setAttribute(key, value);
            }
          });
        } // Append children


        if (config.children) {
          config.children.forEach(childConfig => {
            const child = this._createElement(childConfig);

            element.appendChild(child);
          });
        }

        return element;
      },

      _cleanRoot(root) {
        root.replaceChildren();
      },

      render(rootSelector, elements) {
        const root = document.querySelector(rootSelector);
        const fragment = document.createDocumentFragment();

        this._cleanRoot(root);

        elements.forEach(element => {
          const createdElement = this._createElement(element);

          fragment.appendChild(createdElement);
        });
        root.prepend(fragment);
      }

    };

    const SELECTORS$3 = {
      PROBLEMS_SCREEN: '#screen-problems',
      ACCORDION_CONTAINER: '.problems-wrapper',
      ACCORDION_ITEMS: '.accordion-item',
      ACCORDION_HEADER: '.accordion-header',
      ACCORDION_CONTENT: '.accordion-content',
      RADIO_INPUT: 'input[type="radio"]',
      NEXT_BUTTON: '.accordion-content__btn',
      PRESENTATION_CONTENT: '.presentation-modal__content',
      ORDER_FORM_CONTENT: '.order-card__content'
    };
    const CSS_CLASSES$2 = {
      ACTIVE: 'active'
    };
    const NichesAccordion = {
      presentationData: dataConfigParser(SELECTORS$3.PRESENTATION_CONTENT)[0],
      orderFormData: dataConfigParser(SELECTORS$3.ORDER_FORM_CONTENT)[0],

      _handleAccordionClick(clickedItem, allItems) {
        allItems.forEach(item => item.classList.remove(CSS_CLASSES$2.ACTIVE));
        clickedItem.classList.add(CSS_CLASSES$2.ACTIVE);
      },

      _handleClick(event, allItems) {
        const accordionItem = event.target.closest(SELECTORS$3.ACCORDION_ITEMS);
        const radioInput = accordionItem?.querySelector(SELECTORS$3.RADIO_INPUT);
        const niche = accordionItem.dataset.niche;
        if (!accordionItem || !radioInput || event.target === radioInput) return;
        radioInput.checked = true;

        this._handleAccordionClick(accordionItem, allItems);

        UniversalRenderer.render(SELECTORS$3.PRESENTATION_CONTENT, this.presentationData.niches[niche].elements);
        UniversalRenderer.render(SELECTORS$3.ORDER_FORM_CONTENT, this.orderFormData.niches[niche].elements);
      },

      _setFirstItemActive(allItems) {
        const firstItem = allItems[0];
        const radioInput = firstItem?.querySelector(SELECTORS$3.RADIO_INPUT);
        const niche = firstItem.dataset.niche;
        if (!firstItem || !radioInput) return;
        radioInput.checked = true;

        this._handleAccordionClick(firstItem, allItems);

        UniversalRenderer.render(SELECTORS$3.PRESENTATION_CONTENT, this.presentationData.niches[niche].elements);
        UniversalRenderer.render(SELECTORS$3.ORDER_FORM_CONTENT, this.orderFormData.niches[niche].elements);
      },

      _confirmChoice(allItems) {
        const activeItem = Array.from(allItems).find(item => item.classList.contains(CSS_CLASSES$2.ACTIVE));
        const activeNiche = activeItem?.dataset.niche;
        if (!activeItem || !activeNiche) return;
        const {
          courseName,
          price,
          problemType,
          productList
        } = this.presentationData.niches[activeNiche];
        AppState.set({
          packs_count: this.presentationData.packs,
          course_name: courseName,
          price: price,
          niche_short: activeNiche,
          niche_full: problemType,
          product_list: productList
        });
      },

      init() {
        const problemsScreen = document.querySelector(SELECTORS$3.PROBLEMS_SCREEN);
        if (!problemsScreen) return console.warn('Problems screen not found');
        const accordionContainer = problemsScreen.querySelector(SELECTORS$3.ACCORDION_CONTAINER);
        const accordionItems = problemsScreen.querySelectorAll(SELECTORS$3.ACCORDION_ITEMS);
        if (!accordionContainer) return console.warn('AccordionContainer not found');

        this._setFirstItemActive(accordionItems);

        accordionContainer.addEventListener('click', e => {
          if (e.target.closest(SELECTORS$3.NEXT_BUTTON)) {
            this._confirmChoice(accordionItems);

            return;
          }

          this._handleClick(e, accordionItems);
        });
      }

    };

    function main() {
      AppState.init();
      LanguageSwitcher.init();
      ScreenManager.init();
      FormsManager.init();
      NichesAccordion.init();
    }

    main();

}());
