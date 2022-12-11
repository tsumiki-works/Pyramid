import { AtomBlock } from "../atom_block.js";

export class I32Block extends AtomBlock {

    constructor(left: number, top: number, content: string) {
        super(
            {
                type_id: PyramidTypeID.I32,
                attribute: null
            },
            left,
            top,
            content)
    }

    eval(env: Map<string, PyramidObject>): PyramidObject {
        if (this.is_variable) {
            const v = env.get(this.get_content());
            if (v === undefined) {
                throw new Error(this.get_content() + " variable is undefined"); //! [TODO] exception
            } else if (v.pyramid_type.type_id !== this.pyramid_type.type_id) {
                throw new Error(this.get_content() +  " variable is not I32"); //! [TODO] exception
            } else {
                return { pyramid_type: this.pyramid_type, value: env.get(this.get_content())  };
            }
        } else {
            return { pyramid_type: this.pyramid_type, value: parseFloat(this.get_content()) };
        }
    }

    check_type(text: string): boolean {
        const tmp = parseInt(text);
        return !isNaN(tmp);
    }
}
customElements.define('pyramid-block-i32', I32Block);