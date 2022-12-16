import { LiteralBlock } from "../block/concrete_block/literal_block.js";
import { SymbolBlock } from "../block/concrete_block/symbol_block.js";
import { DefineBlock } from "../block/concrete_block/define_block.js";
import { I32 } from "../evaluation/i32.js";

export class TutorialDatabase {
    constructor() { }

    static get_menu_contents(no: number): Map<MenuTabContent, MenuContent[]> {
        let menu_contents = new Map<MenuTabContent, MenuContent[]>();
        switch (no) {
            case 0:
                const menu_contents_literal = new Array<MenuContent>();
                menu_contents_literal.push({
                    color: "blue",
                    text: "0",
                    block_constructor: ((_l: number, _t: number) => new LiteralBlock({
                        type_id: PyramidTypeID.I32,
                        attribute: null,
                    },
                        [_l, _t],
                        "0",
                        I32.check_type,
                        I32.eval
                    )),
                });
                menu_contents.set({ label: "Literal", color: "black" }, menu_contents_literal);

                const menu_contents_symbol = new Array<MenuContent>();
                menu_contents_symbol.push({
                    color: "blue",
                    text: "+",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock({
                        type_id: PyramidTypeID.I32,
                        attribute: null,
                    },
                        [_l, _t],
                        "+",
                        2
                    )),
                });
                menu_contents.set({ label: "Symbol", color: "lightgreen" }, menu_contents_symbol);

                const menu_contents_define = new Array<MenuContent>();
                menu_contents_define.push({
                    color: "blue",
                    text: "f",
                    block_constructor: ((_l: number, _t: number) => new DefineBlock({
                        type_id: PyramidTypeID.Function,
                        attribute: {
                            args: [],
                            return_type: {
                                type_id: PyramidTypeID.I32,
                                attribute: null,
                            },
                        },
                    },
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
                            {
                                type_id: PyramidTypeID.I32,
                                attribute: null
                            },
                            [_l, _t],
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