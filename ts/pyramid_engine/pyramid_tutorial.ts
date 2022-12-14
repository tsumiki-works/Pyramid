import { PyramidEngine } from "./pyramid_engine.js";
import { MenuManager } from "../menu/menu.js";
import { PyramidTutorialReader } from "./pyramid_tutorial_reader.js";

export class PyramidTutorial extends PyramidEngine {
    //! TODO: Tutorial-Image

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
    private doc: HTMLElement;
    private problem_number: number;
    private checker: Function[];
    private problems: Map<string, Function>;
    private menu_contents: Map<MenuTabContent, MenuContent[]>;

    private previous_problem;
    private next_problem;

    constructor(_no: number, _checker: Function[], _menu_contents: Map<MenuTabContent, MenuContent[]>) {
        super();
        this.problem_number = _no;
        this.checker = _checker;
        this.menu_contents = _menu_contents;

        this.doc = document.getElementById("tutorial-div");

        this.init_menu();
        this.init_tutorial_doc();
    }

    protected override init_menu(): void {
        for (const key of this.menu_contents.keys()) {
            MenuManager.getInstance().add_menu_contents(key, this.menu_contents.get(key));
        }
        let first_tab = this.menu_contents.keys().next().value;
        MenuManager.getInstance().enable_tab(first_tab.label);
    }

    private init_tutorial_doc(): void {
        let tutorial_reader = new PyramidTutorialReader(this.problem_number);
        tutorial_reader.debug();
        
        // Title
        document.getElementById("tutorial-index").innerText = tutorial_reader.get_title();

        
        // Checks
        let checks: {head: string, captions: string[]}[] = tutorial_reader.get_check_texts();
        for(const check of checks){
            this.doc.appendChild(this.get_check_elem(check.head, check.captions));
        }

        /*
        // Body
        document.getElementById("tutorial-body").innerHTML = tutorial_reader.get_body();
        */
    }

    private get_checkmark_svg(): HTMLElement {
        //! TODO: Form this Elem or Use CheckBox(disabled)
        let elem = document.createElement("svg");
        elem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        elem.setAttribute("fill", "#EF454A");
        elem.setAttribute("viewBox", "0 0 512 512");
        elem.setAttribute("class", "h-6 m-1");
        elem.innerHTML = "<!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->"
        let path = document.createElement("path");
        path.setAttribute("d", "M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z");
        elem.appendChild(path);
        return elem;
    }
    private get_check_elem(check_text: string, check_disp: string[]): HTMLElement {
        //! TODO: Form this Elem for tutorial check contents
        let elem = document.createElement("section");
        elem.classList.add("mt-3", "ml-1");
        let h3 = document.createElement("h3");
        h3.classList.add("inline-flex", "items-center", "text-lg");
        h3.innerText = check_text;
        h3.appendChild(this.get_checkmark_svg());
        elem.appendChild(h3);
        for (const disp of check_disp) {
            let p = document.createElement("p");
            p.classList.add("text-slate-700");
            p.innerText = disp;
            p.innerText = p.innerText.slice(0, p.innerText.length);
            elem.appendChild(p);
        }
        return elem;
    }
}