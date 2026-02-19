import './helpers/postDate';
import scrollSmooth from './helpers/smooth-scroll.js';
import {ScreenManager} from "./modules/ScreenManager";
import {FormsManager} from "./modules/FormsManager";

function main() {
  scrollSmooth();

  ScreenManager.init();
  FormsManager.init();
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
