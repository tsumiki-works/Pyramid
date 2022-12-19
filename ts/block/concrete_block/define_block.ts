import { Environment } from "../../evaluation/environment.js";
import { TypeEnv } from "../inference/typeenv.js";
import { ParentBlock } from "../parent_block.js";
import { TypedBlock } from "../typed_block.js";
import { EmptyBlock } from "./empty_block.js";

export class DefineBlock extends ParentBlock {

    private content_wrapper: HTMLDivElement;

    constructor(lr: Vec2, content: string) {
        super(
            lr,
            [
                ["編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        this.set_content(value);
                    }
                })],
                ["仮引数を編集", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0) {
                        for (const child of Array.from(this.content_wrapper.children)) {
                            if (child.classList.contains("pyramid-argument")) {
                                child.remove();
                            }
                        }
                        const args = value.split(" ");
                        for (const arg of args) {
                            const span = document.createElement("span");
                            span.innerText = arg;
                            span.classList.add("pyramid-argument");
                            this.content_wrapper.appendChild(span);
                        }
                    }
                })],
                ["評価", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        for (const child of Array.from(this.children)) {
            if (child.classList.contains("content-wrapper")) {
                this.content_wrapper = child as HTMLDivElement;
                break;
            }
        }
        this.set_content(content);
        this.appendChild(new EmptyBlock(this));
        this.appendChild(new EmptyBlock(this));
        this.format();
    }

    override eval(env: Environment): PyramidObject {
        env.set(this.get_content(), {
            pyramid_type: this.get_type(),
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

    override get_type(): PyramidType {
        const next = this.get_children()[0];
        if (next.is_empty()) {
            return { type_id: PyramidTypeID.Invalid, attribute: null };
        } else {
            return (next as TypedBlock).get_type();
        }
    }

    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        const children = this.get_children();
        let next = (t1: TempPyramidType, t2: TempPyramidTypeTree): TempPyramidTypeTree => {
            if (!children[1].is_empty()) {
                return { node: t1, children: [t2, (children[1] as TypedBlock).infer_type(env)] };
            } else {
                return { node: t1, children: [t2] };
            }
        };
        // if logic is unset
        if (children[0].is_empty()) {
            return next({ id: PyramidTypeID.Invalid, var: null, attribute: null }, null);
        }
        // set temporary type onto environment
        const this_args = this.get_args();
        const args: TempPyramidType[] = [];
        for (const arg of this_args) {
            const tmp = { id: null, var: null, attribute: null };
            args.push(tmp);
            env.set(arg, tmp);
        }
        // infer logic type
        const logic_type = (children[0] as TypedBlock).infer_type(env);
        // set this definition
        const attribute = {
            args: args,
            return: logic_type.node,
        };
        const this_type = { id: PyramidTypeID.Function, var: null, attribute: attribute };
        env.set(this.get_content(), this_type);
        // goto next
        // console.log(attribute); //! debug
        return next(this_type, logic_type);
    }

    private get_args(): string[] {
        let res = [];
        for (const child of Array.from(this.content_wrapper.children)) {
            if (child.classList.contains("pyramid-argument")) {
                res.push(child.innerHTML);
            }
        }
        return res;
    }
}
customElements.define('pyramid-define-block', DefineBlock);