export class MenuTab extends HTMLElement {
    private span: HTMLSpanElement;
    static TAB_WIDTH = 60;
    static TAB_HEIGHT = 50;

    private enabler: Function;
    private mousedown_listener: EventListener;

    constructor(_left: number, _top: number, _color: string, _label: string){
        super();
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




}
customElements.define("pyramid-menutab", MenuTab);