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
    static eval_literal(literal: string, pyramid_type: PyramidType): any {
        // TODO:
        switch (pyramid_type.type_id) {
            case PyramidTypeID.Number: return  PyramidNumber.eval(literal, null);
            case PyramidTypeID.Bool: return  Bool.eval(literal, null);
            case PyramidTypeID.String: return  String.eval(literal, null);
            default: throw new Error("");
        }
    }
}