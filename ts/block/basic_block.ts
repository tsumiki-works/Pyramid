import { Popup } from "../popup.js";
import { EmptyBlock } from "./concrete_block/empty_block.js";
import { Roots } from "./roots.js";
import { Trash } from "./trash.js";
import { EventBlock } from "./event_block.js";

/* ================================================================================================================= */
/*     BasicBlock                                                                                                    */
/*         can be moved and connected                                                                                */
/*         makes popup                                                                                               */
/*         has content                                                                                               */
/*         has some popup event preset                                                                               */
/* ================================================================================================================= */

export abstract class BasicBlock extends EventBlock {

    private readonly content_span: HTMLSpanElement;

    constructor(lr: Vec2, popup_events: PopupEvent[]) {
        super(
            lr,
            _ => this.event_mouse_leftdown(),
            (e: MouseEvent) => this.event_mouse_rightdown(e, popup_events),
            (e: MouseEvent) => this.event_mousemove(e),
            _ => this.event_mouseup(),
        );
        const div = document.createElement("div");
        div.classList.add("content-wrapper");
        this.appendChild(div);
        this.content_span = document.createElement("span");
        this.content_span.classList.add("content");
        div.appendChild(this.content_span);
    }

    protected set_content(content: string) {
        this.content_span.innerText = content;
    }

    get_content(): string {
        return this.content_span.innerText;
    }

    override is_empty(): boolean {
        return false;
    }

    override kill(): void {
        if (this.get_parent() !== null) {
            const tmp = new EmptyBlock();
            tmp.set_parent(this.get_parent());
            this.get_parent().replaceChild(tmp, this);
            this.get_parent().get_root().format();
        }
        this.set_parent(null);
        Trash.append(this);
    }

    protected popup_event_kill() {
        Popup.remove_all_popup();
        this.kill();
    }

    protected popup_event_edit(e: MouseEvent, edit_event: Function) {
        Popup.remove_all_popup();
        Popup.create_input(
            e.pageX,
            e.pageY,
            "popup-block-input",
            ((ke: KeyboardEvent) => {
                if (ke.key == "Enter") {
                    edit_event(Popup.input_get_value());
                    Popup.remove_all_popup();
                    this.get_root().format();
                }
            })
        );
    }

    private event_mouse_leftdown() {
        const x = this.get_x();
        const y = this.get_y();
        if (this.get_parent() !== null) {
            const tmp = new EmptyBlock();
            tmp.set_parent(this.get_parent());
            this.get_parent().replaceChild(tmp, this);
            this.get_parent().get_root().format();
        } else {
            Roots.remove(this);
        }
        Roots.append(this);
        this.set_parent(null);
        this.set_left(x);
        this.set_top(y);
    }

    private event_mouse_rightdown(e: MouseEvent, popup_events: PopupEvent[]) {
        Popup.create_listmenu(e.pageX, e.pageY, "", popup_events);
    }

    private event_mousemove(e: MouseEvent) {
        const rect = document.getElementById("playground").getBoundingClientRect();
        this.style.left = (e.pageX - this.get_width() * 0.5 - rect.left) + "px";
        this.style.top = (e.pageY - this.get_height() * 0.5 - rect.top) + "px";
        this.get_root().format();
    }

    private event_mouseup() {
        Roots.connect(this);
    }
}