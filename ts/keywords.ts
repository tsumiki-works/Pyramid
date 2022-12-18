import { ComparisonOperator } from "./evaluation/comparison_operator.js";
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

        ["==", ComparisonOperator.equal],
        ["!=", ComparisonOperator.not_equal],
        [">", ComparisonOperator.greater_than],
        ["<", ComparisonOperator.less_than],
        [">=", ComparisonOperator.greater_than_or_equal_to],
        ["<=", ComparisonOperator.less_than_or_equal_to],

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