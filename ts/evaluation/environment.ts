import { ArithmeticOperator } from "./arithmetic_operator.js";
import { LogicalOperator } from "./logical_operator.js";
import { MathFunction } from "./math_function.js";

export class Environment {
    private env: [string, any][];
    constructor() {
        this.env = [
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
    }
    get(key: string): any {
        for (let i = this.env.length - 1; i >= 0; --i) {
            if (this.env[i] === null) {
                continue;
            }
            if (this.env[i][0] === key) {
                return this.env[i][1];
            }
        }
        return null;
    }
    set(key: string, value: any) {
        this.env.push([key, value]);
    }
    remove(key: string) {
        for (let i = this.env.length - 1; i >= 0; --i) {
            if (this.env[i] === null) {
                continue;
            }
            if (this.env[i][0] === key) {
                this.env[i] = null;
                return;
            }
        }
        throw new Error(key + " isn't in enviroment");
    }
}