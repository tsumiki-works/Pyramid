import { NumberLiteralType } from "typescript";
import { Environment } from "./environment.js";

export class ArithmeticOperator {
    static typeof_arythmetic_operator: TempPyramidType = {
        id: PyramidTypeID.Function,
        var: null,
        attribute: {
            args: [
                { id: PyramidTypeID.Number, var: null, attribute: null },
                { id: PyramidTypeID.Number, var: null, attribute: null },
            ],
            return: { id: PyramidTypeID.Number, var: null, attribute: null },
        },
    };
    private static is_in_i32(val: number): boolean {
        return (-2147483648 < val && val < 2147483647);
    }
    private static is_in_f32(val: number): boolean {
        return (-3.402823e+38 < val && val < 3.402823e+38);
    }
    static add_int(arg1: number, arg2: number): any {
        const ans: number = arg1 + arg2;
        //check isNaN, isInt, isInf
        if (Number.isNaN(ans)) throw new Error("pyramid backend error: int addition return NaN");
        if (!Number.isInteger(ans)) throw new Error("pyramid backend error: int addition return non-integer")
        if (!ArithmeticOperator.is_in_i32(ans)) {
            if (ans >= 0) throw new Error("pyramid backend error: int addition overflowed toward positive");
            else throw new Error("pyramid backend error: int addition overflowed toward negative");
        }
        return ans
    }
    static add_float(arg1: number, arg2: number): any {
        const ans: number = arg1 + arg2;
        //check isNaN isInf
        if (Number.isNaN(ans)) return Number.NaN;
        if (!ArithmeticOperator.is_in_f32(ans)) {
            if (ans >= 0) return Number.POSITIVE_INFINITY;
            else return Number.NEGATIVE_INFINITY;
        }
        return ans
    }
    static sub_int(arg1: number, arg2: number): any {
        const ans: number = arg1 - arg2;
        //check isNaN, isInt, isInf
        if (Number.isNaN(ans)) throw new Error("pyramid backend error: int subtraction return NaN");
        if (!Number.isInteger(ans)) throw new Error("pyramid backend error: int subtraction return non-integer")
        if (!ArithmeticOperator.is_in_i32(ans)) {
            if (ans >= 0) throw new Error("pyramid backend error: int subtraction overflowed toward positive");
            else throw new Error("pyramid backend error: int subtraction overflowed toward negative");
        }
        return ans
    }
    static sub_float(arg1: number, arg2: number): any {
        const ans: number = arg1 - arg2;
        //check isNaN isInf
        if (Number.isNaN(ans)) return Number.NaN;
        if (!ArithmeticOperator.is_in_f32(ans)) {
            if (ans >= 0) return Number.POSITIVE_INFINITY;
            else return Number.NEGATIVE_INFINITY;
        }
        return ans
    }
    static mul_int(arg1: number, arg2: number): any {
        const ans: number = arg1 * arg2;
        //check isNaN, isInt, isInf
        if (Number.isNaN(ans)) throw new Error("pyramid backend error: int multiplication return NaN");
        if (!Number.isInteger(ans)) throw new Error("pyramid backend error: int multiplication return non-integer")
        if (!ArithmeticOperator.is_in_i32(ans)) {
            if (ans >= 0) throw new Error("pyramid backend error: int multiplication overflowed toward positive");
            else throw new Error("pyramid backend error: int multiplication overflowed toward negative");
        }
        return ans
    }
    static mul_float(arg1: number, arg2: number): any {
        const ans: number = arg1 * arg2;
        //check isNaN isInf
        if (Number.isNaN(ans)) return Number.NaN;
        if (!ArithmeticOperator.is_in_f32(ans)) {
            if (ans >= 0) return Number.POSITIVE_INFINITY;
            else return Number.NEGATIVE_INFINITY;
        }
        return ans
    }
    static div_int(arg1: number, arg2: number): any {
        //check zero division, isNaN, isInt, isInf
        if (arg2 === 0) throw new Error("pyramid backend error: int division deteched zero division")
        const ans = Math.trunc(arg1 / arg2);
        if (Number.isNaN(ans)) throw new Error("pyramid backend error: int division return NaN");
        if (!Number.isInteger(ans)) new Error ("TypeScript's Math.tranc return non-integer");
        else {
            if (!ArithmeticOperator.is_in_i32(ans)) {
                if (ans >= 0) throw new Error("pyramid backend error: int division overflowed toward positive");
                else throw new Error("pyramid backend error: int division overflowed toward negative");
            }
            return ans;
        }
    }
    static div_float(arg1: number, arg2: number): any {
        //check isNaN, isInf
        const ans = arg1 / arg2;
        if (Number.isNaN(ans)) return Number.NaN;
        if (!ArithmeticOperator.is_in_f32(ans)) {
            if (ans >= 0) return Number.POSITIVE_INFINITY;
            else return Number.NEGATIVE_INFINITY;
        }
        return ans;
    }
    //The mod operator forbit taking an Int type and returning a Float type.
    static mod(arg1: number, arg2: number): any {
        const ans: number = arg1 % arg2;
        //check isNaN, isInt, isInf
        if (Number.isNaN(ans)) throw new Error("pyramid backend error: int modulo operation return NaN");
        if (!Number.isInteger(ans)) throw new Error("pyramid backend error: int modulo operation return non-integer")
        if (!ArithmeticOperator.is_in_i32(ans)) {
            if (ans >= 0) throw new Error("pyramid backend error: int modulo operation overflowed toward positive");
            else throw new Error("pyramid backend error: int modulo operation overflowed toward negative");
        }
        return ans;
    }
    static pow_int(arg1: number, arg2: number): any {
        const ans: number = Math.pow(arg1, arg2);
        //check isNaN, isInt, isInf
        if (Number.isNaN(ans)) throw new Error("pyramid backend error: int pow return NaN");
        if (!Number.isInteger(ans)) throw new Error("pyramid backend error: int pow return non-integer")
        if (!ArithmeticOperator.is_in_i32(ans)) {
            if (ans >= 0) throw new Error("pyramid backend error: int pow overflowed toward positive");
            else throw new Error("pyramid backend error: int pow overflowed toward negative");
        }
        return ans
    }
    static pow_float(arg1: number, arg2: number): any {
        const ans: number = Math.pow(arg1, arg2);
        //check isNaN isInf
        if (Number.isNaN(ans)) return Number.NaN;
        if (!ArithmeticOperator.is_in_f32(ans)) {
            if (ans >= 0) return Number.POSITIVE_INFINITY;
            else return Number.NEGATIVE_INFINITY;
        }
        return ans
    }
}