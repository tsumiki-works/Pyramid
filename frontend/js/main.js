const canvas = document.querySelector("#workspace");
let img_texs = [];
const IMGTEX_IDX_LOGO = 0;

function render() {
    let requests = [];
    requests.push([img_texs[IMGTEX_IDX_LOGO], [0.0, 0.0, -10.0], [1.0, 1.0, 1.0]]);
    update_webgl(requests, canvas.width / canvas.height);
}

window.onload = () => {
    const workspace_wrapper = document.getElementById("workspace-wrapper");
    canvas.width = workspace_wrapper.offsetWidth;
    canvas.height = workspace_wrapper.offsetHeight;
    init_webgl(canvas);
    img_texs.push(create_image_texture(document.getElementById("img-logo")));
    render();
}
