import { Operator } from "./evaluation/operator.js";

export class Keywords {
    static readonly keywords: Keyword[] = [
        // TODO: move this to Operator
        [
            "+",
            {
                pyramid_type: {
                    type_id: PyramidTypeID.Function,
                    attribute: {
                        args: [
                            {
                                type_id: PyramidTypeID.I32,
                                attribute: null,
                            },
                            {
                                type_id: PyramidTypeID.I32,
                                attribute: null,
                            },
                        ],
                        return_type: {
                            type_id: PyramidTypeID.I32,
                            attribute: null,
                        },
                    },
                },
                value: (args: PyramidObject[], env: Environment): PyramidObject => {
                    // TODO: merge this with Operator.add
                    if (args.length !== 2) {
                        throw new Error("+ must have 2 arguments but get " + args.length + " arguments");
                    }
                    return Operator.add(args[0], args[1]);
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