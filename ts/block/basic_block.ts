import { Keywords } from "../keywords.js";
import { Popup } from "../popup/popup.js";
import { PopupInput } from "../popup/popup_input.js";
import { PopupLabel } from "../popup/popup_label.js";
import { PopupListMenu } from "../popup/popup_listmenu.js";
import { EmptyBlock } from "./concrete_block/empty_block.js";
import { EventBlock } from "./event_block.js";
import { Roots } from "./roots.js";
import { Trash } from "./trash.js";

/* ================================================================================================================= */
/*     BasicBlock                                                                                                    */
/*         can be moved and connected                                                                                */
/*         makes popup                                                                                               */
/*         has content                                                                                               */
/*         has some popup event preset                                                                               */
/* ================================================================================================================= */

export abstract class BasicBlock extends EventBlock {

    private readonly playground: HTMLDivElement = document.getElementById("playground") as HTMLDivElement;

    constructor(pyramid_type: PyramidType, lr: Vec2, rgba: Vec4, popup_events: PopupEvent[]) {
        super(
            pyramid_type,
            lr,
            rgba,
            _ => this.event_mouse_leftdown(),
            (e: MouseEvent) => this.event_mouse_rightdown(e, popup_events),
            (e: MouseEvent) => this.event_mousemove(e),
            _ => this.event_mouseup(),
        );
    }

    get_content(): string {
        for (let i = 0; i < this.childNodes.length; ++i) {
            if (this.childNodes[i].nodeName === "#text") {
                return this.childNodes[i].nodeValue;
            }
        }
        throw new Error("content is empty");
    }

    override kill(): void {
        if (this.parent !== null) {
            const tmp = new EmptyBlock();
            tmp.set_parent(this.parent);
            this.parent.replaceChild(tmp, this);
            this.parent.get_root().format();
        }
        this.parent = null;
        Trash.append(this);
    }

    protected popup_event_eval() {
        Popup.remove_all_popup();
        // TODO: Make Popup from result
        Popup.create_popup(new PopupLabel(
            this.getBoundingClientRect().left + this.get_width(),
            this.getBoundingClientRect().top,
            "",
            this.eval(Keywords.get_first_env()).value,
        ));
        console.log(this.eval(Keywords.get_first_env()));
    }

    protected popup_event_kill() {
        Popup.remove_all_popup();
        this.kill();
    }

    protected popup_event_edit(e: MouseEvent, edit_event: Function) {
        Popup.remove_all_popup();
        Popup.create_popup(new PopupInput(
            e.pageX,
            e.pageY,
            "popup-block-input",
            ((ke: KeyboardEvent) => {
                if (ke.key == "Enter") {
                    edit_event(PopupInput.get_value());
                    Popup.remove_all_popup();
                    this.get_root().format();
                }
            }),
        ));
        PopupInput.focus();
    }

    private event_mouse_leftdown() {
        const x = this.get_x();
        const y = this.get_y();
        if (this.parent !== null) {
            const tmp = new EmptyBlock();
            tmp.set_parent(this.parent);
            this.parent.replaceChild(tmp, this);
            this.parent.get_root().format();
        } else {
            Roots.remove(this);
        }
        Roots.append(this);
        this.parent = null;
        this.set_left(x);
        this.set_top(y);
    }

    private event_mouse_rightdown(e: MouseEvent, popup_events: PopupEvent[]) {
        Popup.create_popup(new PopupListMenu(e.pageX, e.pageY, "", popup_events));
    }

    private event_mousemove(e: MouseEvent) {
        this.style.left = (e.pageX - this.get_width() * 0.5 - this.playground.getBoundingClientRect().left) + "px";
        this.style.top = (e.pageY - this.get_height() * 0.5 - this.playground.getBoundingClientRect().top) + "px";
        this.get_root().format();
    }

    private event_mouseup() {
        Roots.connect(this);
    }
}