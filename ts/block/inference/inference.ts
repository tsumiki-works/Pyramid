import { Block } from "../block.js";
import { TypedBlock } from "../typed_block.js";
import { encode_type, TypeEnv } from "./typeenv.js";
import { Keywords } from "../../keywords.js";

export class Inference {
    static infer(block: Block) {
        if (block.is_empty()) {
            return;
        }
        const env = new TypeEnv();
        for (const keyword of Keywords.keywords) {
            env.set(keyword[0], encode_type(keyword[1].pyramid_type));
        }
        const tree = (block as TypedBlock).infer_type(env);
        (block as TypedBlock).set_type(tree);
        //console.log(tree);
    }
}