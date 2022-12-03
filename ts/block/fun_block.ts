import { Block } from "./block.js";

export class FunBlock extends Block {
    constructor(left: number, top: number, content: string, fun_attribute: FunctionAttribute) {
        super({type_id: PyramidTypeID.Function, attribute: fun_attribute});
        this.style.left = left + "px";
        this.style.top = top + "px";
        this.style.backgroundColor = "green"; //! [TODO]
        this.span.innerText = content;
        if (fun_attribute.args_cnt === Infinity) {
            this.child_blocks.push(new Block());
        } else {
            for (let i = 0; i < fun_attribute.args_cnt; ++i) {
                const child = new Block();
                child.set_parent(this);
                this.child_blocks.push(child);

            }
        }
        this.format();
    }
}
customElements.define('pyramid-block-fun', FunBlock);