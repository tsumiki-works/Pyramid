import { Matrix, Vec4 } from "./math.js";
import { Model } from "./model.js";
import { Program } from "./program.js";
import { Request } from "./request.js";

export class WebGL {

    private gl: WebGL2RenderingContext;
    private program: Program;
    private square: Model;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext("webgl2");
        if (this.gl == null) {
            throw new Error("pyramid frontend error: failed to initialize WebGL.");
        }
        try {
            this.program = new Program(this.gl);
        } catch (e) {
            throw e;
        }
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        const vtxs = [
            -0.5, -0.5, 0.0,
            -0.5, 0.5, 0.0,
            0.5, 0.5, 0.0,
            0.5, -0.5, 0.0,
        ];
        const idxs = [0, 1, 2, 0, 2, 3];
        const uvs = [
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
        ];
        this.square = new Model(this.gl, 6, vtxs, idxs, uvs);
    }

    draw_requests(requests: Request[], width: number, height: number): void {
        this.gl.viewport(0, 0, width, height);
        this.gl.clearColor(0.6, 0.6, 0.6, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        let is_ui = null;
        let view_tmp = null;
        let base_color_tmp = null;
        let frag_opt_tmp = null;
        let uv_offset_tmp = null;
        for (const request of requests) {
            let mat_view = null;
            if (view_tmp != request.view) {
                if (request.is_ui) {
                    mat_view = Matrix.identity();
                } else {
                    mat_view = Matrix.trans(requests[0].view);
                }
                view_tmp = request.view;
            }
            let mat_proj = null;
            if (is_ui != request.is_ui) {
                if (request.is_ui) {
                    mat_proj = Matrix.ortho(width, height, 1000.0);
                } else {
                    mat_proj = Matrix.perse(45.0, width / height, 0.1, 1000.0);
                }
                is_ui = request.is_ui;
            }
            let base_color = null;
            if (base_color_tmp != request.base_color) {
                base_color = request.base_color;
                base_color_tmp = request.base_color;
            }
            let frag_opt: Vec4 = [request.use_tex ? 1 : 0, 0, 0, 0];
            if (frag_opt_tmp != frag_opt) {
                frag_opt_tmp = frag_opt;
            } else {
                frag_opt = null;
            }
            let uv_offset = null;
            if (uv_offset_tmp != request.uv_offset) {
                uv_offset = request.uv_offset;
                uv_offset_tmp = request.uv_offset;
            }
            let cbuf = {
                mat_trs: Matrix.trans(request.trans),
                mat_scl: Matrix.scale(request.scale),
                mat_view: mat_view,
                mat_proj: mat_proj,
                base_color: base_color,
                frag_opt: frag_opt,
                uv_offset: uv_offset,
                sampler: null,
                new_texture: false,
            };
            this.square.draw(this.gl, this.program, cbuf);
        }
        this.gl.flush();
    }
}