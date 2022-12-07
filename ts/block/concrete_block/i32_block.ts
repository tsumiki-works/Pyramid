import { AtomBlock } from "../atom_block.js";

export class I32Block extends AtomBlock {
    constructor(left: number, top: number, content: string){
        super(
        {
            type_id: PyramidTypeID.I32,
            attribute: null
        },
        left,
        top,
        content)
    }

    eval(env: Map<String, any>): PyramidObject{
        return { pyramid_type: this.pyramid_type, value: this.get_content() };
    }
}
customElements.define('pyramid-block-i32', I32Block);