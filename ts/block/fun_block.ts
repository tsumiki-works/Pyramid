import { Popup } from "../popup.js";
import { Block } from "./block.js";
import { EmptyBlock } from "./empty_block.js";

export class FunBlock extends Block {
    private is_folding: boolean;
    constructor(left: number, top: number, content: string, fun_attribute: FunctionAttribute) {
        super({ type_id: PyramidTypeID.Function, attribute: fun_attribute });
        this.style.left = left + "px";
        this.style.top = top + "px";
        this.style.backgroundColor = "green"; //! [TODO]
        this.span.innerText = content;
        this.is_folding = false;
        if (fun_attribute.args_cnt === Infinity) {
            this.child_blocks.push(new EmptyBlock());
        } else {
            for (let i = 0; i < fun_attribute.args_cnt; ++i) {
                const child = new EmptyBlock();
                child.set_parent(this);
                this.child_blocks.push(child);

            }
        }
        this.format();
    }
    protected override build_popup_event(): [string, EventListener][] {
        let fold_open = null;
        if (this.is_folding) {
            fold_open = ["開く", _ => this.popup_event_open()];
        } else {
            fold_open = ["畳む", _ => this.popup_event_fold()];
        }
        return [
            fold_open,
            ["削除", _ => this.popup_event_kill_self()],
            ["子も削除", _ => this.popup_event_kill()],
        ];
    }
    private popup_event_fold() {
        Popup.remove_popup();
        FunBlock.disable_child_blocks(this);
        this.classList.add("pyramid-block-folding");
        this.get_root().format();
        this.is_folding = true;
    }
    private popup_event_open() {
        Popup.remove_popup();
        FunBlock.enable_child_blocks(this);
        this.classList.remove("pyramid-block-folding");
        this.get_root().format();
        this.is_folding = false;
    }
    private popup_event_kill_self() {
        Popup.remove_popup();
        for (const child of this.child_blocks) {
            child.set_parent(null);
            if (child.is_empty()) {
                child.kill();
            }
        }
        this.remove();
    }
    private static disable_child_blocks(block: Block) {
        for (const child of block.get_child_blocks()) {
            child.classList.remove("pyramid-block");
            child.classList.add("pyramid-block-disable");
            FunBlock.disable_child_blocks(child);
        }
    }
    private static enable_child_blocks(block: Block) {
        for (const child of block.get_child_blocks()) {
            child.classList.remove("pyramid-block-disable");
            child.classList.add("pyramid-block");
            FunBlock.enable_child_blocks(child);
        }
    }

    eval(env: Map<String, any>): PyramidObject {
        const f = env.get(this.get_content());
        if (typeof f !== "function") {
            throw new Error("pyramid backend error:" + this.get_content() + " function undefined");
        } else {
            return {
                pyramid_type: this.pyramid_type.attribute.return_type,
                value: f(this.children, env),
            };
        }
    }
}
customElements.define('pyramid-block-fun', FunBlock);