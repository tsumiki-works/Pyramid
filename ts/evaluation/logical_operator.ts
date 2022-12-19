import { Environment } from "./environment.js";

export class LogicalOperator {
    static typeof_not: TempPyramidType = {
        id: PyramidTypeID.Function,
        var: null,
        attribute: {
            args: [{ id: PyramidTypeID.Bool, var: null, attribute: null }],
            return: { id: PyramidTypeID.Bool, var: null, attribute: null },
        },
    };
    static typeof_logical_binop: TempPyramidType = {
        id: PyramidTypeID.Function,
        var: null,
        attribute: {
            args: [
                { id: PyramidTypeID.Bool, var: null, attribute: null },
                { id: PyramidTypeID.Bool, var: null, attribute: null },
            ],
            return: { id: PyramidTypeID.Bool, var: null, attribute: null },
        },
    };
    static not(args: any[], _: Environment): any {
        if (args.length !== 1) {
            throw new Error("! must have 1 arguments but get " + args.length + " arguments");
        }
        return !args[0];
    }
    static and(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("&& must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] && args[1];
    }
    static or(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("|| must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] || args[1];
    }
}