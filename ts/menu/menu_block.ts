import { Block } from "../block/block.js";
import { Roots } from "../block/roots.js";
import { MenuManager } from "./menu.js";

export class MenuBlock extends HTMLElement {
    static readonly UNIT_WIDTH = 100.;
    static readonly UNIT_HEIGHT = 50.;
    private static readonly playground: HTMLDivElement = document.getElementById("playground") as HTMLDivElement;

    private block_constructor: Function;
    private block: Block;

    private left: number;
    private top: number;
    private minWidth: number;
    private minHeight: number;

    private span: HTMLElement;
    private text: string;

    constructor(_left: number, _top: number, _color: string, _text: string, _block_constructor: Function) {
        super();

        this.classList.add("pyramid-menublock");
        this.block_constructor = _block_constructor;
        this.style.left = _left + "px";
        this.style.top = _top + "px";
        this.style.minWidth = MenuBlock.UNIT_WIDTH + "px";
        this.style.minHeight = MenuBlock.UNIT_HEIGHT + "px";
        this.span = document.createElement("span");
        this.span.innerText = _text;
        this.appendChild(this.span);
        this.style.backgroundColor = _color;
        this.init_event();
    }

    private init_event() {
        this.mousedown_listener = (e: MouseEvent) => this.event_mousedown(e);
        this.mousemove_listener = (e: MouseEvent) => this.event_mousemove(e);
        this.mouseup_listener = (e: MouseEvent) => this.event_mouseup(e);
        this.addEventListener("mousedown", this.mousedown_listener);
    }

    private mousedown_listener: EventListener;
    private mousemove_listener: EventListener;
    private mouseup_listener: EventListener;

    private event_mousedown(e: MouseEvent) {
        if (e.button === 0) {
            this.removeEventListener("mousedown", this.mousedown_listener);
            document.addEventListener("mousemove", this.mousemove_listener);
            document.addEventListener("mouseup", this.mouseup_listener);

            this.block = this.block_constructor(e.pageX, e.pageY);
            this.block.set_left(e.pageX);
            this.block.set_top(e.pageY);
            this.block.style.zIndex = "1";
            Roots.append(this.block);
        }
    }

    private event_mousemove(e: MouseEvent) {
        this.block.set_left(e.pageX);
        this.block.set_top(e.pageY);
    }

    private event_mouseup(e: MouseEvent) {
        if (e.pageX < MenuManager.getInstance().get_width()) {
            this.block.remove();
        }
        Roots.connect(this.block);
        this.block.style.zIndex = "0";
        this.addEventListener("mousedown", this.mousedown_listener);
        document.removeEventListener("mousemove", this.mousemove_listener);
        document.removeEventListener("mouseup", this.mouseup_listener);
    }
}
customElements.define("pyramid-menublock", MenuBlock);