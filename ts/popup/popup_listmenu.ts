import { Popup } from "./popup.js";
import { PopupItem } from "./popup_item.js";

export class PopupListMenu extends PopupItem {
    constructor(event_page_x: number, event_page_y: number, id: string, events: PopupEvent[]) {
        super(event_page_x, event_page_y, id);
        Popup.remove_all_popup();
        const ul = document.createElement("ul");
        for (const event of events) {
            if (event === null) {
                continue;
            }
            const li = document.createElement("li");
            li.classList.add("popup-menu-item");
            li.innerText = event[0];
            li.onclick = event[1];
            ul.appendChild(li);
        }
        this.add_child(ul);
    }
}
