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

    static add(args: number[], _: Environment): any {
        if(args.length !== 2) throw new Error("+ must have 2 arguments but get " + args.length + " arguments");
        const ans: number = args[0] + args[1];
        if(Number.isNaN(ans)) throw new Error("pyramid backend error: number add return NaN");
        return ans;
    }
    static sub(args: number[], _: Environment): any {
        if(args.length !== 2) throw new Error("- must have 2 arguments but get " + args.length + " arguments");
        const ans: number = args[0] - args[1];
        if(Number.isNaN(ans)) throw new Error("pyramid backend error: number sub return NaN");
        return ans;
    }
    static mul(args: number[], _: Environment): any {
        if(args.length !== 2) throw new Error("* must have 2 arguments but get " + args.length + " arguments");
        const ans: number = args[0] * args[1];
        if(Number.isNaN(ans)) throw new Error("pyramid backend error: number mul return NaN");
        return ans;
    }
    static div(args: number[], _: Environment): any {
        if(args.length !== 2) throw new Error("/ must have 2 arguments but get " + args.length + " arguments");
        const ans: number = args[0] / args[1];
        if(Number.isNaN(ans)) throw new Error("pyramid backend error: number div return NaN");
        return ans;
    }
    static mod(args: number[], _: Environment): any {
        if(args.length !== 2) throw new Error("% must have 2 arguments but get " + args.length + " arguments");
        const ans: number = args[0] % args[1];
        if(Number.isNaN(ans)) throw new Error("pyramid backend error: number mod return NaN");
        return ans;
    }
    static pow(args: number[], _: Environment): any {
        if(args.length !== 2) throw new Error("** must have 2 arguments but get " + args.length + " arguments");
        const ans: number = args[0] ** args[1];
        if(Number.isNaN(ans)) throw new Error("pyramid backend error: number pow return NaN");
        return ans;
    }
}