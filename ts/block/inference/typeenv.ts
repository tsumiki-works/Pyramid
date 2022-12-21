import { keywords } from "../../keywords.js";

export function decode_temptype(temptype: TempPyramidType): PyramidType {
    if (temptype === null) return { type_id: PyramidTypeID.Generic, attribute: null };
    if (temptype.id === null) return decode_temptype(temptype.var);
    if (temptype.attribute === null) return { type_id: temptype.id, attribute: null };
    const args = temptype.attribute.args.map(arg => decode_temptype(arg));
    return { type_id: temptype.id, attribute: { args: args, return_type: decode_temptype(temptype.attribute.return) } };
}

export function encode_type(type: PyramidType): TempPyramidType | null {
    if (type.type_id === PyramidTypeID.Generic) return null;
    if (type.attribute === null) return { id: type.type_id, var: null, attribute: null }
    const args = type.attribute.args.map(arg => encode_type(arg))
    return { id: type.type_id, var: null, attribute: { args: args, return: encode_type(type.attribute.return_type) } }
}

function occur(r: TempPyramidType, t: TempPyramidType): boolean {
    let res = true;
    switch (t.id) {
        case null:
            res = (r !== null && t.var !== null && r === t.var);
            res = res || (t.var !== null && occur(r, t.var));
            return res;
        case PyramidTypeID.Function:
            res = false;
            for (const arg of t.attribute.args) {
                res = res || occur(r, arg);
            }
            res = res || occur(r, t.attribute.return);
            return res;
        default:
            return false;
    }
}

export function check_same(t1: TempPyramidType, t2: TempPyramidType): boolean {
    if (t1.id !== null && t2.id === null) {
        return check_same(t2, t1);
    }
    let res = true;
    switch (t1.id) {
        case null:
            if (t2.id === null && t1.var === t2.var) {
                return true;
            }
            if (!occur(t1.var, t2) && t1.var !== null) {
                return check_same(t1.var, t2);
            }
            return false;
        case PyramidTypeID.Number:
            switch (t2.id) {
                case PyramidTypeID.Number: return true;
                default: return false;
            }
        case PyramidTypeID.I32:
            switch (t2.id) {
                case PyramidTypeID.I32: return true;
                default: return false;
            }
        case PyramidTypeID.F32:
            switch (t2.id) {
                case PyramidTypeID.F32: return true;
                default: return false;
            }
        case PyramidTypeID.Bool:
            switch (t2.id) {
                case PyramidTypeID.Bool: return true;
                default: return false;
            }
        case PyramidTypeID.String:
            switch (t2.id) {
                case PyramidTypeID.String: return true;
                default: return false;
            }
        case PyramidTypeID.Function:
            switch (t2.id) {
                case PyramidTypeID.Function:
                    if (t1.attribute.args.length !== t2.attribute.args.length) return false;
                    for (let i = 0; i < t1.attribute.args.length; ++i) {
                        res = check_same(t1.attribute.args[i], t2.attribute.args[i]) && res;
                    }
                    res = check_same(t1.attribute.return, t2.attribute.return) && res;
                    return res;
                default:
                    return false;
            }
        case PyramidTypeID.List:
            switch (t2.id) {
                case PyramidTypeID.List:
                    res = check_same(t1.attribute.return, t2.attribute.return) && res;
                    return res;
                default:
                    return false;
            }

        default:
            return false;
    }
}

export function unify(t1: TempPyramidType, t2: TempPyramidType): boolean {
    if (t1.id !== null && t2.id === null) {
        return unify(t2, t1);
    }
    let res = true;
    switch (t1.id) {
        case null:
            if (t2.id === null && t1.var === t2.var) {
                return true;
            }
            if (!occur(t1.var, t2)) {
                if (t1.var === null) {
                    t1.var = t2;
                    return true;
                } else {
                    return unify(t1.var, t2);
                }
            }
            return false;
        case PyramidTypeID.Number:
            switch (t2.id) {
                case PyramidTypeID.Number: return true;
                case PyramidTypeID.I32: return true;
                case PyramidTypeID.F32: return true;
                default: return false;
            }
        case PyramidTypeID.I32:
            switch (t2.id) {
                case PyramidTypeID.I32: return true;
                default: return false;
            }
        case PyramidTypeID.F32:
            switch (t2.id) {
                case PyramidTypeID.F32: return true;
                default: return false;
            }
        case PyramidTypeID.Bool:
            switch (t2.id) {
                case PyramidTypeID.Bool: return true;
                default: return false;
            }
        case PyramidTypeID.String:
            switch (t2.id) {
                case PyramidTypeID.String: return true;
                default: return false;
            }
        case PyramidTypeID.Function:
            switch (t2.id) {
                case PyramidTypeID.Function:
                    if (t1.attribute.args.length !== t2.attribute.args.length) return false;
                    for (let i = 0; i < t1.attribute.args.length; ++i) {
                        res = unify(t1.attribute.args[i], t2.attribute.args[i]) && res;
                    }
                    res = unify(t1.attribute.return, t2.attribute.return) && res;
                    return res;
                default:
                    return false;
            }
        case PyramidTypeID.List:
            switch (t2.id) {
                case PyramidTypeID.List:
                    res = unify(t1.attribute.return, t2.attribute.return) && res;
                    return res;
                default:
                    return false;
            }

        default:
            return false;
    }
}

export class TypeEnv {
    private env: [string, TempPyramidType][];
    constructor() {
        this.env = keywords.map(keyword => [keyword[0], keyword[1]]);
    }
    set(k: string, t: TempPyramidType) {
        this.env.push([k, t]);
    }
    get(k: string): TempPyramidType {
        for (let i = this.env.length - 1; i >= 0; --i) {
            if (this.env[i] === null) {
                continue;
            }
            if (this.env[i][0] === k) {
                return this.env[i][1];
            }
        }
        return null;
    }
    remove(k: string) {
        for (let i = this.env.length - 1; i >= 0; --i) {
            if (this.env[i] === null) {
                continue;
            }
            if (this.env[i][0] === k) {
                this.env[i] = null;
                return;
            }
        }
    }
}