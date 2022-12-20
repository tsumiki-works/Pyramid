import { PyramidEngine } from "./pyramid_engine/pyramid_engine.js";
import { Pager } from "./pager.js";
import { PyramidPlayground } from "./pyramid_engine/pyramid_playground.js";
import { PyramidTutorial } from "./pyramid_engine/pyramid_tutorial.js";

export class Pyramid {

    private engine: PyramidEngine;

    constructor(engine_name: string) {
        switch (engine_name) {
            case "playground":
                this.engine = new PyramidPlayground();
                break;
            case "tutorial":
                let searchParams = new URLSearchParams(document.location.search);
                if (searchParams.has("q")) {
                    let param_q = searchParams.get("q");
                    if (!isNaN(Number(param_q))) {
                        this.engine = new PyramidTutorial(parseInt(param_q));
                    } else {
                        alert("Invalid Query of `q`: param `q` must be number.");
                        Pager.goto_top_from_tutorial();
                    }
                } else {
                    Pager.goto_top_from_tutorial();
                }
                break;
            case "goto-tutorial":
                // for debug case
                Pager.goto_tutorial_top();
                break;
            default:
                alert("Pyramid frontend error: failed to attach PyramidEngine.")
        }
    }
}