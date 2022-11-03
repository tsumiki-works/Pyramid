let mouse_pos_before_drag_x = 0.0;
let mouse_pos_before_drag_y = 0.0;
let camera_pos_before_drag_x = 0.0;
let camera_pos_before_drag_y = 0.0;

function convert_cursorpos_to_worldpos(x, y) {
    const pos_viewport = convert_2dscreen_to_2dviewport(canvas.width, canvas.height, [x, y]);
    const pos_clipping = convert_2dviewport_to_3dclipping(camera[2], pos_viewport);
    const pos_view = convert_3dclipping_to_3dview(canvas.width, canvas.height, pos_clipping);
    const pos_world = convert_3dview_to_3dworld(camera, pos_view);
    return pos_world;
}

function fun_mousedown(event) {
    // mouseleft down
    if (event.which == 1) {
        if (event.pageX < MENU_WIDTH) {
            alert("clicked menu");
        } else {
            const pos_viewport = convert_2dscreen_to_2dviewport(canvas.width, canvas.height, [event.pageX, event.pageY]);
            const pos_clipping = convert_2dviewport_to_3dclipping(camera[2], pos_viewport);
            const pos_view = convert_3dclipping_to_3dview(canvas.width, canvas.height, pos_clipping);
            const pos_world = convert_3dview_to_3dworld(camera, pos_view);
            const hit_result = find_block((block) => {
                const block_half_width = block[BLOCK_IDX_WIDTH] * 0.5;
                const block_half_height = block[BLOCK_IDX_HEIGHT] * 0.5;
                return Math.abs(block[BLOCK_IDX_X] - pos_world[0]) < block_half_width
                    && Math.abs(block[BLOCK_IDX_Y] - pos_world[1]) < block_half_height;
            });
            if(hit_result != null){
                holding_block = hit_result;
                remove_block(hit_result);
                //block_remove_relationship();
                canvas.addEventListener("mousemove", fun_left_mousemove);
                canvas.addEventListener("mouseup", fun_left_mouseup);
                canvas.removeEventListener("mousedown", fun_mousedown);
            }else{
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

function fun_left_mouseup(event){
    connect_block();
    canvas.removeEventListener("mousemove", fun_left_mousemove);
    canvas.removeEventListener("mouseup", fun_left_mouseup);
    canvas.addEventListener("mousedown", fun_mousedown);
    holding_block = null;
    render();
}  

function fun_left_mousemove(event){
    const pos_world = convert_2dscreen_to_3dworld([event.pageX, event.pageY]);
    holding_block[BLOCK_IDX_X] = pos_world[0];
    holding_block[BLOCK_IDX_Y] = pos_world[1];
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
    if (event.wheelDelta == 0)
        return;
    const prev_pos = convert_cursorpos_to_worldpos(event.pageX, event.pageY);
    if (event.wheelDelta > 0) {
        camera[2] += 0.5;
    } else if (event.wheelDelta < 0) {
        camera[2] -= 0.5;
    }
    camera[2] = Math.max(Math.min(camera[2], -1.5), -10.0);
    const next_pos = convert_cursorpos_to_worldpos(event.pageX, event.pageY);
    camera[0] += next_pos[0] - prev_pos[0];
    camera[1] += next_pos[1] - prev_pos[1];
    event.preventDefault();
    render();
}

async function fun_keydown(event) {
    if (event.key.length == 1 && event.key.charCodeAt(0) >= 32 && event.key.charCodeAt(0) <= 126) {
        event.preventDefault(); // disable browser shortcut
        input_char(event.key);
    } else if (event.key == "Backspace") {
        remove_char();
    } else if (event.key == "Enter") {
        await enter();
    }
    render();
}