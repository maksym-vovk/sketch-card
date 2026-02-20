import {ScreenManager} from "./modules/ScreenManager";
import {FormsManager} from "./modules/FormsManager";
import {NichesAccordion} from "./modules/NichesAccordion";
import {AppState} from "./modules/AppState";
import {LanguageSwitcher} from "./modules/LanguageSwitcher";
import {UniversalRenderer} from "./modules/UniversalRenderer";
// import {presentationsConfig} from "./data/presentationsConfig";

function main() {
  AppState.init()
  LanguageSwitcher.init()
  ScreenManager.init();
  FormsManager.init();
  NichesAccordion.init();
  UniversalRenderer.render(
      ".presentation-modal",
      JSON.parse(document.querySelector(".presentation-modal").dataset.config['weightControl'].elements)
  )
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
