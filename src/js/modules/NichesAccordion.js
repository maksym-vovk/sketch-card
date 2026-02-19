const SELECTORS = {
    PROBLEMS_SCREEN: '#screen-problems',
    ACCORDION_ITEMS: '.accordion-item',
    ACCORDION_HEADER: '.accordion-header',
    ACCORDION_CONTENT: '.accordion-content',
    RADIO_INPUT: 'input[type="radio"]',
    NEXT_BUTTON: '.problems__next'
};

export const NichesAccordion = {
    handleAccordionClick(clickedItem, allItems) {
        const wasActive = clickedItem.classList.contains('active');

        allItems.forEach(item => item.classList.remove('active'));

        if (!wasActive) {
            clickedItem.classList.add('active');
        }
    },

    init() {
        const problemsScreen = document.querySelector(SELECTORS.PROBLEMS_SCREEN);

        if (!problemsScreen) {
            console.warn('Problems screen not found');
            return;
        }

        const accordionItems = problemsScreen.querySelectorAll(SELECTORS.ACCORDION_ITEMS);
        const nextButton = problemsScreen.querySelector(SELECTORS.NEXT_BUTTON);


        if (!accordionItems.length || !nextButton) {
            console.warn('Accordion items or next button not found');
            return;
        }

        nextButton.disabled = true;

        accordionItems.forEach(item => {
            const header = item.querySelector(SELECTORS.ACCORDION_HEADER);
            const radioInput = header?.querySelector(SELECTORS.RADIO_INPUT);

            if (!header || !radioInput) return;

            radioInput.addEventListener('change', () => {
                this.handleAccordionClick(item, accordionItems);
                nextButton.disabled = false;
            });
        });
    }
}