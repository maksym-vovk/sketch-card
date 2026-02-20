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

export const ScreenManager = {
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
