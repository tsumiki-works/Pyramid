export class I32 {

    static check_type(value: string): boolean {
        // TODO:
        return true;
    }

    static eval(content: string, _: Environment): PyramidObject {
        // TODO:
        const v = parseInt(content);
        if (isNaN(v)) {
            throw new Error("unexpected error: " + content + " is not I32");
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.I32,
                attribute: null,
            },
            value: v,
        };
    }
}