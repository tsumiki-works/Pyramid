/**
 * A function to push a block to roots array.
 */
function push_block_to_roots(block) {
    roots.push(block);
}
/**
 * A function to push a new root to roots array.
 */
function create_and_push_root(x, y, type, content) {
    let children = [];
    for (let i = 0; i < 1; ++i) {
        children.push(null);
    }
    const root = [
        null,
        children,
        1,
        x,
        y,
        1.0,
        0.5,
        type,
        content,
    ];
    push_block_to_roots(root);
}
/**
 * A function to remove block from tree in roots.
 */
function remove_block_from_roots(block_removing) {
    function remove_block_(children) {
        if (children.length == 0)
            return;
        for (let i = 0; i < children.length; ++i) {
            if (children[i] == null)
                continue;
            if (children[i] === block_removing) {
                children[i] = null;
                return;
            }
            remove_block_(children[i][BLOCK_IDX_CHILDREN]);
        }
    }
    remove_block_(roots);
}
/**
 * A function to remove null from blocks.
 */
function arrangement_blocks(blocks) {
    for_each_blocks(blocks, block => {
        for (const child of block[BLOCK_IDX_CHILDREN]) {
            if (child == null)
                continue;
            child[BLOCK_IDX_X] = block[BLOCK_IDX_X];
            child[BLOCK_IDX_Y] = block[BLOCK_IDX_Y] - block[BLOCK_IDX_HEIGHT];
        }
    });
}
/**
 * A function to remove null from holding block.
 */
function arrangement_holding_block() {
    for_each_blocks([holding_block], block => {
        const half_width = block[BLOCK_IDX_WIDTH] * 0.5;
        const half_height = block[BLOCK_IDX_HEIGHT] * 0.5;
        const pos_view_1 = convert_view_to_clipping([block[BLOCK_IDX_X] - half_width, block[BLOCK_IDX_Y] - half_height, camera[2], 1.0], canvas.width, canvas.height);
        const pos_view_2 = convert_view_to_clipping([block[BLOCK_IDX_X] + half_width, block[BLOCK_IDX_Y] + half_height, camera[2], 1.0], canvas.width, canvas.height);
        const h = canvas.height * 0.5 * (pos_view_2[1] / pos_view_2[3] - pos_view_1[1] / pos_view_2[3]);
        for (const child of block[BLOCK_IDX_CHILDREN]) {
            if (child == null)
                continue;
            child[BLOCK_IDX_X] = block[BLOCK_IDX_X];
            child[BLOCK_IDX_Y] = block[BLOCK_IDX_Y] - h;
        }
    });
}
/**
 * A function to push all of block entity requests to requests array.
 */
function push_requests_blocks(requests) {
    roots = roots.filter(block => block != null);
    arrangement_blocks(roots);
    for_each_blocks(roots, block => {
        requests.push(
            entity_block(
                block[BLOCK_IDX_X],
                block[BLOCK_IDX_Y],
                block[BLOCK_IDX_WIDTH],
                block[BLOCK_IDX_HEIGHT],
                false
            )
        );
    });
}
/**
 * A function to push all of holding blocks entity requests to requests array.
 */
function push_requests_holding_blocks(requests) {
    arrangement_holding_block();
    for_each_blocks([holding_block], block => {
        requests.push(
            entity_block(
                block[BLOCK_IDX_X],
                block[BLOCK_IDX_Y],
                block[BLOCK_IDX_WIDTH],
                block[BLOCK_IDX_HEIGHT],
                true
            )
        );
    });
}
/**
 * A function to find a block which f(block) is true in roots.
 * @param f fn(block)->bool 
 * @returns If it's found, then it. Otherwise, null.
 */
function find_block_from_roots(f) {
    return find_block(roots, f);
}
/**
 * A function to 
 */
function enumerate() {
    console.log(roots);
}