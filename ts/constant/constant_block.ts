export class ConstantBlock {
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
}