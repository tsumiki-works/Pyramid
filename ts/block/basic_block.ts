import { PyramidNumber } from "../evaluation/pyramid_number.js";
import { Keywords } from "../keywords.js";
import { Popup } from "../popup.js";
import { Block } from "./block.js";
import { EmptyBlock } from "./concrete_block/empty_block.js";
import { LiteralBlock } from "./concrete_block/literal_block.js";
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

    constructor(pyramid_type: PyramidType, lr: Vec2, popup_events: PopupEvent[]) {
        super(
            pyramid_type,
            lr,
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
        // TODO: Make Output Block from result
        let result = this.eval(Keywords.get_first_env());
        let result_block: Block;
        switch(result.pyramid_type.type_id){
            case PyramidTypeID.Number:
                result_block = new LiteralBlock(
                    {type_id: PyramidTypeID.Number, attribute: []},
                    [this.get_x() + this.get_width(), this.get_y() - this.get_height() * 2],
                    result.value,
                    PyramidNumber.check_type,
                    PyramidNumber.eval
                );
                Roots.append(result_block);
                break;
            default:
                throw Error("Not implemented")
        }
        console.log(this.eval(Keywords.get_first_env()));
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
        Popup.create_listmenu(e.pageX, e.pageY, "", popup_events);
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