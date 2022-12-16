export class MathFunction {
    static log: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
                ],
                return_type: {
                    type_id: PyramidTypeID.Number,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static exp: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
                ],
                return_type: {
                    type_id: PyramidTypeID.Number,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static sqrt: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
                ],
                return_type: {
                    type_id: PyramidTypeID.Number,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static sin: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
                ],
                return_type: {
                    type_id: PyramidTypeID.Number,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static cos: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
                ],
                return_type: {
                    type_id: PyramidTypeID.Number,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static tan: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
                ],
                return_type: {
                    type_id: PyramidTypeID.Number,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
}