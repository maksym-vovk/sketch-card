const SUBSCRIBE_PAGE = 'subscribe.html';

const CALL_FORM_SELECTOR = '.intro-popup__form';
const PROMO_CODE_FORM_SELECTOR = '.intro-success__form';
const PROMO_CODE_INPUT_SELECTOR = '[name="promo-code"]';
const PROMO_CODE_BUTTON_SELECTOR = '.intro-success__submit';

const CallRequestForm = {
    init() {
        const callRequestForm = document.querySelector(CALL_FORM_SELECTOR);

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
        const promoCodeForm = document.querySelector(PROMO_CODE_FORM_SELECTOR);
        const promoCodeInput = promoCodeForm ? promoCodeForm.querySelector(PROMO_CODE_INPUT_SELECTOR) : null;
        const promoCodeButton = promoCodeForm ? promoCodeForm.querySelector(PROMO_CODE_BUTTON_SELECTOR) : null;

        if (!promoCodeForm) {
            console.warn('Promocode form not found');
            return;
        }

        promoCodeForm.addEventListener('submit', e => {
            e.preventDefault();
        })

        console.log(promoCodeInput)

        promoCodeInput.addEventListener('input', e => {
           promoCodeButton.disabled = e.target.value === '';
        })
    }
}


export const Forms = {
    init() {
        CallRequestForm.init();
        PromoCodeForm.init();
    }
}