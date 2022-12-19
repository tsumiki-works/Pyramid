import { Block } from "../block.js";
import { BlockConst } from "../block_const.js";
import { EventBlock } from "../event_block.js";

/* ================================================================================================================= */
/*     EmptyBlock                                                                                                    */
/*         cannot be evaluated                                                                                       */
/*         cannot be clicked and moved                                                                               */
/* ================================================================================================================= */

export class EmptyBlock extends EventBlock {
    constructor(parent?: Block) {
        super(
            [-100, -100],
            _ => { },
            _ => { },
            _ => { },
            _ => { },
        );
        if (typeof parent !== "undefined") {
            this.set_parent(parent);
        }
    }
    override is_empty(): boolean {
        return true;
    }
    override kill(): void {
        this.remove();
    }
    override eval(_: Environment): PyramidObject {
        throw new Error("empty block evaluated");
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
customElements.define('pyramid-empty-block', EmptyBlock);