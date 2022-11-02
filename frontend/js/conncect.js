function block_connect(){
    //connect holding_block to nearest block
    for(const b of blocks){
        if(Math.abs(b[BLOCK_IDX_X] - holding_block[BLOCK_IDX_X]) > (b[BLOCK_IDX_WIDTH] + holding_block[BLOCK_IDX_WIDTH]) / 2)
            continue;
        if(Math.abs(b[BLOCK_IDX_Y] - holding_block[BLOCK_IDX_Y]) > (b[BLOCK_IDX_HEIGHT] + holding_block[BLOCK_IDX_HEIGHT]) / 2)
            continue;
        // (parent, child) = (a block, holding_block)
        if(holding_block[BLOCK_IDX_Y] < b[BLOCK_IDX_Y]){
            b[BLOCK_IDX_CHILDREN].push(holding_block);
            holding_block[BLOCK_IDX_PARENT] = b;
            
            // Flexible Connect is required for Block which have more than 1 children
            holding_block[BLOCK_IDX_X] = b[BLOCK_IDX_X];
            holding_block[BLOCK_IDX_Y] = b[BLOCK_IDX_Y] - b[BLOCK_IDX_HEIGHT];
        }
        // (parent, child) = (holding_block, a block)
        if(b[BLOCK_IDX_Y] < holding_block[BLOCK_IDX_Y]){
            holding_block[BLOCK_IDX_CHILDREN].push(b);
            b[BLOCK_IDX_PARENT] = holding_block;

            // (same as upper)
            b[BLOCK_IDX_X] = holding_block[BLOCK_IDX_X];
            b[BLOCK_IDX_Y] = holding_block[BLOCK_IDX_Y] - holding_block[BLOCK_IDX_HEIGHT];
        }
    }
}

function block_remove_relationship(){
    if(holding_block[BLOCK_IDX_PARENT] != null){
        parent = holding_block[BLOCK_IDX_PARENT];
        parent[BLOCK_IDX_CHILDREN] = parent[BLOCK_IDX_CHILDREN].filter(b => b !== holding_block);
    }
    // Remove all children (will change in the future)
    for(const b of blocks){
        if(holding_block[BLOCK_IDX_CHILDREN].includes(b)){
            b[BLOCK_IDX_PARENT] = null;
        }
    }
    holding_block[BLOCK_IDX_PARENT] = null;
    holding_block[BLOCK_IDX_CHILDREN] = [];
}

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