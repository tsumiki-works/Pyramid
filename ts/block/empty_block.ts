import { Popup } from "../popup.js";
import { Block } from "./block.js";

export class EmptyBlock extends Block {
    constructor() {
        super({ type_id: PyramidTypeID.Empty, attribute: null });
        this.style.backgroundColor = "rgba(255, 0, 0, 0.2)"; //! [TODO]
    }

    replace_child(target: Block, after?: Block){}

    eval(env: Map<String, any>): PyramidObject{
        return null;
    }
}
customElements.define('pyramid-block-empty', EmptyBlock);