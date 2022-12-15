import { BasicBlock } from "../basic_block.js";

/* ================================================================================================================= */
/*     LiteralBlock                                                                                                  */
/*         is immediate value                                                                                        */
/*         has no child                                                                                              */
/* ================================================================================================================= */

export class LiteralBlock extends BasicBlock {

    private eval_inner: Function;

    constructor(
        pyramid_type: PyramidType,
        lr: Vec2,
        content: string,
        check_type: Function,
        eval_inner: Function
    ) {
        super(
            pyramid_type,
            lr,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0 && check_type(value)) {
                        this.innerText = value;
                    }
                })],
                ["実行", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill()],
            ]
        );
        this.innerText = content;
        this.eval_inner = eval_inner;
    }

    override eval(env: Environment): PyramidObject {
        return this.eval_inner(this.get_content(), env);
    }
}
customElements.define('pyramid-literal-block', LiteralBlock);