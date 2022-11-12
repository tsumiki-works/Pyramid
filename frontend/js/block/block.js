let roots = [];
let holding_block = null;
let open_trashbox = false;

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

const TYPE_TO_CHILDREN_NUM = [0, 1, 2, 3];
const TYPE_TO_COL = [
    [1.0, 0.0, 0.0, 1.0],
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],
    [1.0, 1.0, 0.0, 1.0],
];

/**
 * A constructor for block.
 * @param {float} x coordinate on world
 * @param {float} y coordinate on world
 * @param {any} type
 * @param {any} content
 */
function create_block(x, y, type, content) {
    if (type >= TYPE_TO_CHILDREN_NUM.length) {
        alert("pyramid frontend error: tried to generate invalid type block.");
        return;
    }
    const children_num = TYPE_TO_CHILDREN_NUM[type];
    let children = [];
    for (let i = 0; i < children_num; ++i) {
        children.push(null);
    }
    return [
        null,
        children,
        children_num,
        [],
        x,
        y,
        children_num * BLOCK_UNIT_WIDTH,
        type,
        content,
    ];
}
/**
 * A function to enumerate and create stree of `node`.
 * @param {object} node 
 * @returns {string} stree of `node`
 */
function enumerate_tree(tree) {
    let res = "";
    if (tree == null) { }
    else if (tree[BLOCK_IDX_CHILDREN_NUM] == 0) {
        res += tree[BLOCK_IDX_CONTENT];
    }
    else {
        res += "(";
        res += tree[BLOCK_IDX_CONTENT];
        tree[BLOCK_IDX_CHILDREN].forEach(child => {
            res += " ";
            res += enumerate_tree(child);
        });
        res += ")";
    }
    return res;
}
/**
 * A function to enumerate all blocks in roots.
 */
function enumerate() {
    return "(" + roots.map(block => enumerate_tree(block)).join(" ") + ")";
}
/**
 * A constructor for block entity request.
 * @param {float} x if is_ui is true then it must be on screen
 * @param {flaot} y if is_ui is true then it must be on screen
 * @param {float} width if is_ui is true then it must be on screen
 * @param {float} height if is_ui is true then it must be on screen
 * @param {boolean} is_ui 
 * @returns block entity request
 */
 function entity_block(x, y, width, height, col, is_ui) {
    return [
        [x, y, 0.0],
        [width, height, 1.0],
        col,
        null,
        [0.0, 0.0, 0.0, 0.0],
        is_ui,
    ];
}
/**
 * A function to push roots requests.
 * @param {[object]} requests 
 */
function push_requests_roots(requests) {
    push_requests_blocks(roots, false, requests);
}
/**
 * A function to push holding block requests.
 * @param {[object]} requests 
 */
function push_requests_holding_block(requests) {
    push_requests_blocks([holding_block], true, requests);
}