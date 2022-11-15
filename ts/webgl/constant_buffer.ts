import { Mat4x4, Vec4 } from "./math";

export type ConstantBuffer = {
    mat_trs: Mat4x4;
    mat_scl: Mat4x4;
    mat_view: Mat4x4;
    mat_proj: Mat4x4;
    base_color: Vec4;
    frag_opt: Vec4;
    uv_offset: Vec4;
    sampler: WebGLTexture;
    new_texture: boolean;
}