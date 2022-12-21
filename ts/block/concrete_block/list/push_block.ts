import { Environment } from "../../../evaluation/environment.js";
import { TypeEnv, unify } from "../../inference/typeenv.js";
import { ParentBlock } from "../../parent_block.js";
import { popup_event_eval } from "../../result_block.js";
import { TypedBlock } from "../../typed_block.js";
import { EmptyBlock } from "../empty_block.js";

export class PushBlock extends ParentBlock {
    constructor(lr: Vec2) {
        super(lr, [
            ["評価", _ => popup_event_eval(this)],
            ["削除", _ => this.popup_event_kill_self()],
            ["子も削除", _ => this.popup_event_kill()],
        ]);
        this.set_content("push");
        this.appendChild(new EmptyBlock(this));
        this.appendChild(new EmptyBlock(this));
        this.format();
    }
    override eval(env: Environment): any {
        if (this.is_invalid()) {
            throw new Error("invalid");
        }
        const this_children = this.get_children();
        const target = this_children[0].eval(env);
        const lst = this_children[1].eval(env);
        lst.push(target);
        return lst;
    }
    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        const this_children = this.get_children();
        const children: TempPyramidTypeTree[] = [];
        for (const child of this_children) {
            if (!child.is_empty()) {
                children.push((child as TypedBlock).infer_type(env));
            }
        }
        let invalid = () => {
            return {
                node: { id: PyramidTypeID.Invalid, var: null, attribute: null },
                children: children,
            };
        };
        // TODO:
        if (children.length !== 2) {
            return invalid();
        }
        const list_type: TempPyramidType = { id: null, var: null, attribute: null };
        if (!unify(children[0].node, list_type)) {
            return invalid();
        }
        if (!unify(children[1].node, {
            id: PyramidTypeID.List,
            var: null,
            attribute: {
                args: [],
                return: list_type,
            },
        })) {
            return invalid();
        }
        return {
            node: {
                id: PyramidTypeID.List,
                var: null,
                attribute: {
                    args: [],
                    return: list_type,
                },
            },
            children: children,
        }
    }
}
customElements.define('pyramid-push-block', PushBlock);