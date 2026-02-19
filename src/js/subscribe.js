import {LanguageSwitcher} from "./modules/LanguageSwitcher";

function main() {
    LanguageSwitcher.init()
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
