import { MenuBlock } from "./menu_block.js";
import { MenuTab } from "./menu_tab.js";

export class MenuManager {
    private static instance: MenuManager = null;

    private menu: HTMLDivElement;
    private menu_tab: HTMLDivElement;
    private menu_items: HTMLDivElement;

    private menu_content_tab: Map<string, MenuTab>;
    private menu_contents: Map<string, MenuBlock[]>;

    private mousedown_listener: EventListener;

    private constructor() {
        this.menu = document.getElementById("menu") as HTMLDivElement;
        this.menu_tab = document.getElementById("menu-tab") as HTMLDivElement;
        this.menu_items = document.getElementById("menu-items") as HTMLDivElement;

        //this.menu.style.top = document.getElementById("logo-wrapper").offsetHeight + "px";
        this.menu_contents = new Map<string, MenuBlock[]>();
        this.menu_content_tab = new Map<string, MenuTab>();
    }

    static getInstance(): MenuManager {
        if (MenuManager.instance == null) {
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

    add_menu_contents(menu_tab: MenuTabContent, menu_content: MenuContent[]): void {
        let tmp_menu_contents: MenuBlock[] = new Array<MenuBlock>();
        // Constraction Menu-Items
        for (const mc of menu_content) {
            let tmp_menublock: MenuBlock = new MenuBlock(
                this.menu_items.offsetWidth * 0.5 - MenuBlock.UNIT_WIDTH * 0.5,
                tmp_menu_contents.length * MenuBlock.UNIT_HEIGHT * 1.2 + MenuBlock.UNIT_HEIGHT * 0.3,
                mc.color,
                mc.text,
                mc.block_constructor,
            );
            this.menu_items.appendChild(tmp_menublock);
            tmp_menu_contents.push(tmp_menublock);
        }
        this.menu_contents.set(menu_tab.label, tmp_menu_contents);

        // Constraction Menu-Tab
        let tmp_menu_tab: MenuTab = new MenuTab(
            this.menu_tab.offsetWidth * 0.5 - MenuTab.TAB_WIDTH * 0.5,
            this.menu_content_tab.size * MenuBlock.UNIT_HEIGHT * 1.2 + MenuBlock.UNIT_HEIGHT * 0.3,
            menu_tab.color,
            menu_tab.label,
        );
        tmp_menu_tab.addEventListener("mousedown", (e: MouseEvent) => this.enable_tab(menu_tab.label));
        this.menu_tab.appendChild(tmp_menu_tab);
        this.menu_content_tab.set(menu_tab.label, tmp_menu_tab);


    }

    enable_tab(_label: string): void {
        if (!this.menu_contents.has(_label)) {
            alert("Pyramid frontend error: Failed to enable tab of ` " + _label + " `");
            return;
        }
        this.menu_contents.forEach((menuContents, lbl) => {
            if (lbl == _label) {
                for (const mc of menuContents) {
                    mc.style.display = "flex";
                }
            } else {
                for (const mc of menuContents) {
                    mc.style.display = "none";
                }
            }
        });
    }

    clear(): void {
        this.menu_contents.clear();
    }
}
