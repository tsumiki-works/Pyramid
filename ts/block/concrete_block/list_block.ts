import { Popup } from "../../popup.js";
import { ParentBlock } from "../parent_block.js";
import { Roots } from "../roots.js";
import { EmptyBlock } from "./empty_block.js";

export class ListBlock extends ParentBlock {

    constructor(pyramid_type: PyramidType, lr: Vec2, content: string, args_cnt: number) {
        super(
            pyramid_type,
            lr,
            [
                ["引数の数を変更", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0 && !isNaN(parseInt(value))) {
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
        let children_values = [];
        return {
            pyramid_type: {
                type_id: PyramidTypeID.List,
                attribute: null,
            },
            value: []
        }
    }
}
customElements.define('pyramid-list-block', ListBlock);