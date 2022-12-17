import { Block } from "../block.js";
import { TypedBlock } from "../typed_block.js";
import { TypeEnv } from "./typeenv.js";
import { Keywords } from "../../keywords.js";

export class Inference {
    static infer(block: Block) {
        if (block.is_empty()) {
            return;
        }
        const env = new TypeEnv();
        env.set("+", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        for (const keyword of Keywords.keywords) {
            //env.set(keyword[0], { id: keyword[1].pyramid_type.type_id, var: null, attribute: keyword[1].pyramid_type.attribute } );
        }
        const tree = (block as TypedBlock).infer_type(env);
        (block as TypedBlock).set_type(tree);
    }
}