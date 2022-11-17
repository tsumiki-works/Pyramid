import { ConstantBlock } from "../constant/constant_block.js";

export class Block {
    parent: Block;
    children: Block[];
    x: number;
    y: number;
    width: number = ConstantBlock.BLOCK_UNIT_WIDTH;
    type: number;
    content: string;
    leftmost: number = -ConstantBlock.BLOCK_UNIT_HALF_WIDTH;
    rightmost: number = ConstantBlock.BLOCK_UNIT_HALF_WIDTH;

    constructor(_x: number = 0.0, _y: number = 0.0, _type: number = -1, _content: string = ""){
        this.children = new Array<Block>(ConstantBlock.TYPE_TO_CHILDREN_NUM[Math.max(0, _type)]);
        this.x = _x;
        this.y = _y;
        this.type = _type;
        this.content = _content;
        return;
    }
    is_empty(): boolean {
        return this.type == -1;
    }

    debug(): void {
        console.log(this.parent, this.children, this.x, this.y, this.width,
            this.type, this.content, this.leftmost, this.rightmost);
    }

    enumerate(): string {
        let res = "";
        if (this.children.length == 0) {
            res += this.content;
        } else {
            res += "(";
            res += this.content;
            this.children.forEach(child => {
                res += " ";
                res += child.enumerate();
            });
            res += ")";
        }
        return res;
    }
}