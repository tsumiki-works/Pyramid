import { ArithmeticOperator } from "./evaluation/arithmetic_operator.js";
import { LogicalOperator } from "./evaluation/logical_operator.js";
import { MathFunction } from "./evaluation/math_function.js";

export class Keywords {
    static readonly keywords: Keyword[] = [
        ["+", ArithmeticOperator.add],
        ["-", ArithmeticOperator.sub],
        ["*", ArithmeticOperator.mul],
        ["/", ArithmeticOperator.div],
        ["%", ArithmeticOperator.mod],
        ["**", ArithmeticOperator.pow],

        ["!", LogicalOperator.not],
        ["&&", LogicalOperator.and],
        ["||", LogicalOperator.or],

        ["log", MathFunction.log],
        ["exp", MathFunction.exp],
        ["sqrt", MathFunction.sqrt],
        ["sin", MathFunction.sin],
        ["cos", MathFunction.cos],
        ["tan", MathFunction.tan],
    ];
    static get_first_env(): Environment {
        const env = new Environment();
        env.set_all(this.keywords);
        return env;
    }
}