import { PyramidObject } from "../pyramid_object.js";
import { STree } from "../stree.js";

export class DefineOperation {
    
    static defvar(list: STree[], sym_map: Map<string, PyramidObject>): PyramidObject {
        if (list.length !== 4) {
            throw new Error(
                "pyramid calculation error: 'defvar' must have just 3 parameters but found "
                + (list.length - 1)
                + " parameters."
            );
        }
        const name = list[1].get_as_undefined_symbol();
        if (sym_map.has(name)) {
            throw new Error("pyramid calculation error: " + name + " has been defined.");
        }
        sym_map.set(name, list[2].eval(sym_map));
        const res = list[3].eval(sym_map);
        sym_map.delete(name);
        return res;
    }
    
}