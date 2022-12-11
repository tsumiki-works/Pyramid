export class Operator {
    private static pyramid_f32_nan: PyramidObject = {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: Number.NaN
    }
    private static pyramid_f32_positive_inf: PyramidObject = {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: Number.POSITIVE_INFINITY
    }
    private static pyramid_f32_negative_inf: PyramidObject = {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: Number.NEGATIVE_INFINITY
    }

    private static is_in_i32(val: number): boolean {
        return (-2147483648 < val && val < 2147483647);
    }
    private static is_in_f32(val: number): boolean {
        return (-3.402823e+38 < val && val < 3.402823e+38);
    }
    private static isString = (val: any): val is string => typeof val === "string";
    
    //operator
    static add(arg1: PyramidObject, arg2: PyramidObject): PyramidObject {
        if (arg1.pyramid_type.type_id === PyramidTypeID.I32 && arg2.pyramid_type.type_id === PyramidTypeID.I32) {
            let ans: number = arg1.value + arg2.value;
            //check  isInf, isInt
            if (!Operator.is_in_i32(ans)) {
                if (ans >= 0) {throw Error ("pyramid backend error: int addition overflowed toward positive");}
                else {throw Error ("pyramid backend error: int addition overflowed toward negative");}
            }
            if (!Number.isInteger(ans)) throw new Error("pyramid backend error: int addition return non-integer")
            return {
                pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
                value: ans
            }
        }
        else if (arg1.pyramid_type.type_id === PyramidTypeID.F32 && arg2.pyramid_type.type_id === PyramidTypeID.F32
            || arg1.pyramid_type.type_id === PyramidTypeID.F32 && arg2.pyramid_type.type_id === PyramidTypeID.I32
            || arg1.pyramid_type.type_id === PyramidTypeID.I32 && arg2.pyramid_type.type_id === PyramidTypeID.F32) {
            let ans: number = arg1.value + arg2.value;
            //check isNan isInf
            if (!Operator.is_in_f32(ans)) {
                if (ans >= 0) return Operator.pyramid_f32_positive_inf;
                else return Operator.pyramid_f32_negative_inf;
            }
            return {
                pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                value: ans
            }
        }
        else if (arg1.pyramid_type.type_id === PyramidTypeID.String && arg2.pyramid_type.type_id === PyramidTypeID.String) {
            let ans: string = arg1.value + arg2.value;
            //check invaild value
            if (!Operator.isString(ans)) throw new Error("pyramid backend error: string addition return non-string")
            return {
                pyramid_type: { type_id: PyramidTypeID.String, attribute: null },
                value: ans
            }
        }
        else {
            throw new Error("pyramid backend error: invalid operands are given add oprator")
        }
    }
}