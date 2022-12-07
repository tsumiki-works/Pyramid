import { Popup } from "../popup.js";
import { Block } from "./block.js"
import { EmptyBlock } from "./concrete_block/empty_block.js";

export abstract class FullBlock extends Block {
    constructor(backgroundColor: string, pyramid_type: PyramidType, left: number, top: number, content: string) {
        super(backgroundColor, pyramid_type);
        this.style.left = left + "px";
        this.style.top = top + "px";
        this.innerText = content;
        //event
        this.init_events();
    }
    get_content(): string {
        return this.innerText;
    }
    get_children(): Array<Block> {
        return Array.from(this.children) as Array<Block>;
    }

    abstract eval(env: Map<String, any>): PyramidObject;

    /* ============================================================================================================= */
    /*     Events                                                                                                    */
    /* ============================================================================================================= */

    private mousedown_listener: EventListener;
    private mousemove_listener: EventListener;
    private mouseup_listener: EventListener;

    private init_events() {
        this.mousedown_listener = (e: MouseEvent) => this.event_mousedown(e);
        this.mousemove_listener = (e: MouseEvent) => this.event_mousemove(e);
        this.mouseup_listener = (e: MouseEvent) => this.event_mouseup(e);
        this.addEventListener("mousedown", this.mousedown_listener);
    }

    private event_mousedown(e: MouseEvent) {
        Popup.remove_popup();
        //! [TODO] delete
        if (this.is_empty()) {
            return;
        }

        if (e.button === 0) {
            const x = this.get_x();
            const y = this.get_y();
            if (this.parent !== null) {
                const tmp = new EmptyBlock();
                tmp.set_parent(this.parent);
                this.parent.replaceChild(tmp, this);
                this.parent.get_root().format();
            } else {
                document.getElementById("blocks").removeChild(this);
            }
            document.getElementById("blocks").appendChild(this);
            this.parent = null;
            this.set_left(x);
            this.set_top(y);
            document.addEventListener("mousemove", this.mousemove_listener);
            document.addEventListener("mouseup", this.mouseup_listener);
            e.stopPropagation();
        }
        else if (e.button === 2) {
            if (this.is_empty()) {
                return;
            }
            new Popup(e.pageX, e.pageY, this.build_popup_event());
            this.get_root().format();
            e.stopPropagation();
        }
    }

    private event_mousemove(e: MouseEvent) {
        this.style.left = (e.pageX - this.get_width() * 0.5) + "px";
        this.style.top = (e.pageY - this.get_height() * 0.5) + "px";
        this.get_root().format();
    }

    private event_mouseup(_: MouseEvent) {
        const roots = Array.from(document.getElementById("blocks").children) as Array<Block>;
        for (const root of roots) {
            if (root.connect_with(this)) {
                break;
            }
        }
        document.removeEventListener("mousemove", this.mousemove_listener);
        document.removeEventListener("mouseup", this.mouseup_listener);
        this.addEventListener("mousedown", this.mousedown_listener);
    }

    protected build_popup_event(): [string, EventListener][] {
        return [
            ["削除", _ => this.popup_event_kill()],
        ];
    }

    protected popup_event_kill() {
        this.kill();
        Popup.remove_popup();
    }

}