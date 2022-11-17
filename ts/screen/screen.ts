import { Block } from "../block/block.js";
import { BlockManager } from "../block/block_manager.js";
import { ImageTexture } from "../webgl/image_texture.js";
import { Vec3 } from "../webgl/math.js";
import { WebGL } from "../webgl/webgl.js";
import { ConsoleManager } from "./console.js";
import { Entity } from "./entity.js";
import { EventManager } from "./event.js";
import { Popup } from "./popup.js";
import { PyramidRequest } from "./request_builder.js";

/**
 * A module to control all contents on the canvas
 */
export class PyramidController {
    private textures: ImageTexture[];
    private canvas: HTMLCanvasElement;
    private view: Vec3;

    private open_trashbox: boolean = false;

    private webgl: WebGL;
    private blockManager: BlockManager;
    private eventManager: EventManager;
    private consoleManager: ConsoleManager;
    private requestBuilder: PyramidRequest;


    constructor(textures: ImageTexture[],_canvas: HTMLCanvasElement, _view: Vec3, _webgl: WebGL){
        this.canvas = _canvas;
        this.view = _view;
        this.webgl = _webgl;
        this.blockManager = new BlockManager();
        this.requestBuilder = new PyramidRequest(textures, _canvas, _view, _webgl);
        this.consoleManager = new ConsoleManager(this.canvas, this.view, (_ => PyramidController.prototype.render.call(this)), this.blockManager);
        this.eventManager = new EventManager(this.canvas, this.view, (_ => PyramidController.prototype.render.call(this)), this.blockManager, this.consoleManager);
        
    }

    init_canvas(): void {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.eventManager.init_canvas_event();
    }

    init_window(): void {
        window.addEventListener("resize", () => {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.render();
        });
    }

    init_console(): void {
        this.consoleManager.init_console();
    }

    init_webgl(): void {
    
    } 

    render(): void {
        // make requests from PyramidManager
        let requests = [];
        this.blockManager.clean_roots();
        this.requestBuilder.push_request_background([1., 1., 1., 1.], requests);
        this.requestBuilder.push_requests_blocks(this.blockManager, this.blockManager.get_roots(), false, requests);
        this.requestBuilder.push_request_header(requests);
        this.requestBuilder.push_request_logo(requests);
        this.requestBuilder.push_request_menu(requests);
        this.requestBuilder.push_requests_menublocks(requests);
        this.requestBuilder.push_request_lines(requests);
        this.requestBuilder.push_request_trashbox(this.open_trashbox, this.consoleManager.get_console_height(), requests);
        this.requestBuilder.push_requests_blocks(this.blockManager, [this.blockManager.get_holding_block()], true, requests);

        this.webgl.draw_requests(requests, this.canvas.width, this.canvas.height);
    }
}