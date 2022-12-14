import { PopupItem } from "./popup_item.js";

export class PopupLabel extends PopupItem {
    constructor(event_page_x: number, event_page_y: number, id: string, content: string){
        super(event_page_x, event_page_y, id);
        const label = document.createElement("p") as HTMLSpanElement;
        label.textContent = content;
        this.add_child(label);
    }
}