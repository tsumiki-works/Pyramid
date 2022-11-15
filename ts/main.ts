// <reference path="./block/block.ts" />
import {Block} from "./block/block.js"

export class Pyramid {
    private canvas: HTMLCanvasElement;

    camera: number[] = [0.0, 0.0, -5.0];

    constructor () {
        this.canvas = document.getElementById("workspace") as HTMLCanvasElement;
    }
    run(): void {
        let test: Block = new Block(200, 400, 0, "0");
        let test2: Block = new Block();
        test.debug();
        test2.debug();
    }

    render(): void {

    }
}