import { Environment } from "./environment.js";

export class F32 {
    static check_type(value: string): boolean {
        const res = parseFloat(value);
        if (!isNaN(res)) return true;
        else return false;
    }

    static eval(content: string, _: Environment): any {
        return parseFloat(content);
    }
}