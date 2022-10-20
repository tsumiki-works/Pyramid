let next_id = 0;
let blocks = [];
const BLOCK_IDX_ID = 0;
const BLOCK_IDX_PARENT = 1;
const BLOCK_IDX_CHILDREN = 2;
const BLOCK_IDX_X = 3;
const BLOCK_IDX_Y = 4;
const BLOCK_IDX_TYPE = 5;
const BLOCK_IDX_CONTENT = 6;

function create_block(x, y, type, content) {
    let block = [
        next_id,
        null,
        [],
        x,
        y,
        type,
        content,
    ];
    blocks.push(block);
    next_id += 1;
}

function push_requests_blocks(requests) {
    for (let i = 0; i < blocks.length; ++i) {
        requests.push(entity_block(blocks[i][BLOCK_IDX_X], blocks[i][BLOCK_IDX_Y], 1.0, 0.5));
    }
}