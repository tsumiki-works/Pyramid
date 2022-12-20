import { Environment } from "../../evaluation/environment.js";
import { TypeEnv, unify } from "../inference/typeenv.js";
import { ParentBlock } from "../parent_block.js";
import { popup_event_eval } from "../result_block.js";
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
                ["評価", _ => popup_event_eval(this)],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.set_children_cnt(args_cnt);
        this.format();
    }

    override eval(env: Environment): any {
        if (this.is_invalid()) {
            throw new Error("invalid");
        }
        const v = env.get(this.get_content());
        if (v === null) {
            throw new Error(this.get_content() + " is undefined symbol");
        }
        const this_children = this.get_children();
        if (this_children.length === 0) {
            return v;
        }
        if (typeof v !== "function") {
            throw new Error(this.get_content() + " is not function but passed some args");
        }
        const evaluateds: any[] = [];
        let flag = false;
        for (const child of this_children) {
            if (child.is_empty()) {
                evaluateds.push(null);
                flag = true;
            } else {
                evaluateds.push(child.eval(env));
            }
        }
        if (flag) {
            return (args_: any[], _: Environment): any => {
                if (this_children.length !== this.get_type().attribute.args.length + args_.length) {
                    throw new Error("few or many args passed to curried function" + this.get_content());
                }
                const args = [];
                let cnt = 0;
                for (const evaluated of evaluateds) {
                    if (evaluated === null) {
                        args.push(args_[cnt]);
                        cnt += 1;
                    } else {
                        args.push(evaluated);
                    }
                }
                return v(args, env);
            };
        }
        return v(evaluateds, env);
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