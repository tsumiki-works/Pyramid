import { Environment } from "../../../evaluation/environment.js";
import { BinopBlock } from "../../binop_block.js";

export class AddBlock extends BinopBlock {
    constructor(lr: Vec2) {
        super(lr);
        this.set_content("+");
        this.format();
    }
    override eval(env: Environment) {
        // TODO:
    }
}
customElements.define('pyramid-add-block', AddBlock);