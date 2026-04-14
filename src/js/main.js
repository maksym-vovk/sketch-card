import {ScreenManager} from "./modules/ScreenManager";
import {FormsManager} from "./modules/FormsManager";
import {NichesAccordion} from "./modules/NichesAccordion";
import {AppState} from "./modules/AppState";
import {LanguageSwitcher} from "./modules/LanguageSwitcher";
import {CourseSwitcher} from "./modules/CourseSwitcher";
import {ReviewsSlider} from "./modules/ReviewsSlider";

function main() {
  AppState.init()
  LanguageSwitcher.init()
  ReviewsSlider.init();
  ScreenManager.init();
  FormsManager.init();
  NichesAccordion.init();
  CourseSwitcher.init();
}

main();