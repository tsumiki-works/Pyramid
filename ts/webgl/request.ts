import { Vec3, Vec4 } from "./math";

export type Request = {
    trans: Vec3;
    scale: Vec3;
    view: Vec3;
    base_color: Vec4;
    uv_offset: Vec4;
    is_ui: boolean;
    use_tex: boolean;
}