import { ArithmeticOperator } from "../../../evaluation/arithmetic_operator.js";
import { Environment } from "../../../evaluation/environment.js";
import { BinopBlock } from "../../binop_block.js";
import { TypedBlock } from "../../typed_block.js";

export class AddBlock extends BinopBlock {
    constructor(lr: Vec2) {
        super(lr);
        this.set_content("+");
        this.format();
    }
    override eval(env: Environment) {
        if (this.is_invalid()) {
            throw new Error("invalid");
        }
        const this_children = this.get_children();
        if (this_children.length !== 2) {
            throw new Error("pyramid: backend error: add operation must have two arguments");
        }
        // check if it needs currying
        let nonempty_idxs = [];
        for (let i = 0; i < this_children.length; ++i) {
            if (!this_children[i].is_empty()) {
                nonempty_idxs.push(i);
            }
        }
        // currying
        if (nonempty_idxs.length === 0) {
            return ArithmeticOperator.add_float;
        } else if (nonempty_idxs.length === 1 && nonempty_idxs[0] === 0) {
            const arg1_evaluated = (this_children[0] as TypedBlock).eval(env);
            return (args: any[], _: Environment): any => {
                if (args.length !== 1) {
                    throw new Error("few or many args passed to curried function +");
                }
                return ArithmeticOperator.add_float(arg1_evaluated, args[0]);
            };
        } else if (nonempty_idxs.length === 1 && nonempty_idxs[0] === 1) {
            const arg2_evaluated = (this_children[1] as TypedBlock).eval(env);
            return (args: any[], _: Environment): any => {
                if (args.length !== 1) {
                    throw new Error("few or many args passed to curried function +");
                }
                return ArithmeticOperator.add_float(args[0], arg2_evaluated);
            };
        }
        // eval
        const arg1 = this_children[0] as TypedBlock;
        const arg2 = this_children[1] as TypedBlock
        if (arg1.get_type().type_id === PyramidTypeID.I32 && arg2.get_type().type_id === PyramidTypeID.I32) {
            return ArithmeticOperator.add_int(arg1.eval(env), arg2.eval(env))
        }
        else if (arg1.get_type().type_id === PyramidTypeID.F32 && arg2.get_type().type_id === PyramidTypeID.F32
            || arg1.get_type().type_id === PyramidTypeID.F32 && arg2.get_type().type_id === PyramidTypeID.I32
            || arg1.get_type().type_id === PyramidTypeID.I32 && arg2.get_type().type_id === PyramidTypeID.F32
            || arg1.get_type().type_id === PyramidTypeID.Number && arg2.get_type().type_id === PyramidTypeID.I32
            || arg1.get_type().type_id === PyramidTypeID.Number && arg2.get_type().type_id === PyramidTypeID.F32
            || arg1.get_type().type_id === PyramidTypeID.I32 && arg2.get_type().type_id === PyramidTypeID.Number
            || arg1.get_type().type_id === PyramidTypeID.F32 && arg2.get_type().type_id === PyramidTypeID.Number
            || arg1.get_type().type_id === PyramidTypeID.Number && arg2.get_type().type_id === PyramidTypeID.Number){
            return ArithmeticOperator.add_float(arg1.eval(env), arg2.eval(env))
        }
        throw new Error("pyramid: backend error: invalid operation ocurred")
    }
}
customElements.define('pyramid-add-block', AddBlock);