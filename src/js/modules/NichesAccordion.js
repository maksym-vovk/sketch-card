const SELECTORS = {
    PROBLEMS_SCREEN: '#screen-problems',
    ACCORDION_CONTAINER: '.problems-wrapper',
    ACCORDION_ITEMS: '.accordion-item',
    ACCORDION_HEADER: '.accordion-header',
    ACCORDION_CONTENT: '.accordion-content',
    RADIO_INPUT: 'input[type="radio"]',
    NEXT_BUTTON: '.problems__next'
};

const CSS_CLASSES = {
    ACTIVE: 'active'
};

export const NichesAccordion = {
    nextButton: null,

    handleAccordionClick(clickedItem, allItems) {
        allItems.forEach(item => item.classList.remove(CSS_CLASSES.ACTIVE));
        clickedItem.classList.add(CSS_CLASSES.ACTIVE);
    },

    handleClick(event, allItems) {
        const accordionItem = event.target.closest(SELECTORS.ACCORDION_ITEMS);
        const radioInput = accordionItem?.querySelector(SELECTORS.RADIO_INPUT);

        if (!accordionItem || !radioInput || event.target === radioInput) return;

        radioInput.checked = true;
        this.handleAccordionClick(accordionItem, allItems);
    },

    init() {
        const problemsScreen = document.querySelector(SELECTORS.PROBLEMS_SCREEN);
        if (!problemsScreen) return console.warn('Problems screen not found');

        const accordionItems = problemsScreen.querySelectorAll(SELECTORS.ACCORDION_ITEMS);

        if (!accordionItems.length) {
            return console.warn('Accordion items or next button not found');
        }

        problemsScreen.querySelector(SELECTORS.ACCORDION_CONTAINER)
            ?.addEventListener('click', (e) => this.handleClick(e, accordionItems));
    }
};