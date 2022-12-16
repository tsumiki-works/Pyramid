import { I32 } from "./i32.js";

export class Evaluator {
    static get_literal_type(literal: string): PyramidType {
        if (I32.check_type(literal)) return { type_id: PyramidTypeID.I32, attribute: null };
        else return { type_id: PyramidTypeID.Invalid, attribute: null };
    }
    static eval_literal(literal: string, pyramid_type: PyramidType): PyramidObject {
        return {
            pyramid_type: {
                type_id: PyramidTypeID.I32,
                attribute: null,
            },
            value: 0,
        };
    }
}