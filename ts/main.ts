import { Block } from "./block/block.js"
import { WebGL } from "./webgl/webgl.js";

export class Pyramid {

    private canvas: HTMLCanvasElement;
    private webgl: WebGL;

    constructor() {
        this.canvas = document.getElementById("workspace") as HTMLCanvasElement;
        try {
            this.webgl = new WebGL(this.canvas);
        } catch (e) {
            alert(e);
        }
    }

    run(): void {
        this.webgl.draw_requests([], this.canvas.width, this.canvas.height);
    }
}