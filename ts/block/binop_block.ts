import { EmptyBlock } from "./concrete_block/empty_block.js";
import { TypeEnv, unify } from "./inference/typeenv.js";
import { ParentBlock } from "./parent_block.js";
import { popup_event_eval } from "./result_block.js";
import { TypedBlock } from "./typed_block.js";

export abstract class BinopBlock extends ParentBlock {
    constructor(lr: Vec2) {
        super(lr, [
            ["評価", _ => popup_event_eval(this)],
            ["削除", _ => this.popup_event_kill_self()],
            ["子も削除", _ => this.popup_event_kill()],
        ]);
        this.appendChild(new EmptyBlock(this));
        this.appendChild(new EmptyBlock(this));
    }
    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        const this_children = this.get_children();
        if (this_children[0].is_empty() && this_children[1].is_empty()) {
            return {
                node: {
                    id: PyramidTypeID.Function,
                    var: null,
                    attribute: {
                        args: [
                            { id: PyramidTypeID.Number, var: null, attribute: null },
                            { id: PyramidTypeID.Number, var: null, attribute: null },
                        ],
                        return: { id: PyramidTypeID.Number, var: null, attribute: null },
                    },
                },
                children: [],
            };
        }
        if (this_children[0].is_empty() || this_children[1].is_empty()) {
            const nonempty_idx = this_children[1].is_empty() ? 0 : 1;
            const nonempty_type_tree = (this_children[nonempty_idx] as TypedBlock).infer_type(env);
            if (!unify({ id: PyramidTypeID.Number, var: null, attribute: null }, nonempty_type_tree.node)) {
                return {
                    node: { id: PyramidTypeID.Invalid, var: null, attribute: null },
                    children: [nonempty_type_tree],
                };
            }
            return {
                node: {
                    id: PyramidTypeID.Function,
                    var: null,
                    attribute: {
                        args: [
                            { id: PyramidTypeID.Number, var: null, attribute: null },
                        ],
                        return: { id: PyramidTypeID.Number, var: null, attribute: null },
                    },
                },
                children: [nonempty_type_tree],
            };
        }
        const children: TempPyramidTypeTree[] = [];
        let invalid_flag = false;
        let i32_cnt = 0;
        let f32_cnt = 0;
        for (const child of this_children) {
            const child_type_tree = (child as TypedBlock).infer_type(env);
            if (!unify({ id: PyramidTypeID.Number, var: null, attribute: null }, child_type_tree.node)) {
                invalid_flag = true;
                //continue;
            }
            if (unify(child_type_tree.node, { id: PyramidTypeID.I32, var: null, attribute: null })) {
                i32_cnt += 1;
            } else if (unify(child_type_tree.node, { id: PyramidTypeID.F32, var: null, attribute: null })) {
                f32_cnt += 1;
            }
            children.push(child_type_tree);
        }
        let id = PyramidTypeID.Number;
        if (i32_cnt === 2) {
            id = PyramidTypeID.I32;
        }
        else if ((f32_cnt === 1 && i32_cnt === 1) || f32_cnt === 2) {
            id = PyramidTypeID.F32;
        }
        else if (invalid_flag) {
            id = PyramidTypeID.Invalid
        }
        return {
            node: { id: id, var: null, attribute: null },
            children: children,
        };
    }
}