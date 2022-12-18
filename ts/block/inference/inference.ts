import { Block } from "../block.js";
import { TypedBlock } from "../typed_block.js";
import { TypeEnv } from "./typeenv.js";
import { Keywords } from "../../keywords.js";

export class Inference {
    static infer(block: Block) {
        if (block.is_empty()) {
            return;
        }
        const env = new TypeEnv();
        const kwlst = Keywords.keywords;

        // set arithmetic operator
        env.set("+", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        env.set("-", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        env.set("*", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        })
        env.set("/", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        env.set("%", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        env.set("**", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });

        // set logical operator
        env.set("!", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Bool, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Bool, var: null, attribute: null },
            },
        });
        env.set("&&", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Bool, var: null, attribute: null },
                    { id: PyramidTypeID.Bool, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Bool, var: null, attribute: null },
            },
        });
        env.set("||", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Bool, var: null, attribute: null },
                    { id: PyramidTypeID.Bool, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Bool, var: null, attribute: null },
            },
        });
        
        // set comparison operator
        env.set("==", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Bool, var: null, attribute: null },
            },
        });
        env.set("!=", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Bool, var: null, attribute: null },
            },
        });
        env.set(">", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Bool, var: null, attribute: null },
            },
        });
        env.set("<", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Bool, var: null, attribute: null },
            },
        });
        env.set(">=", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Bool, var: null, attribute: null },
            },
        });
        env.set("<=", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Bool, var: null, attribute: null },
            },
        });

        // set math fanction
        env.set("log", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        env.set("exp", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        env.set("sqrt", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        env.set("sin", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        env.set("cos", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        env.set("tan", {
            id: PyramidTypeID.Function,
            var: null,
            attribute: {
                args: [
                    { id: PyramidTypeID.Number, var: null, attribute: null },
                ],
                return: { id: PyramidTypeID.Number, var: null, attribute: null },
            },
        });
        
        //for (const keyword of Keywords.keywords) {
        //    //env.set(keyword[0], { id: keyword[1].pyramid_type.type_id, var: null, attribute: keyword[1].pyramid_type.attribute } );
        //}
        const tree = (block as TypedBlock).infer_type(env);
        (block as TypedBlock).set_type(tree);
        //console.log(tree);
    }
}