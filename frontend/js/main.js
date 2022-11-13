const canvas = document.getElementById("workspace");

let camera = [0.0, 0.0, -5.0];
let img_texs = [];
const IMGTEX_IDX_TEX01 = 0;
const IMGTEX_IDX_TEX_FONT = 1;
const IMGTEX_IDX_TEX_TRASHBOX = 2;

function square_distance(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2
}

function replace_escape(message) {
    let message1 = message.replaceAll("<", "&lt;");
    let message2 = message1.replaceAll(">", "&gt;");
    return message2;
}
function exception_message(message) {
    return "<span class=\"exception\">pyramid frontend exception:</span> " + replace_escape(message);
}
function maybe_backend_error_message(message) {
    if (message.length > 22 && message.slice(0, 22) == "pyramid backend error:") {
        return "<span class=\"exception\">pyramid backend error:</span> " + replace_escape(message.slice(22));
    } else {
        return message;
    }
}

function render() {
    let requests = [];
    push_requests_blocks(get_roots(), false, requests);
    requests.push(entity_logo());
    requests.push(entity_menu());
    push_requests_menublocks(requests);
    requests.push(entity_trashbox(open_trashbox));
    push_requests_blocks([get_holding_block()], true, requests);
    update_webgl(canvas, requests, camera);
}

window.onload = () => {
    if (canvas.clientWidth < 600 || canvas.clientHeight < 600) {
        alert("pyramid frontend warning: too small window size to use Pyramid comfortably.");
    }
    // canvas
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.addEventListener("mousedown", fun_mousedown);
    canvas.addEventListener("wheel", fun_wheel);
    // window
    window.addEventListener("resize", () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        render();
    });
    // console
    init_console();
    // webgl
    init_webgl(canvas);
    img_texs.push(create_image_texture(document.getElementById("tex01")));
    img_texs.push(create_image_texture(document.getElementById("tex_font")));
    img_texs.push(create_image_texture(document.getElementById("tex_trashbox")));
    init_holding_block();
    render();
}
