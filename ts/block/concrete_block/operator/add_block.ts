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
        // TODO:
        if (this.is_invalid()) {
            throw new Error("invalid");
        }

        const this_children = this.get_children();
        if (this_children.length !== 2) {
            console.log(this_children.length)
            throw new Error("pyramid: backend error: add operation must have two arguments");
        }

        const arg1 = this_children[0] as TypedBlock//.eval(env)
        const arg2 = this_children[1] as TypedBlock//.eval(env)

        if (arg1.get_type().type_id === PyramidTypeID.I32 && arg2.get_type().type_id === PyramidTypeID.I32) {
            return ArithmeticOperator.add_int(arg1.eval(env), arg2.eval(env))
        }
        else if (arg1.get_type().type_id === PyramidTypeID.F32 && arg2.get_type().type_id === PyramidTypeID.F32
            || arg1.get_type().type_id === PyramidTypeID.F32 && arg2.get_type().type_id === PyramidTypeID.I32
            || arg1.get_type().type_id === PyramidTypeID.I32 && arg2.get_type().type_id === PyramidTypeID.F32){
            return ArithmeticOperator.add_float(arg1.eval(env), arg2.eval(env))
        }
        new Error("pyramid: backend error: invalid operation ocurred")
    }
}
customElements.define('pyramid-add-block', AddBlock);