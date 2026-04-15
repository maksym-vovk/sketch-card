import {ScreenManager} from "./ScreenManager";

const SELECTORS = {
    PROBLEMS_SCREEN: '#screen-problems',
    PROBLEMS_LIST: '.problems-list',
    PROBLEMS_ITEM: '.problems-list__item',
    COURSE_SCREEN: '#screen-course',
    COURSE_DETAILS: '.course-details',
    REVIEW_CARD_BTN: '.review-card__btn',
};

const CSS_CLASSES = {
    HIDDEN: 'hidden',
};

export const NicheDisplayHandler = {
    _showCourseDetailsForNiche(niche) {
        // Hide all course-details blocks
        const allCourseDetails = document.querySelectorAll(SELECTORS.COURSE_DETAILS);
        allCourseDetails.forEach(block => {
            block.classList.add(CSS_CLASSES.HIDDEN);
        });

        // Show the course-details block matching the selected niche
        const targetCourseDetails = document.querySelector(`${SELECTORS.COURSE_DETAILS}[data-niche="${niche}"]`);
        if (targetCourseDetails) {
            targetCourseDetails.classList.remove(CSS_CLASSES.HIDDEN);
            console.log(`Showing course details for niche: ${niche}`);
        } else {
            console.warn(`Course details block not found for niche: ${niche}`);
        }
    },

    _handleProblemClick(event) {
        const problemItem = event.target.closest(SELECTORS.PROBLEMS_ITEM);

        if (!problemItem) return;

        const niche = problemItem.dataset.niche;

        if (!niche) {
            console.warn('No niche data found on clicked problem item');
            return;
        }

        // Show the corresponding course-details block
        this._showCourseDetailsForNiche(niche);
    },

    _handleReviewCardButtonClick(event) {
        const button = event.target.closest(SELECTORS.REVIEW_CARD_BTN);

        if (!button) return;

        // Prevent default link behavior
        event.preventDefault();

        const niche = button.dataset.niche;
        const targetScreen = button.dataset.targetScreen;

        if (!niche) {
            console.warn('No niche data found on clicked review button');
            return;
        }

        // Show the corresponding course-details block
        this._showCourseDetailsForNiche(niche);

        // Navigate to the target screen if specified
        if (targetScreen && ScreenManager) {
            ScreenManager.goToScreen(targetScreen);
        }

        console.log(`Review button clicked - Niche: ${niche}, Target: ${targetScreen}`);
    },

    init() {
        const problemsScreen = document.querySelector(SELECTORS.PROBLEMS_SCREEN);
        if (!problemsScreen) {
            console.warn('Problems screen not found');
            return;
        }

        const problemsList = problemsScreen.querySelector(SELECTORS.PROBLEMS_LIST);
        if (!problemsList) {
            console.warn('Problems list not found');
            return;
        }

        // Listen for clicks on the problems list
        problemsList.addEventListener('click', (e) => {
            this._handleProblemClick(e);
        });

        // Listen for clicks on review card buttons (event delegation on document)
        document.addEventListener('click', (e) => {
            if (e.target.closest(SELECTORS.REVIEW_CARD_BTN)) {
                this._handleReviewCardButtonClick(e);
            }
        });

        console.log('NicheDisplayHandler initialized');
    }
};

// const SELECTORS = {
//     PROBLEMS_SCREEN: '#screen-problems',
//     PROBLEMS_LIST: '.problems-list',
//     PROBLEMS_ITEM: '.problems-list__item',
//     COURSE_SCREEN: '#screen-course',
//     COURSE_DETAILS: '.course-details',
// };
//
// const CSS_CLASSES = {
//     HIDDEN: 'hidden',
// };
//
// export const NicheDisplayHandler = {
//     _showCourseDetailsForNiche(niche) {
//         // Hide all course-details blocks
//         const allCourseDetails = document.querySelectorAll(SELECTORS.COURSE_DETAILS);
//         allCourseDetails.forEach(block => {
//             block.classList.add(CSS_CLASSES.HIDDEN);
//         });
//
//         // Show the course-details block matching the selected niche
//         const targetCourseDetails = document.querySelector(`${SELECTORS.COURSE_DETAILS}[data-niche="${niche}"]`);
//         if (targetCourseDetails) {
//             targetCourseDetails.classList.remove(CSS_CLASSES.HIDDEN);
//             console.log(`Showing course details for niche: ${niche}`);
//         } else {
//             console.warn(`Course details block not found for niche: ${niche}`);
//         }
//     },
//
//     _handleProblemClick(event) {
//         const problemItem = event.target.closest(SELECTORS.PROBLEMS_ITEM);
//
//         if (!problemItem) return;
//
//         const niche = problemItem.dataset.niche;
//
//         if (!niche) {
//             console.warn('No niche data found on clicked problem item');
//             return;
//         }
//
//         // Show the corresponding course-details block
//         this._showCourseDetailsForNiche(niche);
//     },
//
//     init() {
//         const problemsScreen = document.querySelector(SELECTORS.PROBLEMS_SCREEN);
//         if (!problemsScreen) {
//             console.warn('Problems screen not found');
//             return;
//         }
//
//         const problemsList = problemsScreen.querySelector(SELECTORS.PROBLEMS_LIST);
//         if (!problemsList) {
//             console.warn('Problems list not found');
//             return;
//         }
//
//         // Listen for clicks on the problems list
//         problemsList.addEventListener('click', (e) => {
//             this._handleProblemClick(e);
//         });
//
//         console.log('ProblemsSwitcher initialized');
//     }
// };
