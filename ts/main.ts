import { Block } from "./block/block.js";
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
        document.addEventListener('keydown', function (e) {
            if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
                const trashs = Array.from(document.getElementById("trash").children) as Array<Block>;
                if (trashs.length === 0) {
                    return;
                }
                const block = trashs[trashs.length - 1];
                document.getElementById("trash").removeChild(block);
                document.getElementById("blocks").appendChild(block);
                block.set_left(window.innerWidth * 0.5);
                block.set_top(window.innerHeight * 0.5);
                block.get_root().format();
            }
        });
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