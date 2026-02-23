import {AppState} from "./AppState";

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

export const LANG_STATE_KEYS = {
    LANGUAGE: 'language',
    INITIAL_LANG: 'initial_language',
    REDIRECTED_LANG: 'redirected_language',
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

export const LanguageSwitcher = {
    async detectUserLanguage() {
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 500);

            const response = await fetch(API_URL, { signal: controller.signal });
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
            AppState.set({ [LANG_STATE_KEYS.INITIAL_LANG]: urlLang });
        }

        if (savedLang === undefined || savedLang === null) {
            const detectedLang = await this.detectUserLanguage();
            AppState.set({ [LANG_STATE_KEYS.LANGUAGE]: detectedLang });
            AppState.set({ [LANG_STATE_KEYS.REDIRECTED_LANG]: detectedLang });
            return detectedLang;
        }

        AppState.set({ [LANG_STATE_KEYS.LANGUAGE]: normalizedLang });
        return normalizedLang;
    },

    redirectIfNeeded(savedLang) {
        const currentPath = window.location.pathname;
        const isSubscribePage = currentPath.includes(SUBSCRIBE_PAGE);
        const queryParams = window.location.search;

        if (savedLang && !currentPath.includes(`/${savedLang}/`)) {
            window.location.href = isSubscribePage
                ? `/${savedLang}/${SUBSCRIBE_PAGE}${queryParams}`
                : `/${savedLang}/${queryParams}`;
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

        AppState.set({ [LANG_STATE_KEYS.LANGUAGE]: code === 'en' ? '' : code });
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

        const currentLang = AppState.get(LANG_STATE_KEYS.LANGUAGE) || 'en';
        this.setSelectedLanguage(text, options, currentLang);

        selected.addEventListener('click', (e) => {
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