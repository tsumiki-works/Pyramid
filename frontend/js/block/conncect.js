/**
 * A function to connect block if it can be connected.
 */
function connect_block(){
    const nearest_block = find_block(roots, (block) => {
        return Math.abs(block[BLOCK_IDX_X] - holding_block[BLOCK_IDX_X]) <
                    (block[BLOCK_IDX_WIDTH] + holding_block[BLOCK_IDX_WIDTH]) * 0.25
            && Math.abs(block[BLOCK_IDX_Y] - holding_block[BLOCK_IDX_Y]) < BLOCK_HEIGHT;
    });
    if (nearest_block == null) {
        push_block_to_roots(holding_block);
        return;
    }
    console.log(nearest_block, holding_block);
    if(holding_block[BLOCK_IDX_Y] < nearest_block[BLOCK_IDX_Y]) {
        let index = get_connection_idx(nearest_block, holding_block);
        if(nearest_block[BLOCK_IDX_CHILDREN][index] == null){
            nearest_block[BLOCK_IDX_CHILDREN][index] = holding_block;
            holding_block[BLOCK_IDX_PARENT] = nearest_block;
        }else{
            push_block_to_roots(holding_block);
        }
    } else {
        let index = get_connection_idx(holding_block, nearest_block);
        if(holding_block[BLOCK_IDX_CHILDREN][index] == null){
            remove_block_from_roots(nearest_block);
            push_block_to_roots(holding_block);
            holding_block[BLOCK_IDX_CHILDREN][index] = nearest_block;
            nearest_block[BLOCK_IDX_PARENT] = holding_block;
        }else{
            push_block_to_roots(holding_block);
        }
    }
}

/**
 * A function to get block's children connection.
 * @param {block} target_block
 * @return {[object]} relative connections of target_block 
 */
function get_block_connection(block){
    let res = [];
    for(let i=0; i < block[BLOCK_IDX_CHILDREN_NUM]; i++){
        res.push(block[BLOCK_IDX_WIDTH] * (0.5 ** block[BLOCK_IDX_CHILDREN_NUM]) * (2 * i + 1) - block[BLOCK_IDX_WIDTH] * 0.5);
    }
    return res;
}

/**
 * A function to find nearest block's connection.
 * @param {parent} parent_block
 * @param {child} child_block
 * @return index in integer
 */
function get_connection_idx(parent, child){
    let res_idx = -1, min_dist = -1;
    for(let i = 0; i < parent[BLOCK_IDX_CHILDREN_NUM]; i++){
        const dist = square_distance(parent[BLOCK_IDX_X] + parent[BLOCK_IDX_CHILDREN_CONNECTION][i], parent[BLOCK_IDX_Y], 
            child[BLOCK_IDX_X], child[BLOCK_IDX_Y]);
        if(min_dist == -1 || min_dist > dist){
            min_dist = dist;
            res_idx = i;
        }
    }
    if(res_idx != -1){
        console.log(res_idx);
        return res_idx;
    }else{
        alert("ERROR: failed to calculate block's connection index.");
        return 0;
    }
}


/*
function enumerate(){
    let roots = [];
    for (const i of blocks) {
        if (i[BLOCK_IDX_PARENT] === null) {
            roots.push(i);
        }
    }
    console.log(roots);
    if(roots.length == 0 ){
        return "There are no blocks";
    }else if(roots.length > 1){
        return "All blocks aren't connected";
    }else{
        let s = "";
        function enumerate(array) {
            s += "("
            for (const block of array){
                if(block != null){
                    s += block[BLOCK_IDX_ID] + " ";
                    if(block[BLOCK_IDX_CHILDREN].length > 0){
                        enumerate(block[BLOCK_IDX_CHILDREN]);
                    }
                }
            }
            s += ")";
        }
        enumerate(roots);
        return s;
    }
}
*/

function square_distance(x1, y1, x2, y2){
    return (x1 - x2) ** 2 + (y1 - y2) ** 2
}
