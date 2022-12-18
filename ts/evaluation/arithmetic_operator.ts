export class ArithmeticOperator {
    static add: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
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
        },
    }
    static sub: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
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
        },
    }
    static mul: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
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
        },
    }
    static div: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
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
        },
    }
    static mod: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
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
        },
    }
    static pow: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
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
        },
    }
}