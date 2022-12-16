import { ParentBlock } from "../parent_block.js";
import { EmptyBlock } from "./empty_block.js";

export class DefineBlock extends ParentBlock {

    constructor(lr: Vec2, content: string) {
        super(
            { type_id: PyramidTypeID.Invalid, attribute: null }, // TODO:
            lr,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.set_content(value);
                    }
                })],
                ["仮引数を編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        for (const child of Array.from(this.children)) {
                            if (child.classList.contains("pyramid-argument")) {
                                child.remove();
                            }
                        }
                        const args = value.split(" ");
                        for (const arg of args) {
                            const span = document.createElement("span");
                            span.innerText = arg;
                            span.classList.add("pyramid-argument");
                            this.appendChild(span);
                        }
                        this.pyramid_type.attribute.args = args.map(_ => { return { type_id: PyramidTypeID.Number, attribute: null }; }); // TODO:
                    }
                })],
                ["評価", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.appendChild(new EmptyBlock(this));
        this.appendChild(new EmptyBlock(this));
        this.format();
    }

    override eval(env: Environment): PyramidObject {
        env.set(this.get_content(), {
            pyramid_type: this.pyramid_type,
            value: (args: PyramidObject[], _: Environment): PyramidObject => {
                const this_args = this.get_args();
                if (args.length !== this_args.length) {
                    throw new Error(
                        "num of args of "
                        + this.get_content()
                        + " is expected "
                        + this_args.length
                        + " but passed "
                        + args.length
                    );
                }
                for (let i = 0; i < args.length; ++i) {
                    env.set(this_args[i], args[i]);
                }
                const res = this.get_children()[0].eval(env);
                for (const arg of this_args) {
                    env.remove(arg);
                }
                return res;
            }
        })
        return this.get_children()[1].eval(env);
    }

    override inference_type(env: Environment) {
        // TODO:
    }

    private get_args(): string[] {
        let res = [];
        for (const child of Array.from(this.children)) {
            if (child.classList.contains("pyramid-argument")) {
                res.push(child.innerHTML);
            }
        }
        return res;
    }
}
customElements.define('pyramid-define-block', DefineBlock);