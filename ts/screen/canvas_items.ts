import { ImageTexture } from "../webgl/image_texture.js";
import {Vec3, Vec4} from "../webgl/math.js"
import {Request} from "../webgl/request.js" 

export class CanvasItem {
    private canvas_pos_x: number;
    private canvas_pos_y: number;
    private scale_x: number;
    private scale_y: number;
    private color: Vec4;
    private uv_offset: Vec4;
    private texture: ImageTexture;
    private is_ui: boolean;


    constructor(_x: number, _y: number, _scale_x: number, _scale_y: number, _color: Vec4, _uv_offset: Vec4, _texture: ImageTexture, _is_ui: boolean){
        this.canvas_pos_x = _x;
        this.canvas_pos_y = _y;
        this.scale_x = _scale_x;
        this.scale_y = _scale_y;
        this.color = _color;
        this.uv_offset = _uv_offset;
        this.texture = _texture;
        this.is_ui = _is_ui;
    }
    
    private create_request(_view: Vec3): Request{
        return {
            trans: [this.canvas_pos_x, this.canvas_pos_y, 0.0],
            scale: [this.scale_x, this.scale_y, 1.0],
            view: _view,
            base_color: this.color,
            uv_offset: this.uv_offset,
            texture: this.texture,
            is_ui: this.is_ui
        }
    }

    push_requests(view: Vec3 , requests: Request[]): void {
        requests.push(this.create_request(view));
    }
}