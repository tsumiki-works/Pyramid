import { ConsoleManager } from "../screen/console.js";
import { Vec3, Vec4 } from "../webgl/math.js";
import { Request } from "../webgl/request.js";

export class Block {

    /* ============================================================================================================= */
    /*     Constants                                                                                                 */
    /* ============================================================================================================= */

    static readonly UNIT_WIDTH = 1.0;
    static readonly UNIT_HALF_WIDTH = 0.5;
    static readonly UNIT_HEIGHT = 0.5;
    static readonly UNIT_HALF_HEIGHT = 0.25;
    static convert_type_to_children_num(type: number): number {
        switch (type) {
            case 0: return 0;
            case 1: return 2;
            case 2: return 2;
            case 3: return 2;
            case 4: return 2;
            case 5: return 2;
            default: return 0;
        }
    }
    static convert_type_to_color(type: number): Vec4 {
        switch (type) {
            case 0: return [0.15, 0.75, 0.75, 1.0];
            case 1: return [0.15, 0.8, 0.2, 1.0];
            case 2: return [0.15, 0.2, 0.8, 1.0];
            case 3: return [0.35, 0.75, 0.35, 1.0];
            case 4: return [0.2, 0.6, 0.6, 1.0];
            default: return [0.0, 0.0, 0.0, 1.0];
        }
    }
    static create_empty_block(): Block {
        return new Block(0, 0, -1, "");
    }

    /* ============================================================================================================= */
    /*     Block                                                                                                     */
    /* ============================================================================================================= */

    parent: Block | null;
    children: Block[];
    x: number;
    y: number;
    width: number;
    private type: number;
    private content: string;
    private leftmost: number;
    private rightmost: number;

    constructor(_x: number, _y: number, _type: number, _content: string){
        this.parent = null;
        this.children = new Array<Block>(Block.convert_type_to_children_num(_type));
        for(let i = 0; i < this.children.length; i++) {
            this.children[i] = new Block(0, 0, -1, "");
        }
        this.x = _x;
        this.y = _y;
        this.width = Math.max(this.children.length * Block.UNIT_WIDTH, Block.UNIT_WIDTH),
        this.type = _type;
        this.content = _content;
        this.leftmost = -Block.UNIT_HALF_WIDTH;
        this.rightmost = Block.UNIT_HALF_WIDTH;
    }

    is_empty(): boolean {
        return this.type == -1;
    }

    enumerate(): string {
        let res = "";
        if (this.children.length == 0) {
            res += this.content;
        } else {
            res += "(";
            res += this.content;
            this.children.forEach(child => {
                res += " ";
                res += child.enumerate();
            });
            res += ")";
        }
        return res;
    }

    push_requests(view: Vec3, requests: Request[]): void {
        if (this.is_empty()) {
            return;
        }
        requests.push(this.create_request(view));
        for (const child of this.children) {
            if (child === null || child.is_empty()) {
                continue;
            }
            child.push_requests(view, requests);
        }
    }

    private create_request(view: Vec3): Request {
        return {
            trans: [this.x, this.y, 0.0],
            scale: [this.width, Block.UNIT_HEIGHT, 1.0],
            view: view,
            base_color: Block.convert_type_to_color(this.type),
            uv_offset: [0.0, 0.0, 0.0, 0.0],
            texture: null,
            is_ui: false,
        };
    }

    /* ============================================================================================================= */
    /*     Arrangement                                                                                               */
    /* ============================================================================================================= */

    arrange(): void {
        const x = this.x;
        const y = this.y;
        this.determine_width();
        this.determine_pos(x, y);
    }

