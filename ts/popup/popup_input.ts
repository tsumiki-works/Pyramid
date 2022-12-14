import { PopupItem } from "./popup_item.js";

export class PopupInput extends PopupItem {
    constructor(event_page_x: number, event_page_y: number, id: string, keydown_event: Function) {
        super(event_page_x, event_page_y, id);
        const input = document.createElement("input");
        input.id = "popup-menu-edit";
        input.contentEditable = "true";
        input.addEventListener("keydown", e => keydown_event(e));
        this.add_child(input);
    }

    static focus(): void {
        const elem = document.getElementById("popup-menu-edit") as HTMLInputElement;
        if(elem !== null){
            elem.focus();
        }
    }

    static get_value(): string {
        const elem = document.getElementById("popup-menu-edit") as HTMLInputElement;
        if(elem !== null){
            return elem.value;
        }
        return "";
    }
}