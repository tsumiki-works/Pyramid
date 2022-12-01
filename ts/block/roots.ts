import { GLRequest } from "../webgl/glrequest.js";
import { Block } from "../block/block.js";

export class Roots {

    private roots: Block[];

    constructor() {
        this.roots = new Array<Block>();
    }

    push(block: Block): void {
        this.roots.push(block);
    }

    find_block(f: Function): Block {
        for (const root of this.roots) {
            const res = root.find(f);
            if (!res.is_empty()) {
                return res;
            }
        }
        return Block.create_empty_block();
    }

    remove_block(target: Block): boolean {
        for (let i = 0; i < this.roots.length; ++i) {
            if (this.roots[i] === target) {
                this.roots[i] = Block.create_empty_block();
                return true;
            }
            if (this.roots[i].remove(target)) {
                return true;
            }
        }
        return false;
    }

    connect_block(target: Block): boolean {
        for (const root of this.roots) {
            if (root.connect_with(target)) {
                return true;
            }
        }
        return false;
    }

    push_requests(requests: GLRequest[]): void {
        this.roots = this.roots.filter(block => !block.is_empty());
        for (const block of this.roots) {
            block.arrange();
            block.push_requests(requests);
        }
    }
}