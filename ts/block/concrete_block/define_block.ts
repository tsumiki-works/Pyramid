import { TempPyramidType, TempPyramidTypeTree, TypeEnv } from "../inference/typeenv.js";

import { Block } from "../block.js";
import { BlockConst } from "../block_const.js";
import { ParentBlock } from "../parent_block.js";
import { TypedBlock } from "../typed_block.js";
import { EmptyBlock } from "./empty_block.js";

export class DefineBlock extends ParentBlock {

    private content_wrapper: HTMLDivElement;

    constructor(lr: Vec2, content: string) {
        super(
            lr,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.set_content(value);
                    }
                })],
                ["仮引数を編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        for (const child of Array.from(this.content_wrapper.children)) {
                            if (child.classList.contains("pyramid-argument")) {
                                child.remove();
                            }
                        }
                        const args = value.split(" ");
                        for (const arg of args) {
                            const span = document.createElement("span");
                            span.innerText = arg;
                            span.classList.add("pyramid-argument");
                            this.content_wrapper.appendChild(span);
                        }
                    }
                })],
                ["評価", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        for (const child of Array.from(this.children)) {
            if (child.classList.contains("content-wrapper")) {
                this.content_wrapper = child as HTMLDivElement;
                break;
            }
        }
        this.style.height = BlockConst.UNIT_WIDTH + BlockConst.DEFINE_BLOCK_BORDER + "px";
        this.set_content(content);
        this.appendChild(new EmptyBlock(this));
        this.appendChild(new EmptyBlock(this));
        this.format();
    }

    override eval(env: Environment): PyramidObject {
        env.set(this.get_content(), {
            pyramid_type: this.get_type(),
            value: (args: PyramidObject[], _: Environment): PyramidObject => {
                const this_args = this.get_args();
                if (args.length !== this_args.length) {
                    throw new Error(
                        "num of args of "
                        + this.get_content()
                        + " is expected "
                        + this_args.length
                        + " but passed "
                        + args.length
                    );
                }
                for (let i = 0; i < args.length; ++i) {
                    env.set(this_args[i], args[i]);
                }
                const res = this.get_children()[0].eval(env);
                for (const arg of this_args) {
                    env.remove(arg);
                }
                return res;
            }
        })
        return this.get_children()[1].eval(env);
    }

    override get_type(): PyramidType {
        const next = this.get_children()[0];
        if (next.is_empty()) {
            return { type_id: PyramidTypeID.Invalid, attribute: null };
        } else {
            return (next as TypedBlock).get_type();
        }
    }

    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        const children = this.get_children();
        let next = (t1: TempPyramidType, t2: TempPyramidTypeTree): TempPyramidTypeTree => {
            if (!children[1].is_empty()) {
                return { node: t1, children: [t2, (children[1] as TypedBlock).infer_type(env)] };
            } else {
                return { node: t1, children: [t2] };
            }
        };
        // if logic is unset
        if (children[0].is_empty()) {
            return next({ id: PyramidTypeID.Invalid, var: null, attribute: null }, null);
        }
        // set temporary type onto environment
        const this_args = this.get_args();
        const args: TempPyramidType[] = [];
        for (const arg of this_args) {
            const tmp = { id: null, var: null, attribute: null };
            args.push(tmp);
            env.set(arg, tmp);
        }
        // infer logic type
        const logic_type = (children[0] as TypedBlock).infer_type(env);
        // set this definition
        const attribute = {
            args: args,
            return: logic_type.node,
        };
        const this_type = { id: PyramidTypeID.Function, var: null, attribute: attribute };
        env.set(this.get_content(), this_type);
        // goto next
        // console.log(attribute); //! debug
        return next(this_type, logic_type);
    }

    private get_args(): string[] {
        let res = [];
        for (const child of Array.from(this.content_wrapper.children)) {
            if (child.classList.contains("pyramid-argument")) {
                res.push(child.innerHTML);
            }
        }
        return res;
    }

    override determine_pos(x: number, y: number, res: FormatResult) {
        const center: number = x - res.x;
        let strech_width = res.childrens[0].rightmost + Math.abs(res.childrens[0].x);
        this.style.minWidth = (strech_width * 2 + BlockConst.DEFINE_BLOCK_BORDER * 2) + "px";
        this.style.minHeight = BlockConst.UNIT_HEIGHT + res.childrens[0].bottommost + BlockConst.DEFINE_BLOCK_BORDER * 2 + "px";
        this.set_left(x);
        this.set_top(y - BlockConst.DEFINE_BLOCK_BORDER);

        let offset: number = center + res.leftmost;
        if (res.childrens.length !== 2) {
            throw new Error("Pyramid Error: Wrong Define Block");
        }

        // Function Wrapper Field

        // Function Logic Parts
        this.get_children()[0].determine_pos(
            this.get_x(),
            (y - (this.get_height() - BlockConst.UNIT_HEIGHT) * 0.5) + BlockConst.UNIT_HEIGHT + BlockConst.DEFINE_BLOCK_BORDER + res.childrens[0].bottomdiff,
            res.childrens[0]
        );
        // Function Apply Parts
        this.get_children()[1].determine_pos(
            this.get_x(),
            (y - (this.get_height() - BlockConst.UNIT_HEIGHT) * 0.5) + res.childrens[0].bottommost + BlockConst.UNIT_HEIGHT + BlockConst.DEFINE_BLOCK_BORDER * 2 + res.childrens[0].bottomdiff,
            res.childrens[1]
        );
    }
    override determine_width(): FormatResult {
        const children = this.get_children();
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
            bottomdiff = Math.max(bottomdiff, res.bottomdiff - this.get_height());
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
            leftmost: leftmost - x,
            rightmost: rightmost + x,
            bottommost: bottommost + BlockConst.UNIT_HEIGHT * 2 + BlockConst.DEFINE_BLOCK_BORDER * 2,
            bottomdiff: bottomdiff + (bottommost + BlockConst.DEFINE_BLOCK_BORDER * 2) * 0.5,
            childrens: childrens,
        };
    }
}
customElements.define('pyramid-define-block', DefineBlock);