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
    static sub(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("- must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] - args[1];
    }
    static mul(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("* must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] * args[1];
    }
    static div(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("/ must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] / args[1];
    }
    static mod(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("% must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] % args[1];
    }
    static pow(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("** must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] ** args[1];
    }
}