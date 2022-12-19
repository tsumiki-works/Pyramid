import { Evaluator } from "../../evaluation/evaluator.js";
import { TempPyramidTypeTree, TypeEnv } from "../inference/typeenv.js";
import { BlockConst } from "../block_const.js";
import { TypedBlock } from "../typed_block.js";

/* ================================================================================================================= */
/*     LiteralBlock                                                                                                  */
/*         is immediate value                                                                                        */
/*         has no child                                                                                              */
/* ================================================================================================================= */

export class LiteralBlock extends TypedBlock {
    constructor(lr: Vec2, content: string) {
        super(
            lr,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.set_content(value);
                    }
                })],
                ["評価", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.format();
    }
    override eval(_: Environment): PyramidObject {
        return Evaluator.eval_literal(this.get_content(), this.get_type());
    }
    override infer_type(_: TypeEnv): TempPyramidTypeTree {
        return {
            node: {
                id: Evaluator.get_literal_type(this.get_content()).type_id,
                var: null,
                attribute: null,
            },
            children: null,
        };
    }
    override determine_pos(x: number, y: number, res: FormatResult) {
        const center: number = x - res.x;
        this.set_left(x);
        this.set_top(y);
        let offset: number = center + res.leftmost;
        for (let i = 0; i < res.childrens.length; ++i) {
            const child_area = (res.childrens[i].rightmost - res.childrens[i].leftmost);
            this.get_children()[i].determine_pos(
                offset + child_area * 0.5 + res.childrens[i].x,
                y + this.get_height(),
                res.childrens[i]
            );
            offset += child_area;
        }
    }
    override determine_width(): FormatResult {
        const children = this.get_children();
        if (this.is_empty() || children.length == 0 || this.classList.contains("pyramid-block-folding")) {
            this.style.minWidth = BlockConst.UNIT_WIDTH + "px";
            return {
                x: 0,
                leftmost: -this.get_width() * 0.5,
                rightmost: this.get_width() * 0.5,
                childrens: [],
            };
        }
        if (children.length == 1) {
            const res = children[0].determine_width();
            this.style.minWidth = BlockConst.UNIT_WIDTH + "px";
            return {
                x: res.x,
                leftmost: res.leftmost,
                rightmost: res.rightmost,
                childrens: [res],
            };
        }
        let width = BlockConst.UNIT_WIDTH;
        let leftmost = 0.0;
        let rightmost = 0.0;
        let childrens: FormatResult[] = [];
        let i = 0;
        for (const child of children) {
            const res = child.determine_width();
            leftmost += res.leftmost;
            rightmost += res.rightmost;
            if (i == 0) {
                width += res.rightmost - res.x - child.get_width() * 0.5;
            } else if (i == children.length - 1) {
                width += res.x - child.get_width() * 0.5 - res.leftmost;
            } else {
                width += res.rightmost - res.leftmost;
            }
            childrens.push(res);
            i += 1;
        }
        this.style.minWidth = width + "px";
        const x = leftmost
            + (childrens[0].x - childrens[0].leftmost)
            + (children[0].get_width() * 0.5 - BlockConst.UNIT_HALF_WIDTH)
            + this.get_width() * 0.5;
        return {
            x: x,
            leftmost: leftmost,
            rightmost: rightmost,
            childrens: childrens,
        };
    }
}
customElements.define('pyramid-literal-block', LiteralBlock);