import { PyramidEngine } from "./pyramid_engine.js";
import { PyramidTutorialReader } from "./pyramid_tutorial_reader.js";
import { TutorialChecker } from "./tutorial_checker.js";

type CheckEvent = {
    event: string,
    check_func: Function,
}

export class PyramidTutorial extends PyramidEngine {
    private doc: HTMLElement;
    private problem_number: number;
    private checker: CheckEvent[];
    private checker_listeners: EventListener[];

    constructor(_no: number) {
        super(_no);
        this.problem_number = _no;
        this.checker = TutorialChecker.get_checker(_no);
        this.checker_listeners = new Array<EventListener>();

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
        let idx = 0;
        for (const check of checks) {
            this.doc.appendChild(this.get_check_elem(check.head, check.captions, this.checker[idx]));
            idx++;
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
            a1.setAttribute("href", "?q=" + (page_number - 1));
            let button1 = document.createElement("button");
            button1.innerText = "前の問題";
            button1.setAttribute("class", "bg-sky-600 py-1 px-2 text-white hover:bg-sky-500 rounded");
            a1.appendChild(button1);
            elem.appendChild(a1);
        }
            else {
            let a1 = document.createElement("div");
            a1.setAttribute("class", "mx-1 my-2");
            let button1 = document.createElement("button");
            button1.innerText = "前の問題";
            button1.setAttribute("class", "py-1 px-2 rounded invisible");
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
        if (page_number != 9) {
            let a3 = document.createElement("a");
            a3.setAttribute("href", "?q=" + (page_number + 1));
            a3.setAttribute("class", "mx-1 my-2");
            let button3 = document.createElement("button");
            button3.setAttribute("class", "bg-sky-600 py-1 px-2 text-white hover:bg-sky-500 rounded");
            button3.innerText = "次の問題";
            a3.appendChild(button3);
            elem.appendChild(a3);
        }
        else {
            let a3 = document.createElement("div");
            a3.setAttribute("class", "mx-1 my-2");
            let button3 = document.createElement("button");
            button3.setAttribute("class", "py-1 px-2 rounded invisible");
            button3.innerText = "次の問題";
            a3.appendChild(button3);
            elem.appendChild(a3);
        }
        return elem;
    }
    private get_checkmark_icon(check_event: CheckEvent): HTMLElement {
        //! TODO: Form this Elem or Use CheckBox(disabled)
        let elem = document.createElement("span");
        elem.setAttribute("class", "fa-solid fa-check ml-2 text-gray-300");
        // IF ENABLE, text-red-600
        let listener_event = (e => {
            if(check_event.check_func() == true && elem.classList.contains("text-gray-300")){
                elem.classList.replace("text-gray-300", "text-red-600");
            }
        });
        document.addEventListener(check_event.event, listener_event);
        return elem;
    }
    private get_check_elem(check_text: string, check_disp: string[], check_event: CheckEvent): HTMLElement {
        //! TODO: Form this Elem for tutorial check contents
        let elem = document.createElement("section");
        elem.classList.add("mt-3");
        let h3 = document.createElement("h3");
        h3.classList.add("text-slate-800", "inline-flex", "items-center", "text-lg");
        h3.innerText = check_text;
        h3.appendChild(this.get_checkmark_icon(check_event));
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