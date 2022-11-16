use super::parser::Ast;

pub enum PyramidType {
    Int,
    Double,
    PyramidString,
    Bool,
    //List(Box<PyramidType>),
    Nil,
}

pub struct PyramidObject {
    type_id: PyramidType,
    pub value: String,
}

pub fn eval(ast: Ast) -> Result<PyramidObject, String> {
    match ast {
        Ast::Nil => Ok(PyramidObject {
            type_id: PyramidType::Nil,
            value: String::from("nil"),
        }),
        //eval term's type
        Ast::Atom(s) => {
            if s == "nil" {
                Ok(PyramidObject {
                    type_id: PyramidType::Nil,
                    value: String::from("nill"),
                })
            } else if s == "true" || s == "false" {
                Ok(PyramidObject {
                    type_id: PyramidType::Bool,
                    value: s,
                })
            } else if is_pyramid_string(s.clone()) {
                Ok(PyramidObject {
                    type_id: PyramidType::PyramidString,
                    value: get_pyramid_string(s),
                })
            } else if is_pyramid_int(s.clone()) {
                Ok(PyramidObject {
                    type_id: PyramidType::Int,
                    value: s,
                })
            } else if is_pyramid_double(s.clone()) {
                Ok(PyramidObject {
                    type_id: PyramidType::Double,
                    value: s,
                })
            } else {
                Ok(PyramidObject {
                    type_id: PyramidType::Int,
                    value: s,
                })
            }
        }
        Ast::Node(car, cdr) => match *car {
            Ast::Atom(s) => {
                // add calculation
                if s == "+" {
                    Ok(eval_operation(*cdr, "+", add)?)
                } else if s =="-" {
                    Ok(eval_operation(*cdr, "-", sub)?)
                } else if s =="*" {
                    Ok(eval_operation(*cdr, "*", mul)?)
                } else if s =="/" {
                    Ok(eval_operation(*cdr, "/", div)?)
                } else if s =="//" {
                    Ok(eval_operation(*cdr, "//", int_div)?)
                } else if s =="%" {
                    Ok(eval_operation(*cdr, "%", modulo)?)
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
                let arg2_val = arg2.value.clone().parse::<String>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not string.",
                        arg2.value
                    )
                })?;
                let arg1_val = arg1.value.clone().parse::<String>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg1.value)
                })?;
                let res = arg1_val + arg2_val.as_str();
                Ok(PyramidObject { type_id: PyramidType::PyramidString, value: res})
            }
            (PyramidType::Int, PyramidType::Int) => {
                let arg2_val = arg2.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg2.value)
                })?;
                let arg1_val = arg1.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg1.value)
                })?;
                let res = arg1_val + arg2_val;
                Ok(PyramidObject { type_id: PyramidType::Int, value: res.to_string() })
            }
            (PyramidType::Int, PyramidType::Double) | (PyramidType::Double, PyramidType::Int) | (PyramidType::Double, PyramidType::Double) => {
                let arg2_val = arg2.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg2.value
                    )
                })?;
                let arg1_val = arg1.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg1.value
                    )
                })?;
                let res = arg1_val + arg2_val;
                if is_pyramid_int(res.clone().to_string()){
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string() + ".0"})
                }else{
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string()})
                }
            }
            (PyramidType::Nil, _) | (_, PyramidType::Nil) => {
                Err(String::from("pyramid backend error: nil is not operand."))
            }
            _ => Err(String::from(format!(
                "pyramid backend error: These operands ('{}', '{}') are invaild arguments for 'add'.",
                arg1.value,
                arg2.value
            ))),
        }
    }
}

fn sub(args: Vec<PyramidObject>) -> Result<PyramidObject, String> {
    if args.len() != 2 {
        Err(String::from(
            "pyramid backend error: too many arguments for '-' operation.",
        ))
    } else {
        let mut args = args;
        let arg2 = args.pop().unwrap();
        let arg1 = args.pop().unwrap();
        match (arg1.type_id, arg2.type_id) {
            (PyramidType::Int, PyramidType::Int) => {
                let arg2_val = arg2.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg2.value)
                })?;
                let arg1_val = arg1.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg1.value)
                })?;
                let res = arg1_val - arg2_val;
                Ok(PyramidObject { type_id: PyramidType::Int, value: res.to_string() })
            }
            (PyramidType::Int, PyramidType::Double) | (PyramidType::Double, PyramidType::Int) | (PyramidType::Double, PyramidType::Double) => {
                let arg2_val = arg2.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg2.value
                    )
                })?;
                let arg1_val = arg1.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg1.value
                    )
                })?;
                let res = arg1_val - arg2_val;
                if is_pyramid_int(res.clone().to_string()){
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string() + ".0"})
                }else{
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string()})
                }
            }
            (PyramidType::Nil, _) | (_, PyramidType::Nil) => {
                Err(String::from("pyramid backend error: nil is not operand."))
            }
            _ => Err(String::from(format!(
                "pyramid backend error: These operands ('{}', '{}') are invaild arguments for 'sub'.",
                arg1.value,
                arg2.value
            ))),
        }
    }
}

