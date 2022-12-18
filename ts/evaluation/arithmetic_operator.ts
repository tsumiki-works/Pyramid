import { Environment } from "./environment.js";

export class ArithmeticOperator {
    static add(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("+ must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: args[0].value + args[1].value
        }
    }
    static sub(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("- must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: args[0].value - args[1].value
        }
    }
    static mul(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("* must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: args[0].value * args[1].value
        }
    }
    static div(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("/ must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: args[0].value / args[1].value
        }
    }
    static mod(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("% must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: args[0].value % args[1].value
        }
    }
    static pow(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 2) {
            throw new Error("** must have 2 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: args[0].value ** args[1].value
        }
    }
}