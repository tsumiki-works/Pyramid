import { Evaluator } from "./evaluator/evaluator.js";
import { ImageTexture } from "./webgl/image_texture.js";
import { WebGL } from "./webgl/webgl.js";
import { Vec3, Vec4 } from "./webgl/math.js";

import { Block } from "./block/block.js";
import { Translation } from "./lib/translation.js";
import { CanvasItem } from "./screen/canvas_items.js";
import { Menu } from "./screen/menu.js";
import { Pager } from "./screen/pager.js";
import { WorkspaceMover } from "./workspace_mover.js";
import { BlockManager } from "./block/block_manager.js";

export class Pyramid {

    private canvas: HTMLCanvasElement;
    private webgl: WebGL;
    private tex01: ImageTexture;
    private tex_font: ImageTexture;
    private tex_trashbox: ImageTexture;

    private canvas_items: CanvasItem[];
    private menu: Menu;

    private view: Vec3 = [0.0, 0.0, -5.0];

    private block_manager: BlockManager;

    /* ============================================================================================================= */
    /*     Constants                                                                                                 */
    /* ============================================================================================================= */

    static readonly LOGO_WIDTH: number = 191.95;
    static readonly LOGO_HEIGHT: number = 32.0;
    static readonly MENU_WIDTH: number = 190.0;
    static readonly HEADER_HEIGHT: number = this.LOGO_HEIGHT + 18.0;
    static readonly TRASHBOX_WIDTH: number = 128.0;
    static readonly TRASHBOX_HEIGHT: number = 179.2;

    constructor() {
        this.canvas = document.getElementById("workspace") as HTMLCanvasElement;
        this.webgl = new WebGL(this.canvas);
        this.tex01 = this.webgl.create_image_texture(document.getElementById("tex01") as HTMLImageElement);
        this.tex_font = this.webgl.create_image_texture(document.getElementById("tex_font") as HTMLImageElement);
        this.tex_trashbox = this.webgl.create_image_texture(document.getElementById("tex_trashbox") as HTMLImageElement);
        this.canvas_items = new Array<CanvasItem>();
        this.menu = new Menu();
        this.block_manager = new BlockManager();
        // set up
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.init_events();
        this.init_canvas_items();
        this.init_terminal();
        // finish
        if (this.canvas.clientWidth < 600 || this.canvas.clientHeight < 600) {
            alert("pyramid frontend warning: too small window size to use Pyramid comfortably.");
        }
        this.render();
    }

    render(): void {
        const req_for_setting_view = {
            trans: [0, 0, 0],
            scale: [0, 0, 0],
            view: this.view,
            base_color: [0, 0, 0, 0],
            uv_offset: [0, 0, 0, 0],
            texture: null,
            is_ui: false,
        };
        let requests = [];
        requests.push(req_for_setting_view);
        this.block_manager.push_roots_requests(requests);
        for (const item of this.canvas_items) {
            item.push_requests(this.view, requests);
        }
        
        //this.menu.push_requests(this.view, requests);
        
        //this.requestBuilder.push_request_trashbox(this.open_trashbox, this.consoleManager.get_console_height(), requests);
        requests.push(req_for_setting_view);
        this.block_manager.push_holding_block_requests(requests);
        // finish
        this.webgl.draw_requests(requests, this.canvas.width, this.canvas.height);
    }

    /* ============================================================================================================= */
    /*     Event                                                                                                     */
    /* ============================================================================================================= */

    private mousedown_listener: EventListener;
    private mouseup_listener: EventListener;
    private mousemove_listener: EventListener;

    private init_events() {
        this.mousedown_listener = e => this.event_mousedown(e);
        this.mouseup_listener = e => this.event_mouseup(e);
        this.mousemove_listener = e => this.event_mousemove(e);
        this.canvas.addEventListener("mousedown", this.mousedown_listener);
        window.addEventListener("resize", () => {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.render();
        });
    }

