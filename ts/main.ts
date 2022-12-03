import { ConsoleManager } from "./console_manager.js";
import { MenuManager } from "./menu.js";
import { Popup } from "./popup.js";

export class Pyramid {

    private workspace: HTMLDivElement;

    constructor() {
        this.workspace = document.getElementById("workspace") as HTMLDivElement;
        new MenuManager();
        new ConsoleManager();
        this.init_events();
    }

    private mousedown_listener: EventListener;
    private mousemove_listener: EventListener;
    private mouseup_listener: EventListener;

    private init_events() {
        this.mousedown_listener = (e: MouseEvent) => this.event_mousedown(e);
        this.mousemove_listener = (e: MouseEvent) => this.event_mousemove(e);
        this.mouseup_listener = (e: MouseEvent) => this.event_mouseup(e);
        this.workspace.addEventListener("mousedown", this.mousedown_listener);
    }

    private event_mousedown(e: MouseEvent) {
        Popup.remove_popup();
        if (e.button === 2) {
            this.workspace.removeEventListener("mousedown", this.mousedown_listener);
            document.addEventListener("mousemove", this.mousemove_listener);
            document.addEventListener("mouseup", this.mouseup_listener);
        }
    }

    private event_mouseup(_: MouseEvent) {
        document.removeEventListener("mousemove", this.mousemove_listener);
        document.removeEventListener("mouseup", this.mouseup_listener);
        this.workspace.addEventListener("mousedown", this.mousedown_listener);
    }

    private event_mousemove(_: MouseEvent) { }
}