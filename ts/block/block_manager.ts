import { Block } from "./block.js";
import { BlockCalc } from "../lib/block_calc.js";

export class BlockManager {

    private holding_block: Block;
    private roots: Block[];

    constructor() {
        this.holding_block = Block.create_empty_block();
        this.roots = new Array<Block>();
    }

    set_holding_block(block: Block): void {
        this.holding_block = block;
    }

    // wanted removed
    set_holding_block_pos(x: number, y: number): void {
        this.holding_block.x = x;
        this.holding_block.y = y;
    }

    get_holding_block(): Block {
        return this.holding_block;
    }

    get_roots(): Block[] {
        return this.roots;
    }

    reset_holding_block(): void {
        this.holding_block = Block.create_empty_block();
    }

    clean_roots(): void {
        this.roots = this.roots.filter(block => !block.is_empty());
    }

    find_block_from_roots(f: Function): Block {
        function inner(blocks: Block[]): Block {
            if (blocks.length == 0) {
                return Block.create_empty_block();
            }
            for (const block of blocks) {
                if (block.is_empty()) {
                    continue;
                }
                if (f(block)) {
                    return block;
                }
                const res_finding_from_children = inner(block.children);
                if (!res_finding_from_children.is_empty()) {
                    return res_finding_from_children;
                }
            }
            return Block.create_empty_block();
        }
        return inner(this.roots);
    }

    remove_block_from_roots(target: Block): boolean {
        function inner(block: Block) {
            if (block.is_empty()) {
                return false;
            }
            for (let i = 0; i < block.children.length; ++i) {
                if (block.children[i] === target) {
                    block.children[i] = Block.create_empty_block();
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
            if (this.roots[i] === target) {
                this.roots[i] = Block.create_empty_block();
                return true;
            }
            if (inner(this.roots[i])) {
                return true;
            }
        }
        return false;
    }

    arrange_block(target_block: Block, wr: number, hr: number): void {
        let determine_block_width = (block: Block): void => {
            if (block.is_empty() || block.children.length == 0) {
                block.x = 0.0;
                block.width = Block.UNIT_WIDTH;
                block.leftmost = -Block.UNIT_WIDTH * 0.5;
                block.rightmost = Block.UNIT_WIDTH * 0.5;
                return;
            }
            if (block.children.length == 1) {
                determine_block_width(block.children[0]);
                block.x = block.children[0].x;
                block.width = Block.UNIT_WIDTH;
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
        let determine_block_pos = (block: Block, x: number, y: number): void => {
            const center: number = x - block.x * wr;
            block.x = x;
            block.y = y;
            let offset: number = center + block.leftmost * wr;
            for (const child of block.children) {
                const child_area = (child.rightmost - child.leftmost) * wr;
                determine_block_pos(child, offset + child_area * 0.5 + child.x * wr, y - Block.UNIT_HEIGHT * hr);
                offset += child_area;
            }
        }
        const x: number = target_block.x;
        const y: number = target_block.y;
        determine_block_width(target_block);
        determine_block_pos(target_block, x, y);
    }

    connect_block(): void {
        let get_block_connection = (width: number, children_num: number): number[] => {
            let res: number[] = [];
            for (let i = 0; i < children_num; i++) {
                res.push(width * (0.5 ** children_num) * (2 * i + 1) - width * 0.5);
            }
            return res;
        }
        let get_connectable_idx = (parent: Block, child: Block): number => {
            let res_idx: number = -1, min_dist: number = -1;
            let parent_connection: number[] = get_block_connection(parent.width, parent.children.length);
            for (let i = 0; i < parent.children.length; i++) {
                const dist: number = BlockCalc.square_distance(parent.x + parent_connection[i], parent.y,
                    child.x, child.y);
                if ((min_dist == -1 || min_dist > dist)) {
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
        const nearest_block: Block = this.find_block_from_roots((block: Block) => {
            return Math.abs(block.x - this.holding_block.x) <
                (block.width + this.holding_block.width) * 0.25
                && Math.abs(block.y - this.holding_block.y) < Block.UNIT_HEIGHT;
        });
        if (nearest_block.is_empty()) {
            this.get_roots().push(this.holding_block);
            return;
        }
        if (this.holding_block.y < nearest_block.y) {
            let index: number = get_connectable_idx(nearest_block, this.holding_block);
            if (index != -1) {
                nearest_block.children[index] = this.holding_block;
                this.holding_block.parent = nearest_block;
            } else {
                this.get_roots().push(this.holding_block);
            }
        } else {
            let index: number = get_connectable_idx(this.holding_block, nearest_block);
            if (index != -1) {
                this.remove_block_from_roots(nearest_block);
                this.get_roots().push(this.holding_block);
                this.holding_block.children[index] = nearest_block;
                nearest_block.parent = this.holding_block;
            } else {
                this.get_roots().push(this.holding_block);
            }
        }
    }

}