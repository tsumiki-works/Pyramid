import { GLRequest } from "../webgl/glrequest.js";
import { Vec3 } from "../webgl/math.js";
import { Block } from "./block.js";
import { Popup } from "../popup.js";
import { Roots } from "./roots.js";
import { PyramidTypeID } from "./pyramid_object.js";

export class BlockManager {

    private roots: Roots;
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

    on_right_mousedown(e: MouseEvent, cursor_pos_world: Vec3): boolean {
        const hit_block = this.roots.find_block((block: Block) => {
            return block.is_hit(cursor_pos_world[0], cursor_pos_world[1]);
        });
        if (hit_block.is_empty()) {
            this.roots.push(new Block(0, 0, [1, 0, 0, 1], { type_id: PyramidTypeID.Function, attribute: {args_cnt: 2, return_type: PyramidTypeID.I32} }, "+"));
            this.roots.push(new Block(0, 0, [0, 1, 0, 1], { type_id: PyramidTypeID.I32, attribute: null }, 12));
            this.roots.push(new Block(0, 0, [1, 1, 0, 1], { type_id: PyramidTypeID.I32, attribute: null }, 31));
            return false;
        }
        let first = null;
        switch (hit_block.get_type().type_id) {
            case PyramidTypeID.Function:
                first = ["実行", () => {
                    let env = new Map<String, any>();
                    env.set("+", (children: Block[], env) => {
                        let sum = 0;
                        for (const child of children) {
                            const res = child.eval(env);
                            sum += res.value;
                        }
                        return sum;
                    });
                    console.log(hit_block.eval(env));
                }]
                break;
        }
        new Popup(e.pageX, e.pageY, [
            first,
            ["削除", () => {
                this.roots.remove_block(hit_block);
                Popup.remove_popup();
            }
            ]
        ]);
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