    private determine_width() {
        if (this.is_empty() || this.children.length == 0) {
            this.x = 0.0;
            this.width = Block.UNIT_WIDTH;
            this.leftmost = -Block.UNIT_WIDTH * 0.5;
            this.rightmost = Block.UNIT_WIDTH * 0.5;
            return;
        }
        if (this.children.length == 1) {
            this.children[0].determine_width();
            this.x = this.children[0].x;
            this.width = Block.UNIT_WIDTH;
            this.leftmost = this.children[0].leftmost;
            this.rightmost = this.children[0].rightmost;
            return;
        }
        this.width = 1.0;
        this.leftmost = 0.0;
        this.rightmost = 0.0;
        let i = 0;
        for (const child of this.children) {
            child.determine_width();
            this.leftmost += child.leftmost;
            this.rightmost += child.rightmost;
            if (i == 0) {
                this.width += child.rightmost - child.x - child.width * 0.5;
            } else if (i == this.children.length - 1) {
                this.width += child.x - child.width * 0.5 - child.leftmost;
            } else {
                this.width += child.rightmost - child.leftmost;
            }
            i += 1;
        }
        this.x = this.leftmost
            + (this.children[0].x - this.children[0].leftmost)
            + (this.children[0].width * 0.5 - 0.5)
            + this.width * 0.5;
    }

    private determine_pos(x: number, y: number) {
        const center: number = x - this.x;
        this.x = x;
        this.y = y;
        let offset: number = center + this.leftmost;
        for (const child of this.children) {
            const child_area = (child.rightmost - child.leftmost);
            child.determine_pos(offset + child_area * 0.5 + child.x, y - Block.UNIT_HEIGHT);
            offset += child_area;
        }
    }

    /* ============================================================================================================= */
    /*     Popup                                                                                                     */
    /* ============================================================================================================= */

    clicked(event_page_x: number, event_page_y: number, console_manager: ConsoleManager) {
        const popup_ = document.getElementById("popup-menu");
        if (popup_ !== null) {
            document.body.removeChild(popup_);
        }
        const popup = document.createElement("div");
        popup.id = "popup-menu";
        popup.style.display = "block";
        popup.style.left = event_page_x + "px";
        popup.style.top = event_page_y + "px";
        const ul = document.createElement("ul");
        let lis = [];
        switch (this.type) {
            case 0:
                const li_edit = document.createElement("li");
                li_edit.classList.add("popup-menu-item");
                li_edit.innerText = "編集";
                li_edit.onclick = (e => {
                    this.remove_popup();
                    this.event_popup_edit(event_page_x, event_page_y, console_manager);
                });
                lis.push(li_edit);
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                const li_exe = document.createElement("li");
                li_exe.classList.add("popup-menu-item");
                li_exe.innerText = "実行";
                li_exe.onclick = (e => {
                    this.remove_popup();
                    console_manager.run_command("eval " + this.enumerate());
                });
                lis.push(li_exe);
                break;
            default:
                throw new Error("Pyramid Frontend error: the block type is not considered in `window.js`");
        }
        for (const li of lis) {
            ul.appendChild(li);
        }
        popup.appendChild(ul);
        document.body.appendChild(popup);
    }

    private remove_popup() {
        const popup = document.getElementById("popup-menu");
        if (popup !== null) {
            document.body.removeChild(popup);
        }
    }

    private event_popup_edit(event_page_x, event_page_y, console_manager) {
        const popup = document.createElement("div");
        popup.id = "popup-menu";
        popup.style.display = "block";
        popup.style.left = event_page_x + "px";
        popup.style.top = event_page_y + "px";
        document.body.appendChild(popup);
        const input = document.createElement("input");
        input.id = "popup-menu-edit";
        input.style.width = "100px";
        input.style.height = "30px";
        input.contentEditable = "true";
        input.addEventListener("keydown", (e => {
            if(e.key == "Enter"){
                if(!Number.isNaN(Number(input.value))){
                    this.content = input.value;
                    //! [TODO] render
                }else{
                    console_manager.start_newline(ConsoleManager.exception_message("This block's value must be integer."));
                }
                this.remove_popup();
            }
        }));
        popup.appendChild(input);
        input.focus();
    }
}