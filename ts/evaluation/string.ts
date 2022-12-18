export class String {
    // value != null
    // this conditional check "null" and "undefined"
    static check_type(value: string): boolean {
        if (value != null) return true;
        else return false;
    }

    static eval(content: string, _: Environment): PyramidObject {
        if (content != null) {
            return {
                pyramid_type: {
                    type_id: PyramidTypeID.String,
                    attribute: null,
                },
                value: content
            }
        }
        else new Error("unexpected error: null or undefined is detected")
    }
}