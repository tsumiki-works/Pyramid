import { PyramidObject } from "../pyramid_object.js";
import { PyramidType } from "../pyramid_type.js";
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

    static defun(list: STree[], sym_map: Map<string, PyramidObject>): PyramidObject {
        if (list.length !== 5) {
            throw new Error(
                "pyramid calculation error: 'defun' must have just 4 parameters but found "
                + (list.length - 1)
                + " parameters."
            );
        }
        const name = list[1].get_as_undefined_symbol();
        if (sym_map.has(name)) {
            throw new Error("pyramid calculation error: '" + name + "' has been defined.");
        }
        if (!list[2].is_list()) {
            throw new Error(
                "pyramid calculation error: second parameter of '"
                + name
                + "' definition must be list but found "
                + list[2]
            );
        }
        let param_syms = [];
        for (const i of list[2].get_list()) {
            param_syms.push(i.get_as_undefined_symbol());
        }
        const f = (list_: STree[], sym_map_: Map<string, PyramidObject>) => {
            if (list_.length !== param_syms.length + 1) {
                throw new Error(
                    "pyramid calculation error: '"
                    + name
                    + "' must have "
                    + param_syms.length
                    + " parameters but found "
                    + (list_.length - 1)
                    + " parameters."
                );
            }
            for (let i = 1; i < list_.length; ++i) {
                sym_map_.set(param_syms[i - 1], list_[i].eval(sym_map));
            }
            return list[3].eval(sym_map_);
        }
        sym_map.set(name, {type_id: PyramidType.Function, value: f});
        const res = list[4].eval(sym_map);
        sym_map.delete(name);
        return res;
    }
    
}