import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

export const ReviewsSlider = {
    instance: null,

    init() {
        const el = this._getSliderElement();
        if (!el) return;

        this.instance = this._createSwiper(el);
    },

    _getSliderElement() {
        return document.querySelector('.reviews__slider');
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
        if (this.instance) {
            this.instance.destroy();
            this.instance = null;
        }
    }
};
