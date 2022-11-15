import { Block } from "./block/block.js"
import { ImageTexture } from "./webgl/image_texture.js";
import { WebGL } from "./webgl/webgl.js";

export class Pyramid {

    private canvas: HTMLCanvasElement;

    camera: number[] = [0.0, 0.0, -5.0];

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
        let test: Block = new Block(200, 400, 0, "0");
        let test2: Block = new Block();
        test.debug();
        test2.debug();
    }

    render(): void {

    }
}