import { Environment } from "./environment.js";

export class PyramidNumber {
    // check_type return bool and jedge whether value is Number literal or not
    //
    // check_type wants to return true in those cases
    // Number("1") = 1
    // Number("1.1") = 1.1
    // Number("0") = 0
    //
    // check_type wants to return false in those cases
    // Number("a") = NaN
    // Number() = 0
    // Number(null) = 0
    // Number("") = 0
    // Number(undefined) = NaN
    static check_type(value: string): boolean {
        if (value.indexOf(".") !== -1) {
            while (value.slice(-1) === "0" && value.slice(-2, -1) !== ".") {
                value = value.slice(0, -1);
            }
            if (value.slice(-1) === ".") {
                value = value.slice(0, -1);
            }
        }
        if(value.match(/^0+$/)) value = "0"
        if (value === "0") return true
        if (value === "0.0") return true
        if (value === ".0") return true
        const temp = Number(value);
        if (Number.isNaN(temp) || temp === 0) return false
        return true;
    }

    static eval(content: string, _: Environment): any {
        if (!PyramidNumber.check_type(content)) {
            throw new Error("unexpected error: " + content + " is not Number");
        }
        const v = Number(content);
        return v;
    }
}