const canvas = document.querySelector("#workspace");

let camera = [0.0, 0.0, -5.0];
let img_texs = [];
const IMGTEX_IDX_TEX01 = 0;

function render() {
    let requests = [];
    push_requests_blocks(requests);
    requests.push(entity_logo());
    requests.push(entity_menu());
    update_webgl(requests, canvas.width, canvas.height, camera);
}

window.onload = () => {
    const workspace_wrapper = document.getElementById("workspace-wrapper");
    canvas.width = workspace_wrapper.offsetWidth;
    canvas.height = workspace_wrapper.offsetHeight;
    canvas.addEventListener("mousedown", fun_mousedown);
    canvas.addEventListener("wheel", fun_wheel);
    init_webgl(canvas);
    img_texs.push(create_image_texture(document.getElementById("tex01")));
    render();
}
