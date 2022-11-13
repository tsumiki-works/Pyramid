/**
 * @namespace block.blocks
 */
let roots = [];
/**
 * A function to get roots array.
 * @returns {object[]} roots
 * @memberOf block.blocks
 */
function get_roots() {
    return roots;
}
/**
 * A function to remove block from tree in roots array.
 * @param {object} block which you want to remove from trees in roots array
 * @memberOf block.blocks
 */
function remove_block_from_roots(block) {
    roots = roots.filter(block => !is_empty_block(block));
    function remove_block_(children) {
        if (children.length == 0)
            return;
        for (let i = 0; i < children.length; ++i) {
            if (is_empty_block(block))
                continue;
            if (children[i] === block) {
                children[i] = {};
                return;
            }
            remove_block_(children[i].children);
        }
    }
    remove_block_(roots);
}
/**
 * A function to find a block that f(block) is true.
 * @param {object[]} blocks which you want to find a block in
 * @param {function(object):boolean} f which is true then block is found
 * @returns {object} If it's found, then it. Otherwise, empty block.
 * @memberOf block.blocks
 */
function find_block(blocks, f) {
    if (blocks.length == 0)
        return {};
    for (const block of blocks) {
        if (is_empty_block(block))
            continue;
        if (f(block))
            return block;
        const res_finding_from_children = find_block(block.children, f);
        if (Object.keys(res_finding_from_children).length != 0)
            return res_finding_from_children;
    }
    return {};
}
/**
 * A function to do f for blocks.
 * @param {object[]} blocks which you want to proceed
 * @param {function(object):void} f which you want to apply to all block in blocks
 * @memberOf block.blocks
 */
function for_each_blocks(blocks, f) {
    if (blocks.length == 0)
        return;
    for (const block of blocks) {
        if (is_empty_block(block))
            continue;
        f(block);
        for_each_blocks(block.children, f);
    }
}
/**
 * A function to push all block entity requests in `blocks`.
 * @param {object[]} blocks 
 * @param {boolean} is_ui 
 * @param {object[]} requests 
 * @memberOf block.blocks
 */
function push_requests_blocks(blocks, is_ui, requests) {
    /**
     * A constructor for block entity request.
     * @param {float} x if is_ui is true then it must be on screen
     * @param {flaot} y if is_ui is true then it must be on screen
     * @param {float} width if is_ui is true then it must be on screen
     * @param {float} height if is_ui is true then it must be on screen
     * @param {boolean} is_ui 
     * @returns block entity request
     * @memberOf block.blocks
     * @access private
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
     * A function to arrange blocks.
     * It determines their width based on children and position based on root.
     * @param {object[]} blocks which you want to arrange all
     * @param {float} wr width magnification 
     * @param {float} hr height magnification 
     * @memberOf block.arrange
     * @access private
     */
    function arrange_blocks(blocks, wr, hr) {
        /**
         * A function to arrange block width based on its children.
         * For example, let `Block` be `Block(width, children array)`:
         *   * `Block(1, [Block(1, [])])`
         *   * `Block(2, [emptyblock, Block(1, [])])`
         *   * `Block(3, [Block(1, []), Block(1, [Block(1, []), emptyblock])])`
         * @param {object} block which you want to arrange
         * @returns {float} sum of width of children
         * @access private
         */
        function arrange_block_width(block) {
            if (is_empty_block(block))
                return BLOCK_UNIT_WIDTH;
            if (block.children_num == 0) {
                block.width = BLOCK_UNIT_WIDTH;
                block.children_connection = get_block_connection(block);
                return block.width;
                //return BLOCK_UNIT_WIDTH;
            }
            const children_width = block.children.reduce(
                (res, child) => res + arrange_block_width(child),
                0
            );
            block.width = children_width;
            block.children_connection = get_block_connection(block);
            if (children_width < block.children_num) {
                alert(
                    "pyramid frontend exception: number of children is "
                    + block.children_num
                    + " but sum of their width is "
                    + children_width
                    + " so something is wrong with system.");
            }
            return children_width;
        }
        blocks.forEach(block => arrange_block_width(block));
        for_each_blocks(blocks, block => {
            if (block.children_num == 0)
                return;
            let x = block.x - block.width * 0.5 * wr;
            for (const child of block.children) {
                if (is_empty_block(child)) {
                    x += BLOCK_UNIT_WIDTH;
                } else {
                    const c = child.width * 0.5 * wr;
                    x += c;
                    child.x = x;
                    child.y = block.y - BLOCK_HEIGHT * hr;
                    x += c;
                }
            }
        });
    }
    // from now on
    let wr = 1.0;
    let hr = 1.0;
    if (is_ui) {
        const pos_clipping_1 = convert_view_to_clipping([-0.5, -0.5, camera[2], 1.0], canvas.width, canvas.height);
        const pos_clipping_2 = convert_view_to_clipping([0.5, 0.5, camera[2], 1.0], canvas.width, canvas.height);
        wr = canvas.width * 0.5 * (pos_clipping_2[0] / pos_clipping_2[3] - pos_clipping_1[0] / pos_clipping_1[3]);
        hr = canvas.height * 0.5 * (pos_clipping_2[1] / pos_clipping_2[3] - pos_clipping_1[1] / pos_clipping_2[3]);
    }
    arrange_blocks(blocks, wr, hr);
    for_each_blocks(blocks, block => {
        requests.push(
            entity_block(
                block.x,
                block.y,
                Math.max(block.width - 0.6, 1.0) * wr,
                BLOCK_HEIGHT * hr,
                TYPE_TO_COL[block.type],
                is_ui
            )
        );
        push_requests_text(
            block.content,
            block.x,
            block.y,
            0.15 * wr,
            0.3 * hr,
            [1.0, 1.0, 1.0, 1.0],
            is_ui,
            requests
        );
    });
}