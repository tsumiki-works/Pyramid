import { PyramidNumber } from "./pyramid_number.js";

export class Evaluator {
    static get_literal_type(literal: string): PyramidType {
        // TODO:
        if (PyramidNumber.check_type(literal)) return { type_id: PyramidTypeID.Number, attribute: null };
        else return { type_id: PyramidTypeID.Invalid, attribute: null };
    }
    static eval_literal(literal: string, pyramid_type: PyramidType): PyramidObject {
        // TODO:
        return PyramidNumber.eval(literal, null);
    }
}