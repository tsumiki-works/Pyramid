use super::*;

#[test]
fn parse_test() {
    let code = String::from("()");
    let expected = "Nil";
    assert_eq!(format!("{:?}", parser::parse(code).unwrap()), expected);
    let code = String::from("(* 1 (+ 2 3))");
    let expected = "Node(Atom(\"*\"), Node(Atom(\"1\"), Node(Node(Atom(\"+\"), Node(Atom(\"2\"), Node(Atom(\"3\"), Nil))), Nil)))";
    assert_eq!(format!("{:?}", parser::parse(code).unwrap()), expected);
    let code = String::from("(* 1       \n (    + 2 3 ) )");
    let expected = "Node(Atom(\"*\"), Node(Atom(\"1\"), Node(Node(Atom(\"+\"), Node(Atom(\"2\"), Node(Atom(\"3\"), Nil))), Nil)))";
    assert_eq!(format!("{:?}", parser::parse(code).unwrap()), expected);
}

#[test]
fn parse_test_wrong() {
    assert!(parser::parse(String::from("")).is_err());
    assert!(parser::parse(String::from("(")).is_err());
    assert!(parser::parse(String::from("(*")).is_err());
    assert!(parser::parse(String::from("(*())")).is_err());
}

#[test]
fn eval_test_add() {
    let code = String::from("(+ 1 2)");
    let expected = "3";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap(), expected);
    let code = String::from("(+ (+ 1 2) (+ 3 4))");
    let expected = "10";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap(), expected);
}

#[test]
fn eval_test_add_wrong() {
    let code = String::from("(+)");
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
    let code = String::from("(+ 1)");
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
    let code = String::from("(+ 1 ())");
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
    let code = String::from("(+ () 1)");
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
    let code = String::from("(+ 1 2 3)");
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
}