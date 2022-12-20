import { Block } from "./block.js";
import { BlockConst } from "./block_const.js";

type FormatResult = {
    x: number,
    leftmost: number,
    rightmost: number,
    childrens: FormatResult[],
};

/* ================================================================================================================= */
/*     Roots                                                                                                         */
/*         manages roots                                                                                             */
/* ================================================================================================================= */

export class Roots {

    private static readonly roots = document.getElementById("roots");

    static append(root: Block) {
        Roots.roots.appendChild(root);
    }

    static remove(root: Block) {
        Roots.roots.removeChild(root);
    }

    static connect(target: Block) {
        const roots_as_blocks = Array.from(Roots.roots.children) as Array<Block>;
        for (const root of roots_as_blocks) {
            if (root.connect_with(target)) {
                break;
            }
        }
    }

    static get(): Block[] {
        return Array.from(Roots.roots.children) as Array<Block>;
    }

    //! TODO: move this to Block as abstract method
    static determine_width(block: Block): FormatResult {
        //! [ToDo]
        const children = block.get_children();
        if (block.is_empty() || children.length == 0 || block.classList.contains("pyramid-block-folding")) {
            block.style.minWidth = BlockConst.UNIT_WIDTH + "px";
            return {
                x: 0,
                leftmost: -block.get_width() * 0.5,
                rightmost: block.get_width() * 0.5,
                childrens: [],
            };
        }
        if (children.length == 1) {
            const res = Roots.determine_width(children[0]);
            block.style.minWidth = BlockConst.UNIT_WIDTH + "px";
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
            const res = Roots.determine_width(child);
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
        block.style.minWidth = width + "px";
        const x = leftmost
            + (childrens[0].x - childrens[0].leftmost)
            + (children[0].get_width() * 0.5 - BlockConst.UNIT_HALF_WIDTH)
            + block.get_width() * 0.5;
        return {
            x: x,
            leftmost: leftmost,
            rightmost: rightmost,
            childrens: childrens,
        };
    }

    //! TODO: move this to Block as abstract method
    static determine_pos(x: number, y: number, block: Block, res: FormatResult) {
        const center: number = x - res.x;
        block.set_left(x);
        block.set_top(y);
        let offset: number = center + res.leftmost;
        for (let i = 0; i < res.childrens.length; ++i) {
            const child_area = (res.childrens[i].rightmost - res.childrens[i].leftmost);
            Roots.determine_pos(
                offset + child_area * 0.5 + res.childrens[i].x,
                y + block.get_height(),
                block.get_children()[i],
                res.childrens[i]
            );
            offset += child_area;
        }
    }
}