// A module for WebGL shaders (GLSL 3.00 ES)
//   * create_vertex_shader
//   * create_fragment_shader
//   * create_program

const VERTEX_SHADER_CODE = `#version 300 es
uniform mat4 mat_trs;
uniform mat4 mat_scl;
uniform mat4 mat_view;
uniform mat4 mat_proj;
layout (location = 0) in vec3 position;
layout (location = 1) in vec2 tex_coord;
out vec2 tex_coord_in_frag;
void main(void){
    gl_Position = mat_proj * mat_view * mat_trs * mat_scl * vec4(position, 1.0);
    tex_coord_in_frag = tex_coord;
}
`;

const FRAGMENT_SHADER_CODE = `#version 300 es
precision highp float;
uniform vec4 frag_option;
uniform vec4 uv_scale_offset;
uniform sampler2D tex_sampler;
in vec2 tex_coord_in_frag;
out vec4 outColor;
void main(void) {
    if (frag_option.x > 0.5) {
        float u = tex_coord_in_frag.x * uv_scale_offset.x + uv_scale_offset.z;
        float v = tex_coord_in_frag.y * uv_scale_offset.y + uv_scale_offset.w;
        if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
            outColor = vec4(0.0, 0.0, 0.0, 0.0);
        } else {
            vec4 res = texture(tex_sampler, vec2(u, v));
            outColor = res;
        }
    } else {
        outColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}
`;

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

function create_vertex_shader() {
    return create_shader(gl.createShader(gl.VERTEX_SHADER), VERTEX_SHADER_CODE);
}
function create_fragment_shader() {
    return create_shader(gl.createShader(gl.FRAGMENT_SHADER), FRAGMENT_SHADER_CODE);
}

function create_program(vs, fs) {
    let res = gl.createProgram();
    gl.attachShader(res, vs);
    gl.attachShader(res, fs);
    gl.linkProgram(res);
    if (gl.getProgramParameter(res, gl.LINK_STATUS)) {
        gl.useProgram(res);
        return res;
    } else {
        alert("pyramid frontend error: failed to create WebGL shader program. : " + gl.getProgramInfoLog(res));
        return null;
    }
}
