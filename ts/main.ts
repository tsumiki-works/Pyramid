import { Block } from "./block/block.js"
import { WebGL } from "./webgl/webgl.js";

export class Pyramid {

    private canvas: HTMLCanvasElement;
    private webgl: WebGL;

    camera: number[] = [0.0, 0.0, -5.0];
    

    constructor() {
        this.canvas = document.getElementById("workspace") as HTMLCanvasElement;
        try {
            this.webgl = new WebGL(this.canvas);
        } catch (e) {
            alert(e);
        }
    }

    run(): void {
        let test: Block = new Block(200, 400, 0, "0");
        let test2: Block = new Block();
        test.debug();
        test2.debug();
    }

    render(): void {

        this.webgl.draw_requests([], this.canvas.width, this.canvas.height);
    }
}