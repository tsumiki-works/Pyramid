import { Environment } from "../../evaluation/environment.js";
import { TempPyramidType, TempPyramidTypeTree, TypeEnv, unify } from "../inference/typeenv.js";
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
}
customElements.define('pyramid-symbol-block', SymbolBlock);