import { PyramidEngine } from "./pyramid_engine.js";
import { Popup } from "../popup.js";
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
    private menu_contents: PyramidMenuContent[];

    private previous_problem;
    private next_problem;

    constructor(_no: number, _checker: Function[], _menu_contents: PyramidMenuContent[]){
        super();
        this.problem_number = _no;
        this.checker = _checker;
        this.menu_contents = _menu_contents;
        this.format_elements();
    }
    protected override init(): void {
        this.init_doc();
    }

    protected override init_menu(): void {
        for(const mc of this.menu_contents){
            //MenuManager.getInstance().add_menu_contents(mc);
        }
    }
    private init_doc(): void {
        this.doc = document.createElement("div");
        document.body.appendChild(this.doc);
    }
    private format_elements(): void {
        // initialize elements
        this.doc.id = "tutorial-doc";
        this.doc.style.width = PyramidTutorial.doc_size + "px";
        this.doc.style.top = document.getElementById("logo-wrapper").offsetHeight + "px";
        MenuManager.getInstance().set_left(PyramidTutorial.doc_size);
        document.getElementById("console").style.width = (document.body.offsetWidth - MenuManager.getInstance().get_width() - PyramidTutorial.doc_size) + "px";
        
        // Construct tutorial
        // ![TODO] place tutorial contents
        
        // debug
    }
}