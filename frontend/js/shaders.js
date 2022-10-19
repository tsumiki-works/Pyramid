const VERTEX_SHADER_CODE = `#version 300 es
uniform mat4 mat_trs;
uniform mat4 mat_scl;
uniform mat4 mat_view;
uniform mat4 mat_proj;
layout (location = 0) in vec3 position;
layout (location = 1) in vec2 texture_coord;
out vec2 texture_coord_in_frag;
void main(void){
    gl_Position = mat_proj * mat_view * mat_trs * mat_trs * vec4(position, 1.0);
    texture_coord_in_frag = texture_coord;
}
`;

const FRAGMENT_SHADER_CODE = `#version 300 es
precision highp float;
uniform sampler2D tex2dSampler;
in vec2 texture_coord_in_frag;
out vec4 outColor;
void main(void) {
    vec4 res = texture(tex2dSampler, texture_coord_in_frag);
        outColor = res;
}
`;
