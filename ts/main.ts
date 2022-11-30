import { Evaluator } from "./evaluator/evaluator.js";
import { ImageTexture } from "./webgl/image_texture.js";
import { WebGL } from "./webgl/webgl.js";
import { Vec3, Vec4 } from "./webgl/math.js";

import { Roots } from "./roots.js";
import { Block } from "./block.js";
import { Translation } from "./lib/translation.js";
import { ConsoleManager } from "./screen/console.js";
import { ConstantEntity } from "./constant/constant_entity.js";
import { Pager } from "./screen/pager.js";

export class Pyramid {

    private canvas: HTMLCanvasElement;
    private webgl: WebGL;
    private tex01: ImageTexture;
    private tex_font: ImageTexture;
    private tex_trashbox: ImageTexture;

    private view: Vec3 = [0.0, 0.0, -5.0];

    private console_manager: ConsoleManager;

    private roots: Roots;
    private holding_block: Block;

    constructor() {
        this.canvas = document.getElementById("workspace") as HTMLCanvasElement;
        this.webgl = new WebGL(this.canvas);
        this.tex01 = this.webgl.create_image_texture(document.getElementById("tex01") as HTMLImageElement);
        this.tex_font = this.webgl.create_image_texture(document.getElementById("tex_font") as HTMLImageElement);
        this.tex_trashbox = this.webgl.create_image_texture(document.getElementById("tex_trashbox") as HTMLImageElement);
        this.roots = new Roots();
        this.holding_block = Block.create_empty_block();
        this.console_manager = new ConsoleManager(this.canvas, this.roots, this.view, () => this.render());
        // set up
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        // attach events
        this.canvas.addEventListener("mousedown", e => this.event_mousedown(e));
        window.addEventListener("resize", () => {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.render();
        });
        // warning
        if (this.canvas.clientWidth < 600 || this.canvas.clientHeight < 600) {
            alert("pyramid frontend warning: too small window size to use Pyramid comfortably.");
        }
        // finish
        this.render();
    }

    render(): void {
        let requests = [];
        this.roots.clean();
        //this.requestBuilder.push_request_background([0.96, 0.96, 0.96, 1.0], requests);
        this.roots.push_requests(this.view, requests);
        //this.requestBuilder.push_request_header(requests);
        //this.requestBuilder.push_request_logo(requests);
        //this.requestBuilder.push_request_menu(requests);
        //this.requestBuilder.push_requests_menublocks(requests);
        //this.requestBuilder.push_request_lines(requests);
        //this.requestBuilder.push_request_trashbox(this.open_trashbox, this.consoleManager.get_console_height(), requests);
        // holding block
        const pos_clipping_1: Vec4 = Translation.convert_view_to_clipping(
            [-0.5, -0.5, this.view[2], 1.0],
            this.canvas.width,
            this.canvas.height
        );
        const pos_clipping_2: Vec4 = Translation.convert_view_to_clipping(
            [0.5, 0.5, this.view[2], 1.0],
            this.canvas.width,
            this.canvas.height
        );
        const wr = this.canvas.width * 0.5 * (pos_clipping_2[0] / pos_clipping_2[3] - pos_clipping_1[0] / pos_clipping_1[3]);
        const hr = this.canvas.height * 0.5 * (pos_clipping_2[1] / pos_clipping_2[3] - pos_clipping_1[1] / pos_clipping_2[3]);
        this.holding_block.arrange(wr, hr);
        this.holding_block.push_requests(wr, hr, this.view, true, requests);
        // finish
        this.webgl.draw_requests(requests, this.canvas.width, this.canvas.height);
    }

    /* ============================================================================================================= */
    /*     Event                                                                                                     */
    /* ============================================================================================================= */

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
            const block_half_width = block.width * 0.5;
            return Math.abs(block.x - pos_world[0]) < block_half_width
                && Math.abs(block.y - pos_world[1]) < Block.UNIT_HALF_HEIGHT;
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
        if (e.pageX < ConstantEntity.LOGO_WIDTH + 12 && e.pageY < ConstantEntity.LOGO_HEIGHT + 18) {
            window.confirm("トップページに戻ると作業内容が失われます。よろしいですか。");
            Pager.goto_toppage();
            return;
        }
        // menu
        if (e.pageX < ConstantEntity.MENU_WIDTH) {
            console.log("menu clicked"); //! debug
            //! [TODO] this.menu.clicked(e.pageX, e.pageY, this.console_manager);
            return;
        }
        // move block
        if (!hit_block.is_empty()) {
            console.log("hit left block : " + hit_block); //! debug
            //! [TODO] move block
            return;
        }
        console.log("MOUSEPOS: " + e.pageX + ", " + e.pageY); //! debug
    }

    private fun_right_mousedown(e, pos_world: Vec3, hit_block: Block): void {
        if (!hit_block.is_empty()) {
            console.log("hit right block : " + hit_block); //! debug
            hit_block.clicked(e.pageX, e.pageY, this.console_manager);
            return;
        }
        //! [TODO] move workspace
    }

}