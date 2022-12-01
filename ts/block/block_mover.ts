import { Translation } from "../lib/translation.js";
import { Vec3 } from "../webgl/math.js";
import { Block } from "./block.js";

export class BlockMover {

    private block: Block;
    private mousedown_listener: EventListener;
    private left_mouseup_listener: EventListener;
    private left_mousemove_listener: EventListener;

    constructor(
        block: Block,
        mousedown_listener: EventListener,
        canvas: HTMLCanvasElement,
        view: Vec3,
        on_left_mouseup: Function
    ) {
        this.block = block;
        this.mousedown_listener = mousedown_listener;
        this.left_mouseup_listener = _ => this.event_left_mouseup(canvas, on_left_mouseup);
        this.left_mousemove_listener = e => this.event_left_mousemove(canvas, view, e);
        canvas.addEventListener("mouseup", this.left_mouseup_listener);
        canvas.addEventListener("mousemove", this.left_mousemove_listener);
        canvas.removeEventListener("mousedown", this.mousedown_listener);
    }

    private event_left_mouseup(canvas, on_left_mouseup) {
        canvas.removeEventListener("mousemove", this.left_mousemove_listener);
        canvas.removeEventListener("mouseup", this.left_mouseup_listener);
        canvas.addEventListener("mousedown", this.mousedown_listener);
        on_left_mouseup();
        //! [TODO] render
    }

    private event_left_mousemove(canvas, view, e) {
        const pos = Translation.convert_2dscreen_to_3dworld(canvas.width, canvas.height, view, [e.pageX, e.pageY]);
        this.block.x = pos[0];
        this.block.y = pos[1];
        //! [TODO] render
    }

}