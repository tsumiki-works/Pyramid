export class LogicalOperator {
    static not: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Bool,
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
        },
    }
    static and: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Bool,
                        attribute: null,
                    },
                    {
                        type_id: PyramidTypeID.Bool,
                        attribute: null,
                    }
                ],
                return_type: {
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
    static or: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.Function,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Bool,
                        attribute: null,
                    },
                    {
                        type_id: PyramidTypeID.Bool,
                        attribute: null,
                    }
                ],
                return_type: {
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
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
        },
    }
}