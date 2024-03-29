import { Environment } from "../../evaluation/environment.js";
import { TypeEnv, unify } from "../inference/typeenv.js";
import { ParentBlock } from "../parent_block.js";
import { popup_event_eval } from "../result_block.js";
import { TypedBlock } from "../typed_block.js";
import { EmptyBlock } from "./empty_block.js";

export class IfBlock extends ParentBlock {
    constructor(lr: Vec2) {
        super(lr, [
            ["評価", _ => popup_event_eval(this)],
            ["削除", _ => this.popup_event_kill_self()],
            ["子も削除", _ => this.popup_event_kill()],
        ]);
        this.set_content("if");
        this.appendChild(new EmptyBlock(this));
        this.appendChild(new EmptyBlock(this));
        this.appendChild(new EmptyBlock(this));
        this.format();
    }
    override eval(env: Environment): any {
        if (this.is_invalid()) {
            throw new Error("invalid");
        }
        const this_children = this.get_children();
        if (this_children[0].eval(env)) {
            return this_children[1].eval(env);
        } else {
            return this_children[2].eval(env);
        }
    }
    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        const this_children = this.get_children();
        const children: TempPyramidTypeTree[] = [];
        for (const child of this_children) {
            if (!child.is_empty()) {
                children.push((child as TypedBlock).infer_type(env));
            }
        }
        if (children.length !== 3
            || !unify(children[0].node, { id: PyramidTypeID.Bool, var: null, attribute: null })
            || !unify(children[1].node, children[2].node)) {
            return {
                node: { id: PyramidTypeID.Invalid, var: null, attribute: null },
                children: children,
            };
        }
        return {
            node: children[1].node,
            children: children,
        }
    }
}
customElements.define('pyramid-if-block', IfBlock);