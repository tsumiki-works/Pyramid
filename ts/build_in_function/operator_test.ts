import { Operator } from "./Operator.js";

let normalExpValues: PyramidObject[] = []
let normalRealValues: PyramidObject[] = []

//add Function

//// Normal Cases Test
normalRealValues.push(Operator.add({
    pyramid_type: {type_id: PyramidTypeID.I32, attribute: null},
    value: 24
},
{
    pyramid_type: {type_id: PyramidTypeID.I32, attribute: null},
    value: 17
}))

normalExpValues.push({
    pyramid_type: {type_id: PyramidTypeID.I32, attribute: null},
    value: 41
})

normalRealValues.push(Operator.add({
    pyramid_type: {type_id: PyramidTypeID.F32, attribute: null},
    value: 1.234
},
{
    pyramid_type: {type_id: PyramidTypeID.F32, attribute: null},
    value: 3.456
}))

normalExpValues.push({
    pyramid_type: {type_id: PyramidTypeID.F32, attribute: null},
    value: 4.6899999999999995
})

normalRealValues.push(Operator.add({
    pyramid_type: {type_id: PyramidTypeID.I32, attribute: null},
    value: 5
},
{
    pyramid_type: {type_id: PyramidTypeID.F32, attribute: null},
    value: 3.456
}))

normalExpValues.push({
    pyramid_type: {type_id: PyramidTypeID.F32, attribute: null},
    value: 8.456
})

normalRealValues.push(Operator.add({
    pyramid_type: {type_id: PyramidTypeID.String, attribute: null},
    value: "aaa"
},
{
    pyramid_type: {type_id: PyramidTypeID.String, attribute: null},
    value: "bbb"
}))

normalExpValues.push({
    pyramid_type: {type_id: PyramidTypeID.String, attribute: null},
    value: "aaabbb"
})


//// Special Cases Test

let specialExpValues: PyramidObject[] = []
let specialRealValues: PyramidObject[] = []
let returnError = (fn:Function, arg1:PyramidObject, arg2:PyramidObject):string =>{
    try {
        fn(arg1, arg2);
        return "0"
    } catch (error) {
        if (error instanceof Error){
            return error.message;
        }
        console.log("faild catching error");
        throw error
    }
}


specialRealValues.push(Operator.add({
    pyramid_type: {type_id: PyramidTypeID.I32, attribute: null},
    value: 3.402823e+38
},
{
    pyramid_type: {type_id: PyramidTypeID.F32, attribute: null},
    value: 3.402823e+38
}))

specialExpValues.push({
    pyramid_type: {type_id: PyramidTypeID.F32, attribute: null},
    value: Number.POSITIVE_INFINITY
})

// Display Part

console.log("--- Normal Cases Tests ---");

for (let i = 0; i < normalExpValues.length; i++){
    console.log("realValue: " + normalRealValues[i] + " val: " + normalRealValues[i].value + "\n"
    + "expValue: " + normalExpValues[i]  + " val: " + normalExpValues[i].value + "\n");
}

console.log("--- Special Cases Tests ---");

console.log("realValue: " + returnError(Operator.add, {
    pyramid_type: {type_id: PyramidTypeID.I32, attribute: null},
    value: 2147483647
},
{
    pyramid_type: {type_id: PyramidTypeID.I32, attribute: null},
    value: 2147483647
}) + "\n" 
+ "expValue: " + "pyramid backend error: int addition overflowed toward positive")

console.log("realValue: " + returnError(Operator.add, {
    pyramid_type: {type_id: PyramidTypeID.String, attribute: null},
    value: null
},
{
    pyramid_type: {type_id: PyramidTypeID.String, attribute: null},
    value: null
}) + "\n" 
+ "expValue: " + "pyramid backend error: string addition return non-string")

console.log("realValue: " + returnError(Operator.add, {
    pyramid_type: {type_id: PyramidTypeID.Bool, attribute: null},
    value: true
},
{
    pyramid_type: {type_id: PyramidTypeID.I32, attribute: null},
    value: 1
}) + "\n" 
+ "expValue: " +  "pyramid backend error: invalid operands are given add oprato")

for (let i = 0; i < specialExpValues.length; i++){
    console.log("realValue: " + specialRealValues[i] + " val: " + specialRealValues[i].value + "\n"
    + "expValue: " + specialExpValues[i]  + " val: " + specialExpValues[i].value + "\n");
}
