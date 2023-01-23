import { Environment } from "../../evaluation/environment.js";
import { Evaluator } from "../../evaluation/evaluator.js";
import { PyramidNumber } from "../../evaluation/pyramid_number.js";
import { TypeEnv } from "../inference/typeenv.js";
import { popup_event_eval } from "../result_block.js";
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
                        // convert zero's literal to 0 (ex: 0., 00000, .000 -> 0)
                        this.set_content(
                            PyramidNumber.check_type(value) ? Number(value).toString() : value
                            );
                    }
                })],
                ["評価", _ => popup_event_eval(this)],
                ["削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.format();
    }
    override eval(_: Environment): any {
        if (this.is_invalid()) {
            throw new Error("invalid");
        }
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