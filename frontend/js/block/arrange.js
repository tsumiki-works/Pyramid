/**
 * A function to arrange block width based on its children.
 * For example, let `Block` be `Block(width, children array)`:
 *   * `Block(1, [Block(1, [])])`
 *   * `Block(2, [null, Block(1, [])])`
 *   * `Block(3, [Block(1, []), Block(1, [Block(1, []), null])])`
 * @param {object} block which you want to arrange
 * @returns {float} sum of width of children
 */
function arrange_block_width(block) {
    if (block === null)
        return BLOCK_UNIT_WIDTH;
    if (block[BLOCK_IDX_CHILDREN_NUM] == 0) {
        block[BLOCK_IDX_WIDTH] = BLOCK_UNIT_WIDTH;
        block[BLOCK_IDX_CHILDREN_CONNECTION] = get_block_connection(block);
        return block[BLOCK_IDX_WIDTH];
        //return BLOCK_UNIT_WIDTH;
    }
    const children_width = block[BLOCK_IDX_CHILDREN].reduce(
        (res, child) => res + arrange_block_width(child),
        0
    );
    block[BLOCK_IDX_WIDTH] = children_width;
    block[BLOCK_IDX_CHILDREN_CONNECTION] = get_block_connection(block);
    if (children_width < block[BLOCK_IDX_CHILDREN_NUM]) {
        alert(
            "pyramid frontend exception: number of children is "
            + block[BLOCK_IDX_CHILDREN_NUM]
            + " but sum of their width is "
            + children_width
            + " so something is wrong with system.");
    }
    return children_width;
}
/**
 * A function to arrange blocks.
 * It determines their width based on children and position based on root.
 * @param {[object]} blocks which you want to arrange all
 * @param {float} wr width magnification 
 * @param {float} hr height magnification 
 */
function arrange_blocks(blocks, wr, hr) {
    blocks.forEach(block => arrange_block_width(block));
    for_each_blocks(blocks, block => {
        if (block[BLOCK_IDX_CHILDREN_NUM] == 0)
            return;
        let x = block[BLOCK_IDX_X] - block[BLOCK_IDX_WIDTH] * 0.5 * wr;
        for (const child of block[BLOCK_IDX_CHILDREN]) {
            if (child === null) {
                x += BLOCK_UNIT_WIDTH;
            } else {
                const c = child[BLOCK_IDX_WIDTH] * 0.5 * wr;
                x += c;
                child[BLOCK_IDX_X] = x;
                child[BLOCK_IDX_Y] = block[BLOCK_IDX_Y] - BLOCK_HEIGHT * hr;
                x += c;
            }
        }
    });
}



function hoge() {
    const root = create_block(0, 0, 0, "");
    const child1 = create_block(0, 0, 0, "");
    const child2 = create_block(0, 0, 0, "");
    const child2child1 = create_block(0, 0, 0, "");
    const child2child2 = create_block(0, 0, 0, "");
    root[BLOCK_IDX_CHILDREN] = [child1, child2];
    root[BLOCK_IDX_CHILDREN_NUM] = 2;
    child1[BLOCK_IDX_PARENT] = root;
    child1[BLOCK_IDX_CHILDREN] = [];
    child1[BLOCK_IDX_CHILDREN_NUM] = 0;
    child2[BLOCK_IDX_PARENT] = root;
    child2[BLOCK_IDX_CHILDREN] = [child2child1, child2child2];
    child2[BLOCK_IDX_CHILDREN_NUM] = 2;
    child2child1[BLOCK_IDX_PARENT] = child2;
    child2child2[BLOCK_IDX_PARENT] = child2;

    roots.push(root);
    render();
}