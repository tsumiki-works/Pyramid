import { Popup } from "../popup.js";
import { EmptyBlock } from "./concrete_block/empty_block.js";
import { Roots } from "./roots.js";
import { TypedBlock } from "./typed_block.js";

export abstract class ParentBlock extends TypedBlock {

    private is_folding: boolean;

    constructor(lr: Vec2, popup_events: PopupEvent[]) {
        popup_events.push(["開閉", _ => {
            Popup.remove_all_popup();
            this.fold();
            this.get_root().format();
        }]);
        super(lr, popup_events);
        this.is_folding = false;
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
        Popup.remove_all_popup();
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

    fold() {
        for (const child of this.get_children()) {
            if (this.is_folding) {
                child.classList.remove("pyramid-block-disable");
            } else {
                child.classList.add("pyramid-block-disable");
            }
        }
        if (this.is_folding) {
            this.classList.remove("pyramid-block-folding");
        } else {
            this.classList.add("pyramid-block-folding");
        }
        this.is_folding = !this.is_folding;
    }
}