fn mul(args: Vec<PyramidObject>) -> Result<PyramidObject, String> {
    if args.len() != 2 {
        Err(String::from(
            "pyramid backend error: too many arguments for '*' operation.",
        ))
    } else {
        let mut args = args;
        let arg2 = args.pop().unwrap();
        let arg1 = args.pop().unwrap();
        match (arg1.type_id, arg2.type_id) {
            (PyramidType::Int, PyramidType::Int) => {
                let arg2_val = arg2.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg2.value)
                })?;
                let arg1_val = arg1.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg1.value)
                })?;
                let res = arg1_val * arg2_val;
                Ok(PyramidObject { type_id: PyramidType::Int, value: res.to_string() })
            }
            (PyramidType::Int, PyramidType::Double) | (PyramidType::Double, PyramidType::Int) | (PyramidType::Double, PyramidType::Double) => {
                let arg2_val = arg2.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg2.value
                    )
                })?;
                let arg1_val = arg1.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg1.value
                    )
                })?;
                let res = arg1_val * arg2_val;
                if is_pyramid_int(res.clone().to_string()){
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string() + ".0"})
                }else{
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string()})
                }
            }
            (PyramidType::Nil, _) | (_, PyramidType::Nil) => {
                Err(String::from("pyramid backend error: nil is not operand."))
            }
            _ => Err(String::from(format!(
                "pyramid backend error: These operands ('{}', '{}') are invaild arguments for 'mul'.",
                arg1.value,
                arg2.value
            ))),
        }
    }
}

// Always returns an integer quotient (returns the floor function value of the quotient)
// Return PyramidObject:PyramidType::Int
fn int_div(args: Vec<PyramidObject>) -> Result<PyramidObject, String> {
    if args.len() != 2 {
        Err(String::from(
            "pyramid backend error: too many arguments for '//' operation.",
        ))
    } else {
        let mut args = args;
        let arg2 = args.pop().unwrap();
        let arg1 = args.pop().unwrap();
        match (arg1.type_id, arg2.type_id) {
            (PyramidType::Int, PyramidType::Int) => {
                let arg2_val = arg2.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg2.value)
                })?;
                let arg1_val = arg1.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg1.value)
                })?;
                let res = arg1_val / arg2_val;
                Ok(PyramidObject { type_id: PyramidType::Int, value: res.to_string() })
            }
            (PyramidType::Int, PyramidType::Double) | (PyramidType::Double, PyramidType::Int) | (PyramidType::Double, PyramidType::Double) => {
                let arg2_val = arg2.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg2.value
                    )
                })?;
                let arg1_val = arg1.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg1.value
                    )
                })?;
                let res = ((arg1_val / arg2_val) as f64).floor();
                Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string()})
            }
            (PyramidType::Nil, _) | (_, PyramidType::Nil) => {
                Err(String::from("pyramid backend error: nil is not operand."))
            }
            _ => Err(String::from(format!(
                "pyramid backend error: These operands ('{}', '{}') are invaild arguments for 'int_div'.",
                arg1.value,
                arg2.value
            ))),
        }
    }
}

// Return quotient
// Return PyramidObject:PyramidType::Double
fn div(args: Vec<PyramidObject>) -> Result<PyramidObject, String> {
    if args.len() != 2 {
        Err(String::from(
            "pyramid backend error: too many arguments for '/' operation.",
        ))
    } else {
        let mut args = args;
        let arg2 = args.pop().unwrap();
        let arg1 = args.pop().unwrap();
        match (arg1.type_id, arg2.type_id) {
            (PyramidType::Int, PyramidType::Int) => {
                let arg2_val = arg2.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg2.value)
                })?;
                let arg1_val = arg1.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg1.value)
                })?;
                let res = (arg1_val as f64) / (arg2_val as f64);
                if is_pyramid_int(res.clone().to_string()){
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string() + ".0"})
                }else{
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string()})
                }
            }
            (PyramidType::Int, PyramidType::Double) | (PyramidType::Double, PyramidType::Int) | (PyramidType::Double, PyramidType::Double) => {
                let arg2_val = arg2.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg2.value
                    )
                })?;
                let arg1_val = arg1.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg1.value
                    )
                })?;
                let res = arg1_val / arg2_val;
                if is_pyramid_int(res.clone().to_string()){
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string() + ".0"})
                }else{
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string()})
                }
            }
            (PyramidType::Nil, _) | (_, PyramidType::Nil) => {
                Err(String::from("pyramid backend error: nil is not operand."))
            }
            _ => Err(String::from(format!(
                "pyramid backend error: These operands ('{}', '{}') are invaild arguments for 'div'.",
                arg1.value,
                arg2.value
            ))),
        }
    }
}

