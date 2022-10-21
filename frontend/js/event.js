let mouse_pos_before_drag_x = 0.0;
let mouse_pos_before_drag_y = 0.0; 
let camera_pos_before_drag_x = 0.0;
let camera_pos_before_drag_y = 0.0;

function get_workspace_x(pageX) {
    const c = canvas.width * 0.5;
    return (pageX - c) / c;
}

function get_workspace_y(pageY) {
    const c = canvas.height * 0.5;
    return -1.0 * (pageY - c) / c;
}

function fun_mousedown(event) {
    if (event.which == 1) {
        if (event.pageX < MENU_WIDTH) {
            alert("clicked menu");
        } else {
            const pos = convert_clipping_to_view([get_workspace_x(event.pageX), get_workspace_y(event.pageY), camera[2], 1.0], canvas.width, canvas.height);
            create_block(pos[0] * camera[2] * -1.0 - camera[0], pos[1] * camera[2] * -1.0 - camera[1], 0, "");
        }
    } else if (event.which == 3) {
        mouse_pos_before_drag_x = event.pageX;
        mouse_pos_before_drag_y = event.pageY;
        camera_pos_before_drag_x = camera[0];
        camera_pos_before_drag_y = camera[1];
        canvas.addEventListener("mousemove", fun_mousemove);
        canvas.addEventListener("mouseup", fun_right_mouseup);
        canvas.removeEventListener("mousedown", fun_mousedown);
    }
    render();
}

function fun_right_mouseup(_) {
    canvas.removeEventListener("mousemove", fun_mousemove);
    canvas.removeEventListener("mouseup", fun_right_mouseup);
    canvas.addEventListener("mousedown", fun_mousedown);
    render();
}

function fun_mousemove(event) {
    const c = 0.01;
    camera[0] = camera_pos_before_drag_x - (mouse_pos_before_drag_x - event.pageX) * c;
    camera[1] = camera_pos_before_drag_y + (mouse_pos_before_drag_y - event.pageY) * c;
    render();
}

function fun_wheel(event) {
    if (event.wheelDelta > 0) {
        camera[2] -= 0.1;
    } else if (event.wheelDelta < 0) {
        camera[2] += 0.1;
    }
    camera[2] = Math.max(Math.min(camera[2], -1.5), -10.0);
    render();
}