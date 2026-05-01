import {removeModifierClass} from "../utils/selectors";

const SELECTORS = {
    SCREEN: '.screen',
    VISIBLE_SCREEN: '.screen:not(.hidden)',
    NAVIGATION_BUTTON: '[data-target-screen]',

    ORDER_FORM_CONTENT: '.order-card__content',
    ORDER_BACK_BUTTON: '.order__next[data-target-screen="screen-course"]',
    HEADER_BACK_BUTTON: '.header__button',

};

const CSS_CLASSES = {
    HIDDEN: 'hidden',
    SCREEN_EXIT: 'screen-exit',
    SCREEN_ENTER: 'screen-enter',
};

const TRANSITION_DURATION = 300; // Match CSS transition duration

export const ScreenManager = {
    headerBackButton: document.querySelector(SELECTORS.HEADER_BACK_BUTTON),

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

            this.headerBackButton.classList.add(CSS_CLASSES.HIDDEN);

            setTimeout(() => {
                screens.forEach(screen => {
                    screen.classList.add(CSS_CLASSES.HIDDEN);
                    screen.classList.remove(CSS_CLASSES.SCREEN_EXIT, CSS_CLASSES.SCREEN_ENTER);
                });

                targetScreen.classList.remove(CSS_CLASSES.HIDDEN);
                targetScreen.classList.add(CSS_CLASSES.SCREEN_ENTER);

                this._changeTopBackButtonVisibility(screenId);
                window.scrollTo(0, 0);
            }, TRANSITION_DURATION);
        } else {
            targetScreen.classList.remove(CSS_CLASSES.HIDDEN);
            window.scrollTo(0, 0);
        }
    },

    _handleOrderBackButton() {
        setTimeout(() => {
            removeModifierClass(SELECTORS.ORDER_FORM_CONTENT, 'additional');
        }, TRANSITION_DURATION);
    },


    _changeTopBackButtonVisibility(screenId) {
        const screensWithTopBackButton = {
            'screen-course': 'screen-problems',
            'screen-intro-popup': 'screen-intro',
        }

        if (screensWithTopBackButton[screenId]) {
            this.headerBackButton.setAttribute('data-target-screen', screensWithTopBackButton[screenId]);
            this.headerBackButton.classList.remove(CSS_CLASSES.HIDDEN);
        } else {
            this.headerBackButton.removeAttribute('data-target-screen');
            this.headerBackButton.classList.add(CSS_CLASSES.HIDDEN);
        }
    },

    bindButtons() {
        const buttons = document.querySelectorAll(SELECTORS.NAVIGATION_BUTTON);
        const backButton = document.querySelector(SELECTORS.ORDER_BACK_BUTTON);

        if (buttons.length === 0) {
            console.warn('No navigation buttons found');
            return;
        }

        if (backButton) {
            backButton.addEventListener('click', () => {
                this._handleOrderBackButton();
            });
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
