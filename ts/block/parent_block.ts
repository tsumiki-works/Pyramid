import { Popup } from "../popup.js";
import { BasicBlock } from "./basic_block.js";
import { EmptyBlock } from "./concrete_block/empty_block.js";
import { Roots } from "./roots.js";

export abstract class ParentBlock extends BasicBlock {

    constructor(pyramid_type: PyramidType, lr: Vec2, popup_events: PopupEvent[]) {
        super(pyramid_type, lr, popup_events);
    }

    protected set_content(content: string) {
        const tmp = this.get_children();
        this.innerText = content;
        for (const child of tmp) {
            this.appendChild(child);
        }
    }

    protected set_children_cnt(args_cnt: number) {
        const children = this.get_children();
        this.disconnect_all_children();
        for (let i = 0; i < args_cnt; ++i) {
            if (i < children.length) {
                children[i].set_parent(this);
                this.appendChild(children[i]);
            } else {
                this.appendChild(new EmptyBlock(this));
            }
        }
        this.format();
    }

    protected popup_event_kill_self() {
        Popup.remove_popup();
        const children_cnt = this.get_children().length;
        this.disconnect_all_children();
        for (let i = 0; i < children_cnt; ++i) {
            this.appendChild(new EmptyBlock(this));
        }
        this.kill();
    }

    private disconnect_all_children() {
        const children = this.get_children();
        for (const child of children) {
            if (child.is_empty()) {
                child.remove();
            } else {
                const x = child.get_x();
                const y = child.get_y();
                child.set_parent(null);
                Roots.append(child);
                child.set_left(x);
                child.set_top(y);
            }
        }
    }
}