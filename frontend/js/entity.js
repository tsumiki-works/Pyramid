const LOGO_WIDTH = 191.95;
const LOGO_HEIGHT = 32.0;
function logo() {
    return [
        [-canvas.width / 2.0 + LOGO_WIDTH / 2.0, canvas.height / 2.0 - LOGO_HEIGHT / 2.0, 0.0],
        [LOGO_WIDTH, LOGO_HEIGHT, 1.0],
        [1.0, 1.0, 1.0, 1.0],
        img_texs[IMGTEX_IDX_TEX01],
        [1.0, 0.166, 0.0, 0.0],
        true,
    ];
}

const MENU_WIDTH = 190.0;
function menu() {
    const MENU_HEIGHT = canvas.height - LOGO_HEIGHT;
    return [
        [-canvas.width / 2.0 + MENU_WIDTH / 2.0, canvas.height / 2.0 - MENU_HEIGHT / 2.0 - LOGO_HEIGHT - 8.0, 0.0],
        [MENU_WIDTH, MENU_HEIGHT, 1.0],
        [0.5, 0.5, 0.5, 1.0],
        null,
        [0.0, 0.0, 0.0, 0.0],
        true,
    ];
}
