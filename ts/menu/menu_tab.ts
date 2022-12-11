export class MenuTab extends HTMLElement {
    static TAB_WIDTH = 60;
    static TAB_HEIGHT = 50;

    private label: string;
    private color: string;

    private span: HTMLSpanElement;

    private enabler: Function;
    private mousedown_listener: EventListener;

    constructor(_left: number, _top: number, _color: string, _label: string) {
        super();
        this.label = _label;
        this.color = _color;
        this.classList.add("pyramid-menutab");
        this.style.left = _left + "px";
        this.style.top = _top + "px";
        this.style.width = MenuTab.TAB_WIDTH + "px";
        this.style.height = MenuTab.TAB_HEIGHT + "px";
        this.span = document.createElement("span");
        this.span.innerText = _label;
        this.appendChild(this.span);
        this.style.backgroundColor = _color;

        this.style.borderRadius = MenuTab.TAB_HEIGHT + "px";

    }

    get_label(): string {
        return this.label;
    }
    get_color(): string {
        return this.color;
    }

}
customElements.define("pyramid-menutab", MenuTab);