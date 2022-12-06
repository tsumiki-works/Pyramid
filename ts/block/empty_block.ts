import { Block } from "./block.js";
export class EmptyBlock extends Block {
    constructor() {
        super("rgba(0, 0, 0, 0.2)",
            {
                type_id: PyramidTypeID.Empty,
                attribute: null
            });
        this.classList.add("pyramid-empty-block");
    }
}
customElements.define('pyramid-block-empty', EmptyBlock);