import { Block } from "./block.js";

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
}