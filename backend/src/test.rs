use super::*;

#[test]
fn parse_test() {
    let code = "()";
    let expected = "Nil";
    assert_eq!(format!("{:?}", parser::parse(code).unwrap()), expected);
    let code = "(* 1 (+ 2 3))";
    let expected = "Node(Atom(\"*\"), Node(Atom(\"1\"), Node(Node(Atom(\"+\"), Node(Atom(\"2\"), Node(Atom(\"3\"), Nil))), Nil)))";
    assert_eq!(format!("{:?}", parser::parse(code).unwrap()), expected);
    let code = "(* 1       \n (    + 2 3 ) )";
    let expected = "Node(Atom(\"*\"), Node(Atom(\"1\"), Node(Node(Atom(\"+\"), Node(Atom(\"2\"), Node(Atom(\"3\"), Nil))), Nil)))";
    assert_eq!(format!("{:?}", parser::parse(code).unwrap()), expected);
}

#[test]
fn parse_test_wrong() {
    assert!(parser::parse("").is_err());
    assert!(parser::parse("(").is_err());
    assert!(parser::parse("(*").is_err());
    assert!(parser::parse("(*())").is_err());
}

#[test]
fn eval_test_add() {
    let code = "(+ 1 2)";
    let expected = "3";
    assert_eq!(
        evaluater::eval(parser::parse(code).unwrap()).unwrap().value,
        expected
    );
    let code = "(+ (+ 1 2) (+ 3 4))";
    let expected = "10";
    assert_eq!(
        evaluater::eval(parser::parse(code).unwrap()).unwrap().value,
        expected
    );
    let code = "(+ \\\"1\\\" \\\"2\\\" )";
    let expected = "12";
    assert_eq!(
        evaluater::eval(parser::parse(code).unwrap()).unwrap().value,
        expected
    );
    let code = "(+ 1.32 2.08)";
    let expected = "3.4000000000000004";
    assert_eq!(
        evaluater::eval(parser::parse(code).unwrap()).unwrap().value,
        expected
    );

    let code = "(+ 1.0 2.0)";
    let expected = "3.0";
    assert_eq!(
        evaluater::eval(parser::parse(code).unwrap()).unwrap().value,
        expected
    );
    let code = "(+ 1.0 2)";
    let expected = "3.0";
    assert_eq!(
        evaluater::eval(parser::parse(code).unwrap()).unwrap().value,
        expected
    );
}

#[test]
fn eval_test_add_wrong() {
    let code = "(+)";
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
    let code = "(+ 1)";
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
    let code = "(+ 1 ())";
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
    let code = "(+ () 1)";
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
    let code = "(+ 1 2 3)";
    assert!(evaluater::eval(parser::parse(code).unwrap()).is_err());
}

#[test]
fn eval_test_sub(){
    let code = "(- 3 2)";
    let expected = "1";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(- 2.0 3.0)";
    let expected = "-1.0";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(- 3.14 7.342)";
    let expected = "-4.202";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
}

#[test]
fn eval_test_mul(){
    let code = "(* 3 2)";
    let expected = "6";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(* -2.0 3)";
    let expected = "-6.0";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(* 3.14 7.342)";
    let expected = "23.05388";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
}

#[test]
fn eval_test_int_div(){
    let code = "(// 3 2)";
    let expected = "1";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(// 7.1 3)";
    let expected = "2";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(// -7.1 3)";
    let expected = "-3";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
}

#[test]
fn eval_test_div(){
    let code = "(/ 3 2)";
    let expected = "1.5";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(/ 6 2)";
    let expected = "3.0";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(/ -6.0 2.0)";
    let expected = "-3.0";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(/ 7.1 3)";
    let expected = "2.3666666666666667";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(/ 7.1 -3)";
    let expected = "-2.3666666666666667";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
}

#[test]
fn eval_test_modulo(){
    let code = "(% 3 2)";
    let expected = "1";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(% -3 2)";
    let expected = "-1";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(% -3 -2)";
    let expected = "-1";
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
    let code = "(% 7.1 3.2)";
    let expected = evaluater::eval(parser::parse("(- 7.1 (* 3.2 (// 7.1 3.2)))").unwrap()).unwrap().value;
    assert_eq!(evaluater::eval(parser::parse(code).unwrap()).unwrap().value, expected);
}

#[test]
fn diff_test() {
    let threshold = f64::EPSILON * 1000.;
    assert!((intrinsic_func::diff(|x| x * x / 2., 1.).unwrap() - 1.).abs() < threshold);
    assert!(intrinsic_func::diff(|x| x * x / 2., f64::INFINITY).is_err());
    assert!(intrinsic_func::diff(|x| x * x / 2., f64::NAN).is_err());
    assert!(intrinsic_func::diff(|x| 1. / (x + f64::EPSILON), 0.).is_err());
}

#[test]
fn integrate_test() {
    let threshold = f64::EPSILON * 10000000.;
    assert!(
        ((intrinsic_func::integrate(|x: f64| (-x * x).exp(), 0., 1.).unwrap()) * 2.
            / std::f64::consts::PI.sqrt()
            - 0.842700792949714869)
            .abs()
            < threshold
    );
    assert!(intrinsic_func::integrate(|x| x * x * 3., f64::INFINITY, 1.).is_err());
    assert!(intrinsic_func::integrate(|x| x * x * 3., 0., f64::NAN).is_err());
    assert!(intrinsic_func::integrate(|x| 1. / x, 0., 1.).is_err());
}
