import { Evaluator } from "./evaluator/evaluator.js";
import { ImageTexture } from "./webgl/image_texture.js";
import { WebGL } from "./webgl/webgl.js";
import { Vec3 } from "./webgl/math.js";

import { PyramidController } from "./screen/screen.js";

export class Pyramid {

    private canvas: HTMLCanvasElement;
    private webgl: WebGL;
    private tex01: ImageTexture;
    private tex_font: ImageTexture;
    private tex_trashbox: ImageTexture;

    private view: Vec3 = [0.0, 0.0, -5.0];
    

    constructor () {
        this.canvas = document.getElementById("workspace") as HTMLCanvasElement;
        try {
            this.webgl = new WebGL(this.canvas);
        } catch (e) {
            alert(e);
        }
        this.tex01 = this.webgl.create_image_texture(document.getElementById("tex01") as HTMLImageElement);
        this.tex_font = this.webgl.create_image_texture(document.getElementById("tex_font") as HTMLImageElement);
        this.tex_trashbox = this.webgl.create_image_texture(document.getElementById("tex_trashbox") as HTMLImageElement);
    }

    run(): void {
        const evaluator = new Evaluator();
        console.log(evaluator.eval([], "+ 1 (defvar x (+ 2 3) (+ x 3))"));
        console.log(evaluator.eval([], "+ 1 2"));
        if (this.canvas.clientWidth < 600 || this.canvas.clientHeight < 600) {
            alert("pyramid frontend warning: too small window size to use Pyramid comfortably.");
        }
        let pyramidController: PyramidController = new PyramidController([this.tex01, this.tex_font, this.tex_trashbox] , this.canvas, this.view, this.webgl);
        pyramidController.init_canvas();
        pyramidController.init_window();
        pyramidController.init_console();
        pyramidController.init_webgl();
        pyramidController.render();
    }
}