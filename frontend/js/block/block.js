/**
 * A constructor for block.
 * @param {float} x coordinate on world
 * @param {float} y coordinate on world
 * @param {any} type
 * @param {any} content
 */
function create_block(x, y, type, content) {
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
 * A function to push a block to roots array.
 * @param {object} block which you want to push to roots array
 */
function push_block_to_roots(block) {
    roots.push(block);
}

/**
 * A function to remove block from tree in roots.
 */
function remove_block_from_roots(block_removing) {
    function remove_block_(children) {
        if (children.length == 0)
            return;
        for (let i = 0; i < children.length; ++i) {
            if (children[i] == null)
                continue;
            if (children[i] === block_removing) {
                children[i] = null;
                return;
            }
            remove_block_(children[i][BLOCK_IDX_CHILDREN]);
        }
    }
    remove_block_(roots);
}
/**
 * A function to find a block which f(block) is true in roots.
 * @param f fn(block)->bool 
 * @returns If it's found, then it. Otherwise, null.
 */
function find_block_from_roots(f) {
    return find_block(roots, f);
}
/**
 * A function to 
 */
function enumerate() {
    console.log(roots);
}