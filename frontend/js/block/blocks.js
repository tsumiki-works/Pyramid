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
 * A function to remove all empty block from the top of roots array.
 * <b>You should call this before push block requests in roots.</b>
 * @memberOf block.blocks
 */
function clean_roots() {
    roots = roots.filter(block => !is_empty_block(block));
}
/**
 * A function to arrange `block`.
 * @param {object} target_block 
 * @param {float} wr 
 * @param {float} hr 
 * @memberOf block.blocks
 */
function arrange_block(target_block, wr, hr) {
    /**
     * A function to determine block width.
     * Then, block.x is overwritten as offset from center of its area.
     * @param {object} block 
     * @memberOf block.blocks
     * @access private
     */
    function determine_block_width(block) {
        if (is_empty_block(block) || block.children.length == 0) {
            block.x = 0.0;
            block.width = BLOCK_UNIT_WIDTH;
            block.leftmost = -BLOCK_UNIT_WIDTH * 0.5;
            block.rightmost = BLOCK_UNIT_WIDTH * 0.5;
            return;
        }
        if (block.children.length == 1) {
            determine_block_width(block.children[0]);
            block.x = block.children[0].x;
            block.width = BLOCK_UNIT_WIDTH;
            block.leftmost = block.children[0].leftmost;
            block.rightmost = block.children[0].rightmost;
            return;
        }
        block.width = 1.0;
        block.leftmost = 0.0;
        block.rightmost = 0.0;
        let i = 0;
        for (const child of block.children) {
            determine_block_width(child);
            block.leftmost += child.leftmost;
            block.rightmost += child.rightmost;
            if (i == 0) {
                block.width += child.rightmost - child.x - child.width * 0.5;
            } else if (i == block.children.length - 1) {
                block.width += child.x - child.width * 0.5 - child.leftmost;
            } else {
                block.width += child.rightmost - child.leftmost;
            }
            i += 1;
        }
        block.x = block.leftmost
            + (block.children[0].x - block.children[0].leftmost)
            + (block.children[0].width * 0.5 - 0.5)
            + block.width * 0.5;
    }
    /**
     * A function to determine block position.
     * Then, block.x must be offset from center of its area.
     * @param {object} block 
     * @param {float} x
     * @param {float} y 
     * @memberOf block.blocks
     * @access private
     */
    function determine_block_pos(block, x, y) {
        const center = x - block.x * wr;
        block.x = x;
        block.y = y;
        let offset = center + block.leftmost * wr;
        for (const child of block.children) {
            const child_area = (child.rightmost - child.leftmost) * wr;
            determine_block_pos(child, offset + child_area * 0.5 + child.x * wr, y - BLOCK_HEIGHT * hr);
            offset += child_area;
        }
    }
    // from now on
    const x = target_block.x;
    const y = target_block.y;
    determine_block_width(target_block);
    determine_block_pos(target_block, x, y);
    set_block_connection(target_block);
}
/**
 * A function to remove block from tree in `blocks`.
 * @param {object} target_block which you want to remove
 * @returns if removed then true, otherwise false.
 * @memberOf block.blocks
 */
function remove_block_from_roots(target_block) {
    function inner(block) {
        if (is_empty_block(block)) {
            return false;
        }
        for (let i = 0; i < block.children.length; ++i) {
            if (block.children[i] === target_block) {
                block.children[i] = create_empty_block();
                block.children[i].parent = block;
                return true;
            }
            if (inner(block.children[i])) {
                return true;
            }
        }
        return false;
    }
    for (let i = 0; i < roots.length; ++i) {
        if (roots[i] === target_block) {
            roots[i] = create_empty_block();
            return true;
        }
        if (inner(roots[i])) {
            return true;
        }
    }
    return false;
}
/**
 * A function to find a block that f(block) is true.
 * @param {object[]} blocks which you want to find a block in
 * @param {function(object):boolean} f which is true then block is found
 * @returns {object} If it's found, then it. Otherwise, empty block.
 * @memberOf block.blocks
 */
function find_block(blocks, f) {
    if (blocks.length == 0) {
        return create_empty_block();
    }
    for (const block of blocks) {
        if (is_empty_block(block)) {
            continue;
        }
        if (f(block)) {
            return block;
        }
        const res_finding_from_children = find_block(block.children, f);
        if (!is_empty_block(res_finding_from_children)) {
            return res_finding_from_children;
        }
    }
    return create_empty_block();
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
    function entity_block(x, y, width, height, col) {
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
     * A function to push block requests.
     * In some cases, empty block is drawn.
     * @param {object} block
     * @memberOf block.blocks
     * @access private
     */
    function push_requests(block) {
        if (is_empty_block(block) && is_empty_block(holding_block))
            return;
        if (is_empty_block(block) && is_ui)
            return;
        requests.push(
            entity_block(
                block.x,
                block.y,
                block.width * wr,
                BLOCK_HEIGHT * hr,
                is_empty_block(block) ? [1.0, 0.0, 0.0, 0.5] : TYPE_TO_COL[block.type]
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
        for (const child of block.children) {
            push_requests(child);
        }
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
    for (const block of blocks) {
        arrange_block(block, wr, hr);
        push_requests(block);
    }
}