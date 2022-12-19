import { TempPyramidType, TempPyramidTypeTree, TypeEnv, unify } from "../inference/typeenv.js";
import { BlockConst } from "../block_const.js";
import { ParentBlock } from "../parent_block.js";
import { TypedBlock } from "../typed_block.js";

export class SymbolBlock extends ParentBlock {

    constructor(lr: Vec2, content: string, args_cnt: number) {
        super(
            lr,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.set_content(value);
                    }
                })],
                ["引数の数を変更", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0 && !isNaN(parseInt(value))) {
                        this.set_children_cnt(parseInt(value));
                    }
                })],
                ["評価", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.set_children_cnt(args_cnt);
        this.format();
    }

    override eval(env: Environment): PyramidObject {
        const v = env.get(this.get_content());
        if (v === null) {
            throw new Error(this.get_content() + " is undefined symbol");
        }
        if (v.pyramid_type.type_id === PyramidTypeID.Function) {
            if (typeof v.value !== "function") {
                throw new Error("unexpected error: " + this.get_content() + " is not function but expected");
            }
            const evaled = this.get_children().map(child => child.eval(env));
            return v.value(evaled, env);
        } else {
            if (JSON.stringify(v.pyramid_type) !== JSON.stringify(this.get_type())) {
                throw new Error(this.get_content() + " type is wrong"); // TODO: show error better
            }
            return v;
        }
    }

    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        const v = env.get(this.get_content());
        const this_children = this.get_children();
        if (v === null) {
            const args: TempPyramidTypeTree[] = [];
            for (const child of this_children) {
                if (!child.is_empty()) {
                    args.push((child as TypedBlock).infer_type(env));
                }
            }
            return {
                node: { id: PyramidTypeID.Invalid, var: null, attribute: null },
                children: args,
            };
        } else if (this_children.length === 0) {
            return { node: v, children: [] };
        } else {
            const empty_args_idxs: number[] = [];
            const args_tree: TempPyramidTypeTree[] = [];
            const args: TempPyramidType[] = [];
            for (let i = 0; i < this_children.length; ++i) {
                if (this_children[i].is_empty()) {
                    empty_args_idxs.push(i);
                    args.push({ id: null, var: null, attribute: null });
                } else {
                    const child_type_tree = (this_children[i] as TypedBlock).infer_type(env);
                    args_tree.push(child_type_tree);
                    args.push(child_type_tree.node);
                }
            }
            const t = { id: null, var: null, attribute: null };
            if (!unify(v, { id: PyramidTypeID.Function, var: null, attribute: { args: args, return: t } })) {
                return { node: { id: PyramidTypeID.Invalid, var: null, attribute: null }, children: args_tree };
            } else {
                if (args_tree.length !== this_children.length) {
                    const args_for_attribute = [];
                    for (let i = 0; i < args.length; ++i) {
                        if (empty_args_idxs.indexOf(i) >= 0) {
                            args_for_attribute.push(args[i]);
                        }
                    }
                    return {
                        node: {
                            id: PyramidTypeID.Function,
                            var: null,
                            attribute: {
                                args: args_for_attribute,
                                return: t,
                            },
                        },
                        children: args_tree,
                    };
                } else {
                    return { node: t, children: args_tree };
                }
            }
        }
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
customElements.define('pyramid-symbol-block', SymbolBlock);