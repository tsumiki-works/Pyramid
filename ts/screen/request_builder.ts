import { ConstantEntity } from "../constant/constant_entity.js";
import { Translation } from "../lib/translation.js";
import { Vec3, Vec4 } from "../webgl/math.js";
import { Request } from "../webgl/request.js";
import { WebGL } from "../webgl/webgl.js";
import { Block } from "../block/block.js";
import { BlockManager } from "../block/block_manager.js";
import { ImageTexture } from "../webgl/image_texture.js";

export class PyramidRequest {

    private textures: ImageTexture[];
    private canvas: HTMLCanvasElement;
    private view: Vec3;
    private webGL: WebGL;

    constructor(_textures: ImageTexture[], _canvas: HTMLCanvasElement, _view: Vec3, _webGL: WebGL){
        this.textures = _textures;
        this.canvas = _canvas;
        this.view = _view;
        this.webGL = _webGL;
        return;
    }

    push_requests_menublocks(req: Request[]): void {
        const MENU_WIDTH = 190.0;
        const MENU_HEIGHT = this.canvas.height - ConstantEntity.LOGO_HEIGHT;
        for (let i = 0; i < 5; i++) {
            const pos: number[] = 
                Translation.convert_2dscreen_to_2dunnormalizedviewport(
                    this.canvas.width,
                    this.canvas.height,
                    [90, 100 + 60 * i]
                );
            let base_color: Vec4 = Block.convert_type_to_color(i);
            let tmp_req: Request = {
                trans: [pos[0], pos[1], 0.0],
                scale: [100, 50, 1.0],
                view: this.view,
                base_color: base_color,
                uv_offset: [0.0, 0.0, 0.0, 0.0],
                texture: null,
                is_ui: true,
            }
                
            req.push(tmp_req);
        }
        // ブロック増設予定地
        for (let i = 5; i < 10; i++) {
            const pos: number[] = 
                Translation.convert_2dscreen_to_2dunnormalizedviewport(
                    this.canvas.width,
                    this.canvas.height,
                    [90, 120 + 60 * i]
                );
            let tmp_req: Request = {
                trans: [pos[0], pos[1], 0.0],
                scale: [100, 50, 1.0],
                view: this.view,
                base_color: [0.2, 0.2, 0.2, 0.5],
                uv_offset: [0.0, 0.0, 0.0, 0.0],
                texture: null,
                is_ui: true,
            }

            req.push(tmp_req);
        }
    }
    // A function to push requests for drawing text
    //   * text: str          ... text you wanna draw
    //   * x: float           ... x coord of the center of the first character
    //   * y: float           ... y coord of the center of the first character
    //   * width: float       ... the width of a character
    //   * height: float      ... the height of a character
    //   * color : [float; 4] ... the color of the text
    //   * is_ui: boolean     ... whether the text is UI or not
    //   * requests: []       ... target requests array
    push_requests_text(text: string, x: number, y: number, width: number, height: number, color: Vec4, is_ui: boolean, requests: Request[]): void {

        let get_font_offset_u = (ascii: number): number => {
            return ((ascii - 32) % 15) * FONT_WIDTH_SCALE;
        }
        let get_font_offset_v = (ascii: number): number => {
            return (Math.floor((ascii - 32) / 15)) * FONT_HEIGHT_SCALE;
        }
        let entity_character = (x: number, y: number, width: number, height: number, color: Vec4, tex_scale_offset: Vec4, _is_ui: boolean): Request => {
            let tmp_req: Request = {
                trans: [x, y, 0.0],
                scale: [width, height, 1.0],
                view: this.view,
                base_color: color,
                uv_offset: tex_scale_offset,
                texture: this.textures[1],
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
    push_request_background(color: Vec4, req: Request[]): void {
        let tmp_req: Request = {
            trans: [0., 0., 0.],
            scale: [this.canvas.width, this.canvas.height, 1.0],
            view: this.view,
            base_color: color,
            uv_offset: [0., 0., 0., 0.],
            texture: null,
            is_ui: true,
        }
        req.push(tmp_req);
    }

    push_request_header(req: Request[]): void {
        const pos: number[] = Translation.convert_2dscreen_to_2dunnormalizedviewport(this.canvas.width, this.canvas.height, [this.canvas.width * 0.5, ConstantEntity.LOGO_HEIGHT * 0.5]);
        let tmp_req: Request = {
            trans: [pos[0], pos[1] - 9.0, 0.],
            scale: [this.canvas.width, ConstantEntity.HEADER_HEIGHT, 1.0],
            view: this.view,
            base_color: [1., 1., 1., 1.],
            uv_offset: [0., 0., 0., 0.],
            texture: null,
            is_ui: true,
        }
        req.push(tmp_req);
    }

    push_request_logo(req: Request[]): void {
        const pos: number[] = Translation.convert_2dscreen_to_2dunnormalizedviewport(
            this.canvas.width, 
            this.canvas.height, 
            [ConstantEntity.LOGO_WIDTH * 0.5, ConstantEntity.LOGO_HEIGHT * 0.5]
        );
        let tmp_req: Request = {
            trans: [pos[0] + 12.0, pos[1] - 8.0, 0.0],
            scale: [ConstantEntity.LOGO_WIDTH, ConstantEntity.LOGO_HEIGHT, 1.0],
            view: this.view,
            base_color: [1., 1., 1., 1.],
            uv_offset: [1., 0.166, 0., 0.],
            texture: this.textures[0],
            is_ui: true,
        }
        req.push(tmp_req);
    }

    push_request_menu(req: Request[]): void {
        const MENU_HEIGHT: number = this.canvas.height - ConstantEntity.LOGO_HEIGHT;
        const pos: number[] = Translation.convert_2dscreen_to_2dunnormalizedviewport(
            this.canvas.width,
            this.canvas.height,
            [ConstantEntity.MENU_WIDTH * 0.5, MENU_HEIGHT * 0.5]
        );
        let tmp_req: Request = {
            trans: [pos[0], pos[1] - ConstantEntity.LOGO_HEIGHT - 18.0, 0.0],
            scale: [ConstantEntity.MENU_WIDTH, MENU_HEIGHT, 1.0],
            view: this.view,
            base_color: [1.0, 1.0, 1.0, 1.0],
            uv_offset: [0., 0., 0., 0.],
            texture: null,
            is_ui: true,
        }
        req.push(tmp_req);
    }

    push_request_lines(req: Request[]): void {
        const pos = Translation.convert_2dscreen_to_2dunnormalizedviewport(this.canvas.width, this.canvas.height, [ConstantEntity.MENU_WIDTH * 0.5, ConstantEntity.HEADER_HEIGHT * 0.5]);
        let tmp_req: Request = {
            trans: [pos[0] + this.canvas.width *0.5 - ConstantEntity.MENU_WIDTH * 0.5, pos[1] - 24.0, 0.0],
            scale: [this.canvas.width, 1.0, 1.0],
            view: this.view,
            base_color: [0.8, 0.8, 0.8, 1.0],
            uv_offset: [0., 0., 0., 0.],
            texture: null,
            is_ui: true,
        }
        let tmp_req2: Request = {
            trans: [pos[0], pos[1] - 356.0, 0.0],
            scale: [ConstantEntity.MENU_WIDTH - 30.0, 1.0, 1.0],
            view: this.view,
            base_color: [0.8, 0.8, 0.8, 1.0],
            uv_offset: [0., 0., 0., 0.],
            texture: null,
            is_ui: true,
        }
        let tmp_req3: Request = {
            trans: [pos[0] + ConstantEntity.MENU_WIDTH * 0.5, pos[1] - this.canvas.height * 0.5, 0.0],
            scale: [1.0, this.canvas.height - ConstantEntity.HEADER_HEIGHT, 1.0],
            view: this.view,
            base_color: [0.8, 0.8, 0.8, 1.0],
            uv_offset: [0., 0., 0., 0.],
            texture: null,
            is_ui: true,
        }
        req.push(tmp_req);
        req.push(tmp_req2);
        req.push(tmp_req3);
    }
    
    push_request_trashbox(isopen: boolean, console_height: number, req: Request[]): void {
        const pos = Translation.convert_2dscreen_to_2dunnormalizedviewport(
            this.canvas.width,
            this.canvas.height,
            [this.canvas.width - ConstantEntity.TRASHBOX_WIDTH * 0.5, this.canvas.height - console_height - ConstantEntity.TRASHBOX_HEIGHT * 0.5]
        );
        let tmp_req: Request = {
            trans: [pos[0], pos[1], 0.0],
            scale: [ConstantEntity.TRASHBOX_WIDTH, ConstantEntity.TRASHBOX_HEIGHT, 1.0],
            view: this.view,
            base_color: [1., 1., 1., 1.],
            uv_offset: [0.5, 0.7, (isopen ? 0.5 : 0.0), 0.3],
            texture: this.textures[2],
            is_ui: true,
        }
        req.push(tmp_req);
    }
}