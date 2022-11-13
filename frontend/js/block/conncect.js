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
        for (let i = 0; i < parent.children.length; i++) {
            const dist = square_distance(parent.x + parent.children_connection[i], parent.y,
                child.x, child.y);
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
        return Math.abs(block.x - holding_block.x) <
            (block.width + holding_block.width) * 0.25
            && Math.abs(block.y - holding_block.y) < BLOCK_HEIGHT;
    });
    if (is_empty_block(nearest_block)) {
        get_roots().push(holding_block);
        return;
    }
    console.log(nearest_block, holding_block);
    if (holding_block.y < nearest_block.y) {
        let index = get_connection_idx(nearest_block, holding_block);
        if (is_empty_block(nearest_block.children[index])) {
            nearest_block.children[index] = holding_block;
            holding_block.parent = nearest_block;
        } else {
            get_roots().push(holding_block);
        }
    } else {
        let index = get_connection_idx(holding_block, nearest_block);
        if (is_empty_block(holding_block.children[index])) {
            remove_block_from_roots(nearest_block);
            get_roots().push(holding_block);
            holding_block.children[index] = nearest_block;
            nearest_block.parent = holding_block;
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
    for (let i = 0; i < block.children.length; i++) {
        res.push(block.width * (0.5 ** block.children.length) * (2 * i + 1) - block.width * 0.5);
    }
    return res;
}
