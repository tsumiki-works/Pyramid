import { Block } from "../block/block.js";
import { BlockManager } from "../block/block_manager.js";
import { ConsoleManager } from "./console.js";
import { Entity } from "./entity.js";
import { EventManager } from "./event.js";
import { popup } from "./popup.js";

/**
 * A module to control all contents on the canvas
 */
export class PyramidContorller {
    private open_trashbox: boolean = false;
    private holding_block: Block = new Block()
    
}