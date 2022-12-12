export namespace BlockConst {
    export const UNIT_WIDTH: number = 100.0;
    export const UNIT_HALF_WIDTH: number = 50.0;
    export const UNIT_HEIGHT: number = 50.0;
    export const UNIT_HALF_HEIGHT: number = 25.0;

    export namespace I32 {
        export const check_type: Function = function (value: string): boolean {
            // TODO:
            return true;
        }
        export const eval_inner: Function = function(content: string, env: Environment): PyramidObject {
            // TODO:
            return {
                pyramid_type: {
                    type_id: PyramidTypeID.I32,
                    attribute: null,
                },
                value: 0,
            };
        }
    }
}