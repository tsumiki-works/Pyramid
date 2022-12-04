import { Block } from "../block/block.js";
import { MenuBlock } from "./menu_block.js";

export class MenuManager {
    private static instance: MenuManager = null;

    private menu: HTMLDivElement;
    private menu_blocks: MenuBlock[];

    private mousedown_listener: EventListener;

    private constructor() {
        this.menu = document.getElementById("menu") as HTMLDivElement;
        this.menu_blocks = new Array<MenuBlock>();
        this.mousedown_listener = (e: MouseEvent) => this.event_mousedown(e);
        this.menu.addEventListener("mousedown", this.mousedown_listener);
    }
    
    static getInstance(): MenuManager {
        if(MenuManager.instance == null){
            MenuManager.instance = new MenuManager();
        }
        return MenuManager.instance;
    }

    get_width(): number {
        return this.menu.offsetWidth;
    }

    private event_mousedown(_: MouseEvent): void {
        //! [TODO]
        //! debug
        /*document.getElementById("blocks").appendChild(new FunBlock(window.innerWidth * 0.5, window.innerHeight * 0.5, "+", { args_cnt: 2, return_type: { type_id: PyramidTypeID.I32, attribute: null } }));
        document.getElementById("blocks").appendChild(new AtomBlock(window.innerWidth * 0.5 + 100, window.innerHeight * 0.5 + 100, "12", PyramidTypeID.I32));
        document.getElementById("blocks").appendChild(new AtomBlock(window.innerWidth * 0.5 + 200, window.innerHeight * 0.5 + 200, "3", PyramidTypeID.I32));
        */
    }       

    add_menu_content(color: string, text: string, block_constructor: Function): void {
        let tmp_menublock: MenuBlock = new MenuBlock(
            this.menu.offsetWidth * 0.5 - MenuBlock.UNIT_WIDTH * 0.5, 
            (this.menu_blocks.length + 1) * MenuBlock.UNIT_HEIGHT * 1.2 - (MenuBlock.UNIT_HEIGHT * 0.2), 
            color, 
            text,
            block_constructor,
        );
        this.menu.appendChild(tmp_menublock);
        this.menu_blocks.push(tmp_menublock);
    }

    
    static add_menu_tab(): void {
        //! [TODO]
    }
}