import { ImageTexture } from "../webgl/image_texture.js";
import { Vec3, Vec4 } from "../webgl/math.js";
import { GLRequest } from "../webgl/glrequest.js";
import { Translation } from "../lib/translation.js";
import { Pyramid } from "../main.js";

export class Menu {
    private canvas_width: number;
    private canvas_height: number;

    constructor(_canvas_width: number, _canvas_height: number){
        this.canvas_width = _canvas_width;
        this.canvas_height = _canvas_height;
    }

    /*
    create push_menublock_requests(view: Vec3): CanvasItem[] {
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
            let tmp_req: GLRequest = {
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
            let tmp_req: GLRequest = {
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

    craete push_request_menu(view: Vec3): CanvasItem {

        const MENU_HEIGHT: number = this.canvas.height - ConstantEntity.LOGO_HEIGHT;
        const pos: number[] = Translation.convert_2dscreen_to_2dunnormalizedviewport(
            this.canvas.width,
            this.canvas.height,
            [ConstantEntity.MENU_WIDTH * 0.5, MENU_HEIGHT * 0.5]
        );
        let tmp_req: GLRequest = {
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
    */

    private create_requests_lines(_view: Vec3): GLRequest[] {
        let requests_lines: GLRequest[] = new Array<GLRequest>();

        const pos = Translation.convert_2dscreen_to_2dunnormalizedviewport(this.canvas_width, this.canvas_height, [Pyramid.MENU_WIDTH * 0.5, Pyramid.HEADER_HEIGHT * 0.5]);
        let line1: GLRequest = {
            trans: [
                pos[0] + this.canvas_width * 0.5 - Pyramid.MENU_WIDTH * 0.5,
                pos[1] - 24.0,
                0.
            ],
            scale: [this.canvas_width, 1.0, 1.],
            view: _view,
            base_color: [0.8, 0.8, 0.8, 1.],
            uv_offset: [0., 0., 0., 0.],
            texture: null,
            is_ui: true
        };
        /*

        let tmp_req2: GLRequest = {
            trans: [pos[0], pos[1] - 356.0, 0.0],
            scale: [Pyramid.MENU_WIDTH - 30.0, 1.0, 1.0],
            view: this.view,
            base_color: [0.8, 0.8, 0.8, 1.0],
            uv_offset: [0., 0., 0., 0.],
            texture: null,
            is_ui: true,
        }
        let tmp_req3: GLRequest = {
            trans: [pos[0] + Pyramid.MENU_WIDTH * 0.5, pos[1] - this.canvas_height * 0.5, 0.0],
            scale: [1.0, this.canvas_height - Pyramid.HEADER_HEIGHT, 1.0],
            view: this.view,
            base_color: [0.8, 0.8, 0.8, 1.0],
            uv_offset: [0., 0., 0., 0.],
            texture: null,
            is_ui: true,
        }
        */
        requests_lines.push(line1);
        return requests_lines;
    }

    push_requests(view: Vec3, requests: GLRequest[]): void {
        let lines: GLRequest[] = this.create_requests_lines(view);
        for(const l of lines){
            requests.push(l);
        }
    }
}