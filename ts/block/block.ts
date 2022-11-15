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

export class BlockManager {
    static BLOCK_UNIT_WIDTH = 1.0;
    static BLOCK_UNIT_HALF_WIDTH = 0.5;
    static BLOCK_HEIGHT = 0.5;
    static BLOCK_HALF_HEIGHT = 0.25;

    static TYPE_TO_CHILDREN_NUM = [0, 2, 2, 2, 2, 2];
    static TYPE_TO_COL = [
        [0.15, 0.75, 0.75, 1.0],
        [0.15, 0.8, 0.2, 1.0],
        [0.15, 0.2, 0.8, 1.0],
        [0.35, 0.75, 0.35, 1.0],
        [0.2, 0.6, 0.6, 1.0],
    ];
    holding_block = new Block();
    open_trashbox: boolean = false;
    
    constructor(){}
    /*
    blocks.js
    connect.js
    */
}