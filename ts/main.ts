import { Evaluator } from "./evaluator/evaluator.js";
import { ImageTexture } from "./webgl/image_texture.js";
import { WebGL } from "./webgl/webgl.js";
import { Vec3, Vec4 } from "./webgl/math.js";

import { Block } from "./block/block.js";
import { Translation } from "./lib/translation.js";
import { ConsoleManager } from "./screen/console.js";
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
    private console_manager: ConsoleManager;

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
        this.console_manager = new ConsoleManager(this.canvas, this.block_manager.roots, this.view, () => this.render());
        // set up
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.init_events();
        this.init_canvas_items();
        // finish
        if (this.canvas.clientWidth < 600 || this.canvas.clientHeight < 600) {
            alert("pyramid frontend warning: too small window size to use Pyramid comfortably.");
        }
        this.render();
    }

    render(): void {
        let requests = [];
        this.block_manager.push_roots_requests(this.view, requests);
        for (const item of this.canvas_items) {
            item.push_requests(this.view, requests);
        }

        //this.menu.push_requests(this.view, requests);

        //this.requestBuilder.push_request_trashbox(this.open_trashbox, this.consoleManager.get_console_height(), requests);
        this.block_manager.push_holding_block_requests(this.view, requests);
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
}