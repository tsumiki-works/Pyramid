import { MenuBlock } from "./menu_block.js";

export class MenuManager {
    private static instance: MenuManager = null;

    private menu: HTMLDivElement;
    private menu_blocks: MenuBlock[];

    private mousedown_listener: EventListener;

    private constructor() {
        this.menu = document.getElementById("menu") as HTMLDivElement;
        this.menu.style.top = document.getElementById("logo-wrapper").offsetHeight + "px";
        this.menu_blocks = new Array<MenuBlock>();
    }
    
    static getInstance(): MenuManager {
        if(MenuManager.instance == null){
            MenuManager.instance = new MenuManager();
        }
        return MenuManager.instance;
    }
    set_left(left: number): void {
        this.menu.style.left = left + "px";
    }

    get_width(): number {
        return this.menu.offsetWidth;
    }    

    add_menu_content(menu_content: PyramidMenuContent): void {
        let tmp_menublock: MenuBlock = new MenuBlock(
            this.menu.offsetWidth * 0.5 - MenuBlock.UNIT_WIDTH * 0.5, 
            this.menu_blocks.length * MenuBlock.UNIT_HEIGHT * 1.2 + MenuBlock.UNIT_HEIGHT * 0.5, 
            menu_content.color, 
            menu_content.text,
            menu_content.block_constructor,
        );
        this.menu.appendChild(tmp_menublock);
        this.menu_blocks.push(tmp_menublock);
    }

    
    add_menu_tab(): void {
        //! [TODO]
    }

    clear(): void {
        for(const mb of this.menu_blocks){
            mb.remove();
        }
        this.menu_blocks.splice(0);
    }
}
