import { Evaluator } from "../../evaluation/evaluator.js";
import { TempPyramidTypeTree, TypeEnv } from "../inference/typeenv.js";
import { TypedBlock } from "../typed_block.js";

/* ================================================================================================================= */
/*     LiteralBlock                                                                                                  */
/*         is immediate value                                                                                        */
/*         has no child                                                                                              */
/* ================================================================================================================= */

export class LiteralBlock extends TypedBlock {
    constructor(lr: Vec2, content: string) {
        super(
            lr,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.set_content(value);
                    }
                })],
                ["評価", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.format();
    }
    override eval(_: Environment): PyramidObject {
        return Evaluator.eval_literal(this.get_content(), this.get_type());
    }
    override infer_type(_: TypeEnv): TempPyramidTypeTree {
        return {
            node: {
                id: Evaluator.get_literal_type(this.get_content()).type_id,
                var: null,
                attribute: null,
            },
            children: null,
        };
    }
}
customElements.define('pyramid-literal-block', LiteralBlock);