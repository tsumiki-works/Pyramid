import { PyramidEngine } from "./pyramid_engine.js";
import { MenuManager } from "../menu/menu.js";

export class PyramidTutorial extends PyramidEngine {
    // ![TODO]

    /* Contents Images

    [Docs]
    [] Title: Texts

    [Check box]
    [] problem1
    [] problem2
    [] problem3

    [Buttons]

    <previous Problem> <Reload? Re-solve> <next Problem>

    */
    private static doc_size = document.body.offsetWidth * 0.3 - MenuManager.getInstance().get_width() * 0.5;

    private doc: HTMLDivElement;
    private problem_number: number;
    private checker: Function[];
    private problems: Map<string, Function>;
    private menu_contents: Map<MenuTabContent, MenuContent[]>;

    private previous_problem;
    private next_problem;

    constructor(_no: number, _checker: Function[], _menu_contents: Map<MenuTabContent, MenuContent[]>){
        super();
        this.problem_number = _no;
        this.checker = _checker;
        this.menu_contents = _menu_contents;
        this.init_menu();
    }

    protected override init_menu(): void {
        for(const key of this.menu_contents.keys()){
            MenuManager.getInstance().add_menu_contents(key, this.menu_contents.get(key));
        }
        let first_tab = this.menu_contents.keys().next().value;
        MenuManager.getInstance().enable_tab(first_tab.label);
    }
}