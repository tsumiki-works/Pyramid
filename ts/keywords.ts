export class Keywords {
    static readonly keywords: Keyword[] = [
        [
            "+",
            {
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
                            attribute: null,
                        },
                        value: args[0].value + args[1].value,
                    };
                },
            },
        ],
    ];
    static get_first_env(): Environment {
        const env = new Environment();
        env.set_all(this.keywords);
        return env;
    }
}