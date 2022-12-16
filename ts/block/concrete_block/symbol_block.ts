import { Keywords } from "../../keywords.js";
import { ParentBlock } from "../parent_block.js";
import { TypedBlock } from "../typed_block.js";

export class SymbolBlock extends ParentBlock {

    constructor(lr: Vec2, content: string, args_cnt: number) {
        super(
            { type_id: PyramidTypeID.Invalid, attribute: null },
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
                ["評価", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.set_children_cnt(args_cnt);
        this.inference_type(Keywords.get_first_env());
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
            const evaled = this.get_children().map(child => child.eval(env));
            return v.value(evaled, env);
        } else {
            if (JSON.stringify(v.pyramid_type) !== JSON.stringify(this.pyramid_type)) {
                throw new Error(this.get_content() + " type is wrong"); // TODO: show error better
            }
            return v;
        }
    }

    override inference_type(env: Environment) {
        const v = env.get(this.get_content());
        if (v === null) {
            this.set_type({ type_id: PyramidTypeID.Invalid, attribute: null }, false);
            return;
        }
        if (v.pyramid_type.attribute === null && this.get_children().length === 0) {
            this.set_type(v.pyramid_type);
            return;
        }
        if (v.pyramid_type.attribute.args.length !== this.get_children().length) {
            this.set_type(v.pyramid_type, false);
            return;
        }
        let args = [];
        for (const child of this.get_children()) {
            if (child.is_empty()) {
                args.push(null);
            } else {
                (child as TypedBlock).inference_type(env);
                args.push((child as TypedBlock).get_type());
            }
        }
        let args_ = [];
        for (let i = 0; i < args.length; ++i) {
            if (args[i] === null) {
                args_.push(v.pyramid_type.attribute.args[i]);
            } else if (JSON.stringify(args[i]) !== JSON.stringify(v.pyramid_type.attribute.args[i])) {
                this.set_type(v.pyramid_type, false);
                return;
            }
        }
        if (args_.length === 0) {
            this.set_type(v.pyramid_type.attribute.return_type);
        } else {
            this.set_type({
                type_id: PyramidTypeID.Function,
                attribute: {
                    args: args_,
                    return_type: v.pyramid_type.attribute.return_type,
                },
            });
        }
    }
}
customElements.define('pyramid-symbol-block', SymbolBlock);