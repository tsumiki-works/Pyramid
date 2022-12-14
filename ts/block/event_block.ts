import { Popup } from "../popup/popup.js";
import { Block } from "./block.js";

/* ================================================================================================================= */
/*     EventBlock                                                                                                    */
/*         manages block events                                                                                      */
/* ================================================================================================================= */

export abstract class EventBlock extends Block {

    private mouse_down_listener: EventListener;
    private mouse_move_listener: EventListener;
    private mouse_up_listener: EventListener;

    constructor(
        pyramid_type: PyramidType,
        lr: Vec2,
        rgba: Vec4,
        mouse_leftdown_event: Function,
        mouse_rightdown_event: Function,
        mouse_move_event: Function,
        mouse_up_event: Function,
    ) {
        super(pyramid_type, lr, rgba);
        this.mouse_down_listener = (e: MouseEvent) => 
            this.mouse_down_event_wrapper(e, mouse_leftdown_event, mouse_rightdown_event);
        this.mouse_move_listener = (e: MouseEvent) => this.mouse_move_event_wrapper(e, mouse_move_event);
        this.mouse_up_listener = (e: MouseEvent) => this.mouse_up_event_wrapper(e, mouse_up_event);
        this.addEventListener("mousedown", this.mouse_down_listener);
    }

    private mouse_down_event_wrapper(e: MouseEvent, mouse_leftdown_event: Function, mouse_rightdown_event: Function) {
        Popup.remove_all_popup();
        if (e.button === 0) {
            mouse_leftdown_event(e);
            this.removeEventListener("mousedown", this.mouse_down_listener);
            document.addEventListener("mousemove", this.mouse_move_listener);
            document.addEventListener("mouseup", this.mouse_up_listener);
        } else if (e.button === 2) {
            mouse_rightdown_event(e);
        }
        e.stopPropagation();
    }

    private mouse_move_event_wrapper(e: MouseEvent, mouse_move_event: Function) {
        Popup.remove_all_popup();
        mouse_move_event(e);
        e.stopPropagation();
    }

    private mouse_up_event_wrapper(e: MouseEvent, mouse_up_event: Function) {
        Popup.remove_all_popup();
        mouse_up_event(e);
        document.removeEventListener("mousemove", this.mouse_move_listener);
        document.removeEventListener("mouseup", this.mouse_up_listener);
        this.addEventListener("mousedown", this.mouse_down_listener);
        e.stopPropagation();
    }
}