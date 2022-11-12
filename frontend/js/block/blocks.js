/**
 * A function to push a block to roots array.
 * @param {object} block which you want to push to roots array
 */
function push_block_to_roots(block) {
    roots.push(block);
}
/**
 * A function to remove block from tree in roots array.
 * @param {object} block which you want to remove from trees in roots array
 */
function remove_block_from_roots(block) {
    function remove_block_(children) {
        if (children.length == 0)
            return;
        for (let i = 0; i < children.length; ++i) {
            if (children[i] == null)
                continue;
            if (children[i] === block) {
                children[i] = null;
                return;
            }
            remove_block_(children[i][BLOCK_IDX_CHILDREN]);
        }
    }
    remove_block_(roots);
    roots = roots.filter(block => block != null);
}
/**
 * A function to find a block which f(block) is true in roots.
 * @param {function(object):boolean} f 
 * @returns {object} If it's found, then it. Otherwise, null.
 */
function find_block_from_roots(f) {
    return find_block(roots, f);
}
/**
 * A function to find a block that f(block) is true.
 * @param {[object]} blocks which you want to find a block in
 * @param {function(object):boolean} f which is true then block is found
 * @returns {object} If it's found, then it. Otherwise, null.
 */
function find_block(blocks, f) {
    if (blocks.length == 0)
        return null;
    for (const block of blocks) {
        if (block == null)
            continue;
        if (f(block))
            return block;
        const res_finding_from_children = find_block(block[BLOCK_IDX_CHILDREN], f);
        if (res_finding_from_children != null)
            return res_finding_from_children;
    }
    return null;
}
/**
 * A function to do f for blocks.
 * @param {[object]} blocks which you want to proceed
 * @param {function(object):void} f which you want to apply to all block in blocks
 */
function for_each_blocks(blocks, f) {
    if (blocks.length == 0)
        return null;
    for (const block of blocks) {
        if (block == null)
            continue;
        f(block);
        for_each_blocks(block[BLOCK_IDX_CHILDREN], f);
    }
}
/**
 * A function to push all block entity requests in `blocks`.
 * @param {[object]} blocks 
 * @param {boolean} is_ui 
 * @param {[object]} requests 
 */
function push_requests_blocks(blocks, is_ui, requests) {
    let wr = 1.0;
    let hr = 1.0;
    if (is_ui) {
        const pos_clipping_1 = convert_view_to_clipping([-0.5, -0.5, camera[2], 1.0], canvas.width, canvas.height);
        const pos_clipping_2 = convert_view_to_clipping([0.5, 0.5, camera[2], 1.0], canvas.width, canvas.height);
        wr = canvas.width * 0.5 * (pos_clipping_2[0] / pos_clipping_2[3] - pos_clipping_1[0] / pos_clipping_1[3]);
        hr = canvas.height * 0.5 * (pos_clipping_2[1] / pos_clipping_2[3] - pos_clipping_1[1] / pos_clipping_2[3]);
    }
    arrange_blocks(blocks, wr, hr);
    for_each_blocks(blocks, block => {
        requests.push(
            entity_block(
                block[BLOCK_IDX_X],
                block[BLOCK_IDX_Y],
                Math.max(block[BLOCK_IDX_WIDTH] - 0.6, 1.0) * wr,
                BLOCK_HEIGHT * hr,
                TYPE_TO_COL[block[BLOCK_IDX_TYPE]],
                is_ui
            )
        );
        push_requests_text(
            block[BLOCK_IDX_CONTENT],
            block[BLOCK_IDX_X],
            block[BLOCK_IDX_Y],
            0.15 * wr,
            0.3 * hr,
            [1.0, 1.0, 1.0, 1.0],
            is_ui,
            requests
        );
    });
}