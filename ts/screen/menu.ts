import { CanvasItem } from "./canvas_items.js";
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

    }

    craete push_request_menu(view: Vec3): CanvasItem {

    }
    */

    private create_canvasItem_lines(view: Vec3): CanvasItem[] {
        let item_lines: CanvasItem[] = new Array<CanvasItem>();

        const pos = Translation.convert_2dscreen_to_2dunnormalizedviewport(this.canvas_width, this.canvas_height, [Pyramid.MENU_WIDTH * 0.5, Pyramid.HEADER_HEIGHT * 0.5]);
        let line1: CanvasItem = new CanvasItem(
            pos[0] + this.canvas_width * 0.5 - Pyramid.MENU_WIDTH * 0.5,
            pos[1] - 24.0,
            this.canvas_width,
            1.0,
            [0.8, 0.8, 0.8, 1.],
            [0., 0., 0., 0.],
            null,
            true
        );
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
        item_lines.push(line1);
        return item_lines;
    }

    push_requests(view: Vec3, requests: GLRequest[]): void {
        let lines: CanvasItem[] = this.create_canvasItem_lines(view);
        for(const l of lines){
            l.push_requests(view, requests);
        }
    }
}