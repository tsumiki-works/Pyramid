import { Bool } from "./bool.js";
import { F32 } from "./f32.js";
import { I32 } from "./i32.js";
import { PyramidNumber } from "./pyramid_number.js";
// FIXME: Override Namespace?
import { String } from "./string.js";

export class Evaluator {
    static get_literal_type(literal: string): PyramidType {
        // TODO:
        // These conditions are evaluated in this order literary.
        if (I32.check_type(literal)) return { type_id: PyramidTypeID.I32, attribute: null };
        else if (F32.check_type(literal)) return { type_id: PyramidTypeID.F32, attribute: null };
        else if (PyramidNumber.check_type(literal)) return { type_id: PyramidTypeID.Number, attribute: null };
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