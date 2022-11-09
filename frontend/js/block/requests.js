/**
 * A function to push all of block entity requests to requests array.
 * @param {[object]} requests 
 */
 function push_requests_blocks(requests) {
    roots = roots.filter(block => block != null);
    arrange_blocks(roots, 1.0, 1.0);
    for_each_blocks(roots, block => {
        requests.push(
            entity_block(
                block[BLOCK_IDX_X],
                block[BLOCK_IDX_Y],
                Math.max(block[BLOCK_IDX_WIDTH] - 0.6, 1.0),
                BLOCK_HEIGHT,
                false
            )
        );
    });
}
/**
 * A function to push all of holding blocks entity requests to requests array.
 * It depends on `canvas` outer global variable.
 * @param {[object]} requests 
 */
function push_requests_holding_blocks(requests) {
    const pos_clipping_1 = convert_view_to_clipping([-0.5, -0.5, camera[2], 1.0], canvas.width, canvas.height);
    const pos_clipping_2 = convert_view_to_clipping([0.5, 0.5, camera[2], 1.0], canvas.width, canvas.height);
    const wr = canvas.width * 0.5 * (pos_clipping_2[0] / pos_clipping_2[3] - pos_clipping_1[0] / pos_clipping_1[3]);
    const hr = canvas.height * 0.5 * (pos_clipping_2[1] / pos_clipping_2[3] - pos_clipping_1[1] / pos_clipping_2[3]);
    arrange_blocks([holding_block], wr, hr);
    for_each_blocks([holding_block], block => {
        requests.push(
            entity_block(
                block[BLOCK_IDX_X],
                block[BLOCK_IDX_Y],
                Math.max(block[BLOCK_IDX_WIDTH] - 0.6, 1.0) * wr,
                BLOCK_HEIGHT * hr,
                true
            )
        );
    });
}
