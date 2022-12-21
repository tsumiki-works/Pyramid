import { Environment } from "../evaluation/environment.js";
import { Block } from "./block.js";
import { DefineBlock } from "./concrete_block/define_block.js";
import { TypeEnv } from "./inference/typeenv.js";

/* ================================================================================================================= */
/*     Roots                                                                                                         */
/*         manages roots                                                                                             */
/* ================================================================================================================= */

export class Roots {

    private static readonly roots = document.getElementById("roots");

    static append(root: Block) {
        Roots.roots.appendChild(root);
    }

    static remove(root: Block) {
        Roots.roots.removeChild(root);
    }

    static connect(target: Block, x: number, y: number) {
        const roots_as_blocks = Array.from(Roots.roots.children) as Array<Block>;
        for (const root of roots_as_blocks) {
            if (root.connect_with(target, x, y)) {
                break;
            }
        }
    }

    static get(): Block[] {
        return Array.from(Roots.roots.children) as Array<Block>;
    }

    static push_global_definitions(self: Block, env: Environment) {
        for (const root of Roots.get()) {
            if (root !== self && root.tagName === "PYRAMID-DEFINE-BLOCK") {
                const definition = root as DefineBlock;
                if (definition.get_type().type_id !== PyramidTypeID.Invalid) {
                    definition.push_definition(env);
                }
            }
        }
    }

    static push_global_definition_types(self: Block, env: TypeEnv) {
        for (const root of Roots.get()) {
            if (root !== self && root.tagName === "PYRAMID-DEFINE-BLOCK") {
                console.log(root.tagName);
                const definition = root as DefineBlock;
                if (definition.get_type().type_id !== PyramidTypeID.Invalid) {
                    definition.push_definition_type(env);
                }
            }
        }
    }
}