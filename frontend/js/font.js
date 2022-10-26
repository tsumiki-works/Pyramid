const FONT_WIDTH_SCALE = 0.0667;
const FONT_HEIGHT_SCALE = 0.125;

function get_font_offset_u(ascii) {
    return ((ascii - 32) % 15) * FONT_WIDTH_SCALE;
}
function get_font_offset_v(ascii) {
    return (Math.floor((ascii - 32) / 15)) * FONT_HEIGHT_SCALE;
}

// A function to push requests for drawing text
//   * text: str          ... text you wanna draw
//   * x: float           ... x coord of the center of the first character
//   * y: float           ... y coord of the center of the first character
//   * width: float       ... the width of a character
//   * height: float      ... the height of a character
//   * color : [float; 4] ... the color of the text
//   * is_ui: boolean     ... whether the text is UI or not
//   * requests: []       ... target requests array
function push_requests_text(text, x, y, width, height, color, is_ui, requests) {
    let cnt_chars = 0;
    let cnt_newline = 0;
    for (let i = 0; i < text.length; ++i) {
        if (text.charAt(i) == "\n") {
            cnt_newline += 1;
            cnt_chars = 0;
            continue;
        }
        requests.push(entity_character(
            x + width * cnt_chars,
            y - height * cnt_newline,
            width,
            height,
            color,
            [
                FONT_WIDTH_SCALE,
                FONT_HEIGHT_SCALE,
                get_font_offset_u(text.charCodeAt(i)),
                get_font_offset_v(text.charCodeAt(i)),
            ],
            is_ui
        ));
        cnt_chars += 1;
    }
}