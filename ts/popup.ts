export class Popup {
    constructor(event_page_x: number, event_page_y: number, events: PopupEvent[]) {
        Popup.remove_popup();
        const popup = document.createElement("div");
        popup.id = "popup-menu";
        popup.style.display = "block";
        popup.style.left = event_page_x + "px";
        popup.style.top = event_page_y + "px";
        document.body.appendChild(popup);
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
        popup.appendChild(ul);
    }

    static remove_popup(): void {
        const popup = document.getElementById("popup-menu");
        if (popup !== null) {
            document.body.removeChild(popup);
        }
    }
}
