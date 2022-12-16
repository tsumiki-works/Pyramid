import { Popup } from "../../popup/popup.js";
import { ParentBlock } from "../parent_block.js";
import { Roots } from "../roots.js";
import { EmptyBlock } from "./empty_block.js";

export class SymbolBlock extends ParentBlock {

    constructor(pyramid_type: PyramidType, lr: Vec2, content: string, args_cnt: number) {
        super(
            pyramid_type,
            lr,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.set_content(value);
                    }
                })],
                ["引数の数を変更", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0 && !isNaN(parseInt(value))) {
                        this.set_children_cnt(parseInt(value));
                    }
                })],
                ["実行", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.set_children_cnt(args_cnt);
        this.format();
    }

    override eval(env: Environment): PyramidObject {
        const v = env.get(this.get_content());
        if (v === null) {
            throw new Error(this.get_content() + " is undefined symbol");
        }
        if (v.pyramid_type.type_id === PyramidTypeID.Function) {
            if (typeof v.value !== "function") {
                throw new Error("unexpected error: " + this.get_content() + " is not function but expected");
            }
            if (JSON.stringify(v.pyramid_type.attribute.return_type) !== JSON.stringify(this.pyramid_type)) {
                throw new Error(this.get_content() + " return type is wrong"); // TODO: show error better
            }
            if (v.pyramid_type.attribute.args.length !== this.get_children().length) {
                throw new Error(this.get_content() + " has too many arguments");
            }
            const evaled = this.get_children().map(child => child.eval(env));
            return v.value(evaled, env);
        } else {
            if (JSON.stringify(v.pyramid_type) !== JSON.stringify(this.pyramid_type)) {
                throw new Error(this.get_content() + " type is wrong"); // TODO: show error better
            }
            return v;
        }
    }
}
customElements.define('pyramid-symbol-block', SymbolBlock);