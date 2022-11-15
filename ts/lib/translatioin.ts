// A module for coordinates translation

import { Matrix, Vec4, Mat4x4 } from "../webgl/math.js";

export class Translation {
    /**
     * A function to convert coordinate from screen to unnormalized viewport.
     * For example,
     *   * canvas_width=1280, canvas_height=640, xy=[0,0], the result is [-640,480]
     *   * canvas_width=1280, canvas_height=640, xy=[640,480], the result is [0,0]
     * @param {float} canvas_width 
     * @param {float} canvas_height 
     * @param {float[]} xy 
     * @returns {float[]} unnormalized viewport coordinate 
     */
    static convert_2dscreen_to_2dunnormalizedviewport(canvas_width: number, canvas_height: number, xy: number[]): number[] {
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
     * @param {float[]} xy 
     * @returns {float[]} viewport coordinate 
     */
    static convert_2dscreen_to_2dviewport(canvas_width: number, canvas_height: number, xy: number[]): number[] {
        const hw: number = canvas_width * 0.5;
        const hh: number = canvas_height * 0.5;
        return [
            (xy[0] - hw) / hw,
            (xy[1] - hh) * -1.0 / hh,
        ];
    }
    /**
     * A function to convert coordinate from viewport to clipping.
     * @param {float} camera_z 
     * @param {float[]} xy normalized viewport coordinate 
     * @returns {float[]} clipping coordinate
     */
    static convert_2dviewport_to_3dclipping(camera_z: number, xy: number[]): number[]{
        return [
            xy[0],
            xy[1],
            camera_z,
        ];
    }
    /**
     * A function to convert coordinate from clipping to view.
     * @param {float} canvas_width 
     * @param {float} canvas_height 
     * @param {float[]} xyz 
     * @returns {float[]} view coordinate
     */
    static convert_3dclipping_to_3dview(canvas_width: number, canvas_height: number, xyz: number[]): number[] {
        const pos: Vec4 = [xyz[0], xyz[1], xyz[2], 1.0];
        const mat_proj: Mat4x4 = Matrix.perse(45.0, canvas_width / canvas_height, 0.1, 1000.0);
        const inv_proj: Mat4x4 = Matrix.inverse_matrix(mat_proj);
        return Matrix.multiple_matrix_vector(inv_proj, pos);
    }
    /**
     * A function to convert coordinate from view to world.
     * @param {float[]} camera 
     * @param {float[]} xyz 
     * @returns {float[]} world coordinate
     */
    static convert_3dview_to_3dworld(camera: number[], xyz: number[]): number[] {
        let pos: number[] = [xyz[0], xyz[1], xyz[2]];
        pos[0] = pos[0] * camera[2] * -1.0 - camera[0];
        pos[1] = pos[1] * camera[2] * -1.0 - camera[1];
        pos[2] = pos[2] * camera[2] * -1.0 - camera[2];
        return pos;
    }
    /**
     * A function to convert from screen to world.
     * @param {float[]} xy screen coordinate
     * @returns {float[]} world coordinate
     */
    static convert_2dscreen_to_3dworld(canvas_width: number, canvas_height: number, camera: number[], xy: number[]): number[]{
        const pos_viewport = this.convert_2dscreen_to_2dviewport(canvas_width, canvas_height, [xy[0], xy[1]]);
        const pos_clipping = this.convert_2dviewport_to_3dclipping(camera[2], pos_viewport);
        const pos_view = this.convert_3dclipping_to_3dview(canvas_width, canvas_height, pos_clipping);
        const pos_world = this.convert_3dview_to_3dworld(camera, pos_view);
        return pos_world;
    }
}