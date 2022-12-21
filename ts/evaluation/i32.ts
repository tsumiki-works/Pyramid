import { Environment } from "./environment.js";

export class I32 {
    static check_type(value: string): boolean {
        const num = parseFloat(value);
        return num % 1 === 0;
    }

    static eval(content: string, _: Environment): any {
        return parseInt(content);
    }
}