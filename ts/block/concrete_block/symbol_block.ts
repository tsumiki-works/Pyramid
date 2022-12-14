import { Popup } from "../../popup.js";
import { BasicBlock } from "../basic_block.js";
import { Roots } from "../roots.js";
import { EmptyBlock } from "./empty_block.js";

export class SymbolBlock extends BasicBlock {

    constructor(pyramid_type: PyramidType, lr: Vec2, rgba: Vec4, content: string, args_cnt: number) {
        super(
            pyramid_type,
            lr,
            rgba,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.set_content(value);
                    }
                })],
                ["引数の数を変更", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0 && !isNaN(parseInt(value))) {
                        this.set_args_cnt(parseInt(value));
                    }
                })],
                ["実行", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.set_args_cnt(args_cnt);
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
            if (v.pyramid_type.attribute.return_type.type_id !== this.pyramid_type.type_id) { // TODO:
                throw new Error(this.get_content() + " return type is wrong"); // TODO: show error better
            }
            if (v.pyramid_type.attribute.args.length !== this.get_children().length) {
                throw new Error(this.get_content() + " has too many arguments");
            }
            const evaled = this.get_children().map(child => child.eval(env));
            return v.value(evaled, env);
        } else {
            if (v.pyramid_type.type_id !== this.pyramid_type.type_id) {
                throw new Error(this.get_content() + " type is wrong"); // TODO: show error better
            }
            return v;
        }
    }

    private popup_event_kill_self() {
        Popup.remove_popup();
        const children = this.get_children();
        for (const child of children) {
            if (child.is_empty()) {
                child.remove();
            } else {
                const x = child.get_x();
                const y = child.get_y();
                child.set_parent(null);
                Roots.append(child);
                child.set_left(x);
                child.set_top(y);
                this.appendChild(new EmptyBlock(this));
            }
        }
        this.kill();
    }

    private set_content(content: string) {
        const tmp = this.get_children(); // TODO: 
        this.innerText = content;
        for (const child of tmp) {
            this.appendChild(child);
        }
    }

    private set_args_cnt(args_cnt: number) {
        const children = this.get_children();
        for (const child of this.get_children()) {
            child.set_parent(null);
            Roots.append(child);
        }
        for (let i = 0; i < args_cnt; ++i) {
            if (i < children.length) {
                children[i].set_parent(this);
                this.appendChild(children[i]);
            } else {
                this.appendChild(new EmptyBlock(this));
            }
        }
        this.format();
    }
}
customElements.define('pyramid-symbol-block', SymbolBlock);