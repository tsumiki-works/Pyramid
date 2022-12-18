import { Bool } from "./bool.js";
import { PyramidNumber } from "./pyramid_number.js";
// FIXME: Override Namespace?
import { String } from "./string.js";

export class Evaluator {
    static get_literal_type(literal: string): PyramidType {
        // TODO:
        // These conditions are evaluated in this order literary.
        if (PyramidNumber.check_type(literal)) return { type_id: PyramidTypeID.Number, attribute: null };
        else if (Bool.check_type(literal)) return { type_id: PyramidTypeID.Bool, attribute: null };
        else if (String.check_type(literal)) return { type_id: PyramidTypeID.String, attribute: null };
        else return { type_id: PyramidTypeID.Invalid, attribute: null };
    }
    static eval_literal(literal: string, pyramid_type: PyramidType): PyramidObject {
        // TODO:
        if (PyramidNumber.check_type(literal)) return PyramidNumber.eval(literal, null);
        else if (Bool.check_type(literal)) return Bool.eval(literal, null);
        else if (String.check_type(literal)) return String.eval(literal, null);
        else throw Error("");
        // ERROR
    }
}