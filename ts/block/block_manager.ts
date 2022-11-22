import { Block } from "./block.js";
import { ConstantBlock } from "../constant/constant_block.js";
import { BlockCalc } from "../lib/block_calc.js";

export class BlockManager {
    private holding_block: Block = new Block();
    private roots: Block[] = new Array<Block>();
    
    constructor(){}
    /*
    from blocks.js
    */
    static create_block(x: number, y: number, type: number, content: string): Block {
        return new Block(x, y, type, content);
    }

    get_roots(): Block[] {
        return this.roots;
    }
    /**
    * A function to remove all empty block from the top of roots array.
    * <b>You should call this before push block requests in roots.</b>
    * @memberOf block.blocks
    */
    clean_roots(): void {
        this.roots = this.roots.filter(block => !block.is_empty());
    }

    find_block(blocks: Block[], f: Function): Block {
        if (blocks.length == 0) {
            return new Block();
        }
        for (const block of blocks) {
            if (block.is_empty()) {
                continue;
            }
            if (f(block)) {
                return block;
            }
            const res_finding_from_children = this.find_block(block.children, f);
            if (!res_finding_from_children.is_empty()) {
                return res_finding_from_children;
            }
        }
        return new Block();
    }

    /**
    * A function to remove block from tree in `blocks`.
    * @param {object} target_block which you want to remove
    * @returns if removed then true, otherwise false.
    * @memberOf block.blocks
    */
    remove_block_from_roots(target_block: Block): boolean {
        function inner(block: Block) {
            if (block.is_empty()) {
                return false;
            }
            for (let i = 0; i < block.children.length; ++i) {
                if (block.children[i] === target_block) {
                    block.children[i] = new Block();
                    block.children[i].parent = block;
                    return true;
                }
                if (inner(block.children[i])) {
                    return true;
                }
            }
            return false;
        }
        for (let i = 0; i < this.roots.length; ++i) {
            if (this.roots[i] === target_block) {
                this.roots[i] = new Block();
                return true;
            }
            if (inner(this.roots[i])) {
                return true;
            }
        }
        return false;
    }
    // Setter for holding_block
    set_holding_block(block: Block): void {
        this.holding_block = block;
    }
    set_holding_block_pos(pos: number[]): void {
        if(pos.length == 2){
            this.holding_block.x = pos[0];
            this.holding_block.y = pos[1];
        }
    }
    // Getter for holding_block
    get_holding_block(): Block {
        return this.holding_block;
    }

    reset_holding_block(): void {
        this.holding_block = new Block();
    }

    enumerate(block: Block): string {
        let res = "";
        if (block.children.length == 0) {
            res += block.content;
        } else {
            res += "(";
            res += block.content;
            block.children.forEach(child => {
                res += " ";
                res += this.enumerate(child);
            });
            res += ")";
        }
        return res;
    }

    /*
    from connect.js
    */

    /**
    * A function to arrange `block`.
    * @param {object} target_block 
    * @param {float} wr 
    * @param {float} hr 
    * @memberOf block.blocks
    */
    arrange_block(target_block: Block, wr: number, hr: number): void {
        /**
        * A function to determine block width.
        * Then, block.x is overwritten as offset from center of its area.
        * @param {object} block 
        * @memberOf block.blocks
        * @access private
        */
        let determine_block_width = (block: Block): void => {
            if (block.is_empty() || block.children.length == 0) {
                block.x = 0.0;
                block.width = ConstantBlock.BLOCK_UNIT_WIDTH;
                block.leftmost = -ConstantBlock.BLOCK_UNIT_WIDTH * 0.5;
                block.rightmost = ConstantBlock.BLOCK_UNIT_WIDTH * 0.5;
                return;
            }
            if (block.children.length == 1) {
                determine_block_width(block.children[0]);
                block.x = block.children[0].x;
                block.width = ConstantBlock.BLOCK_UNIT_WIDTH;
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
        let determine_block_pos = (block: Block, x: number, y: number): void => {
            const center: number = x - block.x * wr;
            block.x = x;
            block.y = y;
            let offset: number = center + block.leftmost * wr;
            for (const child of block.children) {
                const child_area = (child.rightmost - child.leftmost) * wr;
                determine_block_pos(child, offset + child_area * 0.5 + child.x * wr, y - ConstantBlock.BLOCK_HEIGHT * hr);
                offset += child_area;
            }
        }
        // from now on
        const x: number = target_block.x;
        const y: number = target_block.y;
        determine_block_width(target_block);
        determine_block_pos(target_block, x, y);
    }

    /**
    * A function to connect block if it can be connected.
    * @memberOf block.connect
    */
    connect_block(): void {
        /**
        * A function to get block's children connection.
        * @param {object} block
        * @return {object[]} relative connections of target_block 
        * @memberOf block.connect
        * @access private
        */
        let get_block_connection = (width: number, children_num: number): number[] => {
            let res: number[] = [];
            for (let i = 0; i < children_num; i++) {
                res.push(width* (0.5 ** children_num) * (2 * i + 1) - width * 0.5);
            }
            return res;
        }
        /**
        * A function to find nearest block's connection.
        * @param {object} parent
        * @param {object} child
        * @return index in integer
        * @memberOf block.connect
        * @access private
        */
        let get_connectable_idx = (parent: Block, child: Block): number => {
            let res_idx: number = -1, min_dist: number = -1;
            let parent_connection: number[] = get_block_connection(parent.width, parent.children.length);
            for (let i = 0; i < parent.children.length; i++) {
                const dist: number = BlockCalc.square_distance(parent.x + parent_connection[i], parent.y,
                    child.x, child.y);
                if ((min_dist == -1 || min_dist > dist)){
                    min_dist = dist;
                    res_idx = i;
                }
            }
            if (res_idx != -1 && parent.children[res_idx].is_empty()) {
                return res_idx;
            } else {
                //Nearest block dones't have any connections.
                return -1;
            }
        }

        // from now on
        const nearest_block: Block = this.find_block(this.roots, (block: Block) => {
            return Math.abs(block.x - this.holding_block.x) <
                (block.width + this.holding_block.width) * 0.25
                && Math.abs(block.y - this.holding_block.y) < ConstantBlock.BLOCK_HEIGHT;
        });
        if (nearest_block.is_empty()) {
            this.get_roots().push(this.holding_block);
            return;
        }
        if (this.holding_block.y < nearest_block.y) {
            let index: number = get_connectable_idx(nearest_block, this.holding_block);
            if (index != -1){
                nearest_block.children[index] = this.holding_block;
                this.holding_block.parent = nearest_block;
            }else{
                this.get_roots().push(this.holding_block);
            }
        } else {
            let index: number = get_connectable_idx(this.holding_block, nearest_block);
            if (index != -1){
                this.remove_block_from_roots(nearest_block);
                this.get_roots().push(this.holding_block);
                this.holding_block.children[index] = nearest_block;
                nearest_block.parent = this.holding_block;
            }else{
                this.get_roots().push(this.holding_block);
            }
        }
    }
}