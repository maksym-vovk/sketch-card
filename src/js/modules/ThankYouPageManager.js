const SELECTORS = {
    CALL_TEXT: '.thank-you__text--callback',
    ORDER_TEXT: '.thank-you__text--order',
};

const CSS_CLASSES = {
    HIDDEN: 'hidden',
};

export const ThankYouPageManager = {
    setCongratulationText() {
        const queryParams = new URLSearchParams(window.location.search);
        const redirectType = queryParams.get('redirect');

        const callText = document.querySelector(SELECTORS.CALL_TEXT);
        const orderText = document.querySelector(SELECTORS.ORDER_TEXT);

        if (!callText || !orderText) {
            console.warn('Congratulation text elements not found');
            return;
        }

        switch (redirectType) {
            case 'call_request':
                callText.classList.remove(CSS_CLASSES.HIDDEN);
                orderText.classList.add(CSS_CLASSES.HIDDEN);
                break;
            case 'order':
                orderText.classList.remove(CSS_CLASSES.HIDDEN);
                callText.classList.add(CSS_CLASSES.HIDDEN);
                break;
            default:
                console.warn('Unknown redirect type, showing default text');
        }
    },

    init() {
        this.setCongratulationText();
    }
};
