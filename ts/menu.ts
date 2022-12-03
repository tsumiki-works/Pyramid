import { AtomBlock } from "./block/atom_block.js";
import { FunBlock } from "./block/fun_block.js";

export class MenuManager {

    private menu: HTMLDivElement;

    private mousedown_listener: EventListener;

    constructor() {
        this.menu = document.getElementById("menu") as HTMLDivElement;
        this.mousedown_listener = (e: MouseEvent) => this.event_mousedown(e);
        this.menu.addEventListener("mousedown", this.mousedown_listener);
    }

    event_mousedown(_: MouseEvent) {
        //! [TODO]
        //! debug
        document.getElementById("blocks").appendChild(new FunBlock(window.innerWidth * 0.5, window.innerHeight * 0.5, "+", { args_cnt: 2, return_type: { type_id: PyramidTypeID.I32, attribute: null } }));
        document.getElementById("blocks").appendChild(new AtomBlock(window.innerWidth * 0.5 + 100, window.innerHeight * 0.5 + 100, "12", PyramidTypeID.I32));
        document.getElementById("blocks").appendChild(new AtomBlock(window.innerWidth * 0.5 + 200, window.innerHeight * 0.5 + 200, "3", PyramidTypeID.I32));
    }
}