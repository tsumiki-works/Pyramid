import { Environment } from "../evaluation/environment.js";
import { Popup } from "../popup.js";
import { Block } from "./block.js"
import { ListBlock } from "./concrete_block/list_block.js";
import { LiteralBlock } from "./concrete_block/literal_block.js";
import { Roots } from "./roots.js";

const playground: HTMLDivElement = document.getElementById("playground") as HTMLDivElement;

export function popup_event_eval(block: Block) {
    Popup.remove_all_popup();
    let block_eval_result = document.getElementById("block-eval-result");
    if (block_eval_result !== null) {
        document.getElementById("roots").removeChild(block_eval_result);
    }
    let result = block.eval(new Environment());
    console.log(result);
    let result_block: Block = create_result_block(result);
    if (result_block === null) return;
    result_block.id = "block-eval-result";
    Roots.append(result_block);
    result_block.format();
}

export const create_result_block = (result: any): Block => {
    const result_pos: Vec2 = [
        document.documentElement.clientWidth - playground.getBoundingClientRect().left - 210,
        document.documentElement.clientHeight - 210,
    ];
    if (typeof result === "number" || typeof result === "boolean" || typeof result === "string") {
        return new LiteralBlock(result_pos, String(result));
    } else if (Array.isArray(result)) {
        const lst = new ListBlock(result_pos, 0);
        for (const res of result.reverse()) {
            const tmp = create_result_block(res);
            tmp.set_parent(lst);
            lst.appendChild(tmp);
        }
        lst.fold();
        return lst;
    } else {
        console.log("result is function so cannot create result block");
        return null;
    }
}