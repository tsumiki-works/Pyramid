import { ImageTexture } from "./image_texture";
import { Vec3, Vec4 } from "./math";

export type GLRequest = {
    trans: Vec3;
    scale: Vec3;
    view: Vec3;
    base_color: Vec4;
    uv_offset: Vec4;
    texture: ImageTexture;
    is_ui: boolean;
}