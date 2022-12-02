import { ImageTexture } from "../webgl/image_texture.js";
import {Vec3, Vec4} from "../webgl/math.js"
import {GLRequest} from "../webgl/glrequest.js" 

export interface CanvasDrawable {
    push_requests(view: Vec3, requests: GLRequest[]);
}