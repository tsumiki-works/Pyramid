import { PyramidEngine } from "./pyramid_engine/pyramid_engine.js";
import { ConsoleManager } from "./console_manager.js";
import { Block } from "./block/block.js";
import { PyramidPlayground } from "./pyramid_engine/pyramid_playground.js";
import { PyramidTutorial } from "./pyramid_engine/pyramid_tutorial.js";

export class Pyramid {

    private engine: PyramidEngine;

    constructor(engine_name: string) {
        new ConsoleManager();
        switch(engine_name){
            case "playground":
                this.engine = new PyramidPlayground();
                break;
            case "tutorial":
                this.engine = new PyramidTutorial("TEST", []);
                break;
            default:
                alert("Pyramid frontend error: failed to attach PyramidEngine.")
        }
    }
}