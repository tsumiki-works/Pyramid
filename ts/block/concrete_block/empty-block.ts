import { Block } from "../block.js";
export class EmptyBlock extends Block {
    constructor() {
        super("rgba(0, 0, 0, 0.2)",
            {
                type_id: PyramidTypeID.Empty,
                attribute: null
            });
    }
    kill(): void {
        this.remove();
    }
}
customElements.define('pyramid-block-empty', EmptyBlock);