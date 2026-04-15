import {ScreenManager} from "./modules/ScreenManager";
import {FormsManager} from "./modules/FormsManager";
// import {NichesAccordion} from "./modules/NichesAccordion";
import {AppState} from "./modules/AppState";
import {LanguageSwitcher} from "./modules/LanguageSwitcher";
import {CourseOrderHandler} from "./modules/CourseOrderHandler";
import {ReviewsSlider} from "./modules/ReviewsSlider";
import {NicheDisplayHandler} from "./modules/NicheDisplayHandler";

function main() {
  AppState.init()
  LanguageSwitcher.init()
  ReviewsSlider.init();
  ScreenManager.init();
  FormsManager.init();
  NicheDisplayHandler.init();
  // NichesAccordion.init();
  CourseOrderHandler.init();
}

main();