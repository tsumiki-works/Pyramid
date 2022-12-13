import { Keywords } from "../../keywords.js";
import { BasicBlock } from "../basic_block.js";
import { Block } from "../block.js";
import { EmptyBlock } from "./empty_block.js";

export class SymbolBlock extends BasicBlock {

    constructor(pyramid_type: PyramidType, lr: Vec2, rgba: Vec4, content: string) {
        super(
            pyramid_type,
            lr,
            rgba,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0 && this.determine_args(value)) {
                        this.set_content(value);
                    }
                })],
                ["実行", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill()],
            ]
        );
        if (this.determine_args(content)) {
            this.set_content(content);
            this.format();
        } else {
            throw new Error(content + " is undefined symbol");
        }
    }

    override eval(env: Environment): PyramidObject {
        if (!env.has(this.get_content())) {
            throw new Error(this.get_content() + " is undefined symbol");
        }
        const v = env.get(this.get_content());
        if (v.pyramid_type.type_id === PyramidTypeID.Function) {
            if (typeof v.value !== "function") {
                throw new Error("unexpected error: " + this.get_content() + " is not function but expected");
            }
            if (v.pyramid_type.attribute.return_type.type_id !== this.pyramid_type.type_id) {
                throw new Error(this.get_content() + " return type is wrong"); // TODO: show error better
            }
            if (v.pyramid_type.attribute.args_cnt !== this.get_children().length) {
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

    private set_content(content: string) {
        const tmp = this.get_children();
        this.innerText = content;
        for (const child of tmp) {
            this.appendChild(child);
        }
    }

    private determine_args(content: string): boolean {
        function check(t: PyramidType, b: Block): boolean {
            return t.type_id === PyramidTypeID.Function
                && JSON.stringify(t.attribute.return_type) === JSON.stringify(b.get_type());
        };
        function inner(parent: Block): number | null {
            if (parent === null) {
                return null;
            }
            const t = parent.get_type();
            if (check(t, this) && (parent as BasicBlock).get_content() === content) {
                return t.attribute.args_cnt;
            }
            return inner(parent.get_parent());
        }
        const args_cnt = inner(this.parent);
        if (args_cnt !== null) {
            this.set_args_cnt(args_cnt);
            return true;
        }

        // TODO: check global definitions here
        
        for (const keyword of Keywords.keywords) {
            if (keyword[0] === content && check(keyword[1].pyramid_type, this)) {
                this.set_args_cnt(keyword[1].pyramid_type.attribute.args_cnt);
                return true;
            }
        }
        return false;
    }

    private set_args_cnt(args_cnt: number) {
        for (let i = 0; i < args_cnt; ++i) {
            const tmp = new EmptyBlock();
            tmp.set_parent(this);
            this.appendChild(tmp);
        }
    }
}
customElements.define('pyramid-symbol-block', SymbolBlock);