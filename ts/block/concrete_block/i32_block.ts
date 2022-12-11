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

    eval(_: Map<string, any>): PyramidObject{
        return { pyramid_type: this.pyramid_type, value: parseFloat(this.get_content()) };
    }
}
customElements.define('pyramid-block-i32', I32Block);