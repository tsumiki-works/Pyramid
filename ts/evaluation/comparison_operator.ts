import { Environment } from "./environment.js";

export class ComparisonOperator {
    static typeof_comparison_operator_for_number: TempPyramidType = {
        id: PyramidTypeID.Function,
        var: null,
        attribute: {
            args: [
                { id: PyramidTypeID.Number, var: null, attribute: null },
                { id: PyramidTypeID.Number, var: null, attribute: null },
            ],
            return: { id: PyramidTypeID.Bool, var: null, attribute: null },
        },
    };
    static typeof_comparison_operator_for_string: TempPyramidType = {
        id: PyramidTypeID.Function,
        var: null,
        attribute: {
            args: [
                { id: PyramidTypeID.String, var: null, attribute: null },
                { id: PyramidTypeID.String, var: null, attribute: null },
            ],
            return: { id: PyramidTypeID.Bool, var: null, attribute: null },
        },
    };
    static equal(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("== must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] === args[1];
    }
    static not_equal(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("!= must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] !== args[1];
    }
    static greater_than(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("> must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] > args[1];
    }
    static less_than(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("< must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] < args[1];
    }
    static greater_than_or_equal_to(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error(">= must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] >= args[1];
    }
    static less_than_or_equal_to(args: any[], _: Environment): any {
        if (args.length !== 2) {
            throw new Error("<= must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] <= args[1];
    }
    static string_equal(args: any[], _: Environment): any{
        if (args.length !== 2) {
            throw new Error("\"== must have 2 arguments but get " + args.length + " arguments");
        }
        return args[0] === args[1];
    }
}