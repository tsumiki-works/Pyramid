import { BasicBlock } from "../basic_block.js";
import { EmptyBlock } from "./empty_block.js";

export class DefineBlock extends BasicBlock {

    constructor(pyramid_type: PyramidType, lr: Vec2, rgba: Vec4, content: string) {
        super(
            pyramid_type,
            lr,
            [255, 255, 255, 1],
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.innerText = value;
                    }
                })],
                ["実行", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill()],
            ]
        );
        this.innerText = content;
        this.style.backgroundColor = "white";
        this.style.border = "solid 3px rgba(" + rgba[0]  + "," + rgba[1]  + "," + rgba[2]  + "," + rgba[3]  + ")";
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