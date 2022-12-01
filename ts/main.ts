import { Evaluator } from "./evaluator/evaluator.js";
import { ImageTexture } from "./webgl/image_texture.js";
import { WebGL } from "./webgl/webgl.js";
import { Vec3, Vec4 } from "./webgl/math.js";

import { Roots } from "./block/roots.js";
import { Block } from "./block/block.js";
import { Translation } from "./lib/translation.js";
import { ConsoleManager } from "./screen/console.js";
import { CanvasItem } from "./screen/canvas_items.js";
import { Menu } from "./screen/menu.js";
import { Pager } from "./screen/pager.js";
import { WorkspaceMover } from "./workspace_mover.js";
import { BlockMover } from "./block/block_mover.js";

export class Pyramid {

    private canvas: HTMLCanvasElement;
    private webgl: WebGL;
    private tex01: ImageTexture;
    private tex_font: ImageTexture;
    private tex_trashbox: ImageTexture;

    private canvas_items: CanvasItem[];
    private menu: Menu;

    private view: Vec3 = [0.0, 0.0, -5.0];

    private console_manager: ConsoleManager;

    private roots: Roots;
    private holding_block: Block;

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
        this.roots = new Roots();
        this.canvas_items = new Array<CanvasItem>();
        this.menu = new Menu();
        this.holding_block = Block.create_empty_block();
        this.console_manager = new ConsoleManager(this.canvas, this.roots, this.view, () => this.render());
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
        this.roots.push_requests(this.view, requests);
        for(const item of this.canvas_items){
            item.push_requests(this.view, requests);
        }
        
        //this.menu.push_requests(this.view, requests);

        //this.requestBuilder.push_request_trashbox(this.open_trashbox, this.consoleManager.get_console_height(), requests);
        if (!this.holding_block.is_empty()) {
            this.holding_block.arrange();
            this.holding_block.push_requests(this.view, requests);
        }
        // finish
        this.webgl.draw_requests(requests, this.canvas.width, this.canvas.height);
    }

    /* ============================================================================================================= */
    /*     Event                                                                                                     */
    /* ============================================================================================================= */

    private mousedown_listener: EventListener;

    private init_events() {
        this.mousedown_listener = e => this.event_mousedown(e);
        this.canvas.addEventListener("mousedown", this.mousedown_listener);
        window.addEventListener("resize", () => {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.render();
        });
    }

    private event_mousedown(e) {
        // remove popup if it exists
        const popup = document.getElementById("popup-menu");
        if (popup !== null) {
            document.body.removeChild(popup);
        }
        // get cursor world coordinates
        const pos_world: Vec3 = Translation.convert_2dscreen_to_3dworld(
            this.canvas.width,
            this.canvas.height,
            this.view,
            [e.pageX, e.pageY]
        );
        // get hit block
        const hit_block = this.roots.find_block((block: Block) => {
            return block.is_hit(pos_world[0], pos_world[1]);
        });
        // do event
        if (e.which == 1) {
            this.fun_left_mousedown(e, pos_world, hit_block);
        } else if (e.which == 3) {
            this.fun_right_mousedown(e, pos_world, hit_block);
        }
    }

    private fun_left_mousedown(e, pos_world: Vec3, hit_block: Block): void {
        // logo
        if (e.pageX < Pyramid.LOGO_WIDTH + 12 && e.pageY < Pyramid.LOGO_HEIGHT + 18) {
            window.confirm("トップページに戻ると作業内容が失われます。よろしいですか。");
            Pager.goto_toppage();
            return;
        }
        // menu
        if (e.pageX < Pyramid.MENU_WIDTH) {
            console.log("menu clicked"); //! debug
            //! [TODO] this.menu.clicked(e.pageX, e.pageY, this.console_manager);
            return;
        }
        // move block
        if (!hit_block.is_empty()) {
            this.roots.remove_block(hit_block);
            this.holding_block = hit_block;
            new BlockMover(
                this.holding_block,
                this.mousedown_listener,
                this.canvas,
                this.view,
                () => this.fun_release_holding_block()
            );
            return;
        }
        console.log("MOUSEPOS: " + e.pageX + ", " + e.pageY); //! debug
    }

    private fun_right_mousedown(e, pos_world: Vec3, hit_block: Block): void {
        if (!hit_block.is_empty()) {
            hit_block.clicked(e.pageX, e.pageY, this.console_manager);
            return;
        }
        // move workspace
        new WorkspaceMover(e.pageX, e.pageY, this.mousedown_listener, this.canvas, this.view);
    }

    private fun_release_holding_block() {
        //! [TODO] check if block is thrown away into trashbox
        const is_connected = this.roots.connect_block(this.holding_block);
        if (!is_connected) {
            this.roots.push(this.holding_block);
        }
        this.holding_block = Block.create_empty_block();
        this.render(); //! debug
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