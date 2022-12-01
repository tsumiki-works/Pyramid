import { Request } from "../webgl/request.js";
import { Vec3 } from "../webgl/math.js";
import { Block } from "../block/block.js";

export class Roots {

    private roots: Block[];

    constructor() {
        this.roots = new Array<Block>();
    }

    push(block: Block): void {
        this.roots.push(block);
    }

    clean(): void {
        this.roots = this.roots.filter(block => !block.is_empty());
    }

    find_block(f: Function): Block {
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

    remove_block(target: Block): boolean {
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

    connect_block(holding_block: Block): boolean {
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
                const dist: number = (parent.x + parent_connection[i] - child.x) ** 2.0 + (parent.y - child.y) ** 2.0;
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
        const nearest_block: Block = this.find_block((block: Block) => {
            return Math.abs(block.x - holding_block.x) <
                (block.width + holding_block.width) * 0.25
                && Math.abs(block.y - holding_block.y) < Block.UNIT_HEIGHT;
        });
        if (!nearest_block.is_empty() && holding_block.y < nearest_block.y) {
            let index: number = get_connectable_idx(nearest_block, holding_block);
            if (index != -1) {
                nearest_block.children[index] = holding_block;
                holding_block.parent = nearest_block;
            } else {
                this.roots.push(holding_block);
            }
            return true;
        } else {
            this.roots.push(holding_block);
            return false;
        }
    }

    push_requests(view: Vec3, requests: Request[]): void {
        for (const block of this.roots) {
            block.arrange();
            block.push_requests(view, requests);
        }
    }
}