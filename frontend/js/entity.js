const LOGO_WIDTH = 191.95;
const LOGO_HEIGHT = 32.0;
function entity_logo() {
    const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [LOGO_WIDTH * 0.5, LOGO_HEIGHT * 0.5]);
    return [
        [pos[0], pos[1], 0.0],
        [LOGO_WIDTH, LOGO_HEIGHT, 1.0],
        [1.0, 1.0, 1.0, 1.0],
        img_texs[IMGTEX_IDX_TEX01],
        [1.0, 0.166, 0.0, 0.0],
        true,
    ];
}

const MENU_WIDTH = 190.0;
function entity_menu() {
    const MENU_HEIGHT = canvas.height - LOGO_HEIGHT;
    const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [MENU_WIDTH * 0.5, MENU_HEIGHT * 0.5]);
    return [
        [pos[0], pos[1] - LOGO_HEIGHT - 8.0, 0.0],
        [MENU_WIDTH, MENU_HEIGHT, 1.0],
        [0.5, 0.5, 0.5, 1.0],
        null,
        [0.0, 0.0, 0.0, 0.0],
        true,
    ];
}

function entity_block(x, y, width, height, is_ui) {
    let w = width;
    let h = height;
    if (is_ui) {
        const half_width = width * 0.5;
        const half_height = height * 0.5;
        const pos_view_1 = convert_view_to_clipping([x - half_width, y - half_height, camera[2], 1.0], canvas.width, canvas.height);
        const pos_view_2 = convert_view_to_clipping([x + half_width, y + half_height, camera[2], 1.0], canvas.width, canvas.height);
        w = canvas.width * 0.5 * (pos_view_2[0] / pos_view_2[3] - pos_view_1[0] / pos_view_1[3]);
        h = canvas.height * 0.5 * (pos_view_2[1] / pos_view_2[3] - pos_view_1[1] / pos_view_2[3]);
    }
    return [
        [x, y, 0.0],
        [w, h, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        null,
        [0.0, 0.0, 0.0, 0.0],
        is_ui,
    ];
}

const CONSOLE_HEIGHT = 200.0;
function entity_console() {
    const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [0, CONSOLE_HEIGHT * 0.5]);
    return [
        [MENU_WIDTH * 0.5, -pos[1], 0.0],
        [canvas.width - MENU_WIDTH, CONSOLE_HEIGHT, 1.0],
        [0.25, 0.28, 0.37, 1.0],
        null,
        [0.0, 0.0, 0.0, 0.0],
        true,
    ];
}

function entity_character(x, y, width, height, color, tex_scale_offset, is_ui) {
    return [
        [x, y, 0.0],
        [width, height, 1.0],
        color,
        img_texs[IMGTEX_IDX_TEX_FONT],
        tex_scale_offset,
        is_ui,
    ];
}