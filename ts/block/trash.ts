import { Block } from "./block.js";

/* ================================================================================================================= */
/*     Trash                                                                                                         */
/*         manages trash                                                                                             */
/* ================================================================================================================= */

export class Trash {

    private static readonly trash = document.getElementById("trash");

    static append(block: Block) {
        block.classList.remove("pyramid-block");
        block.classList.add("pyramid-block-disable");
        document.getElementById("trash").appendChild(block);
    }
}