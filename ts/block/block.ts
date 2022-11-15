class Block {
    parent: Block;
    children: Block[];
    x: number;
    y: number;
    width: number;
    type: number;
    content: string;
    leftmost: number;
    rightmost: number;

    test(): void {
        console.log("test.");
    }
}

export {Block}