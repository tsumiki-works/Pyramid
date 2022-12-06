import { PyramidEngine } from "./pyramid_engine.js";
import { Popup } from "../popup.js";
import { MenuManager } from "../menu/menu.js";
import { I32Block } from "../block/i32_block.js";
import { FunBlock } from "../block/fun_block.js";

/**
 * This class is PyramidEngine for Playgorund.
 * The featrues are same as previous 'Pyramid' class
 */

export class PyramidPlayground extends PyramidEngine {
    protected mousedown_listener: EventListener;
    protected mousemove_listener: EventListener;
    protected mouseup_listener: EventListener;

    constructor(){
        super();
    }
    protected init(): void {
        this.init_events();
        this.init_menu();
    }

    protected override event_mousedown(e: MouseEvent) {
        Popup.remove_popup();
        if (e.button === 2) {
            this.workspace.removeEventListener("mousedown", this.mousedown_listener);
            document.addEventListener("mousemove", this.mousemove_listener);
            document.addEventListener("mouseup", this.mouseup_listener);
        }
    }
    protected override init_menu(){
        MenuManager.getInstance().add_menu_content({
            color: "blue",
            text: "0", 
            block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "0"))
        });
        MenuManager.getInstance().add_menu_content({
            color: "green",
            text: "+",
            block_constructor: ((_l: number, _t: number) => new FunBlock(_l, _t, "+", {args_cnt: 2, return_type: { type_id: PyramidTypeID.I32, attribute: null }}))
        });
    }
}