import { PyramidEngine } from "./pyramid_engine.js";
import { Popup } from "../popup.js";
import { MenuManager } from "../menu/menu.js";
import { LiteralBlock } from "../block/concrete_block/literal_block.js";
import { BlockConst } from "../block/block_const.js";
import { SymbolBlock } from "../block/concrete_block/symbol_block.js";
import { I32 } from "../evaluation/i32.js";

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
        const menu_contents_literal = new Array<PyramidMenuContent>();
        menu_contents_literal.push({
            color: "blue",
            text: "0", 
            block_constructor: ((_l: number, _t: number) => new LiteralBlock({
                    type_id: PyramidTypeID.I32,
                    attribute: null,
                },
                [_l, _t],
                [0, 0, 255, 1],
                "0",
                I32.check_type,
                I32.eval
            )),
        });
        MenuManager.getInstance().add_menu_contents("Literal", "black", menu_contents_literal);

        const menu_contents_symbol = new Array<PyramidMenuContent>();
        menu_contents_symbol.push({
            color: "blue",
            text: "+", 
            block_constructor: ((_l: number, _t: number) => new SymbolBlock({
                    type_id: PyramidTypeID.I32,
                    attribute: null,
                },
                [_l, _t],
                [0, 0, 255, 1],
                "+"
            )),
        });
        MenuManager.getInstance().add_menu_contents("Symbol", "lightgreen", menu_contents_symbol);

        // debug
        
        /*let debug_menu: PyramidMenuContent[] = [
            {color: "wheat", text: "Hello", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "0"))},
            {color: "yellow", text: "lemon", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "1"))},
            {color: "lightblue", text: "ocean", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "2"))}
        ];
        MenuManager.getInstance().add_menu_contents("Test", "lightgreen", debug_menu);
        */

        MenuManager.getInstance().enable_tab("Literal");
        MenuManager.getInstance().enable_tab("Symbol");
    }
}