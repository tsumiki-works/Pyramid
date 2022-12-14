type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];

enum PyramidTypeID {
    Empty,
    String,
    I32,
    F32,
    Bool,
    Function,
    List,
}
type PyramidType = {
    type_id: PyramidTypeID;
    attribute: any,
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

type Environment = Map<string, PyramidObject>;
type Keyword = [string, PyramidObject];

type PopupEvent = [string, EventListener];
