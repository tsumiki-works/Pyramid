import { PyramidEngine } from "./pyramid_engine.js";
import { Popup } from "../popup.js";

/**
 * This class is PyramidEngine for Playgorund.
 * The featrues are same as previous 'Pyramid' class
 */

export class PyramidPlayground extends PyramidEngine {
    protected mousedown_listener: EventListener;
    protected mousemove_listener: EventListener;
    protected mouseup_listener: EventListener;

    constructor() {
        super(0);
    }
    protected override init(): void {
        this.init_events();
        this.init_menu(0);
        this.init_dom();
    }
    private init_dom(): void {
        document.getElementById("playground").style.width = "100%";
    }

    protected override event_mousedown(e: MouseEvent) {
        Popup.remove_all_popup();
        if (e.button === 2) {
            this.workspace.removeEventListener("mousedown", this.mousedown_listener);
            document.addEventListener("mousemove", this.mousemove_listener);
            document.addEventListener("mouseup", this.mouseup_listener);
        }
    }
}