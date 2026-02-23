import {LanguageSwitcher} from "./modules/LanguageSwitcher";
import {ThankYouPageManager} from "./modules/ThankYouPageManager";
import {AppState} from "./modules/AppState";

function main() {
    AppState.init();
    LanguageSwitcher.init()
    ThankYouPageManager.init()
}

main();