fn modulo(args: Vec<PyramidObject>) -> Result<PyramidObject, String> {
    if args.len() != 2 {
        Err(String::from(
            "pyramid backend error: too many arguments for '%' operation.",
        ))
    } else {
        let mut args = args;
        let arg2 = args.pop().unwrap();
        let arg1 = args.pop().unwrap();
        match (arg1.type_id, arg2.type_id) {
            (PyramidType::Int, PyramidType::Int) => {
                let arg2_val = arg2.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg2.value)
                })?;
                let arg1_val = arg1.value.clone().parse::<i64>().map_err(|_| {
                    format!("pyramid backend error: '{}' is not integer.", arg1.value)
                })?;
                let res = arg1_val + arg2_val;
                Ok(PyramidObject { type_id: PyramidType::Int, value: res.to_string() })
            }
            (PyramidType::Int, PyramidType::Double) | (PyramidType::Double, PyramidType::Int) | (PyramidType::Double, PyramidType::Double) => {
                let arg2_val = arg2.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg2.value
                    )
                })?;
                let arg1_val = arg1.value.clone().parse::<f64>().map_err(|_| {
                    format!(
                        "pyramid backend error: '{}' is not float point number.",
                        arg1.value
                    )
                })?;
                let res = arg1_val + arg2_val;
                if is_pyramid_int(res.clone().to_string()){
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string() + ".0"})
                }else{
                    Ok(PyramidObject { type_id: PyramidType::Double, value: res.to_string()})
                }
            }
            (PyramidType::Nil, _) | (_, PyramidType::Nil) => {
                Err(String::from("pyramid backend error: nil is not operand."))
            }
            _ => Err(String::from(format!(
                "pyramid backend error: These operands ('{}', '{}') are invaild arguments for 'modulo'.",
                arg1.value,
                arg2.value
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

fn is_pyramid_string(st: String) -> bool {
    st.starts_with("\\\"") && st.ends_with("\\\"")
}

//Only ASCII is allowed
fn is_pyramid_int(st: String) -> bool {
    for i in st.to_string().chars().enumerate() {
        match i.0 {
            0 => match i.1 {
                '-' => continue,
                '0'..='9' => continue,
                _ => return false,
            },
            _ => match i.1 {
                '0'..='9' => continue,
                _ => return false,
            },
        }
    }
    true
}

fn is_pyramid_double(st: String) -> bool {
    let mut dot_times = 0;
    if st.starts_with("+.") || st.starts_with("-.") {
        return false;
    }
    for i in st.to_string().chars().enumerate() {
        match i.0 {
            0 => match i.1 {
                '+' => continue,
                '-' => continue,
                '0'..='9' => continue,
                _ => return false,
            },
            _ => match i.1 {
                '0'..='9' => continue,
                '.' => match dot_times {
                    0 => {
                        dot_times = 1;
                        continue;
                    }
                    _ => return false,
                },
                _ => return false,
            },
        }
    }
    match dot_times {
        1 => true,
        _ => false,
    }
}

fn get_pyramid_string(st: String) -> String {
    let max_index = st.len() - 1;
    let mut new_st = String::new();
    for i in st.to_string().chars().enumerate() {
        if i.0 < 2 {
            continue;
        } else if i.0 > max_index - 2{
            break;
        } else {
            new_st.push(i.1)
        }
    }
    new_st
}

#[test]
fn pyramid_string_test() {
    assert_eq!(is_pyramid_string(String::from("\\\"abc\\\"")), true);
    assert_eq!(is_pyramid_string(String::from("\\\"abc")), false);
    assert_eq!(is_pyramid_string(String::from("abc\\\"")), false);
    assert_eq!(is_pyramid_string(String::from("abc")), false);
}

#[test]
fn pyramid_int_test() {
    assert_eq!(is_pyramid_int(String::from("123")), true);
    assert_eq!(is_pyramid_int(String::from("038892045")), true);
    assert_eq!(is_pyramid_int(String::from("-123")), true);
    assert_eq!(is_pyramid_int(String::from("3.1453")), false);
    assert_eq!(is_pyramid_int(String::from("abc")), false);
}

#[test]
fn pyramid_double_test() {
    assert_eq!(is_pyramid_double(String::from("1.0")), true);
    assert_eq!(is_pyramid_double(String::from("1.23")), true);
    assert_eq!(is_pyramid_double(String::from("0.38892045")), true);
    assert_eq!(is_pyramid_double(String::from("38892045.0")), true);
    assert_eq!(is_pyramid_double(String::from("38892045.")), true);
    assert_eq!(is_pyramid_double(String::from("123")), false);
    assert_eq!(is_pyramid_double(String::from("-123")), false);
    assert_eq!(is_pyramid_double(String::from(".31453")), false);
    assert_eq!(is_pyramid_double(String::from("-.31453")), false);
    assert_eq!(is_pyramid_double(String::from("abc")), false);
}

#[test]
fn get_pyramid_string_test() {
    assert_eq!(get_pyramid_string(String::from("\\\"abc\\\"")), "abc");
    assert_eq!(get_pyramid_string(String::from("\\\"\\\"")), "");
}
