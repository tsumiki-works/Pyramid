// A module for coordinates translation

import { Matrix, Vec2, Vec3, Vec4 } from "../webgl/math.js";

export class Translation {
    /**
     * A function to convert coordinate from screen to unnormalized viewport.
     * For example,
     *   * canvas_width=1280, canvas_height=640, xy=[0,0], the result is [-640,480]
     *   * canvas_width=1280, canvas_height=640, xy=[640,480], the result is [0,0]
     * @param {float} canvas_width 
     * @param {float} canvas_height 
     * @param {Vec2} xy 
     * @returns {Vec2} unnormalized viewport coordinate 
     */
    static convert_2dscreen_to_2dunnormalizedviewport(canvas_width: number, canvas_height: number, xy: Vec2): Vec2 {
        return [
            canvas_width * -0.5 + xy[0],
            canvas_height * 0.5 - xy[1],
        ];
    }
    /**
     * A function to convert coordinate from screen to viewport.
     * For example,
     *   * canvas_width=1280, canvas_height=640, xy=[0,0], the result is [-1,1]
     *   * canvas_width=1280, canvas_height=640, xy=[640,480], the result is [0,0]
     * @param {float} canvas_width 
     * @param {float} canvas_height 
     * @param {Vec2} xy 
     * @returns {Vec2} viewport coordinate 
     */
    static convert_2dscreen_to_2dviewport(canvas_width: number, canvas_height: number, xy: Vec2): Vec2 {
        const hw: number = canvas_width * 0.5;
        const hh: number = canvas_height * 0.5;
        return [
            (xy[0] - hw) / hw,
            (xy[1] - hh) * -1.0 / hh,
        ];
    }
    /**
     * A function to convert coordinate from viewport to clipping.
     * @param {float} view_z 
     * @param {float[]} xy normalized viewport coordinate 
     * @returns {float[]} clipping coordinate
     */
    static convert_2dviewport_to_3dclipping(view_z: number, xy: number[]): Vec3 {
        return [
            xy[0],
            xy[1],
            view_z,
        ];
    }
    /**
     * A function to convert coordinate from clipping to view.
     * @param {float} canvas_width 
     * @param {float} canvas_height 
     * @param {float[]} xyz 
     * @returns {float[]} view coordinate
     */
    static convert_3dclipping_to_3dview(canvas_width: number, canvas_height: number, xyz: Vec3): Vec4 {
        const pos: Vec4 = [xyz[0], xyz[1], xyz[2], 1.0];
        return this.convert_clipping_to_view(pos, canvas_width, canvas_height);
    }

    static convert_clipping_to_view(pos: Vec4, width: number, height: number): Vec4 {
        const mat_proj = Matrix.perse(45.0, width / height, 0.1, 1000.0);
        const inv_proj = Matrix.inverse_matrix(mat_proj);
        return Matrix.multiple_matrix_vector(inv_proj, pos);
    }

    static convert_view_to_clipping(pos: Vec4, width: number, height: number): Vec4 {
        const mat_proj = Matrix.perse(45.0, width / height, 0.1, 1000.0);
        return Matrix.multiple_matrix_vector(mat_proj, pos);
    }
    /**
     * A function to convert coordinate from view to world.
     * @param {float[]} view 
     * @param {float[]} xyz 
     * @returns {float[]} world coordinate
     */
    static convert_3dview_to_3dworld(view: Vec3, xyz: Vec3): Vec3 {
        let pos: Vec3 = [xyz[0], xyz[1], xyz[2]];
        pos[0] = pos[0] * view[2] * -1.0 - view[0];
        pos[1] = pos[1] * view[2] * -1.0 - view[1];
        pos[2] = pos[2] * view[2] * -1.0 - view[2];
        return pos;
    }
    /**
     * A function to convert from screen to world.
     * @param {float[]} xy screen coordinate
     * @returns {float[]} world coordinate
     */
    static convert_2dscreen_to_3dworld(canvas_width: number, canvas_height: number, view: Vec3, xy: Vec2): Vec3 {
        const pos_viewport: Vec2 = this.convert_2dscreen_to_2dviewport(canvas_width, canvas_height, [xy[0], xy[1]]);
        const pos_clipping: Vec3 = this.convert_2dviewport_to_3dclipping(view[2], pos_viewport);
        const pos_view: Vec4 = this.convert_3dclipping_to_3dview(canvas_width, canvas_height, pos_clipping);
        const pos_view_: Vec3 = [pos_view[0], pos_view[1], pos_view[2]];
        const pos_world: Vec3 = this.convert_3dview_to_3dworld(view, pos_view_);
        return pos_world;
    }
}