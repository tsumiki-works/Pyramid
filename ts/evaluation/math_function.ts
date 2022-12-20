import { Environment } from "./environment.js";

export class MathFunction {
    static typeof_math_function: TempPyramidType = {
        id: PyramidTypeID.Function,
        var: null,
        attribute: {
            args: [{ id: PyramidTypeID.Number, var: null, attribute: null }],
            return: { id: PyramidTypeID.F32, var: null, attribute: null },
        },
    };
    static log(args: any[], _: Environment): any {
        if (args.length !== 1) {
            throw new Error("log function must have 1 arguments but get " + args.length + " arguments");
        }
        return Math.log(args[0]);
    }
    static exp(args: any[], _: Environment): any {
        if (args.length !== 1) {
            throw new Error("exp function must have 1 arguments but get " + args.length + " arguments");
        }
        return Math.exp(args[0]);
    }
    static sqrt(args: any[], _: Environment): any {
        if (args.length !== 1) {
            throw new Error("sqrt function must have 1 arguments but get " + args.length + " arguments");
        }
        return Math.sqrt(args[0]);
    }
    static sin(args: any[], _: Environment): any {
        if (args.length !== 1) {
            throw new Error("sin function must have 1 arguments but get " + args.length + " arguments");
        }
        return Math.sin(args[0]);
    }
    static cos(args: any[], _: Environment): any {
        if (args.length !== 1) {
            throw new Error("cos function must have 1 arguments but get " + args.length + " arguments");
        }
        return Math.cos(args[0]);
    }
    static tan(args: any[], _: Environment): any {
        if (args.length !== 1) {
            throw new Error("tan function must have 1 arguments but get " + args.length + " arguments");
        }
        return Math.tan(args[0]);
    }
}