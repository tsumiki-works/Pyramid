import { Block } from "../block/block.js";
import { TutorialDatabase } from "./tutorial_database.js";
import { MenuManager } from "../menu/menu.js";

export abstract class PyramidEngine {

    protected workspace: HTMLDivElement;
    protected menu_contents: Map<MenuTabContent, MenuContent[]>;

    protected mousedown_listener: EventListener;
    protected mousemove_listener: EventListener;
    protected mouseup_listener: EventListener;

    constructor(menu_num: number){
        this.workspace = document.getElementById("workspace") as HTMLDivElement;
        this.init(menu_num);
    }
    protected init(menu_num: number): void {
        this.init_events();
        this.init_menu(menu_num);
    };
    protected init_events() {
        this.mousedown_listener = (e: MouseEvent) => this.event_mousedown(e);
        this.mousemove_listener = (e: MouseEvent) => this.event_mousemove(e);
        this.mouseup_listener = (e: MouseEvent) => this.event_mouseup(e);
        this.workspace.addEventListener("mousedown", this.mousedown_listener);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
                const trashs = Array.from(document.getElementById("trash").children) as Array<Block>;
                if (trashs.length === 0) {
                    return;
                }
                const block = trashs[trashs.length - 1];
                block.classList.remove("pyramid-block-disable");
                block.classList.add("pyramid-block");
                document.getElementById("trash").removeChild(block);
                document.getElementById("blocks").appendChild(block);
                block.style.left = "400px";
                block.style.top = "200px";
                block.get_root().format();
            }
        });
    }

    protected event_mousedown(e: MouseEvent) {
        this.workspace.removeEventListener("mousedown", this.mousedown_listener);
        document.addEventListener("mousemove", this.mousemove_listener);
        document.addEventListener("mouseup", this.mouseup_listener);
    }

    protected event_mouseup(_: MouseEvent) {
        document.removeEventListener("mousemove", this.mousemove_listener);
        document.removeEventListener("mouseup", this.mouseup_listener);
        this.workspace.addEventListener("mousedown", this.mousedown_listener);
    }

    protected event_mousemove(_: MouseEvent) { }

    protected init_menu(menu_num: number){
        this.menu_contents = TutorialDatabase.get_menu_contents(menu_num);
        for (const key of this.menu_contents.keys()) {
            MenuManager.getInstance().add_menu_contents(key, this.menu_contents.get(key));
        }
        let first_tab = this.menu_contents.keys().next().value;
        MenuManager.getInstance().enable_tab(first_tab.label);
    }
}