export enum PyramidTypeID {
    Nil,
    String,
    I32,
    F32,
    Bool,
    Function,
    List,
}

export type PyramidType = {
    type_id: PyramidTypeID;
    attribute: any,
};

export type FunctionAttribute = {
    args_cnt: number;
    return_type: PyramidType;
}

export type PyramidObject = {
    pyramid_type: PyramidType;
    value: any;
};