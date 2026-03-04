import {dataConfigParser} from "../utils/dataConfigParser";
import {UniversalRenderer} from "./UniversalRenderer";
import {AppState} from "./AppState";

const SELECTORS = {
    COURSE_SCREEN: '#screen-course',
    COURSE_CONTAINER: '.course-options',
    COURSE_ITEMS: '.course-option',
    NEXT_BUTTON: '.course__select',
    RADIO_INPUT: `#screen-course input[type="radio"]`,
    PRESENTATION_CONTENT: '.presentation-modal__content',
    FOUR_COURSE_CONTENT: '#four-course',
    SIX_COURSE_CONTENT: '#six-course',
    ORDER_FORM_CONTENT: '.order-card__content',
};

const CSS_CLASSES = {
    ACTIVE: 'active'
};


export const CourseSwitcher = {
    presentationData: dataConfigParser(SELECTORS.PRESENTATION_CONTENT),
    orderFormData: dataConfigParser(SELECTORS.ORDER_FORM_CONTENT)[0],

    _handleAccordionClick(clickedItem, allItems) {
        allItems.forEach(item => item.classList.remove(CSS_CLASSES.ACTIVE));
        clickedItem.classList.add(CSS_CLASSES.ACTIVE);
    },

    _setFirstItemActive(allItems) {
        const firstItem = allItems[0];
        const radioInput = firstItem?.querySelector(SELECTORS.RADIO_INPUT);
        const niche = radioInput.dataset.niche
        const packs = Number(radioInput.dataset.packs)

        const presentationElements = this.presentationData.find(course => course.packs === packs).niches[niche].elements;

        if (!firstItem || !radioInput) return;

        radioInput.checked = true;
        this._handleAccordionClick(firstItem, allItems);

        UniversalRenderer.render(
            SELECTORS.PRESENTATION_CONTENT,
            presentationElements
        )

        UniversalRenderer.render(
            SELECTORS.ORDER_FORM_CONTENT,
            this.orderFormData.niches[niche].elements
        )
    },

    _handleClick(event, allItems) {
        const courseItem = event.target.closest(SELECTORS.COURSE_ITEMS);
        const radioInput = courseItem?.querySelector(SELECTORS.RADIO_INPUT);
        const niche = radioInput.dataset.niche
        const packs = Number(radioInput.dataset.packs)

        const presentationElements = this.presentationData.find(course => course.packs === packs).niches[niche].elements;

        if (!courseItem || !radioInput || event.target === radioInput) return;

        radioInput.checked = true;
        this._handleAccordionClick(courseItem, allItems);

        UniversalRenderer.render(
            SELECTORS.PRESENTATION_CONTENT,
            presentationElements
        )

        UniversalRenderer.render(
            SELECTORS.ORDER_FORM_CONTENT,
            this.orderFormData.niches[niche].elements
        )
    },

    _confirmChoice(allItems) {
        const activeItem = Array.from(allItems).find(item => item.classList.contains(CSS_CLASSES.ACTIVE));
        const radioInput = activeItem?.querySelector(SELECTORS.RADIO_INPUT);
        const activeNiche = radioInput?.dataset.niche;
        const activePacks = Number(radioInput.dataset.packs)

        if (!activeItem || !activeNiche) return;

        const {
            courseName,
            price,
            problemType,
            productList
        } = this.presentationData.find(course => course.packs === activePacks).niches[activeNiche].sendData;

        AppState.set({
            packs_count: activePacks,
            course_name: courseName,
            price: price,
            niche_short: activeNiche,
            chosen_problem: problemType,
            product_list: productList
        })
    },

    init() {
        const problemsScreen = document.querySelector(SELECTORS.COURSE_SCREEN);
        if (!problemsScreen) return console.warn('Problems screen not found');

        const coursesContainer = problemsScreen.querySelector(SELECTORS.COURSE_CONTAINER);
        const coursesItems = problemsScreen.querySelectorAll(SELECTORS.COURSE_ITEMS);
        if (!coursesContainer) return console.warn('Courses Container not found');

        this._setFirstItemActive(coursesItems);

        coursesContainer.addEventListener('click', (e) => {
            if (e.target.closest(SELECTORS.NEXT_BUTTON)) {
                this._confirmChoice(coursesItems);
                return;
            }
            this._handleClick(e, coursesItems);
        });
    }
};