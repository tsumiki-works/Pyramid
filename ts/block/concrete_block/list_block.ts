import { ParentBlock } from "../parent_block.js";
import { TypedBlock } from "../typed_block.js";
import { TypeEnv } from "../inference/typeenv.js";
import { TempPyramidTypeTree } from "../inference/typeenv.js";

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

    override eval(env: Environment): PyramidObject {
        let children_values = Array<PyramidObject>();
        for (const child of this.get_children()) {
            children_values.push(child.eval(env));
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.List,
                attribute: null,
            },
            value: children_values.reverse()
        }
    }

    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        if (this.get_children().length == 0) {
            return {
                // TODO: Use Generics List<T>
                node: {
                    id: PyramidTypeID.List,
                    var: null,
                    attribute: null,
                },
                children: null,
            }
        } else {
            let first_child = this.get_children()[0];
            if (!first_child.is_empty()) {
                // FIXME: in List<T>, 'T' is included at 'FunctionAttribute' now. 
                // TODO:  This type is not infereced. Need get_inferenced_type().
                let children_type = new Array<TempPyramidTypeTree>();
                for (const child of this.get_children()) {
                    children_type.push((child as TypedBlock).infer_type(env));
                }
                return ({
                    node: {
                        id: PyramidTypeID.List,
                        var: null,
                        attribute: {
                            args: [],
                            return: {
                                id: (first_child as TypedBlock).get_type().type_id,
                                var: null,
                                attribute: null,
                            }
                        },
                    },
                    children: children_type,
                }
                )
            } else {
                return {
                    // TODO: Use Generics List<T>
                    node: {
                        id: PyramidTypeID.Invalid,
                        var: null,
                        attribute: null,
                    },
                    children: null,
                }
            }
        }
    }
}
customElements.define('pyramid-list-block', ListBlock);