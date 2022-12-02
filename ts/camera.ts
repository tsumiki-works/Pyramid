import { Vec3 } from "./webgl/math.js";
export class Camera {
    private view: Vec3;
    private is_moving: boolean;

    constructor () {
        this.view = [0.0, 0.0, -5.0];
        this.is_moving = false;
    }

    get_view (): Vec3{
        return this.view;
    }
}