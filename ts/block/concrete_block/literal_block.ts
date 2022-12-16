import { Evaluator } from "../../evaluation/evaluator.js";
import { BasicBlock } from "../basic_block.js";

/* ================================================================================================================= */
/*     LiteralBlock                                                                                                  */
/*         is immediate value                                                                                        */
/*         has no child                                                                                              */
/* ================================================================================================================= */

export class LiteralBlock extends BasicBlock {

    constructor(
        lr: Vec2,
        content: string
    ) {
        super(
            Evaluator.get_literal_type(content),
            lr,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.set_content(value);
                    }
                })],
                ["実行", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
    }

    override eval(_: Environment): PyramidObject {
        return Evaluator.eval_literal(this.get_content(), this.pyramid_type);
    }

    override inference_type(_: Environment) {
        this.set_type(Evaluator.get_literal_type(this.get_content()));
    }
}
customElements.define('pyramid-literal-block', LiteralBlock);