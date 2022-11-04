// A module for coordinates translation

/**
 * A function to convert coordinate from screen to unnormalized viewport.
 * For example,
 *   * canvas_width=1280, canvas_height=640, xy=[0,0], the result is [-640,480]
 *   * canvas_width=1280, canvas_height=640, xy=[640,480], the result is [0,0]
 * @param {float} canvas_width 
 * @param {float} canvas_height 
 * @param {[float, float]} xy 
 * @returns {[float, float]} unnormalized viewport coordinate 
 */
function convert_2dscreen_to_2dunnormalizedviewport(canvas_width, canvas_height, xy) {
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
 * @param {[float, float]} xy 
 * @returns {[float, float]} viewport coordinate 
 */
function convert_2dscreen_to_2dviewport(canvas_width, canvas_height, xy) {
    const hw = canvas_width * 0.5;
    const hh = canvas_height * 0.5;
    return [
        (xy[0] - hw) / hw,
        (xy[1] - hh) * -1.0 / hh,
    ];
}
/**
 * A function to convert coordinate from viewport to clipping.
 * @param {float} camera_z 
 * @param {[float, float]} xy normalized viewport coordinate 
 * @returns {[float, float, float]} clipping coordinate
 */
function convert_2dviewport_to_3dclipping(camera_z, xy) {
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
 * @param {[float, float, float]} xyz 
 * @returns {[float, float, float]} view coordinate
 */
function convert_3dclipping_to_3dview(canvas_width, canvas_height, xyz) {
    return convert_clipping_to_view(
        [xyz[0], xyz[1], xyz[2], 1.0],
        canvas_width,
        canvas_height
    );
}
/**
 * A function to convert coordinate from view to world.
 * @param {[float, float, float]} camera 
 * @param {[float, float, float]} xyz 
 * @returns {[float, float, float]} world coordinate
 */
function convert_3dview_to_3dworld(camera, xyz) {
    let pos = [xyz[0], xyz[1], xyz[2]];
    pos[0] = pos[0] * camera[2] * -1.0 - camera[0];
    pos[1] = pos[1] * camera[2] * -1.0 - camera[1];
    pos[2] = pos[2] * camera[2] * -1.0 - camera[2];
    return pos;
}
/**
 * A function to convert from screen to world.
 * @param {[float, float]} xy screen coordinate
 * @returns {[float, float, float]} world coordinate
 */
function convert_2dscreen_to_3dworld(xy){
    const pos_viewport = convert_2dscreen_to_2dviewport(canvas.width, canvas.height, [xy[0], xy[1]]);
    const pos_clipping = convert_2dviewport_to_3dclipping(camera[2], pos_viewport);
    const pos_view = convert_3dclipping_to_3dview(canvas.width, canvas.height, pos_clipping);
    const pos_world = convert_3dview_to_3dworld(camera, pos_view);
    return pos_world;
}
