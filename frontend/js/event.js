function fun_click(event) {
    create_block(0.0, 0.0, 0, "");
    render();
}

function fun_right_click(event) {
    render();
}

function fun_wheel(event) {
    if (event.wheelDelta > 0) {
        camera[2] -= 0.1;
    } else if (event.wheelDelta < 0) {
        camera[2] += 0.1;
    }
    render();
}