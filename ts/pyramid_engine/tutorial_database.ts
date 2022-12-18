import { LiteralBlock } from "../block/concrete_block/literal_block.js";
import { SymbolBlock } from "../block/concrete_block/symbol_block.js";
import { DefineBlock } from "../block/concrete_block/define_block.js";
import { PyramidNumber } from "../evaluation/pyramid_number.js";
import { ListBlock } from "../block/concrete_block/list_block.js";
import { String } from "../evaluation/string.js";
import { Bool } from "../evaluation/bool.js";

export class TutorialDatabase {
    constructor() { }

    static get_menu_contents(no: number): Map<MenuTabContent, MenuContent[]> {
        let menu_contents = new Map<MenuTabContent, MenuContent[]>();
        // TODO: How many primitive blocks display on the menutab?
        switch (no) {
            case 0:
                // number, string, bool, literal block
                const menu_contents_literal = new Array<MenuContent>();
                menu_contents_literal.push({
                    color: "blue",
                    text: "0",
                    block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                        [_l, _t],
                        "0",
                    )),
                });
                
                menu_contents_literal.push({
                    color: "blue",
                    text: "text",
                    block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                        [_l, _t],
                        "text",
                    )),
                });
                menu_contents_literal.push({
                    color: "blue",
                    text: "true",
                    block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                        [_l, _t],
                        "true",
                    )),
                });
                menu_contents_literal.push({
                    color: "lightseagreen",
                    text: "LIST(0)",
                    block_constructor: ((_l: number, _t: number) => new ListBlock({
                        type_id: PyramidTypeID.List,
                        attribute: null,
                    },
                        [_l, _t],
                        "LIST(0)",
                        0
                    )),
                })

                menu_contents.set({ label: "Literal", color: "black" }, menu_contents_literal);

                // arithmetic operator 
                const menu_contents_symbol = new Array<MenuContent>();
                menu_contents_symbol.push({
                    color: "green",
                    text: "+",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "+",
                        2
                    )),
                });
                menu_contents_symbol.push({
                    color: "green",
                    text: "-",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "-",
                        2
                    )),
                });

                // logic operator
                menu_contents_symbol.push({
                    color: "green",
                    text: "!",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "!",
                        1
                    )),
                });
                menu_contents_symbol.push({
                    color: "green",
                    text: "&&",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "&&",
                        2
                    )),
                });

                // build in math fanction
                menu_contents_symbol.push({
                    color: "green",
                    text: "exp",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "exp",
                        1
                    )),
                });
                menu_contents_symbol.push({
                    color: "green",
                    text: "tan",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "tan",
                        1
                    )),
                });
                menu_contents.set({ label: "Symbol", color: "lightgreen" }, menu_contents_symbol);

                const menu_contents_define = new Array<MenuContent>();
                menu_contents_define.push({
                    color: "gray",
                    text: "f",
                    block_constructor: ((_l: number, _t: number) => new DefineBlock(
                        [_l, _t],
                        "f"
                    )),
                });
                menu_contents.set({ label: "Define", color: "green" }, menu_contents_define);
                break;
            case 1:
                let only_basics: MenuContent[] = [
                    {
                        text: "0",
                        color: "blue",
                        block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                            [_l, _t],
                            "0"
                        ))
                    },
                    {
                        color: "green",
                        text: "+",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "+",
                            2
                        ))
                    }
                ];
                menu_contents.set({ label: "basic", color: "blue" }, only_basics);
                break;
            default:
                alert("Pyramid frontend error: invalid query parameter.");
        }
        return menu_contents;
    }
}