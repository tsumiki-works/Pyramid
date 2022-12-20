import { ArithmeticOperator } from "../../../evaluation/arithmetic_operator.js";
import { Environment } from "../../../evaluation/environment.js";
import { BinopBlock } from "../../binop_block.js";
import { TypedBlock } from "../../typed_block.js";
import { TypeEnv, unify } from "../../inference/typeenv.js";

export class ModBlock extends BinopBlock {
    constructor(lr: Vec2) {
        super(lr);
        this.set_content("%");
        this.format();
    }
    override eval(env: Environment) {
        if (this.is_invalid()) {
            throw new Error("invalid");
        }
        const this_children = this.get_children();
        if (this_children.length !== 2) {
            throw new Error("pyramid: backend error: mod operation must have two arguments");
        }

        const arg1 = this_children[0] as TypedBlock
        const arg2 = this_children[1] as TypedBlock
        if (arg1.get_type().type_id === PyramidTypeID.I32 && arg2.get_type().type_id === PyramidTypeID.I32) {
            return ArithmeticOperator.mod(arg1.eval(env), arg2.eval(env))
        }
        throw new Error("pyramid: backend error: invalid operation ocurred")
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
                            { id: PyramidTypeID.I32, var: null, attribute: null },
                            { id: PyramidTypeID.I32, var: null, attribute: null },
                        ],
                        return: { id: PyramidTypeID.I32, var: null, attribute: null },
                    },
                },
                children: [],
            };
        }
        if (this_children[0].is_empty() || this_children[1].is_empty()) {
            const nonempty_idx = this_children[1].is_empty() ? 0 : 1;
            const nonempty_type_tree = (this_children[nonempty_idx] as TypedBlock).infer_type(env);
            if (!unify({ id: PyramidTypeID.I32, var: null, attribute: null }, nonempty_type_tree.node)) {
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
                            { id: PyramidTypeID.I32, var: null, attribute: null },
                        ],
                        return: { id: PyramidTypeID.I32, var: null, attribute: null },
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
                continue;
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
        else {
            id = PyramidTypeID.Invalid;
        }
        return {
            node: { id: id, var: null, attribute: null },
            children: children,
        };
    }
}
customElements.define('pyramid-mod-block', ModBlock);