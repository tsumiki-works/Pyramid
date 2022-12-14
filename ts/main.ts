import { PyramidEngine } from "./pyramid_engine/pyramid_engine.js";
import { ConsoleManager } from "./console_manager.js";
import { Pager } from "./pager.js";
import { PyramidPlayground } from "./pyramid_engine/pyramid_playground.js";
import { PyramidTutorial } from "./pyramid_engine/pyramid_tutorial.js";
import { SymbolBlock } from "./block/concrete_block/symbol_block.js";
import { LiteralBlock } from "./block/concrete_block/literal_block.js";
import { I32 } from "./evaluation/i32.js";

export class Pyramid {

    private engine: PyramidEngine;

    constructor(engine_name: string) {
        new ConsoleManager();
        switch (engine_name) {
            case "playground":
                this.engine = new PyramidPlayground();
                break;
            case "tutorial":
                let searchParams = new URLSearchParams(document.location.search);
                if (searchParams.has("q")) {
                    switch (searchParams.get("q")) {
                        case "1":
                            // these code will be shorter. <= Defined Block can be easily to call from `PyramidEngine`
                            let menu_contents = new Map<MenuTabContent, MenuContent[]>();
                            let only_basics: MenuContent[] = [
                                {
                                    text: "0",
                                    color: "blue",
                                    block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                                        {
                                            type_id: PyramidTypeID.I32,
                                            attribute: null
                                        },
                                        [_l, _t],
                                        [0, 0, 255, 1],
                                        "0",
                                        I32.check_type,
                                        I32.eval
                                    ))
                                },
                                {
                                    color: "green",
                                    text: "+",
                                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                                        {
                                            type_id: PyramidTypeID.I32,
                                            attribute: null
                                        },
                                        [_l, _t],
                                        [0, 0, 255, 1],
                                        "+",
                                        2
                                    ))
                                }
                            ];
                            menu_contents.set({label: "basic", color: "blue"}, only_basics);
                            this.engine = new PyramidTutorial(1, [], menu_contents);
                            break;
                        default:
                            alert("Pyramid frontend error: invalid query parameter.");
                    }
                } else {
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