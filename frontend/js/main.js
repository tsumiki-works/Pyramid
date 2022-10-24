const canvas = document.getElementById("workspace");

let camera = [0.0, 0.0, -5.0];
let img_texs = [];
const IMGTEX_IDX_TEX01 = 0;
const IMGTEX_IDX_TEX_FONT = 1;

// A functions to get x or y UNNORMALIZED coord at which (0, 0) is at center of screen
// For example,
//   if canvas width is 1280, get_centerd_screen_x(0) = -640
//   if canvas height is 640, get_centerd_screen_y(0) = 320
function get_centered_screen_x(x) {
    return canvas.width * -0.5 + x;
}
function get_centered_screen_y(y) {
    return canvas.height * 0.5 - y;
}

function render() {
    let requests = [];
    push_requests_blocks(requests);
    requests.push(entity_logo());
    requests.push(entity_menu());
    push_requests_console(requests);
    update_webgl(requests, canvas.width, canvas.height, camera);
}

window.onload = () => {
    const workspace_wrapper = document.getElementById("workspace-wrapper");
    canvas.width = workspace_wrapper.offsetWidth;
    canvas.height = workspace_wrapper.offsetHeight;
    canvas.addEventListener("mousedown", fun_mousedown);
    canvas.addEventListener("wheel", fun_wheel);
    document.body.addEventListener("keydown", fun_keydown);
    init_webgl(canvas);
    img_texs.push(create_image_texture(document.getElementById("tex01")));
    img_texs.push(create_image_texture(document.getElementById("tex_font")));
    render();
}
