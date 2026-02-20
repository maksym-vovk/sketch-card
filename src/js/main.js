import {ScreenManager} from "./modules/ScreenManager";
import {FormsManager} from "./modules/FormsManager";
import {NichesAccordion} from "./modules/NichesAccordion";
import {AppState} from "./modules/AppState";
import {LanguageSwitcher} from "./modules/LanguageSwitcher";

function main() {
  AppState.init()
  LanguageSwitcher.init()
  ScreenManager.init();
  FormsManager.init();
  NichesAccordion.init();
}

main();

// if (document.documentElement.clientWidth < 480) {
//   window.addEventListener('scroll',
//     function () {
//       return setTimeout(main, 1000);
//     }, {
//       once: true
//     });
// } else {
//   main();
// }
