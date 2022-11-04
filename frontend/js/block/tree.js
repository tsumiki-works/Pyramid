/**
 * A function to do f for blocks.
 * @param blocks [block; _]
 * @param f fn(block)->void
 */
 function for_each_blocks(blocks, f) {
    if (blocks.length == 0)
        return null;
    for (const block of blocks) {
        if (block == null)
            continue;
        f(block);
        for_each_blocks(block[BLOCK_IDX_CHILDREN], f);
    }
}
/**
 * A function to find a block that f(block) is true.
 * @param blocks [block; _]
 * @param f fn(block)->bool 
 * @returns If it's found, then it. Otherwise, null.
 */
function find_block(blocks, f) {
    if (blocks.length == 0)
        return null;
    for (const block of blocks) {
        if (block == null)
            continue;
        if (f(block))
            return block;
        const res_finding_from_children = find_block(block[BLOCK_IDX_CHILDREN], f);
        if (res_finding_from_children != null)
            return res_finding_from_children;
    }
    return null;
}
