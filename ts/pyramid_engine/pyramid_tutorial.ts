import { PyramidEngine } from "./pyramid_engine.js";
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

    private previous_problem;
    private next_problem;

    constructor(_no: number, _checker: Function[]) {
        super(_no);
        this.problem_number = _no;
        this.checker = _checker;

        this.doc = document.getElementById("tutorial-div");

        this.init_tutorial_doc();
    }

    private init_tutorial_doc(): void {
        let tutorial_reader = new PyramidTutorialReader(this.problem_number);
        tutorial_reader.debug();

        // Title
        document.getElementById("tutorial-index").innerText = tutorial_reader.get_title();


        // Checks
        let checks: { head: string, captions: string[] }[] = tutorial_reader.get_check_texts();
        for (const check of checks) {
            this.doc.appendChild(this.get_check_elem(check.head, check.captions));
        }

        document.getElementById("tutorial-container").appendChild(this.set_button_area(this.problem_number));

        /*
        // Body
        document.getElementById("tutorial-body").innerHTML = tutorial_reader.get_body();
        */
    }
    private set_button_area(page_number: number): HTMLElement {
        let elem = document.createElement("dev");
        elem.setAttribute("class", "flex justify-center items-center");
        if (page_number != 1) {
            let a1 = document.createElement("a");
            a1.setAttribute("class", "mx-1 my-2");
            a1.setAttribute("href", "?q=" + (page_number-1));
            let button1 = document.createElement("button");
            button1.innerText = "前の問題";
            button1.setAttribute("class", "bg-sky-600 py-1 px-2 text-white hover:bg-sky-500 rounded");
            a1.appendChild(button1);
            elem.appendChild(a1);
        }
        let a2 = document.createElement("a");
        a2.setAttribute("href", "?q=" + page_number);
        a2.setAttribute("class", "mx-1 my-2");
        let button2 = document.createElement("button");
        button2.setAttribute("class", "bg-cyan-600 py-1 px-2 text-white text-sm hover:bg-cyan-500 rounded");
        button2.innerText = "解き直す";
        a2.appendChild(button2);
        elem.appendChild(a2);
        let a3 = document.createElement("a");
        a3.setAttribute("href", "?q=" + (page_number + 1));
        a3.setAttribute("class", "mx-1 my-2");
        let button3 = document.createElement("button");
        button3.setAttribute("class", "bg-sky-600 py-1 px-2 text-white hover:bg-sky-500 rounded");
        button3.innerText = "次の問題";
        a3.appendChild(button3);
        elem.appendChild(a3);
        return elem;

    }
    private get_checkmark_icon(): HTMLElement {
        //! TODO: Form this Elem or Use CheckBox(disabled)
        let elem = document.createElement("i");
        elem.setAttribute("class", "fa-solid fa-check ml-2 text-red-500");
        return elem;
    }
    private get_check_elem(check_text: string, check_disp: string[]): HTMLElement {
        //! TODO: Form this Elem for tutorial check contents
        let elem = document.createElement("section");
        elem.classList.add("mt-3");
        let h3 = document.createElement("h3");
        h3.classList.add("text-slate-800", "inline-flex", "items-center", "text-lg");
        h3.innerText = check_text;
        h3.appendChild(this.get_checkmark_icon());
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