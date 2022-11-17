import { Block } from "../block/block.js";
import { BlockManager } from "../block/block_manager.js";
import { ConsoleManager } from "./console.js";

/**
 * A module to control popup such as dialog, contextmenu.
 */

export class Popup {

    private render: Function;
    private consoleManager: ConsoleManager;

    constructor(_render: Function, _consoleManager: ConsoleManager){
        this.render = _render;
        this.consoleManager = _consoleManager;
    }
    /**
     * A function to create popup-menu nearly clicked-block.
     * Create below DOMs basicly.
     * The contents of `li` are changed by the block's type.
     * 
        <div id="popup-menu">
            <ul>
                <li class="popup-menu-item">Run</li> # if block isn't int, float.
                <li class="popup-menu-item">Edit</li> # if block is int or float.
                <li class="popup-menu-item">Delete</li>
            </ul>
        </div>
    * 
    * @param {object} block 
    */
    create_popup_menu(blockManager: BlockManager, event: MouseEvent, block: Block): void{
        let elem = document.createElement("div");
        elem.id = "popup-menu";
        elem.style.display = "block";
        elem.style.left = event.pageX + "px";
        elem.style.top = event.pageY + "px";
        let elem_ul = document.createElement("ul");
        let elem_li_array = [];
        if(block.type == 0){
            let elem_li_edit = document.createElement("li");
            elem_li_edit.classList.add("popup-menu-item");
            elem_li_edit.innerText = "編集";
            elem_li_edit.onclick = (e => this.popup_menu_content_edit(block));
            elem_li_array.push(elem_li_edit);
            
        }else if([1, 2, 3, 4].includes(block.type)){
            let elem_li_run = document.createElement("li");
            elem_li_run.classList.add("popup-menu-item");
            elem_li_run.innerText = "実行";
            elem_li_run.onclick = (e => {this.consoleManager.run_command("eval " + block.enumerate()); this.delete_popup_menu()});
            elem_li_array.push(elem_li_run);
        }else{
            alert("Pyramid Frontend error: the block type is not considered in `window.js`");
        }
        let elem_li_del = document.createElement("li");
        elem_li_del.classList.add("popup-menu-item");
        elem_li_del.innerText = "削除";
        elem_li_del.onclick = (e => {this.popup_menu_content_delete(blockManager, block); this.delete_popup_menu()});
        elem_li_array.push(elem_li_del);

        for(let i = 0; i < elem_li_array.length; i++){
            elem_ul.appendChild(elem_li_array[i]);
        }
        elem.appendChild(elem_ul);
        document.body.appendChild(elem);
    }

    delete_popup_menu(): void {
        const elem = document.getElementById("popup-menu");
        if(elem !== null){
            document.body.removeChild(elem);
        }
    }

    popup_menu_content_delete(blockManager, block): void {
        blockManager.remove_block_from_roots(block);
    }

    popup_menu_content_edit(block): void {
        const elem_menu = document.getElementById("popup-menu");
        elem_menu.removeChild(elem_menu.firstChild);

        const elem_edit = document.createElement("input");
        elem_edit.id = "popup-menu-edit";
        elem_edit.style.width = "100px";
        elem_edit.style.height = "30px";
        elem_edit.contentEditable = "true";
        elem_edit.addEventListener("keydown", (e => {
            if(e.key == "Enter"){
                if(!Number.isNaN(elem_edit.value)){
                    block.content = elem_edit.value;
                    this.render();
                }else{
                    this.consoleManager.start_newline(ConsoleManager.exception_message("This block's value must be integer."));
                }
                this.delete_popup_menu();
            }
        }));
        elem_menu.appendChild(elem_edit);
        elem_edit.focus();
    }
}