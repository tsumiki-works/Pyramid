import { Block } from "./block/block.js";
import { Roots } from "./block/roots.js";

export class WorkspaceMover {
    private roots: Block[];
    private initial_root_poss: Vec2[];
    private initial_mouse_pos: Vec2;
    private mousemove_listener: EventListener;
    private mouseup_listener: EventListener;
    constructor(initial_mouse_pos: Vec2, workspace: HTMLElement, listener: EventListener) {
        this.roots = Roots.get();
        this.initial_root_poss = this.roots.map(r => [r.get_x(), r.get_y()]);
        this.initial_mouse_pos = initial_mouse_pos;
        this.mousemove_listener = (e: MouseEvent) => this.event_mousemove(e);
        this.mouseup_listener = _ => this.event_mouseup(workspace, listener);
        document.addEventListener("mousemove", this.mousemove_listener);
        document.addEventListener("mouseup", this.mouseup_listener);
    }
    private event_mousemove(e: MouseEvent) {
        for (let i = 0; i < this.roots.length; ++i) {
            this.roots[i].set_left(this.initial_root_poss[i][0] + e.pageX - this.initial_mouse_pos[0]);
            this.roots[i].set_top(this.initial_root_poss[i][1] + e.pageY - this.initial_mouse_pos[1]);
        }
    }
    private event_mouseup(workspace: HTMLElement, listener: EventListener) {
        document.removeEventListener("mousemove", this.mousemove_listener);
        document.removeEventListener("mouseup", this.mouseup_listener);
        workspace.addEventListener("mousedown", listener);
    }
}