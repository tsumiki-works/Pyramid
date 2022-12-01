import { GLRequest } from "../webgl/glrequest.js";
import { Vec3 } from "../webgl/math.js";
import { Block } from "./block.js";
import { Roots } from "./roots.js";

export class BlockManager {

    /* private */ roots: Roots;
    private holding_block: Block;

    constructor() {
        this.roots = new Roots();
        this.holding_block = Block.create_empty_block();
    }

    push_block_into_roots(block: Block): void {
        this.roots.push(block);
    }

    push_roots_requests(requests: GLRequest[]): void {
        this.roots.push_requests(requests);
    }

    push_holding_block_requests(requests: GLRequest[]): void {
        if (this.holding_block.is_empty()) {
            return;
        }
        this.holding_block.arrange();
        this.holding_block.push_requests(requests);
    }

    on_left_mousedown(cursor_pos_world: Vec3): boolean {
        const hit_block = this.roots.find_block((block: Block) => {
            return block.is_hit(cursor_pos_world[0], cursor_pos_world[1]);
        });
        if (hit_block.is_empty()) {
            return false;
        }
        this.roots.remove_block(hit_block);
        this.holding_block = hit_block;
        return true;
    }

    on_mouseup(): void {
        if (this.holding_block.is_empty()) {
            return;
        }
        //! [TODO] check if block is thrown away into trashbox
        if (!this.roots.connect_block(this.holding_block)) {
            this.roots.push(this.holding_block);
        }
        this.holding_block = Block.create_empty_block();
    }

    on_mousemove(cursor_pos_world): void {
        if (this.holding_block.is_empty()) {
            return;
        }
        this.holding_block.x = cursor_pos_world[0];
        this.holding_block.y = cursor_pos_world[1];
    }
}