import { Environment } from "./environment.js";

export class ComparisonOperator {
    static typeof_comparison_operator: TempPyramidType = {
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
    static equal(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("== must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Bool,
                attribute: null
            },
            value: args[0].value === args[1].value
        }
    }
    static not_equal(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("!= must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Bool,
                attribute: null
            },
            value: args[0].value !== args[1].value
        }
    }
    static greater_than(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("> must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Bool,
                attribute: null
            },
            value: args[0].value > args[1].value
        }
    }
    static less_than(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("< must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Bool,
                attribute: null
            },
            value: args[0].value < args[1].value
        }
    }
    static greater_than_or_equal_to(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error(">= must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Bool,
                attribute: null
            },
            value: args[0].value >= args[1].value
        }
    }
    static less_than_or_equal_to(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("<= must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Bool,
                attribute: null
            },
            value: args[0].value <= args[1].value
        }
    }
}