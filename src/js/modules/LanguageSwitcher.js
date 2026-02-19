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

export const LanguageSwitcher = {
    async detectUserLanguage() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const countryCode = data.country_code;

            return COUNTRY_MAP[countryCode] || '';
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

        localStorage.setItem(STORAGE_KEY, code === 'en' ? '' : code);
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

        const currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
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