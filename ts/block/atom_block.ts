import { Popup } from "../popup.js";
import { Block } from "./block.js";

export class AtomBlock extends FullBlock {
    constructor(className: string, pyramid_type: PyramidType, content: string) {
        super(className, "blue", pyramid_type);
        //this.style.left = left + "px";
        //this.style.top = top + "px";
        this.style.backgroundColor = "blue"; //! [TODO]
        this.innerText = content;
    }
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
customElements.define('pyramid-block-atom', AtomBlock);