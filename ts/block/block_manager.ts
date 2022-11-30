import { Block } from "./block.js";
import { BlockCalc } from "../lib/block_calc.js";
import { Translation } from "../lib/translation.js";
import { Vec3, Vec4 } from "../webgl/math.js";
import { Request } from "../webgl/request.js";

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

    push_holding_block_requests(canvas_width: number, canvas_height: number, view: Vec3, requests: Request[]): void {
        const pos_clipping_1: Vec4 = Translation.convert_view_to_clipping(
            [-0.5, -0.5, view[2], 1.0],
            canvas_width,
            canvas_height
        );
        const pos_clipping_2: Vec4 = Translation.convert_view_to_clipping(
            [0.5, 0.5, view[2], 1.0],
            canvas_width,
            canvas_height
        );
        const wr = canvas_width * 0.5 * (pos_clipping_2[0] / pos_clipping_2[3] - pos_clipping_1[0] / pos_clipping_1[3]);
        const hr = canvas_height * 0.5 * (pos_clipping_2[1] / pos_clipping_2[3] - pos_clipping_1[1] / pos_clipping_2[3]);
        this.holding_block.arrange(wr, hr);
        this.holding_block.push_requests(wr, hr, view, true, requests);
    }

    push_roots_requests(view: Vec3, requests: Request[]): void {
        for (const block of this.roots) {
            block.arrange(1.0, 1.0);
            block.push_requests(1.0, 1.0, view, false, requests);
        }
    }

}