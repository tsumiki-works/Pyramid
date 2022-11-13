/**
 * @namespace block.connect
 */
/**
 * A function to connect block if it can be connected.
 * @memberOf block.connect
 */
function connect_block() {
    /**
     * A function to find nearest block's connection.
     * @param {object} parent
     * @param {object} child
     * @return index in integer
     * @memberOf block.connect
     * @access private
     */
    function get_connection_idx(parent, child) {
        let res_idx = -1, min_dist = -1;
        for (let i = 0; i < parent[BLOCK_IDX_CHILDREN_NUM]; i++) {
            const dist = square_distance(parent[BLOCK_IDX_X] + parent[BLOCK_IDX_CHILDREN_CONNECTION][i], parent[BLOCK_IDX_Y],
                child[BLOCK_IDX_X], child[BLOCK_IDX_Y]);
            if (min_dist == -1 || min_dist > dist) {
                min_dist = dist;
                res_idx = i;
            }
        }
        if (res_idx != -1) {
            console.log(res_idx);
            return res_idx;
        } else {
            alert("ERROR: failed to calculate block's connection index.");
            return 0;
        }
    }
    // from now on
    const nearest_block = find_block(roots, (block) => {
        return Math.abs(block[BLOCK_IDX_X] - holding_block[BLOCK_IDX_X]) <
            (block[BLOCK_IDX_WIDTH] + holding_block[BLOCK_IDX_WIDTH]) * 0.25
            && Math.abs(block[BLOCK_IDX_Y] - holding_block[BLOCK_IDX_Y]) < BLOCK_HEIGHT;
    });
    if (nearest_block == null) {
        get_roots().push(holding_block);
        return;
    }
    console.log(nearest_block, holding_block);
    if (holding_block[BLOCK_IDX_Y] < nearest_block[BLOCK_IDX_Y]) {
        let index = get_connection_idx(nearest_block, holding_block);
        if (nearest_block[BLOCK_IDX_CHILDREN][index] == null) {
            nearest_block[BLOCK_IDX_CHILDREN][index] = holding_block;
            holding_block[BLOCK_IDX_PARENT] = nearest_block;
        } else {
            get_roots().push(holding_block);
        }
    } else {
        let index = get_connection_idx(holding_block, nearest_block);
        if (holding_block[BLOCK_IDX_CHILDREN][index] == null) {
            remove_block_from_roots(nearest_block);
            get_roots().push(holding_block);
            holding_block[BLOCK_IDX_CHILDREN][index] = nearest_block;
            nearest_block[BLOCK_IDX_PARENT] = holding_block;
        } else {
            get_roots().push(holding_block);
        }
    }
}
/**
 * A function to get block's children connection.
 * @param {object} block
 * @return {object[]} relative connections of target_block 
 * @memberOf block.connect
 */
function get_block_connection(block) {
    let res = [];
    for (let i = 0; i < block[BLOCK_IDX_CHILDREN_NUM]; i++) {
        res.push(block[BLOCK_IDX_WIDTH] * (0.5 ** block[BLOCK_IDX_CHILDREN_NUM]) * (2 * i + 1) - block[BLOCK_IDX_WIDTH] * 0.5);
    }
    return res;
}
