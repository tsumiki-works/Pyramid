let next_id = 0;
let blocks = [];
let holding_block = null;
const BLOCK_IDX_ID = 0;
const BLOCK_IDX_PARENT = 1;
const BLOCK_IDX_CHILDREN = 2;
const BLOCK_IDX_X = 3;
const BLOCK_IDX_Y = 4;
const BLOCK_IDX_WIDTH = 5;
const BLOCK_IDX_HEIGHT = 6;
const BLOCK_IDX_TYPE = 7;
const BLOCK_IDX_CONTENT = 8;

function create_block(x, y, type, content) {
    let block = [
        next_id,
        null,
        [],
        x,
        y,
        1.0,
        0.5,
        type,
        content,
    ];
    blocks.push(block);
    next_id += 1;
}

function push_requests_blocks(requests) {
    for (let i = 0; i < blocks.length; ++i) {
        requests.push(entity_block(blocks[i][BLOCK_IDX_X], blocks[i][BLOCK_IDX_Y], blocks[i][BLOCK_IDX_WIDTH], blocks[i][BLOCK_IDX_HEIGHT]));
    }
}

function hit_block(pos){
    for(const b of blocks){
        let block_half_width = b[BLOCK_IDX_WIDTH] * 0.5;
        let block_half_height = b[BLOCK_IDX_HEIGHT] * 0.5;
        if(Math.abs(b[BLOCK_IDX_X] - pos[0]) > block_half_width){
            continue;
        }
        if(Math.abs(b[BLOCK_IDX_Y] - pos[1]) > block_half_height){
            continue;
        }
        return [true, b[BLOCK_IDX_ID]];
    }
    return [false, -1];
}

function search_block_from_id(id){
    for(const b of blocks){
        if(b[BLOCK_IDX_ID] == id){
            return b;
        }
    }
    return null;
}
