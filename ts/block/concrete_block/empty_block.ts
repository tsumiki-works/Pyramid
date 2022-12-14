import { EventBlock } from "../event_block.js";

/* ================================================================================================================= */
/*     EmptyBlock                                                                                                    */
/*         cannot be evaluated                                                                                       */
/*         cannot be clicked and moved                                                                               */
/* ================================================================================================================= */

export class EmptyBlock extends EventBlock {
    constructor() {
        super(
            {
                type_id: PyramidTypeID.Empty,
                attribute: null
            },
            [-100, -100],
            [0, 0, 0, 0.2],
            _ => { },
            _ => { },
            _ => { },
            _ => { },
        );
    }

    override kill(): void {
        this.remove();
    }

    override eval(_: Environment): PyramidObject {
        throw new Error("empty block evaluated");
    }
}
customElements.define('pyramid-empty-block', EmptyBlock);