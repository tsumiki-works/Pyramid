let roots = [];
let holding_block = null;

const BLOCK_IDX_PARENT = 0;
const BLOCK_IDX_CHILDREN = 1;
const BLOCK_IDX_CHILDREN_NUM = 2;
const BLOCK_IDX_CHILDREN_CONNECTION = 3;
const BLOCK_IDX_X = 4;
const BLOCK_IDX_Y = 5;
const BLOCK_IDX_WIDTH = 6;
const BLOCK_IDX_TYPE = 7;
const BLOCK_IDX_CONTENT = 8;

const BLOCK_UNIT_WIDTH = 1.0;
const BLOCK_HEIGHT = 0.5;
const BLOCK_HALF_HEIGHT = 0.25;

const TYPE_TO_CHILDREN_NUM = [1, 2, 3];