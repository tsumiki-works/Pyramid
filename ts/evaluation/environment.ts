import { keywords } from "../keywords.js";

export class Environment {
    private env: [string, any][];
    constructor() {
        this.env = keywords.map(keyword => [keyword[0], keyword[2]]);
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