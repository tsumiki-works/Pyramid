/**
 * @namespace block
 */
const BLOCK_UNIT_WIDTH = 1.0;
const BLOCK_UNIT_HALF_WIDTH = 1.0;
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

let holding_block = create_empty_block();
let open_trashbox = false;

/**
 * A function to create empty block.
 * <b>Be careful to that empty block's parent is `{}`.</b>
 * @returns {object}
 * @memberOf block
 */
function create_empty_block() {
    return {
        parent: {},
        children: [],
        x: 0.0,
        y: 0.0,
        width: BLOCK_UNIT_WIDTH,
        type: -1,
        content: "",
        leftmost: -BLOCK_UNIT_HALF_WIDTH,
        rightmost: BLOCK_UNIT_HALF_WIDTH,
    };
}
/**
 * A constructor for block.
 * @param {float} x coordinate on world
 * @param {float} y coordinate on world
 * @param {int} type number of children and color is based on this
 * @param {any} content atom in S-expression
 * @returns {object}
 * @memberOf block
 */
function create_block(x, y, type, content) {
    if (type >= TYPE_TO_CHILDREN_NUM.length) {
        alert("pyramid frontend error: tried to generate invalid type block.");
        return;
    }
    let children = [];
    for (let i = 0; i < TYPE_TO_CHILDREN_NUM[type]; ++i) {
        children.push(create_empty_block());
    }
    const width = children.length * BLOCK_UNIT_WIDTH;
    const half_width = width * 0.5;
    return {
        parent: {},
        children: children,
        x: x,
        y: y,
        width: width,
        type: type,
        content: content,
        leftmost: -half_width,
        rightmost: half_width,
    };
}
/**
 * A function to check if `block` is block or not.
 * @param {object} block which you want to check
 * @returns if `block` is block then `true`, otherwise `false`.
 * @memberOf block
 */
function is_empty_block(block) {
    return !("type" in block) || block.type == -1;
}
/**
 * A function to enumerate and create S-expression of `node`.
 * @param {object} block which you want to convert to S-expression
 * @returns {string} S-expression of `node`
 * @memberOf block
 */
function enumerate(block) {
    let res = "";
    if (block.children.length == 0) {
        res += block.content;
    } else {
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