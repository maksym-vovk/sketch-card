import './helpers/postDate';
import scrollSmooth from './helpers/smooth-scroll.js';
import {ScreenManager} from "./modules/ScreenManager";
import {Forms} from "./modules/Forms";

function main() {
  scrollSmooth();

  ScreenManager.init();
  Forms.init();
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
};
