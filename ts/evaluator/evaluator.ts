import { BinaryOperation } from "./operation/binary_operation.js";
import { DefineOperation } from "./operation/define_operation.js";
import { Parser } from "./parser.js";
import { PyramidObject } from "./pyramid_object.js";
import { PyramidType } from "./pyramid_type.js";

export class Evaluator {

    private sym_map: Map<string, PyramidObject>;

    constructor() {
        this.sym_map = new Map();
        this.sym_map.set("+", {
            type_id: PyramidType.Function,
            value: BinaryOperation.add,
        });
        this.sym_map.set("defvar", {
            type_id: PyramidType.Function,
            value: DefineOperation.defvar,
        });
        this.sym_map.set("defun", {
            type_id: PyramidType.Function,
            value: DefineOperation.defun,
        });
    }

    eval(defines: string[], target: string): any {
        return Parser.parse(target).eval(this.sym_map).value;
    }

}