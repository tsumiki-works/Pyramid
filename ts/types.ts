type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];

enum PyramidTypeID {
    Invalid,
    Generic,
    String,
    I32,
    F32,
    Bool,
    Function,
    List,
}
function typeid_to_string(id: PyramidTypeID): string {
    switch (id) {
        case PyramidTypeID.Invalid: return "INVALID";
        case PyramidTypeID.Generic: return "_";
        case PyramidTypeID.String: return "string";
        case PyramidTypeID.I32: return "i32";
        case PyramidTypeID.F32: return "f32";
        case PyramidTypeID.Bool: return "bool";
        case PyramidTypeID.Function: return "function";
        case PyramidTypeID.List: return "list";
        default: throw new Error(id + " th type is not defined");
    }
}

type TempFunctionAttribute = {
    args: TempPyramidType[],
    return: TempPyramidType,
};
type TempPyramidType = {
    id: PyramidTypeID | null,
    var: TempPyramidType | null,
    attribute: TempFunctionAttribute | null,
};
type TempPyramidTypeTree = {
    node: TempPyramidType,
    children: TempPyramidTypeTree[],
};

type PyramidType = {
    type_id: PyramidTypeID;
    attribute: FunctionAttribute | null,
};
type FunctionAttribute = {
    args: PyramidType[];
    return_type: PyramidType;
};

type MenuContent = {
    text: string;
    color: string;
    block_constructor: Function;
}
type MenuTabContent = {
    label: string;
    color: string;
}

type PopupEvent = [string, EventListener];