export class ComparisonOperator {
    static equal: PyramidObject = {
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
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static not_equal: PyramidObject = {
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
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static greater_than: PyramidObject = {
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
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static less_than: PyramidObject = {
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
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static greater_than_or_equal_to: PyramidObject = {
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
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static less_than_or_equal_to: PyramidObject = {
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
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
}