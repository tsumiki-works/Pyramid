type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];

enum PyramidTypeID {
    Empty,
    String,
    Number,
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

type Keyword = [string, PyramidObject];

type PopupEvent = [string, EventListener];

class Environment {
    private env: Keyword[];
    constructor() {
        this.env = [];
    }
    get(key: string): PyramidObject | null {
        for (let i = this.env.length - 1; i >= 0; --i) {
            if (this.env[i][0] === key) {
                return this.env[i][1];
            }
        }
        return null;
    }
    set(key: string, value: PyramidObject) {
        this.env.push([key, value]);
    }
    set_all(keywords: Keyword[]) {
        for (const keyword of keywords) {
            this.env.push(keyword);
        }
    }
    remove(key: string) {
        for (let i = this.env.length - 1; i >= 0; --i) {
            if (this.env[i][0] === key) {
                this.env[i] = ["", null];
                return;
            }
        }
        throw new Error(key + " isn't in enviroment");
    }
}
