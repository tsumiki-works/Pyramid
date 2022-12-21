import { Environment } from "../../../evaluation/environment.js";
import { TypeEnv, unify } from "../../inference/typeenv.js";
import { ParentBlock } from "../../parent_block.js";
import { popup_event_eval } from "../../result_block.js";
import { TypedBlock } from "../../typed_block.js";
import { EmptyBlock } from "../empty_block.js";

export class MapBlock extends ParentBlock {
    constructor(lr: Vec2) {
        super(lr, [
            ["評価", _ => popup_event_eval(this)],
            ["削除", _ => this.popup_event_kill_self()],
            ["子も削除", _ => this.popup_event_kill()],
        ]);
        this.set_content("map");
        this.appendChild(new EmptyBlock(this));
        this.appendChild(new EmptyBlock(this));
        this.format();
    }
    override eval(env: Environment): any {
        if (this.is_invalid()) {
            throw new Error("invalid");
        }
        const this_children = this.get_children();
        const f = this_children[0].eval(env);
        const lst = this_children[1].eval(env);
        return lst.map(n => f([n], env));
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
        const type_a: TempPyramidType = { id: null, var: null, attribute: null };
        const type_b: TempPyramidType = { id: null, var: null, attribute: null };
        if (!unify(children[0].node, {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [type_a],
                return: type_b
            },
        })) {
            return invalid();
        }
        if (!unify(children[1].node, {
            id: PyramidTypeID.List,
            var: null,
            attribute: {
                args: [],
                return: type_a,
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
                    return: type_b,
                },
            },
            children: children,
        }
    }
}
customElements.define('pyramid-map-block', MapBlock);