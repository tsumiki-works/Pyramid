export class Popup {
    private static create_base(x: number, y: number, id: string): HTMLDivElement{
        let item: HTMLDivElement;

        item = document.createElement("div");
        item.classList.add("popup");
        item.id = "popup#" + (id.length == 0 ? "noId" : id);
        item.style.display = "block";
        item.style.left = x + "px";
        item.style.top = y + "px";

        return item;
    }

    static create_listmenu(x: number, y: number, id: string, events: PopupEvent[]): void {
        let base = Popup.create_base(x, y, id);
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
        base.appendChild(ul);
        Popup.show_popup(base);
    }

    static create_input(event_page_x: number, event_page_y: number, id: string, keydown_event: Function): void {
        let base = Popup.create_base(event_page_x, event_page_y, id);
        const input = document.createElement("input");
        input.id = "popup-menu-edit";
        input.contentEditable = "true";
        input.addEventListener("keydown", e => keydown_event(e));
        base.appendChild(input);

        Popup.show_popup(base);
        input.focus();        
    }
    static input_get_value(){
        return (document.getElementById("popup-menu-edit") as HTMLInputElement).value;
    }

    static show_popup(popup_item: HTMLElement) {
        document.body.appendChild(popup_item);
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