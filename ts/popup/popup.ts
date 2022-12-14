import { PopupItem } from "./popup_item";

export class Popup {
    constructor() {

    }

    static create_popup(popup_item: PopupItem) {
        popup_item.show();
    }

    static remove_popup(f: Function): void {
        const popups = document.getElementsByClassName("popup");
        for (let i = 0; i < popups.length; i++) {
            if (f(popups.item(i))) {
                document.body.removeChild(popups.item(i));
            }
        }
    }

    // macro functions. may be deleted in the future.
    static remove_popup_from_id(id: string): void {
        Popup.remove_popup(e => e.id == id);
    }
    static remove_all_popup(): void {
        Popup.remove_popup(_ => true);
    }
}