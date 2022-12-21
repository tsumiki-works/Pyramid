import { ArithmeticOperator } from "../../../evaluation/arithmetic_operator.js";
import { Environment } from "../../../evaluation/environment.js";
import { BinopBlock } from "../../binop_block.js";
import { TypedBlock } from "../../typed_block.js";

export class PowBlock extends BinopBlock {
    constructor(lr: Vec2) {
        super(lr);
        this.set_content("**");
        this.format();
    }
    override eval(env: Environment) {
        if (this.is_invalid()) {
            throw new Error("invalid");
        }
        const this_children = this.get_children();
        if (this_children.length !== 2) {
            throw new Error("pyramid: backend error: pow operation must have two arguments");
        }

        const arg1 = this_children[0] as TypedBlock
        const arg2 = this_children[1] as TypedBlock
        if (arg1.get_type().type_id === PyramidTypeID.I32 && arg2.get_type().type_id === PyramidTypeID.I32) {
            return ArithmeticOperator.pow_int(arg1.eval(env), arg2.eval(env))
        }
        else if (arg1.get_type().type_id === PyramidTypeID.F32 && arg2.get_type().type_id === PyramidTypeID.F32
            || arg1.get_type().type_id === PyramidTypeID.F32 && arg2.get_type().type_id === PyramidTypeID.I32
            || arg1.get_type().type_id === PyramidTypeID.I32 && arg2.get_type().type_id === PyramidTypeID.F32
            || arg1.get_type().type_id === PyramidTypeID.Number && arg2.get_type().type_id === PyramidTypeID.I32
            || arg1.get_type().type_id === PyramidTypeID.Number && arg2.get_type().type_id === PyramidTypeID.F32
            || arg1.get_type().type_id === PyramidTypeID.I32 && arg2.get_type().type_id === PyramidTypeID.Number
            || arg1.get_type().type_id === PyramidTypeID.F32 && arg2.get_type().type_id === PyramidTypeID.Number
            || arg1.get_type().type_id === PyramidTypeID.Number && arg2.get_type().type_id === PyramidTypeID.Number) {
            return ArithmeticOperator.pow_float(arg1.eval(env), arg2.eval(env))
        }
        throw new Error("pyramid: backend error: invalid operation ocurred")
    }
}
customElements.define('pyramid-pow-block', PowBlock);