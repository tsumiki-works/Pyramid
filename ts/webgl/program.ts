export class Program {

    attlocation_position: number;
    attlocation_texcoord: number;
    unilocation_mat_trs: WebGLUniformLocation;
    unilocation_mat_scl: WebGLUniformLocation;
    unilocation_mat_view: WebGLUniformLocation;
    unilocation_mat_proj: WebGLUniformLocation;
    unilocation_base_color: WebGLUniformLocation;
    unilocation_frag_opt: WebGLUniformLocation;
    unilocation_uv_offset: WebGLUniformLocation;
    unilocation_sampler: WebGLUniformLocation;

    private program: WebGLProgram;

    constructor(gl: WebGL2RenderingContext) {
        try {
            const vs: WebGLShader =
                Program.create_shader(gl, gl.createShader(gl.VERTEX_SHADER), Program.VERTEX_SHADER_CODE);
            const fs: WebGLShader =
                Program.create_shader(gl, gl.createShader(gl.FRAGMENT_SHADER), Program.FRAGMENT_SHADER_CODE);
            this.program = Program.create_program(gl, vs, fs);
        } catch (e) {
            throw e;
        }
        this.attlocation_position = gl.getAttribLocation(this.program, "position");
        this.attlocation_texcoord = gl.getAttribLocation(this.program, "tex_coord");
        this.unilocation_mat_trs = gl.getUniformLocation(this.program, "mat_trs");
        this.unilocation_mat_scl = gl.getUniformLocation(this.program, "mat_scl");
        this.unilocation_mat_view = gl.getUniformLocation(this.program, "mat_view");
        this.unilocation_mat_proj = gl.getUniformLocation(this.program, "mat_proj");
        this.unilocation_base_color = gl.getUniformLocation(this.program, "base_color");
        this.unilocation_frag_opt = gl.getUniformLocation(this.program, "frag_opt");
        this.unilocation_uv_offset = gl.getUniformLocation(this.program, "uv_offset");
        this.unilocation_sampler = gl.getUniformLocation(this.program, "sampler");
        gl.enableVertexAttribArray(this.attlocation_position);
        gl.enableVertexAttribArray(this.attlocation_texcoord);
    }

    private static create_shader(gl: WebGL2RenderingContext, shader: WebGLShader, code: string): WebGLShader {
        gl.shaderSource(shader, code);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            throw new Error("pyramid frontend error: failed to compile shader. : " + gl.getShaderInfoLog(shader));
        }
    }

    private static create_program(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            return program;
        } else {
            throw new Error(
                "pyramid frontend error: failed to create WebGL shader program. : "
                + gl.getProgramInfoLog(program)
            );
        }
    }

    private static readonly VERTEX_SHADER_CODE = `#version 300 es
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

    private static readonly FRAGMENT_SHADER_CODE = `#version 300 es
precision highp float;
uniform vec4 base_color;
uniform vec4 frag_opt;
uniform vec4 uv_offset;
uniform sampler2D tex_sampler;
in vec2 tex_coord_in_frag;
out vec4 outColor;
void main(void) {
    if (frag_opt.x > 0.5) {
        float u = tex_coord_in_frag.x * uv_offset.x + uv_offset.z;
        float v = tex_coord_in_frag.y * uv_offset.y + uv_offset.w;
        if (u > 0.00001 && u < 0.99999 && v > 0.00001 && v < 0.99999) {
            vec4 res = texture(tex_sampler, vec2(u, v));
            outColor = res * base_color;
        } else {
            outColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
    } else {
        outColor = base_color;
    }
}
`;
}