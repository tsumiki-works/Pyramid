import { BlockConst } from "../block_const.js";
import { ParentBlock } from "../parent_block.js";
import { TypedBlock } from "../typed_block.js";
import { TypeEnv, unify } from "../inference/typeenv.js";
import { Environment } from "../../evaluation/environment.js";

export class ListBlock extends ParentBlock {

    constructor(lr: Vec2, content: string, args_cnt: number) {
        super(
            lr,
            [
                ["引数の数を変更", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0 && !isNaN(parseInt(value))) {
                        this.set_content("List(" + value + ")");
                        this.set_children_cnt(parseInt(value));
                    }
                })],
                ["実行", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.set_children_cnt(args_cnt);
        this.format();
    }

    override eval(env: Environment): any {
        let children_values = Array<any>();
        for (const child of this.get_children()) {
            children_values.push(child.eval(env));
        }
        return children_values.reverse();
    }

    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        if (this.get_children().length == 0) {
            return {
                // TODO: Use Generics List<T>
                node: {
                    id: PyramidTypeID.List,
                    var: null,
                    attribute: {
                        args: [],
                        return: {
                            id: null,
                            var: null,
                            attribute: null
                        }
                    },
                },
                children: null,
            }
        } else {
            let is_invalid: boolean = false;
            let children_type = new Array<TempPyramidTypeTree>();
            let first_child = this.get_children()[0];
            let first_child_type: TempPyramidTypeTree;
            let unify_result = false;
            let t = {
                id: null,
                var: null,
                attribute: null
            }

            for (const child of this.get_children()) {
                if (first_child === child && !first_child.is_empty()) {
                    first_child_type = (first_child as TypedBlock).infer_type(env);
                    unify_result = unify(t, first_child_type.node);
                    children_type.push(first_child_type);
                } else {
                    if (child.is_empty()) {
                        // FIXME: This is 'POWER' codeing. Remove Error from 'not' adding empty_block's TempPyramidTypeTree
                        /** ex) (List [empty, List<num>]) ==> 
                         * node: List
                         * children: [
                         *      node: List,
                         *      children: [num]
                         * ]
                         */
                        is_invalid = true;
                    } else {
                        let c_type = (child as TypedBlock).infer_type(env);
                        unify_result = unify(t, c_type.node) && unify_result;
                        children_type.push(c_type);
                    }
                }
            }

            // There're no empty child
            if (unify_result && !is_invalid) {
                return ({
                    node: {
                        id: PyramidTypeID.List,
                        var: null,
                        attribute: {
                            args: [],
                            return: t,
                        },
                    },
                    children: children_type,
                })
            } else {
                return ({
                    node: {
                        id: PyramidTypeID.Invalid,
                        var: null,
                        attribute: null,
                    },
                    children: children_type,
                })
            }
        }
    }
}
customElements.define('pyramid-list-block', ListBlock);