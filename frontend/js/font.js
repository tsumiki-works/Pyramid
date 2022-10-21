const FONT_WIDTH_SCALE = 0.048828125;
const FONT_HEIGHT_SCALE = 0.1953125;

function get_font_offset_u(ascii) {
    return ((ascii - 32) % 20) * FONT_WIDTH_SCALE;
}
function get_font_offset_v(ascii) {
    return (Math.floor((ascii - 32) / 20)) * FONT_HEIGHT_SCALE;
}

// A function to push requests for drawing text
//   * text: str       ... text you wanna draw
//   * x: float        ... x coord of the center of the first character
//   * y: float        ... y coord of the center of the first character
//   * width: float    ... the width of a character
//   * height: float   ... the height of a character
//   * is_ui: boolean  ... whether the text is UI or not
//   * requests: []    ... target requests array
function push_requests_text(text, x, y, width, height, is_ui, requests) {
    for (let i = 0; i < text.length; ++i) {
        requests.push(entity_character(
            x + width * i,
            y,
            width,
            height,
            [
                FONT_WIDTH_SCALE,
                FONT_HEIGHT_SCALE,
                get_font_offset_u(text.charCodeAt(i)),
                get_font_offset_v(text.charCodeAt(i)),
            ],
            is_ui
        ));
    }
}