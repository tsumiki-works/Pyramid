import { LiteralBlock } from "../block/concrete_block/literal_block.js";
import { SymbolBlock } from "../block/concrete_block/symbol_block.js";
import { DefineBlock } from "../block/concrete_block/define_block.js";
import { PyramidNumber } from "../evaluation/pyramid_number.js";
import { ListBlock } from "../block/concrete_block/list_block.js";
import { String } from "../evaluation/string.js";
import { Bool } from "../evaluation/bool.js";
import { IfBlock } from "../block/concrete_block/if_block.js";
import { MapBlock } from "../block/concrete_block/map_block.js";

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
                    color: "#5d8cd4",
                    text: "false",
                    block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                        [_l, _t],
                        "false",
                    )),
                });
                menu_contents_literal.push({
                    color: "#99a9c2",
                    text: "LIST(0)",
                    block_constructor: ((_l: number, _t: number) => new ListBlock(
                        [_l, _t],
                        0
                    )),
                })

                menu_contents.set({ label: "Literal", color: "#5d8cd4" }, menu_contents_literal);

                // arithmetic operator 
                const menu_contents_arithmetic = new Array<MenuContent>();
                menu_contents_arithmetic.push({
                    color: "#40a5a8",
                    text: "+",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "+",
                        2
                    )),
                });
                menu_contents_arithmetic.push({
                    color: "#40a5a8",
                    text: "-",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "-",
                        2
                    )),
                });
                menu_contents_arithmetic.push({
                    color: "#40a5a8",
                    text: "*",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "*",
                        2
                    )),
                });
                menu_contents_arithmetic.push({
                    color: "#40a5a8",
                    text: "/",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "/",
                        2
                    )),
                });
                menu_contents_arithmetic.push({
                    color: "#40a5a8",
                    text: "%",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "%",
                        2
                    )),
                });
                menu_contents_arithmetic.push({
                    color: "#40a5a8",
                    text: "**",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "**",
                        2
                    )),
                });
                menu_contents.set({ label: "arith.", color: "#40a5a8" }, menu_contents_arithmetic);

                const menu_contents_logic = new Array<MenuContent>();
                // logic operator
                menu_contents_logic.push({
                    color: "#40a5a8",
                    text: "!",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "!",
                        1
                    )),
                });
                menu_contents_logic.push({
                    color: "#40a5a8",
                    text: "&&",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "&&",
                        2
                    )),
                });
                menu_contents_logic.push({
                    color: "#40a5a8",
                    text: "||",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "||",
                        2
                    )),
                });
                menu_contents.set({ label: "logic", color: "#40a5a8" }, menu_contents_logic);

                const menu_contents_comparison = new Array<MenuContent>();
                // Comparison Operator
                menu_contents_comparison.push({
                    color: "#40a5a8",
                    text: "==",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "==",
                        2
                    ))
                })
                menu_contents_comparison.push({
                    color: "#40a5a8",
                    text: "!=",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "!=",
                        2
                    ))
                })
                menu_contents_comparison.push({
                    color: "#40a5a8",
                    text: ">",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        ">",
                        2
                    ))
                })
                menu_contents_comparison.push({
                    color: "#40a5a8",
                    text: "<",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "<",
                        2
                    ))
                })
                menu_contents_comparison.push({
                    color: "#40a5a8",
                    text: ">=",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        ">=",
                        2
                    ))
                })
                menu_contents_comparison.push({
                    color: "#40a5a8",
                    text: "<=",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "<=",
                        2
                    ))
                })
                menu_contents_comparison.push({
                    color: "#40a5a8",
                    text: "\"==",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "\"==",
                        2
                    ))
                })
                menu_contents.set({ label: "cf.", color: "#40a5a8" }, menu_contents_comparison);

                const menu_contents_function = new Array<MenuContent>();
                // build in math fanction
                menu_contents_function.push({
                    color: "#40a5a8",
                    text: "log",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "log",
                        1
                    )),
                });
                menu_contents_function.push({
                    color: "#40a5a8",
                    text: "exp",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "exp",
                        1
                    )),
                });
                menu_contents_function.push({
                    color: "#40a5a8",
                    text: "sqrt",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "sqrt",
                        1
                    )),
                });
                menu_contents_function.push({
                    color: "#40a5a8",
                    text: "sin",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "sin",
                        1
                    )),
                });
                menu_contents_function.push({
                    color: "#40a5a8",
                    text: "cos",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "cos",
                        1
                    )),
                });
                menu_contents_function.push({
                    color: "#40a5a8",
                    text: "tan",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "tan",
                        1
                    )),
                });
                menu_contents_function.push({
                    color: "#40a5a8",
                    text: "pi",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "pi",
                        0
                    )),
                });
                
                menu_contents.set({ label: "fun.", color: "#40a5a8" }, menu_contents_function);

                const menu_contents_define = new Array<MenuContent>();
                menu_contents_define.push({
                    color: "#f09ecb",
                    text: "f",
                    block_constructor: ((_l: number, _t: number) => new DefineBlock(
                        [_l, _t],
                        "f"
                    )),
                });
                menu_contents_define.push({
                    color: "#ea7f90",
                    text: "if",
                    block_constructor: ((_l: number, _t: number) => new IfBlock(
                        [_l, _t],
                    )),
                });
                menu_contents_define.push({
                    color: "#66bbaa",
                    text: "map",
                    block_constructor: ((_l: number, _t: number) => new MapBlock(
                        [_l, _t],
                    )),
                });
                menu_contents.set({ label: "Define", color: "#dc8ebc" }, menu_contents_define);
                
                const menu_contents_variable = new Array<MenuContent>();
                menu_contents_variable.push({
                    color: "#40a5a8",
                    text: "x",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "x",
                        0
                    )),
                });
                menu_contents_variable.push({
                    color: "#40a5a8",
                    text: "n",
                    block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                        [_l, _t],
                        "n",
                        0
                    )),
                });
                menu_contents.set({ label: "variable", color: "#75b595" }, menu_contents_variable);
                break;
            case 1:
                let tutorial1: MenuContent[] = [
                    {
                        color: "#5d8cd4",
                        text: "0",
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
                    },
                    {
                        color: "#40a5a8",
                        text: "-",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "-",
                            2
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "*",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "*",
                            2
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "/",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "/",
                            2
                        ))
                    }
                ];
                menu_contents.set({ label: "sample", color: "#82be64" }, tutorial1);
                break;

            case 2:
                let tutorial2: MenuContent[] = [
                    {
                        color: "#5d8cd4",
                        text: "true",
                        block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                            [_l, _t],
                            "true"
                        ))
                    },
                    {
                        text: "false",
                        color: "#5d8cd4",
                        block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                            [_l, _t],
                            "false"
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "!",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "!",
                            1
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "&&",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "&&",
                            2

                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "||",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "||",
                            2
                        ))
                    }

                ];
                menu_contents.set({ label: "sample", color: "#82be64" }, tutorial2);
                break;

            case 3:
                let tutorial3: MenuContent[] = [
                    {
                        color: "#5d8cd4",
                        text: "0",
                        block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                            [_l, _t],
                            "0"
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "pi",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "pi",
                            0
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
                    },
                    {
                        color: "#40a5a8",
                        text: "-",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "-",
                            2
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "*",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "*",
                            2
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "/",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "/",
                            2
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "sin",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "sin",
                            1
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "cos",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "cos",
                            1
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "tan",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "tan",
                            1
                        ))
                    }
                ];
                menu_contents.set({ label: "sample", color: "#82be64" }, tutorial3);
                break;

            case 4:
                let tutorial4: MenuContent[] = [
                    {
                        color: "#5d8cd4",
                        text: "0",
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
                    },
                    {
                        color: "#40a5a8",
                        text: "-",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "-",
                            2
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "*",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "*",
                            2
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "/",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "/",
                            2
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "exp",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "exp",
                            1
                        ))
                    },
                    {
                        color: "#40a5a8",
                        text: "log",
                        block_constructor: ((_l: number, _t: number) => new SymbolBlock(
                            [_l, _t],
                            "log",
                            1
                        ))
                    }
                ];
                menu_contents.set({ label: "sample", color: "#82be64" }, tutorial4);
                break;

            case 5:
                let tutorial5: MenuContent[] = [
                    {
                        color: "#5d8cd4",
                        text: "0",
                        block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                            [_l, _t],
                            "0"
                        ))
                    },
                    {
                        color: "#5d8cd4",
                        text: "text",
                        block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                            [_l, _t],
                            "text",
                        ))
                    },
                    {
                        color: "#5d8cd4",
                        text: "true",
                        block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                            [_l, _t],
                            "true"
                        ))
                    },
                    {
                        text: "false",
                        color: "#5d8cd4",
                        block_constructor: ((_l: number, _t: number) => new LiteralBlock(
                            [_l, _t],
                            "false"
                        ))
                    },
                    {
                        color: "#99a9c2",
                        text: "LIST(0)",
                        block_constructor: ((_l: number, _t: number) => new ListBlock(
                            [_l, _t],
                            0
                        ))
                    }


                ];
                menu_contents.set({ label: "sample", color: "#82be64" }, tutorial5);
                break;

            case 6:
                let tutorial6: MenuContent[] = [

                ];
                menu_contents.set({ label: "sample", color: "#82be64" }, tutorial6);
                break;
            default:
                alert("Pyramid frontend error: invalid query parameter.");
        }
        return menu_contents;
    }
}