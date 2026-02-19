const SUBSCRIBE_PAGE = 'subscribe.html';

const SELECTORS = {
    CALL_FORM: '.intro-popup__form',
    PROMO_CODE_FORM: '.intro-success__form',
    PROMO_CODE_INPUT: '[name="promo-code"]',
    PROMO_CODE_BUTTON: '.intro-success__submit',
    ORDER_FORM: '.order__form',
}

const CallRequestForm = {
    init() {
        const callRequestForm = document.querySelector(SELECTORS.CALL_FORM);

        if (!callRequestForm) {
            console.warn('Call request form not found');
            return;
        }

        callRequestForm.addEventListener('submit', e => {
            e.preventDefault();
            window.location.href = `${window.location.origin}/${SUBSCRIBE_PAGE}`;
        });
    }
}

const PromoCodeForm = {
    init() {
        const promoCodeForm = document.querySelector(SELECTORS.PROMO_CODE_FORM);

        if (!promoCodeForm) {
            console.warn('Promocode form not found');
            return;
        }

        const promoCodeInput = promoCodeForm.querySelector(SELECTORS.PROMO_CODE_INPUT);
        const promoCodeButton = promoCodeForm.querySelector(SELECTORS.PROMO_CODE_BUTTON);

        if (!promoCodeInput || !promoCodeButton) {
            console.warn('Promocode input or button not found');
            return;
        }

        promoCodeButton.disabled = promoCodeInput.value.trim() === '';

        promoCodeForm.addEventListener('submit', e => {
            e.preventDefault();
        });

        promoCodeInput.addEventListener('input', e => {
           promoCodeButton.disabled = e.target.value.trim() === '';
        });
    }
}

const OrderForm = {
    init() {
        const orderForm = document.querySelector(SELECTORS.ORDER_FORM);

        if (!orderForm) {
            console.warn('Order form not found');
            return;
        }

        orderForm.addEventListener('submit', e => {
            e.preventDefault();
            window.location.href = `${window.location.origin}/${SUBSCRIBE_PAGE}`;
        });
    }
}

export const FormsManager = {
    init() {
        CallRequestForm.init();
        PromoCodeForm.init();
        OrderForm.init();
    }
}