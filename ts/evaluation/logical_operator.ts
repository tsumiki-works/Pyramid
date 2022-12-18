import { Environment } from "./environment.js";

export class LogicalOperator {
    static not(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 1) {
            throw new Error("! must have 1 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Bool,
                attribute: null
            },
            value: !args[0].value
        }
    }
    static and(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("&& must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Bool,
                attribute: null
            },
            value: args[0].value && args[1].value
        }
    }
    static or(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("|| must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Bool,
                attribute: null
            },
            value: args[0].value || args[1].value
        }
    }
}