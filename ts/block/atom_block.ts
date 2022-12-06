import { Popup } from "../popup.js";
import { FullBlock } from "./full_block.js"

export abstract class AtomBlock extends FullBlock {
    constructor(pyramid_type: PyramidType, left: number, top: number, content: string) {
        super("blue", "atom_block", pyramid_type, left, top, content);
    }

    abstract eval(env: Map<String, any>): PyramidObject;

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
                if (!Number.isNaN(Number(input.value))) {
                    this.innerText = input.value;
                    this.get_root().format();
                }
                Popup.remove_popup();
            }
        }));
        popup.appendChild(input);
        input.focus();
    }
}
//customElements.define('pyramid-block-atom', AtomBlock);