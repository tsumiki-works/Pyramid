import { Block } from "../block/block.js"

export class BlockCalc {
    static square_distance(x1: number, y1: number, x2: number, y2: number): number {
        return (x1 - x2) ** 2 + (y1 - y2) ** 2
    }
}
