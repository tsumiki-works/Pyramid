use super::parser::Ast;

pub enum PyramidType{
    Int(i64),
    Double(f64),
    PyramidString(String),
    Bool(bool),
    List(std::collections::LinkedList<PyramidType>),
}

pub fn eval(ast: Ast) -> Result<String, String> {
    match ast {
        Ast::Nil => Ok(String::from("nil")),
        Ast::Atom(s) => Ok(s),
        Ast::Node(car, cdr) => match *car {
            Ast::Atom(s) => {
                if s == "+" {
                    Ok(eval_operation(*cdr, "+", add)?)
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

fn add(args: Vec<String>) -> Result<String, String> {
    if args.len() != 2 {
        Err(String::from(
            "pyramid backend error: too many arguments for '+' operation.",
        ))
    } else {
        let mut args = args;
        let arg2 = args.pop().unwrap();
        let arg1 = args.pop().unwrap();
        let arg2_val = arg2
            .parse::<i64>()
            .map_err(|_| format!("pyramid backend error: '{}' is not integer.", arg2))?;
        let arg1_val = arg1
            .parse::<i64>()
            .map_err(|_| format!("pyramid backend error: '{}' is not integer.", arg1))?;
        let res = arg1_val + arg2_val;
        Ok(res.to_string())
    }
}

fn eval_operation(
    ast: Ast,
    opname: &'static str,
    op: fn(_: Vec<String>) -> Result<String, String>,
) -> Result<String, String> {
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
