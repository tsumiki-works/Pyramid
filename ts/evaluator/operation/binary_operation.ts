import { PyramidObject } from "../pyramid_object.js";
import { PyramidType } from "../pyramid_type.js";
import { STree } from "../stree.js";

export class BinaryOperation {

    static add(list: STree[], sym_map: Map<string, PyramidObject>): PyramidObject {
        if (list.length !== 3) {
            throw new Error(
                "pyramid calculation error: '+' must have just 2 parameters but found "
                + (list.length - 1)
                + " parameters."
            );
        }
        const param1 = list[1].eval(sym_map);
        const param2 = list[2].eval(sym_map);
        if (param1.type_id !== PyramidType.Number || param2.type_id !== PyramidType.Number) {
            throw new Error("pyramid calculation error: the type of parameters of '+' must be Number.");
        }
        return {
            type_id: PyramidType.Number,
            value: param1.value + param2.value,
        };
    }

}