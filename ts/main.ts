import { Block } from "./block/block.js"
import { ImageTexture } from "./webgl/image_texture.js";
import { WebGL } from "./webgl/webgl.js";

export class Pyramid {

    private canvas: HTMLCanvasElement;

    private camera: number[] = [0.0, 0.0, -5.0];
    

    constructor () {
        this.canvas = document.getElementById("workspace") as HTMLCanvasElement;
        try {
            this.webgl = new WebGL(this.canvas);
        } catch (e) {
            alert(e);
        }
        this.tex01 = this.webgl.create_image_texture(document.getElementById("tex01") as HTMLImageElement);
    }

    run(): void {
        if (this.canvas.clientWidth < 600 || this.canvas.clientHeight < 600) {
            alert("pyramid frontend warning: too small window size to use Pyramid comfortably.");
        }
        /*
        // canvas
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.addEventListener("mousedown", fun_mousedown);
        this.canvas.addEventListener("wheel", fun_wheel);
        // window
        window.addEventListener("resize", () => {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            render();
        });
        // console
        init_console();
        // webgl
        init_webgl(canvas);
        img_texs.push(create_image_texture(document.getElementById("tex01")));
        img_texs.push(create_image_texture(document.getElementById("tex_font")));
        img_texs.push(create_image_texture(document.getElementById("tex_trashbox")));
        */
        this.render();
    }

    render(): void {
        // make requests from PyramidManager
        this.webgl.draw_requests([], this.canvas.width, this.canvas.height);
    }
}