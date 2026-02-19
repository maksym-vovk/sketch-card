const SELECTORS = {
    LANG_SWITCHER_LINK: '.lang-switcher a'
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

        if (savedLang && !currentPath.includes(`/${savedLang}/`)) {
            window.location.href = isSubscribePage
                ? `/${savedLang}/${SUBSCRIBE_PAGE}`
                : `/${savedLang}/`;
            return true;
        }

        return false;
    },

    bindLinks() {
        const links = document.querySelectorAll(SELECTORS.LANG_SWITCHER_LINK);

        if (links.length === 0) {
            console.warn('No language switcher links found');
            return;
        }

        links.forEach(link => {
            link.addEventListener('click', () => {
                const lang = link.textContent.toLowerCase();
                const value = lang === 'en' ? '' : lang;
                localStorage.setItem(STORAGE_KEY, value);
            });
        });
    },

    async init() {
        try {
            const savedLang = await this.getLanguage();
            const redirected = this.redirectIfNeeded(savedLang);

            if (!redirected) {
                this.bindLinks();
            }
        } catch (error) {
            console.error('LanguageSwitcher initialization failed:', error);
            this.bindLinks();
        }
    }
};