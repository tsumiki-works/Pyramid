type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];

enum PyramidTypeID {
    Invalid,
    Generic,
    String,
    Number,
    Bool,
    Function,
    List,
}
function typeid_to_string(id: PyramidTypeID): string {
    switch (id) {
        case PyramidTypeID.Invalid: return "INVALID";
        case PyramidTypeID.Generic: return "_";
        case PyramidTypeID.String: return "string";
        case PyramidTypeID.Number: return "num";
        case PyramidTypeID.Bool: return "bool";
        case PyramidTypeID.Function: return "function";
        case PyramidTypeID.List: return "list";
        default: throw new Error(id + " th type is not defined");
    }
}

type PyramidType = {
    type_id: PyramidTypeID;
    attribute: FunctionAttribute | null,
};
type FunctionAttribute = {
    args: PyramidType[];
    return_type: PyramidType;
};
type PyramidObject = {
    pyramid_type: PyramidType;
    value: any;
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

type Keyword = [string, PyramidObject];

type PopupEvent = [string, EventListener];