export const initPhoneInputValidation = (input) => {
    if (input.type === 'tel' || input.name === 'phone') {
        input.addEventListener('input', e => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
};