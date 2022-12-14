export abstract class PopupItem {

    private item: HTMLDivElement;
    private id: string;

    constructor(event_page_x: number, event_page_y: number, id: string) {
        this.item = document.createElement("div");
        this.item.classList.add("popup");
        this.item.id = "popup#" + (id.length == 0 ? "noId" : id);
        this.item.style.display = "block";
        this.item.style.left = event_page_x + "px";
        this.item.style.top = event_page_y + "px";
    }

    protected add_child(elem: HTMLElement) {
        this.item.appendChild(elem);
    }

    get_id(): string {
        return this.id;
    }

    show() {
        document.body.appendChild(this.item);
    }
}