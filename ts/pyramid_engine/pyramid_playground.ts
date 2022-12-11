import { PyramidEngine } from "./pyramid_engine.js";
import { Popup } from "../popup.js";
import { MenuManager } from "../menu/menu.js";
import { I32Block } from "../block/concrete_block/i32_block.js";
import { FunBlock } from "../block/concrete_block/fun_block.js";

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
    protected override init(): void {
        this.init_events();
        this.init_menu();
        this.init_dom();
    }
    private init_dom(): void {
        document.getElementById("playground").style.width = "100%";
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
        let menu_contents_basic = new Array<MenuContent>();
        menu_contents_basic.push({
            color: "blue",
            text: "0", 
            block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "0"))
        });
        menu_contents_basic.push({
            color: "green",
            text: "+",
            block_constructor: ((_l: number, _t: number) => new FunBlock(_l, _t, "+", {args_cnt: 2, return_type: { type_id: PyramidTypeID.I32, attribute: null }}))
        });
        MenuManager.getInstance().add_menu_contents({label: "Basic", color: "black"}, menu_contents_basic);

        // debug
        
        let debug_menu: MenuContent[] = [
            {color: "wheat", text: "Hello", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "0"))},
            {color: "yellow", text: "lemon", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "1"))},
            {color: "lightblue", text: "ocean", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "2"))}
        ];
        MenuManager.getInstance().add_menu_contents({label: "Test", color: "lightgreen"}, debug_menu);

        MenuManager.getInstance().enable_tab("Basic");
    }
}