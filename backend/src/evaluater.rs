use super::parser::Ast;

pub enum PyramidType {
    Int,
    Double,
    PyramidString,
    Bool,
    List(Box<PyramidType>),
    Nil,
}

pub struct PyramidObject {
    type_id: PyramidType,
    pub value: Option<String>,
}

pub fn eval(ast: Ast) -> Result<PyramidObject, String> {
    match ast {
        Ast::Nil => Ok(PyramidObject {
            type_id: PyramidType::Nil,
            value: None,
        }),
        //eval term's type
        Ast::Atom(s) => {
            if s == "nil"{
                Ok(PyramidObject { type_id: PyramidType::Nil, value: None })
            }else {
                Ok(PyramidObject {
                type_id: PyramidType::Int,
                value: Some(s),
                })
            }
        }
        Ast::Node(car, cdr) => match *car {
            Ast::Atom(s) => {
                if s == "+" {
                    Ok(eval_operation(*cdr, "+", add)?)
                // add other calculation
                } else if s == "nil" {
                    Err(String::from(
                        "pyramid backend error: function symbol must be atom but nil found.",
                    ))
                } else {
                    Err(format!(
                        "pyramid backend error: invalid function symbol '{}' found.",
                        s
                    ))
                }
            }
            _ => Err(format!(
                "pyramid backend error: function symbol must be atom but '({})' found.",
                car.to_sexpression()
            )),
        },
    }
}

fn add(args: Vec<PyramidObject>) -> Result<PyramidObject, String> {
    if args.len() != 2 {
        Err(String::from(
            "pyramid backend error: too many arguments for '+' operation.",
        ))
    } else {
        let mut args = args;
        let arg2 = args.pop().unwrap();
        let arg1 = args.pop().unwrap();
        match (arg1.type_id, arg2.type_id) {
            (PyramidType::PyramidString, PyramidType::PyramidString) => {
                let arg2_val = arg2.value.clone().unwrap().parse::<String>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not string.",
                        arg2.value.unwrap()
                    )
                })?;
                let arg1_val = arg1.value.clone().unwrap().parse::<String>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg1.value.unwrap())
                })?;
                let res = arg1_val + arg2_val.as_str();
                Ok(PyramidObject { type_id: PyramidType::PyramidString, value: Some(res) })
            }
            (PyramidType::Int, PyramidType::Int) => {
                let arg2_val = arg2.value.clone().unwrap().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg2.value.unwrap())
                })?;
                let arg1_val = arg1.value.clone().unwrap().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg1.value.unwrap())
                })?;
                let res = arg1_val + arg2_val;
                Ok(PyramidObject { type_id: PyramidType::Int, value: Some(res.to_string()) })
            }
            (PyramidType::Int, PyramidType::Double) | (PyramidType::Double, PyramidType::Int) | (PyramidType::Double, PyramidType::Double) => {
                let arg2_val = arg2.value.clone().unwrap().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg2.value.unwrap()
                    )
                })?;
                let arg1_val = arg1.value.clone().unwrap().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg1.value.unwrap()
                    )
                })?;
                let res = arg1_val + arg2_val;
                Ok(PyramidObject { type_id: PyramidType::Double, value: Some(res.to_string()) })
            }
            (PyramidType::Nil, _) | (_, PyramidType::Nil) => {
                Err(String::from("pyramid backend error: nil is not operand."))
            }
            _ => Err(String::from(format!(
                "pyramid backend error: These operands ('{}', '{}') are invaild arguments for 'add'.",
                arg1.value.unwrap(),
                arg2.value.unwrap()
            ))),
        }
    }
}

fn eval_operation(
    ast: Ast,
    opname: &'static str,
    op: fn(_: Vec<PyramidObject>) -> Result<PyramidObject, String>,
) -> Result<PyramidObject, String> {
    let mut args = Vec::new();
    let mut cdr = ast;
    loop {
        match cdr {
            Ast::Nil => break,
            Ast::Node(cadr, cddr) => {
                args.push(eval(*cadr)?);
                cdr = *cddr;
            }
            Ast::Atom(s) => {
                return Err(format!(
                    "pyramid backend error: invalid argument '{}' found for '{}' operation.",
                    s, opname
                ))
            }
        }
    }
    Ok(op(args)?)
}
