export class PyramidMath {
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

    // Return arg1**arg2
    static pow(arg1: PyramidObject, arg2: PyramidObject): PyramidObject {
        if (arg1.pyramid_type.type_id === PyramidTypeID.I32 && arg2.pyramid_type.type_id === PyramidTypeID.I32) {
            let ans: number = Math.pow(arg1.value, arg2.value);
            //check isNaN, isInt, isInf
            //The pow operator allows taking an Int type and returning a Float type.
            if (Number.isNaN(ans)) throw new Error("pyramid backend error: int pow return NaN");
            if (!Number.isInteger(ans)) {
                if (!PyramidMath.is_in_f32(ans)) {
                    if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                    else return PyramidMath.pyramid_f32_negative_inf;
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                    value: ans
                }
            }
            else {
                if (!PyramidMath.is_in_i32(ans)) {
                    if (ans >= 0) throw new Error("pyramid backend error: int pow overflowed toward positive");
                    else throw new Error("pyramid backend error: int pow overflowed toward negative");
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
                    value: ans
                }
            }
        }
        else if (arg1.pyramid_type.type_id === PyramidTypeID.F32 && arg2.pyramid_type.type_id === PyramidTypeID.F32
            || arg1.pyramid_type.type_id === PyramidTypeID.F32 && arg2.pyramid_type.type_id === PyramidTypeID.I32
            || arg1.pyramid_type.type_id === PyramidTypeID.I32 && arg2.pyramid_type.type_id === PyramidTypeID.F32) {
            let ans: number = Math.pow(arg1.value, arg2.value);
            //check isNaN isInf
            if (Number.isNaN(ans)) return PyramidMath.pyramid_f32_nan;
            if (!PyramidMath.is_in_f32(ans)) {
                if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                else return PyramidMath.pyramid_f32_negative_inf;
            }
            return {
                pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                value: ans
            }
        }
        else {
            throw new Error("pyramid backend error: invalid operands are given pow oprator")
        }
    }
    static log(arg: PyramidObject): PyramidObject {
        if (arg.pyramid_type.type_id === PyramidTypeID.I32) {
            let ans: number = Math.log(arg.value);
            //check isNaN, isInt, isInf
            //The log operator allows taking an Int type and returning a Float type.
            if (Number.isNaN(ans)) throw new Error("pyramid backend error: int log return NaN");
            if (!Number.isInteger(ans)) {
                if (!PyramidMath.is_in_f32(ans)) {
                    if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                    else return PyramidMath.pyramid_f32_negative_inf;
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                    value: ans
                }
            }
            else {
                if (!PyramidMath.is_in_i32(ans)) {
                    if (ans >= 0) throw new Error("pyramid backend error: int log overflowed toward positive");
                    else throw new Error("pyramid backend error: int log overflowed toward negative");
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
                    value: ans
                }
            }
        }
        else if (arg.pyramid_type.type_id === PyramidTypeID.F32) {
            let ans: number = Math.log(arg.value);
            //check isNaN isInf
            if (Number.isNaN(ans)) return PyramidMath.pyramid_f32_nan;
            if (!PyramidMath.is_in_f32(ans)) {
                if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                else return PyramidMath.pyramid_f32_negative_inf;
            }
            return {
                pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                value: ans
            }
        }
        else {
            throw new Error("pyramid backend error: invalid operands are given log oprator")
        }
    }
    static exp(arg: PyramidObject): PyramidObject {
        if (arg.pyramid_type.type_id === PyramidTypeID.I32) {
            let ans: number = Math.exp(arg.value);
            //check zero pow, isNaN, isInt, isInf
            //The exp operator allows taking an Int type and returning a Float type.
            if (Number.isNaN(ans)) throw new Error("pyramid backend error: int exp return NaN");
            if (!Number.isInteger(ans)) {
                if (!PyramidMath.is_in_f32(ans)) {
                    if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                    else return PyramidMath.pyramid_f32_negative_inf;
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                    value: ans
                }
            }
            else {
                if (!PyramidMath.is_in_i32(ans)) {
                    if (ans >= 0) throw new Error("pyramid backend error: int exp overflowed toward positive");
                    else throw new Error("pyramid backend error: int exp overflowed toward negative");
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
                    value: ans
                }
            }
        }
        else if (arg.pyramid_type.type_id === PyramidTypeID.F32) {
            let ans: number = Math.exp(arg.value);
            //check isNaN isInf
            if (Number.isNaN(ans)) return PyramidMath.pyramid_f32_nan;
            if (!PyramidMath.is_in_f32(ans)) {
                if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                else return PyramidMath.pyramid_f32_negative_inf;
            }
            return {
                pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                value: ans
            }
        }
        else {
            throw new Error("pyramid backend error: invalid operands are given exp oprator")
        }
    }
    static sqrt(arg: PyramidObject): PyramidObject {
        if (arg.pyramid_type.type_id === PyramidTypeID.I32) {
            let ans: number = Math.sqrt(arg.value);
            //check isNaN, isInt, isInf
            //The sqrt operator allows taking an Int type and returning a Float type.
            if (Number.isNaN(ans)) throw new Error("pyramid backend error: int sqrt return NaN");
            if (!Number.isInteger(ans)) {
                if (!PyramidMath.is_in_f32(ans)) {
                    if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                    else return PyramidMath.pyramid_f32_negative_inf;
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                    value: ans
                }
            }
            else {
                if (!PyramidMath.is_in_i32(ans)) {
                    if (ans >= 0) throw new Error("pyramid backend error: int sqrt overflowed toward positive");
                    else throw new Error("pyramid backend error: int sqrt overflowed toward negative");
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
                    value: ans
                }
            }
        }
        else if (arg.pyramid_type.type_id === PyramidTypeID.F32) {
            let ans: number = Math.sqrt(arg.value);
            //check isNaN isInf
            if (Number.isNaN(ans)) return PyramidMath.pyramid_f32_nan;
            if (!PyramidMath.is_in_f32(ans)) {
                if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                else return PyramidMath.pyramid_f32_negative_inf;
            }
            return {
                pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                value: ans
            }
        }
        else {
            throw new Error("pyramid backend error: invalid operands are given sqrt oprator")
        }
    }
    static sin(arg: PyramidObject): PyramidObject {
        if (arg.pyramid_type.type_id === PyramidTypeID.I32) {
            let ans: number = Math.sin(arg.value);
            //check isNaN, isInt, isInf
            //The sin operator allows taking an Int type and returning a Float type.
            if (Number.isNaN(ans)) throw new Error("pyramid backend error: int sin return NaN");
            if (!Number.isInteger(ans)) {
                if (!PyramidMath.is_in_f32(ans)) {
                    if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                    else return PyramidMath.pyramid_f32_negative_inf;
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                    value: ans
                }
            }
            else {
                if (!PyramidMath.is_in_i32(ans)) {
                    if (ans >= 0) throw new Error("pyramid backend error: int sin overflowed toward positive");
                    else throw new Error("pyramid backend error: int sin overflowed toward negative");
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
                    value: ans
                }
            }
        }
        else if (arg.pyramid_type.type_id === PyramidTypeID.F32) {
            let ans: number = Math.sin(arg.value);
            //check isNaN isInf
            if (Number.isNaN(ans)) return PyramidMath.pyramid_f32_nan;
            if (!PyramidMath.is_in_f32(ans)) {
                if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                else return PyramidMath.pyramid_f32_negative_inf;
            }
            return {
                pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                value: ans
            }
        }
        else {
            throw new Error("pyramid backend error: invalid operands are given sin oprator")
        }
    }
    static cos(arg: PyramidObject): PyramidObject {
        if (arg.pyramid_type.type_id === PyramidTypeID.I32) {
            let ans: number = Math.cos(arg.value);
            //check isNaN, isInt, isInf
            //The cos operator allows taking an Int type and returning a Float type.
            if (Number.isNaN(ans)) throw new Error("pyramid backend error: int cos return NaN");
            if (!Number.isInteger(ans)) {
                if (!PyramidMath.is_in_f32(ans)) {
                    if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                    else return PyramidMath.pyramid_f32_negative_inf;
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                    value: ans
                }
            }
            else {
                if (!PyramidMath.is_in_i32(ans)) {
                    if (ans >= 0) throw new Error("pyramid backend error: int cos overflowed toward positive");
                    else throw new Error("pyramid backend error: int cos overflowed toward negative");
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
                    value: ans
                }
            }
        }
        else if (arg.pyramid_type.type_id === PyramidTypeID.F32) {
            let ans: number = Math.cos(arg.value);
            //check isNaN isInf
            if (Number.isNaN(ans)) return PyramidMath.pyramid_f32_nan;
            if (!PyramidMath.is_in_f32(ans)) {
                if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                else return PyramidMath.pyramid_f32_negative_inf;
            }
            return {
                pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                value: ans
            }
        }
        else {
            throw new Error("pyramid backend error: invalid operands are given cos oprator")
        }
    }
    static tan(arg: PyramidObject): PyramidObject {
        if (arg.pyramid_type.type_id === PyramidTypeID.I32) {
            let ans: number = Math.tan(arg.value);
            //check isNaN, isInt, isInf
            //The tan operator allows taking an Int type and returning a Float type.
            if (Number.isNaN(ans)) throw new Error("pyramid backend error: int tan return NaN");
            if (!Number.isInteger(ans)) {
                if (!PyramidMath.is_in_f32(ans)) {
                    if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                    else return PyramidMath.pyramid_f32_negative_inf;
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                    value: ans
                }
            }
            else {
                if (!PyramidMath.is_in_i32(ans)) {
                    if (ans >= 0) throw new Error("pyramid backend error: int tan overflowed toward positive");
                    else throw new Error("pyramid backend error: int tan overflowed toward negative");
                }
                return {
                    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
                    value: ans
                }
            }
        }
        else if (arg.pyramid_type.type_id === PyramidTypeID.F32) {
            let ans: number = Math.tan(arg.value);
            //check isNaN isInf
            if (Number.isNaN(ans)) return PyramidMath.pyramid_f32_nan;
            if (!PyramidMath.is_in_f32(ans)) {
                if (ans >= 0) return PyramidMath.pyramid_f32_positive_inf;
                else return PyramidMath.pyramid_f32_negative_inf;
            }
            return {
                pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
                value: ans
            }
        }
        else {
            throw new Error("pyramid backend error: invalid operands are given tan oprator")
        }
    }
}