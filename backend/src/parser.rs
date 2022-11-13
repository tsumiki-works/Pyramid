#[derive(Clone, Debug)]
pub enum Ast {
    Nil,
    Atom(String),
    Node(Box<Ast>, Box<Ast>),
}
impl Ast {
    fn construct_boxed(current: Vec<Box<Ast>>) -> Box<Self> {
        let iter_rev = current.into_iter().rev();
        let mut res = Box::new(Ast::Nil);
        for i in iter_rev {
            res = Box::new(Self::Node(i, res));
        }
        res
    }
    pub fn to_sexpression(&self) -> String {
        match self {
            Ast::Nil => String::from(""),
            Ast::Atom(n) => n.clone(),
            Ast::Node(car, cdr) => {
                let mut res = String::new();
                match *car.clone() {
                    Ast::Nil => (),
                    Ast::Atom(n) => res.push_str(&n),
                    Ast::Node(_, _) => {
                        res.push('(');
                        res.push_str(&car.to_sexpression());
                        res.push(')');
                    }
                }
                res.push(' ');
                let res_cdr = cdr.to_sexpression();
                if res_cdr.is_empty() {
                    res.pop();
                } else {
                    res.push_str(&res_cdr);
                }
                res
            }
        }
    }
}

pub fn parse(code: &str) -> Result<Ast, String> {
    let chars = code
        .chars()
        .filter(|&n| n as u32 != 0)
        .collect::<Vec<char>>();
    if chars.is_empty() {
        return Err(String::from("pyramid backend error: code is empty."));
    }
    if chars[0] != '(' {
        return Err(String::from(
            "pyramid backend error: code doesn't begin with '('.",
        ));
    }
    let mut stack = Vec::new();
    let mut current = Vec::new();
    let mut symbol = String::new();
    for c in chars {
        match c {
            '(' => {
                if !symbol.is_empty() {
                    return Err(String::from(
                        "pyramid backend error: symbol must not have '('.",
                    ));
                }
                stack.push(current);
                current = Vec::new();
            }
            ')' => {
                if !symbol.is_empty() {
                    current.push(Box::new(Ast::Atom(symbol)));
                    symbol = String::new();
                }
                let ast = Ast::construct_boxed(current);
                current = stack.pop().ok_or(String::from(
                    "pyramid backend error: parsing stack is empty.",
                ))?;
                current.push(ast);
            }
            ' ' | '\t' | '\n' => {
                if !symbol.is_empty() {
                    current.push(Box::new(Ast::Atom(symbol)));
                    symbol = String::new();
                }
            }
            '\r' => (),
            _ => {
                symbol.push(c);
            }
        }
    }
    if !symbol.is_empty() || !stack.is_empty() || current.len() != 1 {
        Err(String::from("pyramid backend error: code is not closed."))
    } else {
        Ok(*current[0].clone())
    }
}
