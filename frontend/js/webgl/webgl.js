// A module for WebGL2.0
//   * init_webgl
//   * update_webgl
//   * create_image_texture
//   * convert_clipping_to_view

let gl = null;
let program = null;
let location_position = null;
let location_tex_coord = null;
let uniform_location_mat_trs = null;
let uniform_location_mat_scl = null;
let uniform_location_mat_view = null;
let uniform_location_mat_proj = null;
let uniform_location_base_color = null;
let uniform_location_frag_option = null;
let uniform_location_uv_scale_offset = null;
let uniform_location_sampler = null;
let squeare_model = null;
const MODEL_IDX_INDEX_COUNT = 0;
const MODEL_IDX_VBO = 1;
const MODEL_IDX_IBO = 2;
const MODEL_IDX_TCBO = 3;
const REQUEST_IDX_TRANS = 0;
const REQUEST_IDX_SCALE = 1;
const REQUEST_IDX_COLOR = 2;
const REQUEST_IDX_IMGTEX = 3;
const REQUEST_IDX_UV_SCALE_OFFSET = 4;
const REQUEST_IDX_IS_UI = 5;

function create_square_model() {
    const vtxs = [
        -0.5, -0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
    ];
    const idxs = [0, 1, 2, 0, 2, 3];
    const uvs = [
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
    ];
    return create_model(6, vtxs, idxs, uvs);
}

function create_camera(x, y, z) {
    return create_trans(x, y, z);
}

function create_image_texture(image) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

function init_webgl(target_canvas) {
    // initialize WebGL
    gl = target_canvas.getContext("webgl2");
    if (gl === null) {
        alert("pyramid frontend error: failed to initialize WebGL.");
        return;
    }
    // initialize shaders
    const vs = create_vertex_shader();
    const fs = create_fragment_shader();
    program = create_program(vs, fs);
    location_position = gl.getAttribLocation(program, "position");
    location_tex_coord = gl.getAttribLocation(program, "tex_coord");
    uniform_location_mat_trs = gl.getUniformLocation(program, "mat_trs");
    uniform_location_mat_scl = gl.getUniformLocation(program, "mat_scl");
    uniform_location_mat_view = gl.getUniformLocation(program, "mat_view");
    uniform_location_mat_proj = gl.getUniformLocation(program, "mat_proj");
    uniform_location_base_color = gl.getUniformLocation(program, "base_color");
    uniform_location_frag_option = gl.getUniformLocation(program, "frag_option");
    uniform_location_uv_scale_offset = gl.getUniformLocation(program, "uv_scale_offset");
    uniform_location_sampler = gl.getUniformLocation(program, "tex_sampler");
    gl.enableVertexAttribArray(location_position);
    gl.enableVertexAttribArray(location_tex_coord);
    // configure
    gl.activeTexture(gl.TEXTURE0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // create square model
    squeare_model = create_square_model();
}

function update_webgl(requests, width, height, camera) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < requests.length; ++i) {
        draw_model(
            squeare_model,
            width,
            height,
            camera,
            requests[i][REQUEST_IDX_TRANS],
            requests[i][REQUEST_IDX_SCALE],
            requests[i][REQUEST_IDX_COLOR],
            requests[i][REQUEST_IDX_IMGTEX],
            requests[i][REQUEST_IDX_UV_SCALE_OFFSET],
            requests[i][REQUEST_IDX_IS_UI]
        );
    }
    gl.flush();
}

function convert_clipping_to_view(pos, width, height) {
    const mat_proj = create_perse(45.0, width / height, 0.1, 1000.0);
    const inv_proj = inverse_matrix(mat_proj);
    return multiple_matrix_vector(inv_proj, pos);
}
