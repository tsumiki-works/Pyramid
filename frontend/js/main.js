window.onload = () => {
    const canvas = document.querySelector("#workspace");
    const workspace_wrapper = document.getElementById("workspace-wrapper");
    canvas.width = workspace_wrapper.offsetWidth;
    canvas.height = workspace_wrapper.offsetHeight;
    init_webgl(canvas);
    update_webgl();
}
