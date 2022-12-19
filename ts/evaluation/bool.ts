import { Environment } from "./environment.js";

export class Bool {
    static check_type(value: string): boolean {
        if (value === "true" || value === "false") return true;
        else return false;
    }

    static eval(content: string, _: Environment): any {
        if (content === "true") {
            return true;
        }
        else if (content === "false") {
            return false;
        }
        else new Error("unexpected error: null or undefined is detected")
    }
}