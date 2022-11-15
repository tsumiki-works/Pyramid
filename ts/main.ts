import { Block } from "./block/block.js"
import { ImageTexture } from "./webgl/image_texture.js";
import { WebGL } from "./webgl/webgl.js";

export class Pyramid {

    private canvas: HTMLCanvasElement;
    private webgl: WebGL;
    private tex01: ImageTexture;

    constructor() {
        this.canvas = document.getElementById("workspace") as HTMLCanvasElement;
        try {
            this.webgl = new WebGL(this.canvas);
        } catch (e) {
            alert(e);
        }
        this.tex01 = this.webgl.create_image_texture(document.getElementById("tex01") as HTMLImageElement);
    }

    run(): void {
        this.webgl.draw_requests([], this.canvas.width, this.canvas.height);
    }
}