let gl = null;
let program = null;
let location_position = null;
let location_texture_coord = null;
let uniform_location_mat_trs = null;
let uniform_location_mat_scl = null;
let uniform_location_mat_view = null;
let uniform_location_mat_proj = null;
let uniform_location_sampler = null;
let squeare_model = null;
let image_textures = [];
const MODEL_IDX_INDEX_COUNT = 0;
const MODEL_IDX_VBO = 1;
const MODEL_IDX_IBO = 2;
const MODEL_IDX_TCBO = 3;
const IMGTEX_IDX_LOGO = 0;

function create_shader(shader, code) {
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader;
    else {
        alert("pyramid frontend error: failed to compile shader. : " + gl.getShaderInfoLog(shader));
        return null;
    }
}
function create_vertex_shader(code) {
    return create_shader(gl.createShader(gl.VERTEX_SHADER), code);
}
function create_fragment_shader(code) {
    return create_shader(gl.createShader(gl.FRAGMENT_SHADER), code);
}

function create_program(vs, fs) {
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        return program;
    } else {
        alert("pyramid frontend error: failed to create WebGL shader program. : " + gl.getProgramInfoLog(program));
        return null;
    }
}

function create_vbo(data) {
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}
function create_ibo(data) {
    let ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
}
function create_tcbo(data) {
    let tcbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tcbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return tcbo;
}

function create_image_texture(id) {
    let image = document.getElementById(id);
    if (image == null) {
        alert("pyramid frontend exception: the element whose id is '" + id + "' not found for image texture resource.");
        return;
    }
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

function create_square_model() {
    let vtxs = [
        -0.5, -0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
    ];
    let idxs = [0, 1, 2, 0, 2, 3];
    let uvs = [
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
    ];
    return [6, create_vbo(vtxs), create_ibo(idxs), create_tcbo(uvs)];
}

function draw_model(model) {
    gl.bindBuffer(gl.ARRAY_BUFFER, model[MODEL_IDX_VBO]);
    gl.vertexAttribPointer(location_position, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, model[MODEL_IDX_TCBO]);
    gl.vertexAttribPointer(location_texture_coord, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model[MODEL_IDX_IBO]);
    gl.bindTexture(gl.TEXTURE_2D, image_textures[IMGTEX_IDX_LOGO]);
    gl.uniform1i(uniform_location_sampler, 0);
    var m = new matIV();
    var mat_trs = m.identity(m.create());
    var mat_scl = m.identity(m.create());
    var mat_view = m.identity(m.create());
    var mat_proj = m.identity(m.create());
    //m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
    //m.perspective(90, canvas.width / canvas.height, 0.1, 100, pMatrix);
    gl.uniformMatrix4fv(uniform_location_mat_trs, false, mat_trs);
    gl.uniformMatrix4fv(uniform_location_mat_scl, false, mat_scl);
    gl.uniformMatrix4fv(uniform_location_mat_view, false, mat_view);
    gl.uniformMatrix4fv(uniform_location_mat_proj, false, mat_proj);
    gl.drawElements(gl.TRIANGLES, model[MODEL_IDX_INDEX_COUNT], gl.UNSIGNED_SHORT, 0);
}

function init_webgl(canvas) {
    // initialize WebGL
    gl = canvas.getContext("webgl2");
    if (gl === null) {
        alert("pyramid frontend error: failed to initialize WebGL.");
        return;
    }
    // initialize shaders
    let vs = create_vertex_shader(VERTEX_SHADER_CODE);
    let fs = create_fragment_shader(FRAGMENT_SHADER_CODE);
    program = create_program(vs, fs);
    location_position = gl.getAttribLocation(program, "position");
    location_texture_coord = gl.getAttribLocation(program, "texture_coord");
    uniform_location_mat_trs = gl.getUniformLocation(program, "mat_trs");
    uniform_location_mat_scl = gl.getUniformLocation(program, "mat_scl");
    uniform_location_mat_view = gl.getUniformLocation(program, "mat_view");
    uniform_location_mat_proj = gl.getUniformLocation(program, "mat_proj");
    uniform_location_sampler = gl.getUniformLocation(program, "tex2dSampler");
    gl.enableVertexAttribArray(location_position);
    gl.enableVertexAttribArray(location_texture_coord);
    gl.activeTexture(gl.TEXTURE0);
    // create square model
    squeare_model = create_square_model();
    // create image texture
    image_textures.push(create_image_texture("img-logo"));
}

function update_webgl() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    draw_model(squeare_model);
    gl.flush();
}
