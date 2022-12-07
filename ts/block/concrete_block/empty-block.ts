import { Block } from "../block.js";
export class EmptyBlock extends Block {
    constructor() {
        super("rgba(0, 0, 0, 0.2)",
            {
                type_id: PyramidTypeID.Empty,
                attribute: null
            });
        this.init_events();
    }
    kill(): void {
        this.remove();
    }

    init_events() {
        this.mousedown_listener = (e: MouseEvent) => this.event_mousedown(e);
        this.mousemove_listener = (e: MouseEvent) => this.event_mousemove(e);
        this.mouseup_listener = (e: MouseEvent) => this.event_mouseup(e);
        this.addEventListener("mousedown", this.mousedown_listener);
    }
    
    private event_mousedown(e: MouseEvent){
        e.stopPropagation();
    }
    private event_mousemove(e: MouseEvent){
        e.stopPropagation();
    }
    private event_mouseup(e: MouseEvent){
        e.stopPropagation();
    }

}
customElements.define('pyramid-block-empty', EmptyBlock);