    private event_mousedown(e) {
        this.canvas.removeEventListener("mousedown", this.mousedown_listener);
        this.canvas.addEventListener("mousemove", this.mousemove_listener);
        this.canvas.addEventListener("mouseup", this.mouseup_listener);
        // remove popup if it exists
        const popup = document.getElementById("popup-menu");
        if (popup !== null) {
            document.body.removeChild(popup);
        }
        // do event
        if (e.which == 1) {
            this.fun_left_mousedown(e);
        } else if (e.which == 3) {
            this.fun_right_mousedown(e);
        }
    }

    private fun_left_mousedown(e): void {
        //! [TODO] logo
        if (e.pageX < Pyramid.LOGO_WIDTH + 12 && e.pageY < Pyramid.LOGO_HEIGHT + 18) {
            window.confirm("トップページに戻ると作業内容が失われます。よろしいですか。");
            Pager.goto_toppage();
        }
        //! [TODO] menu
        else if (e.pageX < Pyramid.MENU_WIDTH /* && this.menu.on_left_mousedown(e.pageX, e.pageY, this.console_manager) */) { }
        // roots
        else if (!this.block_manager.on_left_mousedown(this.get_cursor_pos_world(e))) { }
    }

    private fun_right_mousedown(e): void {
        //! [TODO] click right block
        new WorkspaceMover(e.pageX, e.pageY, this.mousedown_listener, this.canvas, this.view);
    }

    private event_mouseup(_) {
        this.canvas.removeEventListener("mouseup", this.mouseup_listener);
        this.canvas.removeEventListener("mousemove", this.mousemove_listener);
        this.canvas.addEventListener("mousedown", this.mousedown_listener);
        this.block_manager.on_mouseup();
        this.render();
    }

    private event_mousemove(e) {
        this.block_manager.on_mousemove(this.get_cursor_pos_world(e));
        this.render();
    }

    private get_cursor_pos_world(e): Vec3 {
        return Translation.convert_2dscreen_to_3dworld(
            this.canvas.width,
            this.canvas.height,
            this.view,
            [e.pageX, e.pageY]
        );
    }

    /* ============================================================================================================= */
    /*     Canvas items                                                                                              */
    /* ============================================================================================================= */

    private init_canvas_items(): void {
        const pos_header: number[] = Translation.convert_2dscreen_to_2dunnormalizedviewport(
            this.canvas.width, this.canvas.height, [this.canvas.width * 0.5, Pyramid.LOGO_HEIGHT * 0.5]
        );
        const header: CanvasItem = new CanvasItem(
            pos_header[0],
            pos_header[1] - 9.0,
            this.canvas.width,
            Pyramid.HEADER_HEIGHT,
            [1., 1., 1., 1.],
            [0., 0., 0., 0.],
            null,
            true,
        );

        const pos_logo: number[] = Translation.convert_2dscreen_to_2dunnormalizedviewport(
            this.canvas.width,
            this.canvas.height,
            [Pyramid.LOGO_WIDTH * 0.5, Pyramid.LOGO_HEIGHT * 0.5]
        );
        const logo: CanvasItem = new CanvasItem(
            pos_logo[0] + 12.0,
            pos_logo[1] - 8.0,
            Pyramid.LOGO_WIDTH,
            Pyramid.LOGO_HEIGHT,
            [1., 1., 1., 1.],
            [1., 0.166, 0., 0.],
            this.tex01,
            true,
        );
        this.canvas_items.push(header);
        this.canvas_items.push(logo);
    }

    /* ============================================================================================================= */
    /*     Pyramid Console                                                                                            */
    /* ============================================================================================================= */

    private console_div: HTMLDivElement = document.getElementById("console") as HTMLDivElement;
    private content: HTMLDivElement = document.getElementById("console-content") as HTMLDivElement;
    private console_log: HTMLLabelElement = document.getElementById("console-log") as HTMLLabelElement;
    private evaluator: Evaluator;

