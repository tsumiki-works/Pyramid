
import { Block } from "../block.js";
import { ParentBlock } from "../parent_block.js";
import { TypedBlock } from "../typed_block.js";

export class ListBlock extends ParentBlock {

    constructor(pyramid_type: PyramidType, lr: Vec2, content: string, args_cnt: number) {
        super(
            pyramid_type,
            lr,
            [
                ["引数の数を変更", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0 && !isNaN(parseInt(value))) {
                        this.set_content("List("+value+")");
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
        for (const child of this.get_children()){
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

    override inference_type(env: Environment) {
        if(this.get_children().length == 0){
            this.set_type({
                // TODO: Use Generics List<T>
                type_id: PyramidTypeID.List,
                attribute: null
            })
        }else{
            for(const child of this.get_children()){
                child.inference_type(env);
            }
            let first_child = this.get_children()[0];
            if(!first_child.is_empty()){
                // FIXME: in List<T>, 'T' is included at 'FunctionAttribute' now. 
                // TODO:  This type is not infereced. Need get_inferenced_type().
                this.set_type({
                    type_id: PyramidTypeID.List,
                    attribute: {
                        args: [],
                        return_type: (first_child as TypedBlock).get_type()
                    }
                })
            }else{
                this.set_type({
                    type_id: PyramidTypeID.List,
                    attribute: null
                })
            }
        }
    }
}
customElements.define('pyramid-list-block', ListBlock);