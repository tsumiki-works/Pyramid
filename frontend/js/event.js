let mouse_pos_before_drag_x = 0.0;
let mouse_pos_before_drag_y = 0.0;
let camera_pos_before_drag_x = 0.0;
let camera_pos_before_drag_y = 0.0;

function fun_mousedown(event) {
    // mouseleft down
    if (event.which == 1) {
        if (event.pageX < MENU_WIDTH) {
            let is_generate = false;
            const pos_world = convert_2dscreen_to_3dworld([event.pageX, event.pageY]);
            if (event.pageX > 40 && event.pageX < 140) {
                if (event.pageY > 75 && event.pageY < 125) {
                    holding_block = (create_block(pos_world[0], pos_world[1], 0, "0"));
                    is_generate = true;
                }
                if (event.pageY > 135 && event.pageY < 185) {
                    holding_block = (create_block(pos_world[0], pos_world[1], 1, "plus"));
                    is_generate = true;
                }
                if (event.pageY > 195 && event.pageY < 245) {
                    holding_block = (create_block(pos_world[0], pos_world[1], 2, "minus"));
                    is_generate = true;
                }
                if (event.pageY > 255 && event.pageY < 305) {
                    holding_block = (create_block(pos_world[0], pos_world[1], 3, "times"));
                    is_generate = true;
                }
                if (event.pageY > 315 && event.pageY < 365) {
                    holding_block = (create_block(pos_world[0], pos_world[1], 4, "divide"));
                    is_generate = true;
                }
            }
            if (is_generate) {
                const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [event.pageX, event.pageY]);
                holding_block[BLOCK_IDX_X] = pos[0];
                holding_block[BLOCK_IDX_Y] = pos[1];
                canvas.addEventListener("mousemove", fun_left_mousemove);
                canvas.addEventListener("mouseup", fun_left_mouseup);
                canvas.removeEventListener("mousedown", fun_mousedown);
            }
        } else {
            const pos_world = convert_2dscreen_to_3dworld([event.pageX, event.pageY]);
            const hit_result = find_block(get_roots(), (block) => {
                const block_half_width = block[BLOCK_IDX_WIDTH] * 0.5;
                return Math.abs(block[BLOCK_IDX_X] - pos_world[0]) < block_half_width
                    && Math.abs(block[BLOCK_IDX_Y] - pos_world[1]) < BLOCK_HALF_HEIGHT;
            });
            if (hit_result != null) {
                holding_block = hit_result;
                console.log("hit_result = " + hit_result);
                remove_block_from_roots(hit_result);
                const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [event.pageX, event.pageY]);
                holding_block[BLOCK_IDX_X] = pos[0];
                holding_block[BLOCK_IDX_Y] = pos[1];
                canvas.addEventListener("mousemove", fun_left_mousemove);
                canvas.addEventListener("mouseup", fun_left_mouseup);
                canvas.removeEventListener("mousedown", fun_mousedown);
                open_trashbox = true;
            } else {
                console.log("MOUSEPOS: " + event.pageX + ", " + event.pageY);
            }
        }
    }
    // mouseright down : move around workspace
    else if (event.which == 3) {
        mouse_pos_before_drag_x = event.pageX;
        mouse_pos_before_drag_y = event.pageY;
        camera_pos_before_drag_x = camera[0];
        camera_pos_before_drag_y = camera[1];
        canvas.addEventListener("mousemove", fun_right_mousemove);
        canvas.addEventListener("mouseup", fun_right_mouseup);
        canvas.removeEventListener("mousedown", fun_mousedown);
    }
    render();
}

function fun_left_mouseup(_) {
    const pos_viewport = [holding_block[BLOCK_IDX_X] / canvas.width * 2.0, holding_block[BLOCK_IDX_Y] / canvas.height * 2.0];
    const pos_clipping = convert_2dviewport_to_3dclipping(camera[2], pos_viewport);
    const pos_view = convert_3dclipping_to_3dview(canvas.width, canvas.height, pos_clipping);
    const pos_world = convert_3dview_to_3dworld(camera, pos_view);
    const pos_trashbox = convert_2dscreen_to_2dunnormalizedviewport(
        canvas.width,
        canvas.height,
        [canvas.width - TRASHBOX_WIDTH * 0.5, canvas.height - get_console_height() - TRASHBOX_HEIGHT * 0.5]
    );
    canvas.removeEventListener("mousemove", fun_left_mousemove);
    canvas.removeEventListener("mouseup", fun_left_mouseup);
    canvas.addEventListener("mousedown", fun_mousedown);
    if (square_distance(pos_trashbox[0], pos_trashbox[1], holding_block[BLOCK_IDX_X], holding_block[BLOCK_IDX_Y]) > 10000) {
        holding_block[BLOCK_IDX_X] = pos_world[0];
        holding_block[BLOCK_IDX_Y] = pos_world[1];
        connect_block();
    }
    else {
        console.log("Success!Deleted!");
    }
    holding_block = null;
    open_trashbox = false;
    render();
}

function fun_left_mousemove(event) {
    const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [event.pageX, event.pageY]);
    holding_block[BLOCK_IDX_X] = pos[0];
    holding_block[BLOCK_IDX_Y] = pos[1];
    render();
}


function fun_right_mouseup(_) {
    canvas.removeEventListener("mousemove", fun_right_mousemove);
    canvas.removeEventListener("mouseup", fun_right_mouseup);
    canvas.addEventListener("mousedown", fun_mousedown);
    render();
}

function fun_right_mousemove(event) {
    const c = -0.00176 * camera[2] + 0.00235;
    camera[0] = camera_pos_before_drag_x - (mouse_pos_before_drag_x - event.pageX) * c;
    camera[1] = camera_pos_before_drag_y + (mouse_pos_before_drag_y - event.pageY) * c;
    render();
}

function fun_wheel(event) {
    if (event.pageX > MENU_WIDTH) {
        if (event.wheelDelta == 0)
            return;
        const prev_pos = convert_2dscreen_to_3dworld([event.pageX, event.pageY]);
        if (event.wheelDelta > 0) {
            camera[2] = camera[2] / 1.08;
        } else if (event.wheelDelta < 0) {
            camera[2] = camera[2] * 1.08;
        }
        camera[2] = Math.max(Math.min(camera[2], -1.5), -10.0);
        const next_pos = convert_2dscreen_to_3dworld([event.pageX, event.pageY]);
        camera[0] += next_pos[0] - prev_pos[0];
        camera[1] += next_pos[1] - prev_pos[1];
        event.preventDefault();
        render();
    }
    else {
        // メニューバーをスクロールさせるかも
        event.preventDefault();
    }
}
