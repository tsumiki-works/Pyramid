import { Block } from "../block.js";
import { EventBlock } from "../event_block.js";

/* ================================================================================================================= */
/*     EmptyBlock                                                                                                    */
/*         cannot be evaluated                                                                                       */
/*         cannot be clicked and moved                                                                               */
/* ================================================================================================================= */

export class EmptyBlock extends EventBlock {
    constructor(parent?: Block) {
        super(
            [-100, -100],
            _ => { },
            _ => { },
            _ => { },
            _ => { },
        );
        if (typeof parent !== "undefined") {
            this.set_parent(parent);
        }
    }

    override is_empty(): boolean {
        return true;
    }

    override kill(): void {
        this.remove();
    }

    override eval(_: Environment): PyramidObject {
        throw new Error("empty block evaluated");
    }

    override inference_type(_: Environment) { }
}
customElements.define('pyramid-empty-block', EmptyBlock);