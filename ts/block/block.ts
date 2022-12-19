import { BlockConst } from "./block_const.js";
import { Inference } from "./inference/inference.js";
import { Roots } from "./roots.js";

/* ================================================================================================================= */
/*     Block                                                                                                         */
/*         is a kind of HTMLElement                                                                                  */
/*         has parent                                                                                                */
/*         has "pyramid-block" class                                                                                 */
/*         can connect a block by replacing its empty block block                                                    */
/* ================================================================================================================= */

export abstract class Block extends HTMLElement {

    private parent: Block | null;
    protected readonly playground: HTMLDivElement = document.getElementById("playground") as HTMLDivElement;

    constructor(lr: Vec2) {
        super();
        this.parent = null;
        this.classList.add("pyramid-block");
        this.style.left = lr[0] + "px";
        this.style.top = lr[1] + "px";
        this.style.minWidth = BlockConst.UNIT_WIDTH + "px";
        this.style.minHeight = BlockConst.UNIT_HEIGHT + "px";
        Roots.append(this);
    }

    set_left(x: number): void {
        const left = x - this.get_width() * 0.5;
        let parent: HTMLElement = null;
        if (this.parent === null) {
            parent = document.getElementById("workspace");
        } else {
            parent = this.parent;
        }
        this.style.left = -(parent.getBoundingClientRect().left - left) + "px";
    }
    set_top(y: number): void {
        const top = y - this.get_height() * 0.5;
        let parent: HTMLElement = null;
        if (this.parent === null) {
            parent = document.getElementById("workspace");
        } else {
            parent = this.parent;
        }
        this.style.top = -(parent.getBoundingClientRect().top - top) + "px";
    }
    set_parent(parent: Block): void {
        this.parent = parent;
    }

    get_x(): number {
        return this.getBoundingClientRect().left + this.get_width() * 0.5;
    }
    get_y(): number {
        return this.getBoundingClientRect().top + this.get_height() * 0.5;
    }
    get_width(): number {
        return this.offsetWidth;
    }
    get_height(): number {
        return this.offsetHeight;
    }
    get_root(): Block {
        if (this.parent === null) {
            return this;
        } else {
            return this.parent.get_root();
        }
    }
    get_parent(): Block {
        return this.parent;
    }
    get_children(): Array<Block> {
        let res = new Array();
        for (const child of Array.from(this.children)) {
            if (child.classList.contains("pyramid-block")) {
                res.push(child);
            }
        }
        return res;
    }

    connect_with(target: Block): boolean {
        if (this === target) {
            return false;
        }
        for (const child of this.get_children()) {
            if (child.is_empty()
                && Math.abs(child.get_x() - target.get_x()) < child.get_width() * 0.5
                && Math.abs(child.get_y() - target.get_y()) < child.get_height() * 0.5
            ) {
                this.replaceChild(target, child);
                target.parent = this;
                child.parent = null;
                child.kill();
                target.parent.format();
                this.get_root().format();
                return true;
            }
            if (child.connect_with(target)) {
                return true;
            }
        }
        return false;
    }

    format() {
        Inference.infer(this);
        this.determine_pos(this.get_x(), this.get_y(), this.determine_width());
    }

    determine_pos(x: number, y: number, res: FormatResult) {
        const center: number = x - res.x;
        this.set_left(x);
        this.set_top(y);
        let offset: number = center + res.leftmost;
        for (let i = 0; i < res.childrens.length; ++i) {
            const child_area = (res.childrens[i].rightmost - res.childrens[i].leftmost);
            this.get_children()[i].determine_pos(
                offset + child_area * 0.5 + res.childrens[i].x,
                y + this.get_height() + res.childrens[i].bottomdiff,
                res.childrens[i]
            );
            offset += child_area;
        }
    }
    determine_width(): FormatResult {
        const children = this.get_children();
        if (this.is_empty() || children.length == 0 || this.classList.contains("pyramid-block-folding")) {
            this.style.minWidth = BlockConst.UNIT_WIDTH + "px";
            return {
                x: 0,
                leftmost: -this.get_width() * 0.5,
                rightmost: this.get_width() * 0.5,
                bottommost: this.get_height(),
                bottomdiff: 0,
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
                bottommost: res.bottommost + this.get_height(),
                bottomdiff: res.bottomdiff,
                childrens: [res],
            };
        }
        let width = BlockConst.UNIT_WIDTH;
        let leftmost = 0.0;
        let rightmost = 0.0;
        let bottommost = 0.0;
        let bottomdiff = 0.0;
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
            bottommost = Math.max(bottommost, res.bottommost);
            bottomdiff = Math.max(bottomdiff, bottomdiff + this.get_height() - BlockConst.UNIT_HEIGHT);
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
            bottommost: bottommost + this.get_height(),
            bottomdiff: bottomdiff,
            childrens: childrens,
        };
    }

    abstract is_empty(): boolean;
    abstract kill(): void;
    abstract eval(env: Environment): PyramidObject;
}