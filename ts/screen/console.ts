import { Pyramid } from "../main.js";
import { Translation } from "../lib/translation.js";
import { BlockManager } from "../block/block_manager.js";

import { Vec3 } from "../webgl/math.js";

export class ConsoleManager {
    private console_div: HTMLDivElement = document.getElementById("console") as HTMLDivElement;
    private content: HTMLDivElement = document.getElementById("console-content") as HTMLDivElement;
    private console_log: HTMLLabelElement = document.getElementById("console-log") as HTMLLabelElement;
    private canvas: HTMLCanvasElement;
    private view: Vec3;
    private render: Function;
    private blockManager: BlockManager;

    /**
    * A function to initialize console.
    */
    constructor(_canvas: HTMLCanvasElement, _view: Vec3, _render: Function, _blockManager: BlockManager) {
        this.canvas = _canvas;
        this.view = _view;
        this.render = _render;
        this.blockManager = _blockManager;
        this.console_div.addEventListener("click", this.fun_click_console);
        this.console_div.addEventListener("keydown", this.fun_keydown_console);
        const observer = new MutationObserver(() => this.render());
        const options = {
            attriblutes: true,
            attributeFilter: ["style"]
        };
        observer.observe(this.console_div, options);
        const line = document.getElementById("console-line");
        line.addEventListener("keydown", this.fun_prevent_enter_console_line);
        line.focus();
    }
    init_console() {
        this.console_div.addEventListener("click", this.fun_click_console);
        this.console_div.addEventListener("keydown", this.fun_keydown_console);
        const observer = new MutationObserver(() => this.render());
        const options = {
            attriblutes: true,
            attributeFilter: ["style"]
        };
        observer.observe(this.console_div, options);
        const line = document.getElementById("console-line");
        line.addEventListener("keydown", this.fun_prevent_enter_console_line);
        line.focus();
    }
    /**
     * A function to get console element's height.
     * @return {float} the offfset height of console element.
     */
    get_console_height(): number {
        return this.console_div.offsetHeight;
    }
    /**
     * An event handler for console.onclick.
     * Wherever you click on console, you're focused on console line.
     */
    private fun_click_console(_: Event): void {
        document.getElementById("console-line").focus();
    }
    /**
     * An event handler for console.onkeydown.
     * Detecting enter hit and run command inputed.
     */
    private async fun_keydown_console(event: KeyboardEvent): Promise<void> {
        if (event.key == "Enter") {
            await this.run_command(document.getElementById("console-line").innerText);
            this.render();
        }
    }
    /**
     * An event handler for console-line.onkeydown.
     * It prevents enter and make a newline in console-line.
     */
    private fun_prevent_enter_console_line(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            return event.preventDefault();
        }
    }
    /**
     * A function to send calculation request to backend server.
     * @param {string} stree like (+ (+ 1 2) 3)
     * @param {string} out_type console, 
     */
    private async send_calc_request_to_server(defines: string[], stree: string, out_type: string): Promise<Response>{
        const res: Response = await fetch("http://127.0.0.1:7878", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "defines": defines,
                "stree": stree,
                "out_type": out_type,
            }),
        })
        .catch(err => {alert(err); return err})
        .then(data => { return data.json(); });
        
        return res;
    }
    /**
     * A function to run command.
     * @param {string} command
     */
    async run_command(command): Promise<void> {
        const words = command.trim().split(/\s+/);
        console.log(words[0]);
        let res = "";
        switch (words[0]) {
            case "":
                break;
            case "generate":
                if (words.length == 1) {
                    const pos_world = Translation.convert_2dscreen_to_3dworld(this.canvas.width, this.canvas.height, this.view, [400, 200]);
                    this.blockManager.get_roots().push(BlockManager.create_block(pos_world[0], pos_world[1], 0, "0"));
                    res = "generated at (400, 200) on screen";
                } else if (words.length == 4) {
                    const x = parseInt(words[1]);
                    const y = parseInt(words[2]);
                    const type = parseInt(words[3]);
                    if (isNaN(x)) {
                        res = ConsoleManager.exception_message("x is not integer.");
                    } else if (isNaN(y)) {
                        res = ConsoleManager.exception_message("y is not integer.");
                    } else if (isNaN(type)) {
                        res = ConsoleManager.exception_message("type is not integer.");
                    } else {
                        const pos_world = Translation.convert_2dscreen_to_3dworld(this.canvas.width, this.canvas.height, this.view, [x, y]);
                        this.blockManager.get_roots().push(BlockManager.create_block(pos_world[0], pos_world[1], type, "0"));
                        res = "generated at (" + x + ", " + y + ") in screen";
                    }
                } else {
                    res = ConsoleManager.exception_message("'generate' has to have 0 or 3 parameters.");
                }
                break;
            case "eval":
                let stree = "";
                if (words.length > 1) {
                    let tmp = words;
                    tmp.shift();
                    stree = tmp.join(" ");
                    const response = await this.send_calc_request_to_server(["(define int add (x y) (+ x y))", "(define int hoge () 1)"], stree, "console");
                    res = ConsoleManager.maybe_backend_error_message(response["result"]);
                } else {
                    res = ConsoleManager.exception_message("'eval' has to have 1 parameter.")
                }
                break;
            default:
                res = ConsoleManager.exception_message("invalid command '" + words[0] + "'.");
                break;
        }
        this.start_newline(res);
    }
    static replace_escape(message: string): string {
        let message1: string = message.replaceAll("<", "&lt;");
        let message2: string = message1.replaceAll(">", "&gt;");
        return message2;
    }
    static exception_message(message: string): string {
        return "<span class=\"exception\">pyramid frontend exception:</span> " + ConsoleManager.replace_escape(message);
    }
    static maybe_backend_error_message(message): string {
        if (message.length > 22 && message.slice(0, 22) == "pyramid backend error:") {
            return "<span class=\"exception\">pyramid backend error:</span> " + ConsoleManager.replace_escape(message.slice(22));
        } else {
            return message;
        }
    }
    /**
     * A function to start new line.
     * @param {string} log if it's "" then nothing will be printed.
     */
    start_newline(log): void {
        const prev_line: HTMLLabelElement = document.getElementById("console-line") as HTMLLabelElement;
        const prev_line_head: HTMLLabelElement = document.getElementById("console-line-head") as HTMLLabelElement;
        const line_head: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const new_line: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        prev_line.removeEventListener("keydown", this.fun_prevent_enter_console_line);
        prev_line.contentEditable = "false";
        prev_line.id = "";
        prev_line_head.id = "";
        line_head.innerText = "# ";
        line_head.id = "console-line-head";
        new_line.contentEditable = "true";
        new_line.id = "console-line";
        this.console_log.innerHTML += "# " + prev_line.innerText + "<br>";
        this.content.removeChild(prev_line);
        this.content.removeChild(prev_line_head);
        if (log.length != 0) {
            this.console_log.innerHTML += log + "<br>";
        }
        this.content.appendChild(line_head);
        this.content.appendChild(new_line);
        new_line.focus();
        new_line.addEventListener("keydown", this.fun_prevent_enter_console_line);
    }
}