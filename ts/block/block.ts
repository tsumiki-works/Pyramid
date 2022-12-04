import { Popup } from "../popup.js";
import { BlockFormatter } from "./block_formatter.js";

export class Block extends HTMLElement {

    static readonly UNIT_WIDTH = 100.0;
    static readonly UNIT_HALF_WIDTH = 50.0;
    static readonly UNIT_HEIGHT = 50.0;
    static readonly UNIT_HALF_HEIGHT = 25.0;

    protected pyramid_type: PyramidType;
    protected parent: Block | null;

    constructor(pyramid_type?: PyramidType) {
        super();
        // fields
        if (typeof pyramid_type === "undefined") {
            this.pyramid_type = { type_id: PyramidTypeID.Empty, attribute: null };
        } else {
            this.pyramid_type = pyramid_type;
        }
        this.parent = null;
        // html div element
        this.classList.add("pyramid-block");
        this.style.left = "-10px";
        this.style.top = "-10px";
        this.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        this.style.minWidth = Block.UNIT_WIDTH + "px";
        this.style.minHeight = Block.UNIT_HEIGHT + "px";
        document.getElementById("blocks").appendChild(this);
        // event
        this.init_events();
    }
    kill(): void {
        if (this.parent !== null) {
            const tmp = new Block();
            tmp.parent = this.parent;
            this.parent.replaceChild(tmp, this);
            this.parent.get_root().format();
        }
        if (this.is_empty()) {
            this.remove();
            return;
        }
        document.getElementById("trash").appendChild(this);
    }
    copy_with(block: Block): void {
        this.pyramid_type = block.pyramid_type;
        this.parent = block.parent;
    }

    set_left(x: number): void {
        const left = x - this.get_width() * 0.5;
        let parent: HTMLElement = null;
        if (this.parent === null) {
            parent = document.getElementById("workspace");
        } else {
            parent = this.parent;
        }
        this.style.left = -(parent.getBoundingClientRect().left - left) + "px";
    }
    set_top(y: number): void {
        const top = y - this.get_height() * 0.5;
        let parent: HTMLElement = null;
        if (this.parent === null) {
            parent = document.getElementById("workspace");
        } else {
            parent = this.parent;
        }
        this.style.top = -(parent.getBoundingClientRect().top - top) + "px";
    }
    set_parent(parent: Block): void {
        this.parent = parent;
    }

    get_x(): number {
        return this.getBoundingClientRect().left + this.get_width() * 0.5;
    }
    get_y(): number {
        return this.getBoundingClientRect().top + this.get_height() * 0.5;
    }
    get_width(): number {
        return this.offsetWidth;
    }
    get_height(): number {
        return this.offsetHeight;
    }
    get_type(): PyramidType {
        return this.pyramid_type;
    }
    get_content(): string {
        return this.innerText;
    }
    get_children(): Array<Block> {
        return Array.from(this.children) as Array<Block>;
    }
    get_root(): Block {
        if (this.parent === null) {
            return this;
        } else {
            return this.parent.get_root();
        }
    }

    is_empty(): boolean {
        return this.pyramid_type.type_id === PyramidTypeID.Empty;
    }
    is_hit(target: Block): boolean {
        return Math.abs(this.get_x() - target.get_x()) < this.get_width() * 0.5
            && Math.abs(this.get_y() - target.get_y()) < Block.UNIT_HEIGHT * 0.5;
    }

    connect_with(target: Block): boolean {
        if (this === target) {
            return false;
        }
        for (const child of this.get_children()) {
            if (child.is_empty() && child.is_hit(target) && child.classList.contains("pyramid-block")) {
                this.replaceChild(target, child);
                target.parent = this;
                this.get_root().format();
                return true;
            }
            const res = child.connect_with(target);
            if (res) {
                return true;
            }
        }
        return false;
    }

    format() {
        BlockFormatter.format(this);
    }

    //! [TODO]
    eval(env: Map<String, any>): PyramidObject {
        switch (this.pyramid_type.type_id) {
            case PyramidTypeID.Empty:
                throw new Error("evaluated Empty");
            case PyramidTypeID.I32:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.get_content() };
            case PyramidTypeID.F32:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.get_content() };
            case PyramidTypeID.Bool:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.get_content() };
            case PyramidTypeID.String:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.get_content() };
            case PyramidTypeID.List:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.get_content() };
            case PyramidTypeID.Function:
                //! [TODO]
                const f = env.get(this.get_content());
                if (typeof f !== "function") {
                    throw new Error(this.get_content() + " function undefined");
                } else {
                    return {
                        pyramid_type: this.pyramid_type.attribute.return_type,
                        value: f(this.children, env),
                    };
                }
        }
    }

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
        if (this.is_empty()) {
            return;
        }
        if (e.button === 0) {
            const x = this.get_x();
            const y = this.get_y();
            if (this.parent !== null) {
                const tmp = new Block();
                tmp.parent = this.parent;
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
customElements.define('pyramid-block', Block);