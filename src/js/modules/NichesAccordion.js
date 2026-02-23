import {dataConfigParser} from "../utils/dataConfigParser";
import {UniversalRenderer} from "./UniversalRenderer";
import {AppState} from "./AppState";

const SELECTORS = {
    PROBLEMS_SCREEN: '#screen-problems',
    ACCORDION_CONTAINER: '.problems-wrapper',
    ACCORDION_ITEMS: '.accordion-item',
    ACCORDION_HEADER: '.accordion-header',
    ACCORDION_CONTENT: '.accordion-content',
    RADIO_INPUT: 'input[type="radio"]',
    NEXT_BUTTON: '.accordion-content__btn',
    PRESENTATION_CONTENT: '.presentation-modal__content',
    ORDER_FORM_CONTENT: '.order-card__content'
};

const CSS_CLASSES = {
    ACTIVE: 'active'
};

export const NichesAccordion = {
    presentationData: dataConfigParser(SELECTORS.PRESENTATION_CONTENT)[0],
    orderFormData: dataConfigParser(SELECTORS.ORDER_FORM_CONTENT)[0],

    _handleAccordionClick(clickedItem, allItems) {
        allItems.forEach(item => item.classList.remove(CSS_CLASSES.ACTIVE));
        clickedItem.classList.add(CSS_CLASSES.ACTIVE);
    },

    _handleClick(event, allItems) {
        const accordionItem = event.target.closest(SELECTORS.ACCORDION_ITEMS);
        const radioInput = accordionItem?.querySelector(SELECTORS.RADIO_INPUT);
        const niche = accordionItem.dataset.niche

        if (!accordionItem || !radioInput || event.target === radioInput) return;

        radioInput.checked = true;
        this._handleAccordionClick(accordionItem, allItems);

        UniversalRenderer.render(
            SELECTORS.PRESENTATION_CONTENT,
            this.presentationData.niches[niche].elements
        )

        UniversalRenderer.render(
            SELECTORS.ORDER_FORM_CONTENT,
            this.orderFormData.niches[niche].elements
        )
    },

    _setFirstItemActive(allItems) {
        const firstItem = allItems[0];
        const radioInput = firstItem?.querySelector(SELECTORS.RADIO_INPUT);
        const niche = firstItem.dataset.niche

        if (!firstItem || !radioInput) return;

        radioInput.checked = true;
        this._handleAccordionClick(firstItem, allItems);

        UniversalRenderer.render(
            SELECTORS.PRESENTATION_CONTENT,
            this.presentationData.niches[niche].elements
        )

        UniversalRenderer.render(
            SELECTORS.ORDER_FORM_CONTENT,
            this.orderFormData.niches[niche].elements
        )
    },

    _confirmChoice(allItems) {
        const activeItem = Array.from(allItems).find(item => item.classList.contains(CSS_CLASSES.ACTIVE));
        const activeNiche = activeItem?.dataset.niche;

        if (!activeItem || !activeNiche) return;

        const { courseName, price, problemType, productList } = this.presentationData.niches[activeNiche];

        AppState.set({
            packs_count: this.presentationData.packs,
            course_name: courseName,
            price: price,
            niche_short: activeNiche,
            niche_full: problemType,
            product_list: productList
        })
    },


    init() {
        const problemsScreen = document.querySelector(SELECTORS.PROBLEMS_SCREEN);
        if (!problemsScreen) return console.warn('Problems screen not found');

        const accordionContainer = problemsScreen.querySelector(SELECTORS.ACCORDION_CONTAINER);
        const accordionItems = problemsScreen.querySelectorAll(SELECTORS.ACCORDION_ITEMS);
        if (!accordionContainer) return console.warn('AccordionContainer not found');

        this._setFirstItemActive(accordionItems);

        accordionContainer.addEventListener('click', (e) => {
            if (e.target.closest(SELECTORS.NEXT_BUTTON)) {
                this._confirmChoice(accordionItems);
                return;
            }
            this._handleClick(e, accordionItems);
        });
    }
};