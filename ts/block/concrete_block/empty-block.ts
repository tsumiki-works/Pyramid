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
    
    private mousedown_listener: EventListener;

    private init_events() {
        this.mousedown_listener = (e: MouseEvent) => this.event_mousedown(e);
        this.addEventListener("mousedown", this.mousedown_listener);
    }

    private event_mousedown(e: MouseEvent){
        e.stopPropagation();
    }
}
customElements.define('pyramid-block-empty', EmptyBlock);