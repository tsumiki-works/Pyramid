import { Vec3 } from "./webgl/math";

export class WorkspaceMover {

    private mouse_pos_before_drag_x: number;
    private mouse_pos_before_drag_y: number;
    private view_before_drag_x: number;
    private view_before_drag_y: number;
    private mousedown_listener: EventListener;
    private right_mouseup_listener: EventListener;
    private right_mousemove_listener: EventListener;

    constructor(
        mouse_pos_before_drag_x: number,
        mouse_pos_before_drag_y: number,
        mousedown_listener: EventListener,
        canvas: HTMLCanvasElement,
        view: Vec3
    ) {
        this.mouse_pos_before_drag_x = mouse_pos_before_drag_x;
        this.mouse_pos_before_drag_y = mouse_pos_before_drag_y;
        this.view_before_drag_x = view[0];
        this.view_before_drag_y = view[1];
        this.mousedown_listener = mousedown_listener;
        this.right_mouseup_listener = _ => this.event_right_mouseup(canvas);
        this.right_mousemove_listener = e => this.event_right_mousemove(view, e);
        canvas.addEventListener("mouseup", this.right_mouseup_listener);
        canvas.addEventListener("mousemove", this.right_mousemove_listener);
        canvas.removeEventListener("mousedown", this.mousedown_listener);
    }

    private event_right_mouseup(canvas) {
        canvas.removeEventListener("mousemove", this.right_mousemove_listener);
        canvas.removeEventListener("mouseup", this.right_mouseup_listener);
        canvas.addEventListener("mousedown", this.mousedown_listener);
        //! [TODO] render
    }

    private event_right_mousemove(view, e) {
        const c = -0.00176 * view[2] + 0.00235;
        view[0] = this.view_before_drag_x - (this.mouse_pos_before_drag_x - e.pageX) * c;
        view[1] = this.view_before_drag_y + (this.mouse_pos_before_drag_y - e.pageY) * c;
        //! [TODO] render
    }

}