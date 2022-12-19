import { ArithmeticOperator } from "./evaluation/arithmetic_operator.js";
import { ComparisonOperator } from "./evaluation/comparison_operator.js";
import { LogicalOperator } from "./evaluation/logical_operator.js";
import { MathFunction } from "./evaluation/math_function.js";

export const keywords: [string, TempPyramidType, any][] = [
    ["+", ArithmeticOperator.typeof_arythmetic_operator, ArithmeticOperator.add],
    ["-", ArithmeticOperator.typeof_arythmetic_operator, ArithmeticOperator.sub],
    ["*", ArithmeticOperator.typeof_arythmetic_operator, ArithmeticOperator.mul],
    ["/", ArithmeticOperator.typeof_arythmetic_operator, ArithmeticOperator.div],
    ["%", ArithmeticOperator.typeof_arythmetic_operator, ArithmeticOperator.mod],
    ["**", ArithmeticOperator.typeof_arythmetic_operator, ArithmeticOperator.pow],

    ["!", LogicalOperator.typeof_not, LogicalOperator.not],
    ["&&", LogicalOperator.typeof_logical_binop, LogicalOperator.and],
    ["||", LogicalOperator.typeof_logical_binop, LogicalOperator.or],

    ["==", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.equal],
    ["!=", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.not_equal],
    [">", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.greater_than],
    ["<", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.less_than],
    [">=", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.greater_than_or_equal_to],
    ["<=", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.less_than_or_equal_to],

    ["log", MathFunction.typeof_math_function, MathFunction.log],
    ["exp", MathFunction.typeof_math_function, MathFunction.exp],
    ["sqrt", MathFunction.typeof_math_function, MathFunction.sqrt],
    ["sin", MathFunction.typeof_math_function, MathFunction.sin],
    ["cos", MathFunction.typeof_math_function, MathFunction.cos],
    ["tan", MathFunction.typeof_math_function, MathFunction.tan],

    ["π", { id: PyramidTypeID.Number, var: null, attribute: null }, 3.1415926536]
];