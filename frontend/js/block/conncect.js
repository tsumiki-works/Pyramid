/**
 * A function to connect block if it can be connected.
 */
function connect_block(){
    const nearest_block = find_block(roots, (block) => {
        return Math.abs(block[BLOCK_IDX_X] - holding_block[BLOCK_IDX_X]) <
                    (block[BLOCK_IDX_WIDTH] + holding_block[BLOCK_IDX_WIDTH]) / 2
            && Math.abs(block[BLOCK_IDX_Y] - holding_block[BLOCK_IDX_Y]) <
                    (block[BLOCK_IDX_HEIGHT] + holding_block[BLOCK_IDX_HEIGHT]) / 2;
    });
    if (nearest_block == null) {
        push_block_to_roots(holding_block);
        return;
    }
    if(holding_block[BLOCK_IDX_Y] < nearest_block[BLOCK_IDX_Y]) {
        let index = 0;
        nearest_block[BLOCK_IDX_CHILDREN][index] = holding_block;
        holding_block[BLOCK_IDX_PARENT] = nearest_block;
    } else {
        remove_block_from_roots(nearest_block);
        push_block_to_roots(holding_block);
        let index = 0;
        holding_block[BLOCK_IDX_CHILDREN][index] = nearest_block;
        nearest_block[BLOCK_IDX_PARENT] = holding_block;
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

function square_distance(x1, y1, x2, y2){
    return (x1 - x2) ** 2 + (y1 - y2) ** 2
}
*/