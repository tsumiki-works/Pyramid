import { ConstantBuffer } from "./constant_buffer.js";
import { Program } from "./program.js";

export class Model {

    private index_count: number;
    private vbo: WebGLBuffer;
    private ibo: WebGLBuffer;
    private tcbo: WebGLBuffer;

    constructor(gl: WebGL2RenderingContext, index_count: number, vtxs: number[], idxs: number[], uvs: number[]) {
        this.index_count = index_count;
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtxs), gl.STATIC_DRAW);
        this.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(idxs), gl.STATIC_DRAW);
        this.tcbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tcbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    }

    draw(gl: WebGL2RenderingContext, program: Program, cbuf: ConstantBuffer): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.vertexAttribPointer(program.attlocation_position, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tcbo);
        gl.vertexAttribPointer(program.attlocation_texcoord, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        if (cbuf.mat_trs != null) {
            gl.uniformMatrix4fv(program.unilocation_mat_trs, false, cbuf.mat_trs);
        }
        if (cbuf.mat_scl != null) {
            gl.uniformMatrix4fv(program.unilocation_mat_scl, false, cbuf.mat_scl);
        }
        if (cbuf.mat_view != null) {
            gl.uniformMatrix4fv(program.unilocation_mat_view, false, cbuf.mat_view);
        }
        if (cbuf.mat_proj != null) {
            gl.uniformMatrix4fv(program.unilocation_mat_proj, false, cbuf.mat_proj);
        }
        if (cbuf.base_color != null) {
            gl.uniform4fv(program.unilocation_base_color, cbuf.base_color);
        }
        if (cbuf.frag_opt != null) {
            gl.uniform4fv(program.unilocation_frag_opt, cbuf.frag_opt);
        }
        if (cbuf.uv_offset != null) {
            gl.uniform4fv(program.unilocation_uv_offset, cbuf.uv_offset);
        }
        if (cbuf.sampler != null) {
            gl.bindTexture(gl.TEXTURE_2D, cbuf.sampler);
            gl.uniform1i(program.unilocation_sampler, 0);
        }
        gl.drawElements(gl.TRIANGLES, this.index_count, gl.UNSIGNED_SHORT, 0);
    }
}