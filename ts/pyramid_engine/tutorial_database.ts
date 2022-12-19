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
                    color: "#5d8cd4",
                    text: "0",
                    block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                        [_l, _t],
                        "0",
                    )),
                });

                menu_contents_literal.push({
                    color: "#5d8cd4",
                    text: "text",
                    block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                        [_l, _t],
                        "text",
                    )),
                });
                menu_contents_literal.push({
                    color: "#5d8cd4",
                    text: "true",
                    block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                        [_l, _t],
                        "true",
                    )),
                });
                menu_contents_literal.push({
                    color: "#99a9c2",
                    text: "LIST(0)",
                    block_constructor: ((_l: number, _t: number) => new ListBlock(
                        [_l, _t],
                        "LIST(0)",
                        0
                    )),
                })

                menu_contents.set({ label: "Literal", color: "#5d8cd4" }, menu_contents_literal);

                // arithmetic operator 
                const menu_contents_symbol = new Array<MenuContent>();
                menu_contents_symbol.push({
                    color: "#40a5a8",
                    text: "+",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "+",
                        2
                    )),
                });
                menu_contents_symbol.push({
                    color: "#40a5a8",
                    text: "-",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "-",
                        2
                    )),
                });

                // logic operator
                menu_contents_symbol.push({
                    color: "#40a5a8",
                    text: "!",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "!",
                        1
                    )),
                });
                menu_contents_symbol.push({
                    color: "#40a5a8",
                    text: "&&",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "&&",
                        2
                    )),
                });

                // Comparison Operator
                menu_contents_symbol.push({
                    color: "#40a5a8",
                    text: "==",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "==",
                        2
                    ))
                })

                // build in math fanction
                menu_contents_symbol.push({
                    color: "#40a5a8",
                    text: "exp",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "exp",
                        1
                    )),
                });
                menu_contents_symbol.push({
                    color: "#40a5a8",
                    text: "tan",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "tan",
                        1
                    )),
                });
                menu_contents.set({ label: "Symbol", color: "#40a5a8" }, menu_contents_symbol);

                const menu_contents_define = new Array<MenuContent>();
                menu_contents_define.push({
                    color: "#df7083",
                    text: "f",
                    block_constructor: ((_l: number, _t: number) => new DefineBlock(
                        [_l, _t],
                        "f"
                    )),
                });
                menu_contents.set({ label: "Define", color: "#df7083" }, menu_contents_define);
                break;
            case 1:
                let only_basics: MenuContent[] = [
                    {
                        text: "0",
                        color: "#5d8cd4",
                        block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                            [_l, _t],
                            "0"
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "+",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "+",
                            2
                        ))
                    }
                ];
                menu_contents.set({ label: "basic", color: "#82be64" }, only_basics);
                break;
            default:
                alert("Pyramid frontend error: invalid query parameter.");
        }
        return menu_contents;
    }
}