mod evaluater;
mod parser;
#[cfg(test)]
mod test;

fn main() {
    let code = String::from("(+ (+ 3 4) (+ 2 3))");
    let ast_boxed = parser::parse(code).unwrap();
    let res = evaluater::eval(ast_boxed);
    println!("{:?}", res.unwrap());
}
