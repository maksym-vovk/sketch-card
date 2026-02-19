import {LanguageSwitcher} from "./modules/LanguageSwitcher";
import {ThankYouPageManager} from "./modules/ThankYouPageManager";

function main() {
    LanguageSwitcher.init()
    ThankYouPageManager.init()
}

if (document.documentElement.clientWidth < 480) {
    window.addEventListener('scroll',
        function () {
            return setTimeout(main, 1000);
        }, {
            once: true
        });
} else {
    main();
}
