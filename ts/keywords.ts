import { ArithmeticOperator } from "./evaluation/arithmetic_operator.js";
import { ComparisonOperator } from "./evaluation/comparison_operator.js";
import { LogicalOperator } from "./evaluation/logical_operator.js";
import { MathFunction } from "./evaluation/math_function.js";

export const keywords: [string, TempPyramidType, any][] = [
    ["!", LogicalOperator.typeof_not, LogicalOperator.not],
    ["&&", LogicalOperator.typeof_logical_binop, LogicalOperator.and],
    ["||", LogicalOperator.typeof_logical_binop, LogicalOperator.or],

    ["==", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.equal],
    ["!=", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.not_equal],
    [">", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.greater_than],
    ["<", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.less_than],
    [">=", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.greater_than_or_equal_to],
    ["<=", ComparisonOperator.typeof_comparison_operator, ComparisonOperator.less_than_or_equal_to],

    ["pi", { id: PyramidTypeID.F32, var: null, attribute: null }, 3.1415926536]
];