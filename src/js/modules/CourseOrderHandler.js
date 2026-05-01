import {dataConfigParser} from "../utils/dataConfigParser";
import {UniversalRenderer} from "./UniversalRenderer";
import {AppState} from "./AppState";

const SELECTORS = {
    COURSE_SCREEN: '#screen-course',
    COURSE_DETAILS: '.course-details',
    ORDER_BUTTON: '[data-course]',
    ORDER_FORM_CONTENT: '.order-card__content',
};

export const CourseOrderHandler = {
    orderFormData: null,

    _initData() {
        this.orderFormData = dataConfigParser(SELECTORS.ORDER_FORM_CONTENT);
        console.log('Order form data loaded:', this.orderFormData);
    },

    _handleOrderClick(event) {
        const button = event.target.closest(SELECTORS.ORDER_BUTTON);
        if (!button) return;

        const courseDetails = button.closest(SELECTORS.COURSE_DETAILS);
        if (!courseDetails) {
            console.warn('Course details container not found');
            return;
        }

        const niche = courseDetails.dataset.niche;
        const packs = Number(button.dataset.course);

        console.log('Order button clicked:', { niche, packs });

        if (!niche || !packs) {
            console.warn('Missing niche or packs:', { niche, packs });
            return;
        }

        if (!this.orderFormData) {
            console.warn('Order form data not initialized');
            return;
        }

        // Find the order form elements for this niche and pack count
        const courseConfig = this.orderFormData.find(course => course.packs === packs);

        if (!courseConfig) {
            console.warn(`No course config found for packs: ${packs}`, this.orderFormData);
            return;
        }

        const orderFormElements = courseConfig.niches?.[niche]?.elements;

        if (!orderFormElements) {
            console.warn(`No order form data found for niche: ${niche}, packs: ${packs}`);
            console.log('Available niches:', Object.keys(courseConfig.niches || {}));
            return;
        }

        console.log('Rendering order form for:', { niche, packs });

        // Render the order form
        UniversalRenderer.render(
            SELECTORS.ORDER_FORM_CONTENT,
            orderFormElements
        );

        const price = button.dataset.price;
        const plan = button.dataset.plan;

        AppState.set({
            price: price,
            packs_count: packs,
            course_name: plan
        });
    },

    init() {
        const courseScreen = document.querySelector(SELECTORS.COURSE_SCREEN);
        if (!courseScreen) {
            console.warn('Course screen not found');
            return;
        }

        // Initialize data
        this._initData();

        // Listen for clicks on the entire course screen
        courseScreen.addEventListener('click', (e) => {
            this._handleOrderClick(e);
        });

        console.log('CourseOrderHandler initialized');
    }
};
