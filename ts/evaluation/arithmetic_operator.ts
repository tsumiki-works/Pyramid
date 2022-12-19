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
    static add(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("+ must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] + args[1];
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