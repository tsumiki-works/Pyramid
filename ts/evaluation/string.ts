import { Environment } from "./environment.js";

export class String {
    // value != null
    // this conditional check "null" and "undefined"
    static check_type(value: string): boolean {
        if (value != null) return true;
        else return false;
    }

    static eval(content: string, _: Environment): any {
        if (content != null) {
            return content;
        }
        else new Error("unexpected error: null or undefined is detected")
    }
}