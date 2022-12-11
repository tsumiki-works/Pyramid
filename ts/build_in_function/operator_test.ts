import { Operator } from "./operator.js";

let normalExpValues: PyramidObject[] = []
let normalRealValues: PyramidObject[] = []

// if the value is 0 or NaN, this function return false
const isPyramidObject = (item: any): item is PyramidObject => {
    return !!(item as PyramidObject).value;
}

let specialExpValues: (PyramidObject | string)[] = []
let specialRealValues: (PyramidObject | string)[] = []
let returnError = (fn: Function, arg1: PyramidObject, arg2: PyramidObject): string => {
    try {
        fn(arg1, arg2);
        return "0"
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
        console.log("faild catching error");
        throw error
    }
}



////////// add Function //////////
//// Normal Cases Test
normalRealValues.push(Operator.add({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 24
},
    {
        pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
        value: 17
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 41
})

normalRealValues.push(Operator.add({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 1.234
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 3.456
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 4.6899999999999995
})

normalRealValues.push(Operator.add({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 5
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 3.456
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 8.456
})

normalRealValues.push(Operator.add({
    pyramid_type: { type_id: PyramidTypeID.String, attribute: null },
    value: "aaa"
},
    {
        pyramid_type: { type_id: PyramidTypeID.String, attribute: null },
        value: "bbb"
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.String, attribute: null },
    value: "aaabbb"
})

//// Special Cases Test
specialRealValues.push(Operator.add({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 3.402823e+38
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 3.402823e+38
    }))
specialExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.POSITIVE_INFINITY
})

specialRealValues.push(Operator.add({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.NaN
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 1.4
    }))
specialExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.NaN
})

specialRealValues.push(returnError(Operator.add, {
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 2147483647
},
    {
        pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
        value: 2147483647
    }))
specialExpValues.push("pyramid backend error: int addition overflowed toward positive")

specialRealValues.push(returnError(Operator.add, {
    pyramid_type: { type_id: PyramidTypeID.String, attribute: null },
    value: null
},
    {
        pyramid_type: { type_id: PyramidTypeID.String, attribute: null },
        value: null
    }))
specialExpValues.push("pyramid backend error: string addition return non-string")

specialRealValues.push(returnError(Operator.add, {
    pyramid_type: { type_id: PyramidTypeID.Bool, attribute: null },
    value: true
},
    {
        pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
        value: 1
    }))
specialExpValues.push("pyramid backend error: invalid operands are given add oprator")



////////// sub Function //////////
//// Normal Cases Test
normalRealValues.push(Operator.sub({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 24
},
    {
        pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
        value: 17
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 7
})

normalRealValues.push(Operator.sub({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 1.234
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 3.456
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: -2.222
})

normalRealValues.push(Operator.sub({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 5
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 3.456
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 1.544
})

//// Special Cases Test
specialRealValues.push(Operator.sub({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.POSITIVE_INFINITY
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: Number.POSITIVE_INFINITY
    }))
specialExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.NaN
})



////////// mul Function //////////
//// Normal Cases Test
normalRealValues.push(Operator.mul({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 24
},
    {
        pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
        value: 17
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 408
})

normalRealValues.push(Operator.mul({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 1.234
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 3.456
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 4.264704
})

//// Special Cases Test
specialRealValues.push(Operator.mul({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.POSITIVE_INFINITY
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 0
    }))
specialExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.NaN
})



////////// div Function //////////
//// Normal Cases Test
normalRealValues.push(Operator.div({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 6
},
    {
        pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
        value: 3
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 2
})

normalRealValues.push(Operator.div({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 24
},
    {
        pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
        value: 17
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 1.411764705882353
})

normalRealValues.push(Operator.div({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 6.0
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 3.0
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 2.0
})

//// Special Cases Test
specialRealValues.push(Operator.div({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.POSITIVE_INFINITY
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: Number.POSITIVE_INFINITY
    }))
specialExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.NaN
})

specialRealValues.push(Operator.div({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 0
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 0
    }))
specialExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.NaN
})

specialRealValues.push(Operator.div({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 2
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 0
    }))
specialExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: Number.POSITIVE_INFINITY
})

specialRealValues.push(Operator.div({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 2
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: Number.POSITIVE_INFINITY
    }))
specialExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 0
})

specialRealValues.push(returnError(Operator.div, {
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 2
},
    {
        pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
        value: 0
    }))
specialExpValues.push("pyramid backend error: int division deteched zero division")



////////// mod Function //////////
//// Normal Cases Test
normalRealValues.push(Operator.mod({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 5
},
    {
        pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
        value: 2
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.I32, attribute: null },
    value: 1
})

normalRealValues.push(Operator.mod({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 5.2
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 3.0
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 2.2
})

normalRealValues.push(Operator.mod({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 5.0
},
    {
        pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
        value: 2.0
    }))
normalExpValues.push({
    pyramid_type: { type_id: PyramidTypeID.F32, attribute: null },
    value: 1
})

// Display Part

console.log("--- Normal Cases Tests ---");

console.log(normalRealValues[9].pyramid_type.type_id); //2 (PyramidTypeID.I32)
console.log(normalRealValues[11].pyramid_type.type_id) //3 (PyramidTypeID.F32)
console.log(normalRealValues[14].pyramid_type.type_id) //2 (PyramidTypeID.I32)
for (let i = 0; i < normalExpValues.length; i++) {
    console.log("realValue: " + normalRealValues[i] + " val: " + normalRealValues[i].value + "\n"
        + "expValue: " + normalExpValues[i] + " val: " + normalExpValues[i].value + "\n");
}

console.log("--- Special Cases Tests ---");

console.log((specialExpValues[1] as PyramidObject).value); //NaN
console.log((specialRealValues[5] as PyramidObject).value); //NaN
console.log((specialRealValues[6] as PyramidObject).value); //NaN
for (let j = 0; j < specialExpValues.length; j++) {
    //console.log("realValue: " + specialRealValues[i])
    if (isPyramidObject(specialExpValues[j]) && isPyramidObject(specialRealValues[j])) {
        console.log("realValue: " + specialRealValues[j] + " val: " + (specialRealValues[j] as PyramidObject).value + "\n"
            + "expValue: " + specialExpValues[j] + " val: " + (specialExpValues[j] as PyramidObject).value);
    }
    else {
        console.log("realValue: " + specialRealValues[j] + "\n" + "explValue: " + specialExpValues[j]);
    }
}
