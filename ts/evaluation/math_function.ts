import { Environment } from "./environment.js";

export class MathFunction {
    static log(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 1) {
            throw new Error("log function must have 1 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: Math.log(args[0].value)
        }
    }
    static exp(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 1) {
            throw new Error("exp function must have 1 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: Math.exp(args[0].value)
        }
    }
    static sqrt(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 1) {
            throw new Error("sqrt function must have 1 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: Math.sqrt(args[0].value)
        }
    }
    static sin(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 1) {
            throw new Error("sin function must have 1 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: Math.sin(args[0].value)
        }
    }
    static cos(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 1) {
            throw new Error("cos function must have 1 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: Math.cos(args[0].value)
        }
    }
    static tan(args: PyramidObject[], _: Environment): PyramidObject {
        if (args.length !== 1) {
            throw new Error("tan function must have 1 arguments but get " + args.length + " arguments");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.Number,
                attribute: null
            },
            value: Math.tan(args[0].value)
        }
    }
}