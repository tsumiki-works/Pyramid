import { Environment } from "../../../evaluation/environment.js";
import { TypeEnv, unify } from "../../inference/typeenv.js";
import { ParentBlock } from "../../parent_block.js";
import { popup_event_eval } from "../../result_block.js";
import { TypedBlock } from "../../typed_block.js";
import { EmptyBlock } from "../empty_block.js";

export class RestBlock extends ParentBlock {
    constructor(lr: Vec2) {
        super(lr, [
            ["評価", _ => popup_event_eval(this)],
            ["削除", _ => this.popup_event_kill_self()],
            ["子も削除", _ => this.popup_event_kill()],
        ]);
        this.set_content("rest");
        this.appendChild(new EmptyBlock(this));
        this.format();
    }
    override eval(env: Environment): any {
        if (this.is_invalid()) {
            throw new Error("invalid");
        }
        const this_children = this.get_children();
        const lst = this_children[0].eval(env);
        const cloned = lst.concat();
        cloned.pop();
        return cloned;
    }
    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        const this_children = this.get_children();
        if (this_children[0].is_empty()) {
            return {
                node: { id: PyramidTypeID.Invalid, var: null, attribute: null },
                children: [],
            };
        }
        const child_type_tree = (this_children[0] as TypedBlock).infer_type(env);
        const list_type: TempPyramidType = { id: null, var: null, attribute: null };
        if (!unify(child_type_tree.node, {
            id: PyramidTypeID.List,
            var: null,
            attribute: {
                args: [],
                return: list_type,
            },
        })) {
            return {
                node: { id: PyramidTypeID.Invalid, var: null, attribute: null },
                children: [child_type_tree],
            };
        }
        return {
            node: list_type,
            children: [child_type_tree],
        }
    }
}
customElements.define('pyramid-rest-block', RestBlock);