    init_terminal(){
        this.evaluator = new Evaluator();
        // attach events
        this.console_div.addEventListener("click", e => this.fun_click_console(e));
        this.console_div.addEventListener("keydown", e => this.fun_keydown_console(e));
        const observer = new MutationObserver(() => this.render());
        const options = {
            attriblutes: true,
            attributeFilter: ["style"]
        };
        observer.observe(this.console_div, options);
        const line = document.getElementById("console-line");
        line.addEventListener("keydown", e => this.fun_prevent_enter_console_line(e));
        line.focus();
    }
    
    /**
     * A function to get console element's height.
     * @return {float} the offfset height of console element.
     */
    private get_console_height(): number {
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
    private fun_keydown_console(event: KeyboardEvent): void{
        if (event.key == "Enter") {
            this.run_command(document.getElementById("console-line").innerText);
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
    private send_calc_request_to_server(defines: string[], stree: string, out_type: string): void{
        const res = this.evaluator.eval(defines, stree);
        
        return res;
    }
    /**
     * A function to run command.
     * @param {string} command
     */
    private run_command(command: string): void {
        const words: string[] = command.trim().split(/\s+/);
        console.log(words[0]);
        let res = "";
        switch (words[0]) {
            case "":
                break;
            case "generate":
                if (words.length == 1) {
                    const pos_world = Translation.convert_2dscreen_to_3dworld(this.canvas.width, this.canvas.height, this.view, [400, 200]);
                    this.block_manager.push_block_into_roots(new Block(pos_world[0], pos_world[1], 0, "0"));
                    res = "generated at (400, 200) on screen";
                } else if (words.length == 5) {
                    const x = parseInt(words[1]);
                    const y = parseInt(words[2]);
                    const type = parseInt(words[3]);
                    if (isNaN(x)) {
                        res = this.exception_message("x is not integer.");
                    } else if (isNaN(y)) {
                        res = this.exception_message("y is not integer.");
                    } else if (isNaN(type)) {
                        res = this.exception_message("type is not integer.");
                    } else {
                        const pos_world = Translation.convert_2dscreen_to_3dworld(this.canvas.width, this.canvas.height, this.view, [x, y]);
                        this.block_manager.push_block_into_roots(new Block(pos_world[0], pos_world[1], type, words[4]));
                        res = "generated at (" + x + ", " + y + ") in screen";
                    }
                } else {
                    res = this.exception_message("'generate' has to have 0 or 3 parameters.");
                }
                break;
            case "eval":
                let stree = "";
                if (words.length > 1) {
                    let tmp: string[] = words;
                    tmp.shift();
                    stree = tmp.join(" ");
                    let cut_stree: string = stree.substring(1, stree.length - 1);
                    const response = this.send_calc_request_to_server([], cut_stree, "console");
                    res = this.maybe_backend_error_message(response);
                } else {
                    res = this.exception_message("'eval' has to have 1 parameter.")
                }
                break;
            default:
                res = this.exception_message("invalid command '" + words[0] + "'.");
                break;
        }
        this.start_newline(res);
    }
    private replace_escape(message: string): string {
        let message1: string = message.replaceAll("<", "&lt;");
        let message2: string = message1.replaceAll(">", "&gt;");
        return message2;
    }
    private exception_message(message: string): string {
        return "<span class=\"exception\">pyramid frontend exception:</span> " + this.replace_escape(message);
    }
    private maybe_backend_error_message(message): string {
        if (message.length > 22 && message.slice(0, 22) == "pyramid backend error:") {
            return "<span class=\"exception\">pyramid backend error:</span> " + this.replace_escape(message.slice(22));
        } else {
            return message;
        }
    }
    /**
     * A function to start new line.
     * @param {string} log if it's "" then nothing will be printed.
     */
    private start_newline(log): void {
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