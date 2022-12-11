import { Popup } from "../popup.js";
import { FullBlock } from "./full_block.js"

export abstract class AtomBlock extends FullBlock {

    protected is_variable;

    constructor(pyramid_type: PyramidType, left: number, top: number, content: string) {
        super("blue", pyramid_type, left, top, content);
        this.is_variable = false;
    }

    abstract eval(env: Map<string, PyramidObject>): PyramidObject;
    abstract check_type(text: string): boolean;

    /* ============================================================================================================= */
    /*     Events                                                                                                    */
    /* ============================================================================================================= */

    protected override build_popup_event(): [string, EventListener][] {
        return [
            ["編集", (e: MouseEvent) => this.popup_event_edit(e)],
            ["削除", _ => this.popup_event_kill()],
        ];
    }
    private popup_event_edit(e: MouseEvent) {
        Popup.remove_popup();
        const popup = document.createElement("div");
        popup.id = "popup-menu";
        popup.style.display = "block";
        popup.style.left = e.pageX + "px";
        popup.style.top = e.pageY + "px";
        document.body.appendChild(popup);
        const input = document.createElement("input");
        input.id = "popup-menu-edit";
        input.contentEditable = "true";
        input.addEventListener("keydown", (e => {
            if (e.key == "Enter") {
                Popup.remove_popup();
                if (input.value.length === 0) {
                } else if (input.value[0] === "$") {
                    this.is_variable = true;
                    this.classList.add("pyramid-block-variable");
                    this.innerText = input.value.substring(1);
                } else if (this.check_type(input.value)) {
                    this.innerText = input.value;
                } else { }
                this.get_root().format();
            }
        }));
        popup.appendChild(input);
        input.focus();
    }
}