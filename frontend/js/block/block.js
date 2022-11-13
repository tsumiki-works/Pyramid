/**
 * @namespace block
 */
let holding_block = {};
let open_trashbox = false;

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
        children.push({});
    }
    let tmp_block = {};
    tmp_block.parent = {};
    tmp_block.children = children;
    tmp_block.children_num = children_num;
    tmp_block.x = x;
    tmp_block.y = y;
    tmp_block.width = children_num * BLOCK_UNIT_WIDTH;
    tmp_block.type = type;
    tmp_block.content = content;
    return tmp_block;
}
/**
 * A function to check if `block` is block or not.
 * @param {object} block which you want to check
 * @returns if `block` is block then `true`, otherwise `false`.
 * @memberOf block
 */
function is_empty_block(block) {
    return Object.keys(block).length == 0;
}
/**
 * A function to enumerate and create S-expression of `node`.
 * @param {object} block which you want to convert to S-expression
 * @returns {string} S-expression of `node`
 * @memberOf block
 */
function enumerate(block) {
    let res = "";
    if (is_empty_block(block)) { }
    else if (block.children_num == 0) {
        res += block.content;
    }
    else {
        res += "(";
        res += block.content;
        block.children.forEach(child => {
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