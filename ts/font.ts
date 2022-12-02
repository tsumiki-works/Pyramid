import { GLRequest } from "./webgl/glrequest.js";
import { ImageTexture } from "./webgl/image_texture.js";
import { Vec3, Vec4 } from "./webgl/math.js";

export class Font {
    private view: Vec3;
    private font_texture: ImageTexture;

    constructor(_view: Vec3, _font_texture: ImageTexture){
        this.view = _view;
        this.font_texture = _font_texture;
    }
    push_requests_text(text: string, x: number, y: number, width: number, height: number, color: Vec4, is_ui: boolean, requests: GLRequest[]): void {

        let get_font_offset_u = (ascii: number): number => {
            return ((ascii - 32) % 15) * FONT_WIDTH_SCALE;
        }
        let get_font_offset_v = (ascii: number): number => {
            return (Math.floor((ascii - 32) / 15)) * FONT_HEIGHT_SCALE;
        }
        let entity_character = (x: number, y: number, width: number, height: number, color: Vec4, tex_scale_offset: Vec4, _is_ui: boolean): GLRequest => {
            let tmp_req: GLRequest = {
                trans: [x, y, 0.0],
                scale: [width, height, 1.0],
                view: this.view,
                base_color: color,
                uv_offset: tex_scale_offset,
                texture: this.font_texture,
                is_ui: _is_ui,
            }
            return tmp_req;
        }
        const FONT_WIDTH_SCALE = 0.0667;
        const FONT_HEIGHT_SCALE = 0.125;
        let cnt_chars: number = 0;
        let cnt_newline: number = 0;
        for (let i: number = 0; i < text.length; ++i) {
            if (text.charAt(i) == "\n") {
                cnt_newline += 1;
                cnt_chars = 0;
                continue;
            }
            let tmp_req = entity_character(
                x + width * cnt_chars,
                y - height * cnt_newline,
                width,
                height,
                color,
                [
                    FONT_WIDTH_SCALE,
                    FONT_HEIGHT_SCALE,
                    get_font_offset_u(text.charCodeAt(i)),
                    get_font_offset_v(text.charCodeAt(i)),
                ],
                is_ui
            );
            requests.push(tmp_req);
            cnt_chars += 1;
        }
    }
}