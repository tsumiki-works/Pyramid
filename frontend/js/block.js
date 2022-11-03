let roots = [];
let holding_block = null;
const BLOCK_IDX_PARENT = 0;
const BLOCK_IDX_CHILDREN = 1;
const BLOCK_IDX_CHILDREN_NUM = 2;
const BLOCK_IDX_X = 3;
const BLOCK_IDX_Y = 4;
const BLOCK_IDX_WIDTH = 5;
const BLOCK_IDX_HEIGHT = 6;
const BLOCK_IDX_TYPE = 7;
const BLOCK_IDX_CONTENT = 8;

/**
 * A function to push new root to roots array.
 */
function create_and_push_root(x, y, type, content) {
    let children = [];
    for (let i = 0; i < 1; ++i) {
        children.push(null);
    }
    const root = [
        null,
        children,
        1,
        x,
        y,
        1.0,
        0.5,
        type,
        content,
    ];
    roots.push(root);
}
/**
 * A function to push block to roots.
 */
function push_block_to_roots(block) {
    roots.push(block);
}
/**
 * A function to remove block from tree.
 */
function remove_block(block_removing) {
    function remove_block_(children) {
        if (children.length == 0)
            return;
        for (let i = 0; i < children.length; ++i) {
            if (children[i] == null)
                continue;
            if (children[i] === block_removing) {
                console.log("remove");
                children[i] = null;
                return;
            }
            remove_block_(children[i][BLOCK_IDX_CHILDREN]);
        }
    }
    remove_block_(roots);
}
/**
 * A function to remove null from roots.
 */
function arrangement_tree() {
    roots = roots.filter(block => block != null);
    map_block(block => {
        for (const child of block[BLOCK_IDX_CHILDREN]) {
            if (child == null)
                continue;
            child[BLOCK_IDX_X] = block[BLOCK_IDX_X];
            child[BLOCK_IDX_Y] = block[BLOCK_IDX_Y] - block[BLOCK_IDX_HEIGHT];
        }
    });
}
/**
 * A function to push all of block entity requests to requests array.
 */
function push_requests_blocks(requests) {
    arrangement_tree();
    function push_requests_blocks_(requests, tree) {
        if (tree == null)
            return;
        requests.push(
            entity_block(
                tree[BLOCK_IDX_X],
                tree[BLOCK_IDX_Y],
                1.0,
                0.5
            )
        );
        for (const child of tree[BLOCK_IDX_CHILDREN]) {
            push_requests_blocks_(requests, child);
        }
    }    
    for (const root of roots) {
        push_requests_blocks_(requests, root);
    }
}
/**
 * A function to do f for tree.
 * @param f fn(block)->void
 */
function map_block(f) {
    function map_block_(blocks) {
        if (blocks.length == 0)
            return null;
        for (const block of blocks) {
            if (block == null)
                continue;
            f(block);
            map_block_(block[BLOCK_IDX_CHILDREN]);
        }
    }
    map_block_(roots);
}
/**
 * A function to find a block that f(block) is true.
 * @param f fn(block)->bool 
 * @returns If it's found, then it. Otherwise, null.
 */
function find_block(f) {
    function find_block_(blocks) {
        if (blocks.length == 0)
            return null;
        for (const block of blocks) {
            if (block == null)
                continue;
            if (f(block))
                return block;
            const res_finding_from_children = find_block_(block[BLOCK_IDX_CHILDREN]);
            if (res_finding_from_children != null)
                return res_finding_from_children;
        }
        return null;
    }
    return find_block_(roots);
}
/**
 * A function to 
 */
function enumerate() {
    console.log(roots);
}