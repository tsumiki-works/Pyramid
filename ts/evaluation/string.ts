export class String {
    static check_type(value: string): boolean {
        if (value === "true" || value === "false") return true;
        else return false;
    }

    static eval(content: string, _: Environment): PyramidObject {
        if (content === "true") {
            return {
                pyramid_type: {
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
                value: true
            }
        }
        else if (content === "false") {
            return {
                pyramid_type: {
                    type_id: PyramidTypeID.Bool,
                    attribute: null,
                },
                value: false
            }
        }
        else new Error("unexpected error: null or undefined is detected")
    }
}