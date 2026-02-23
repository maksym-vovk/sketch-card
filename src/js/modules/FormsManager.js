import {AppState} from "./AppState";
import {LANG_STATE_KEYS} from "./LanguageSwitcher";

const SUBSCRIBE_PAGE = 'subscribe.html';

const SELECTORS = {
    CALL_FORM: '.intro-popup__form',
    PROMO_CODE_FORM: '.intro-success__form',
    PROMO_CODE_INPUT: '[name="promo_code"]',
    PROMO_CODE_BUTTON: '.intro-success__submit',
    ORDER_FORM: '.order__form',
}

const redirectTypes = {
    CALL_REQUEST: 'call_request',
    ORDER: 'order'
};

const CallRequestForm = {
    init() {
        const callRequestForm = document.querySelector(SELECTORS.CALL_FORM);
        const callRequestInputs = callRequestForm?.querySelectorAll('input');

        if (!callRequestForm) {
            console.warn('Call request form not found');
            return;
        }

        callRequestInputs.forEach(input => {
            input.addEventListener('blur', e => AppState.set({ [e.target.name]: e.target.value }));
        })

        callRequestForm.addEventListener('submit', e => {
            e.preventDefault();

            const formData = new FormData(callRequestForm);
            const data = Object.fromEntries(formData.entries());
            AppState.set(data);

            const currentLang = AppState.get(LANG_STATE_KEYS.LANGUAGE);
            const langPrefix = currentLang ? `/${currentLang}` : '';
            window.location.href = `${window.location.origin}${langPrefix}/${SUBSCRIBE_PAGE}?redirect=${redirectTypes.CALL_REQUEST}`;
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

            const formData = new FormData(promoCodeForm);
            const data = Object.fromEntries(formData.entries());
            AppState.set(data);
        });

        promoCodeInput.addEventListener('blur', e => {
            AppState.set({ [e.target.name]: e.target.value });
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

        const orderFormInputs = orderForm.querySelectorAll('input');

        orderFormInputs.forEach(input => {
            input.addEventListener('blur', e => {
                AppState.set({ [e.target.name]: e.target.value });
            });
        });

        orderForm.addEventListener('submit', e => {
            e.preventDefault();

            const formData = new FormData(orderForm);
            const data = Object.fromEntries(formData.entries());
            AppState.set({
                ...data,
                is_ordered: true
            });

            const currentLang = AppState.get(LANG_STATE_KEYS.LANGUAGE);
            const langPrefix = currentLang ? `/${currentLang}` : '';
            window.location.href = `${window.location.origin}${langPrefix}/${SUBSCRIBE_PAGE}?redirect=${redirectTypes.ORDER}`;
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