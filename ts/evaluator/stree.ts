import { PyramidObject } from "./pyramid_object.js";
import { PyramidType } from "./pyramid_type.js";

export class STree {

    private value: string;
    private list: STree[];

    constructor(value?: string) {
        if (value) {
            this.value = value;
            this.list = null;
        } else {
            this.value = null;
            this.list = [];
        }
    }

    push(target: STree): void {
        if (this.list === null) {
            throw new Error("pyramid stree error: tried to push a tree to symbol.");
        } else {
            this.list.push(target);
        }
    }

    get_as_undefined_symbol(): string {
        if (this.list !== null) {
            throw new Error("pyramid stree error: variable or function name symbol must not be list.");
        }
        return this.value;
    }

    eval(sym_map: Map<string, PyramidObject>): PyramidObject {
        if (this.value === null && this.list === null) {
            throw new Error("pyramid evaluation error: invalid tree.");
        }
        // eval symbol
        if (this.list === null) {
            if (this.value.length == 0) {
                throw new Error("pyramid evaluation error: empty symbol.");
            }
            if (this.value.startsWith('"') && this.value.endsWith('"')) {
                return {
                    type_id: PyramidType.String,
                    value: this.value.slice(1).slice(0, -1),
                };
            }
            const maybe_number = Number(this.value);
            if (!isNaN(maybe_number)) {
                return {
                    type_id: PyramidType.Number,
                    value: maybe_number,
                };
            }
            const maybe_obj = sym_map.get(this.value);
            if (maybe_obj === undefined) {
                throw new Error("pyramid evaluation error: undefined symbol '" + this.value + "'.");
            }
            return maybe_obj;
        }
        // eval list
        const fun_sym_obj = this.list[0].eval(sym_map);
        if (fun_sym_obj.type_id !== PyramidType.Function || typeof fun_sym_obj.value !== "function") {
            throw new Error(
                "pyramid evaluation error: the first of list must be function but found "
                + fun_sym_obj.value
                + " the type is "
                + fun_sym_obj.type_id
            );
        }
        return fun_sym_obj.value(this.list, sym_map);
    }

}