import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

export const ReviewsSlider = {
    instances: [],

    init() {
        const elements = this._getSliderElements();
        if (!elements.length) return;

        elements.forEach(el => {
            const swiper = this._createSwiper(el);
            this.instances.push(swiper);
        });
    },

    _getSliderElements() {
        return document.querySelectorAll('.reviews__slider');
    },

    _createSwiper(el) {
        return new Swiper(el, {
            modules: [Navigation],
            slidesPerView: 1,
            spaceBetween: 16,
            speed: 450,
            loop: false,
            autoHeight: true,
            // autoplay: true,

            navigation: {
                nextEl: '.reviews__nav-next',
                prevEl: '.reviews__nav-prev',
            },
        });
    },

    destroy() {
        this.instances.forEach(instance => {
            if (instance) {
                instance.destroy();
            }
        });
        this.instances = [];
    }
};