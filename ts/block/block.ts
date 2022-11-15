import { BlockManager } from "./block_manager.js";

export class Block {
    parent: Block;
    children: Block[];
    x: number;
    y: number;
    width: number = BlockManager.BLOCK_UNIT_WIDTH;
    type: number;
    content: string;
    leftmost: number = -BlockManager.BLOCK_UNIT_HALF_WIDTH;
    rightmost: number = BlockManager.BLOCK_UNIT_HALF_WIDTH;

    constructor(_x: number = 0.0, _y: number = 0.0, _type: number = -1, _content: string = ""){
        this.children = new Array(BlockManager.TYPE_TO_CHILDREN_NUM[Math.max(0, _type)]);
        this.x = _x;
        this.y = _y;
        this.type = _type;
        this.content = _content;
        return;
    }
    isEmpty(): boolean {
        return this.type == -1;
    }

    debug(): void {
        console.log(this.parent, this.children, this.x, this.y, this.width,
            this.type, this.content, this.leftmost, this.rightmost);
    }
}