import { AtomBlock } from "./block/atom_block.js";
import { FunBlock } from "./block/fun_block.js";
import { ConsoleManager } from "./console_manager.js";
import { MenuManager } from "./menu/menu.js";
import { Popup } from "./popup.js";

export class Pyramid {

    private workspace: HTMLDivElement;

    constructor() {
        this.workspace = document.getElementById("workspace") as HTMLDivElement;
        new ConsoleManager();
        this.init();
    }

    private init(){
        this.init_events();
        this.init_menu();
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

    private init_menu(){
        MenuManager.getInstance().add_menu_content(
            "blue",
            "0", 
            ((_l: number, _t: number) => new AtomBlock(_l, _t, "0", PyramidTypeID.I32))
        );
        MenuManager.getInstance().add_menu_content(
            "green",
            "+",
            ((_l: number, _t: number) => new FunBlock(_l, _t, "+", {args_cnt: 2, return_type: { type_id: PyramidTypeID.I32, attribute: null }})));
    }
}