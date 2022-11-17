import { STree } from "./stree.js";

export class Parser {
    static parse(stree: string): STree {
        if (stree.length == 0) {
            throw new Error("pyramid parser error: tried to parse empty code.");
        }
        let symbol: string = "";
        let stack: STree[] = [];
        let current: STree = new STree();
        for (const c of stree) {
            switch (c) {
                case '(':
                    if (symbol.length != 0) {
                        throw new Error("pyramid parser error: symbol must not have '('.");
                    }
                    stack.push(current);
                    current = new STree();
                    break;
                case ')':
                    if (stack.length == 0) {
                        throw new Error("pyramid parser error: stack is empty.");
                    }
                    if (symbol.length != 0) {
                        current.push(new STree(symbol));
                    }
                    symbol = "";
                    const cadr = current;
                    current = stack.pop();
                    current.push(cadr);
                    break;
                case ' ':
                case '\t':
                case '\n':
                    if (symbol.length != 0) {
                        current.push(new STree(symbol));
                        symbol = "";
                    }
                    break;
                case '\r':
                    break;
                default:
                    symbol += c;
                    break;
            }
        }
        if (symbol.length != 0) {
            current.push(new STree(symbol));
        }
        if (stack.length != 0) {
            throw new Error("pyramid parser error: code is not closed.");
        } else {
            return current;
        }
    }
}