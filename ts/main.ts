import { PyramidEngine } from "./pyramid_engine/pyramid_engine.js";
import { ConsoleManager } from "./console_manager.js";
import { Pager } from "./pager.js";
import { PyramidPlayground } from "./pyramid_engine/pyramid_playground.js";
import { PyramidTutorial } from "./pyramid_engine/pyramid_tutorial.js";
import { I32Block } from "./block/concrete_block/i32_block.js";
import { FunBlock } from "./block/concrete_block/fun_block.js";

export class Pyramid {

    private engine: PyramidEngine;

    constructor(engine_name: string) {
        new ConsoleManager();
        switch(engine_name){
            case "playground":
                this.engine = new PyramidPlayground();
                break;
            case "tutorial":
                let searchParams = new URLSearchParams(document.location.search);
                if(searchParams.has("q")){
                    switch (searchParams.get("q")){
                        case "1":
                            // these code will be shorter. <= Defined Block can be easily to call from `PyramidEngine`
                            let menu_contents = new Map<MenuTabContent, MenuContent[]>();
                            let only_basics: MenuContent[] = [
                                {text: "0", color: "blue", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "0"))},
                                {
                                    color: "green",
                                    text: "+",
                                    block_constructor: ((_l: number, _t: number) => new FunBlock(_l, _t, "+", {args_cnt: 2, return_type: { type_id: PyramidTypeID.I32, attribute: null }}))
                                }
                            ];
                            
                            let test_contents: MenuContent[] = [
                                {color: "wheat", text: "Hello", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "0"))}, 
                                {color: "yellow", text: "lemon", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "1"))},
                                {color: "lightblue", text: "ocean", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "2"))}
                            ];
                            let test_contents2: MenuContent[] = [
                                {color: "wheat", text: "Hello2", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "0"))},
                                {color: "yellow", text: "lemon2", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "1"))},
                                {color: "lightblue", text: "ocean2", block_constructor: ((_l: number, _t: number) => new I32Block(_l, _t, "2"))}
                            ];
                            menu_contents.set({label: "basic", color: "lightgreen"}, only_basics);
                            menu_contents.set({label: "debug", color: "green"}, test_contents);
                            menu_contents.set({label: "debug2", color: "yellow"}, test_contents2);
                            this.engine = new PyramidTutorial(1, [], menu_contents);
                            break;
                        default:
                            alert("Pyramid frontend error: invalid query parameter.");
                    }
                }else{
                    Pager.goto_toppage();
                }
                break;
            case "goto-tutorial":
                // for debug case
                Pager.goto_tutorial_top();
                break;
            default:
                alert("Pyramid frontend error: failed to attach PyramidEngine.")
        }
    }
}