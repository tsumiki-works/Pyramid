import { Block } from "../block.js";
import { BlockConst } from "../block_const.js";
import { Environment } from "../../evaluation/environment.js";
import { encode_type, TypeEnv, unify } from "../inference/typeenv.js";
import { ParentBlock } from "../parent_block.js";
import { popup_event_eval } from "../result_block.js";
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
                })],
                ["評価", _ => popup_event_eval(this)],
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
        this.set_content(content);
        this.appendChild(new EmptyBlock(this));
        this.appendChild(new EmptyBlock(this));
        this.format();
    }

    override eval(env: Environment): any {
        this.push_definition(env);
        const res = this.get_children()[1].eval(env);
        env.remove(this.get_content());
        return res;
    }

    push_definition(env: Environment): void {
        if (this.get_args().length === 0) {
            env.set(this.get_content(), this.get_children()[0].eval(env));
        } else {
            env.set(
                this.get_content(),
                (args: any[], _: Environment): any => {
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
            );
        }
    }

    push_definition_type(env: TypeEnv) {
        env.set(this.get_content(), encode_type(this.get_type()));
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
        let children_tree = new Array<TempPyramidTypeTree>();
        // set if child is unset
        for(const child of children){
            if(child.is_empty()){
                children_tree.push({ node: { id: null, var: null, attribute: null }, children: null});
            }else{
                children_tree.push((child as TypedBlock).infer_type(env));
            }
        }
        if(children[0].is_empty()){
            return next({ id: PyramidTypeID.Invalid, var: null, attribute: null }, children_tree[1]);
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
        const this_type = { id: null, var: null, attribute: null };
        env.set(this.get_content(), this_type);
        const logic_type_tree = (children[0] as TypedBlock).infer_type(env);
        if (this_args.length === 0) {
            if (!unify(this_type, logic_type_tree.node)) {
                return next({ id: PyramidTypeID.Invalid, var: null, attribute: null }, logic_type_tree);
            } else {
                return next(this_type, logic_type_tree);
            }
        } else {
            const this_type_ = {
                id: PyramidTypeID.Function,
                var: null,
                attribute: {
                    args: args,
                    return: logic_type_tree.node,
                },
            };
            if (!unify(this_type, this_type_)) {
                console.log(this_type, this_type_);
                return next({ id: PyramidTypeID.Invalid, var: null, attribute: null }, logic_type_tree);
            } else {
                return next(this_type, logic_type_tree);
            }
        }
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
        this.set_left(x);
        this.set_top(y);

        let offset: number = center + res.leftmost;
        if (res.childrens.length !== 2) {
            throw new Error("Pyramid Error: Wrong Define Block");
        }

        // Function Wrapper Field

        // Function Logic Parts
        this.get_children()[0].determine_pos(
            this.get_x(),
            (y - (this.get_height() - BlockConst.UNIT_HEIGHT) * 0.5) + BlockConst.UNIT_HEIGHT + res.childrens[0].bottomdiff * 0.5,
            res.childrens[0]
        );
        // Function Apply Parts
        this.get_children()[1].determine_pos(
            this.get_x(),
            (y - (this.get_height() - BlockConst.UNIT_HEIGHT) * 0.5) + res.childrens[0].bottommost + res.childrens[1].bottomdiff * 0.5 + BlockConst.UNIT_HEIGHT + BlockConst.DEFINE_BLOCK_BORDER,
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

        let res_logic = children[0].determine_width();
        let res_apply = children[1].determine_width();

        childrens.push(res_logic);
        childrens.push(res_apply);

        bottommost = Math.max(bottommost, res_logic.bottommost);//, res_apply.bottommost);
        bottomdiff = Math.max(bottomdiff, res_logic.bottomdiff - this.get_height(), res_apply.bottomdiff - this.get_height());

        let strech_width = res_logic.rightmost + Math.abs(res_logic.x);
        this.style.minWidth = strech_width * 2 + "px";
        this.style.minHeight = res_logic.bottommost + BlockConst.UNIT_HEIGHT + "px";

        const x = leftmost
            + (res_logic.x - res_logic.leftmost - BlockConst.UNIT_HALF_WIDTH)
            + (children[0].get_width() * 0.5 - BlockConst.UNIT_HALF_WIDTH)
            + this.get_width() * 0.5;
        return {
            x: 0,
            leftmost: leftmost - x,
            rightmost: rightmost + x,
            bottommost: bottommost + BlockConst.UNIT_HEIGHT + BlockConst.DEFINE_BLOCK_BORDER * 2,
            bottomdiff: bottomdiff + bottommost,
            childrens: childrens,
        };
    }
}
customElements.define('pyramid-define-block', DefineBlock);