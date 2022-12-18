export class ListFunction {
    /*
    static map(fn: PyramidObject, lst: PyramidObject): PyramidObject{
        if(true){
        }else{
            new Error("pyramid backend error: invalid operands are given map function")
        }
    }
    */
    static push: PyramidObject = {
        pyramid_type: {
            type_id: PyramidTypeID.List,
            attribute: {
                args: [
                    {
                        type_id: PyramidTypeID.Number,
                        attribute: null,
                    },
                    {
                        type_id: PyramidTypeID.List,
                        attribute: null,
                    }
                ],
                return_type: {
                    type_id: PyramidTypeID.List,
                    attribute: null,
                } 
            },
        },
        value: (args: PyramidObject[], env: Environment): PyramidObject => {
            if(args.length != 2){
                throw new Error("`push` must have 2 arguments but get " + args.length);
            }
            return {
                pyramid_type: {
                    type_id: PyramidTypeID.List,
                    attribute: null,
                },
                value: args[1].value.push(args[0].value)
            }
        }
    }
}