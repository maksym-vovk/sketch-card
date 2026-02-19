import './helpers/postDate';
import scrollSmooth from './helpers/smooth-scroll.js';
import {ScreenManager} from "./modules/ScreenManager";
import {FormsManager} from "./modules/FormsManager";
import {NichesAccordion} from "./modules/NichesAccordion";
import {AppState} from "./modules/AppState";

function main() {
  scrollSmooth();

  AppState.init()
  ScreenManager.init();
  FormsManager.init();
  NichesAccordion.init();
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
