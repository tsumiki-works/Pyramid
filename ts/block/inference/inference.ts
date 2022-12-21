import { Block } from "../block.js";
import { Roots } from "../roots.js";
import { TypedBlock } from "../typed_block.js";
import { TypeEnv } from "./typeenv.js";

export class Inference {
    static infer(block: Block) {
        if (block.is_empty()) {
            return;
        }
        const env = new TypeEnv();
        Roots.push_global_definition_types(block.get_root(), env);
        const tree = (block as TypedBlock).infer_type(env);
        (block as TypedBlock).set_type(tree);
        //console.log(tree);
    }
}