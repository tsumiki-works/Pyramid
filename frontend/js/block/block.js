/**
 * @namespace block
 */
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
    [0.15, 0.75, 0.75, 1.0],
    [0.15, 0.8, 0.2, 1.0],
    [0.15, 0.2, 0.8, 1.0],
    [0.35, 0.75, 0.35, 1.0],
    [0.2, 0.6, 0.6, 1.0],
];

/**
 * A constructor for block.
 * @param {float} x coordinate on world
 * @param {float} y coordinate on world
 * @param {any} type number of children and color is based on this
 * @param {any} content atom in S-expression
 * @memberOf block
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
 * A function to enumerate and create S-expression of `node`.
 * @param {object} block which you want to convert to S-expression
 * @returns {string} S-expression of `node`
 * @memberOf block
 */
function enumerate(block) {
    let res = "";
    if (block == null) { }
    else if (block[BLOCK_IDX_CHILDREN_NUM] == 0) {
        res += block[BLOCK_IDX_CONTENT];
    }
    else {
        res += "(";
        res += block[BLOCK_IDX_CONTENT];
        block[BLOCK_IDX_CHILDREN].forEach(child => {
            res += " ";
            res += enumerate(child);
        });
        res += ")";
    }
    return res;
}
/**
 * A function to get holding block.
 * @returns {object} holding block
 * @memberOf block
 */
function get_holding_block() {
    return holding_block;
}