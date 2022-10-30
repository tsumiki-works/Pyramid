//use iter_num_tools::lin_space;

pub fn diff(f: Box<dyn Fn(f64) -> f64>) -> impl Fn(f64) -> f64{
    let h = f64::EPSILON;
    Box::new(move |x| (f(x + h) - f(x - h))/2.0*h)
}
/*
//error hadling 
//interval rimitation:
//
pub fn integrate(f: Box<dyn Fn(f64) -> f64>, a: f64, b: f64) -> impl Fn(f64) -> f64{
    //iterate until the error become small.
    let split_num = search_split_num(1, f, f64::INFINITY, f64::INFINITY, a, b);
    Box::new(move |x: f64| -> f64{
        ((b - a)/split_num)*(2*lin_space::<f64>(a..=b, split_num+1).fold(0, |acc: f64, val: f64| acc + f(val)) - f(a) - f(b))
    });
}

//fn linspace(start: f64, end: f64, size_n: i64) -> Vec<f64>{
    
//}

//default argument
//split_num = 2 
//prev_solution = minimum

//exit condition: "Relative Error decrease monotonically" or "Relative error to the previous step is less than the standard value" 

//linspace: https://docs.rs/itertools-num/latest/itertools_num/fn.linspace.html
fn search_split_num(itr_num: i32, f: Box(dyn Fn(f64) -> f64), last_solution: f64, last_rel_err: f64, a: f64, b: f64) -> i32{
    let split_num = 2.pow(itr_num);
    let solution = ((b - a)/split_num)*(2*lin_space::<f64>(a..=b, split_num+1).fold(0, |acc, val| acc + f(val)) - f(a) - f(b));
    let rel_err = ((solution - last_solution)/solution).abs();
    if rel_err <= last_rel_err && itr_num < 23 {
        search_split_num(itr_num+1, f, solution, rel_err);
    }
    else{
        2.pow(itr_num - 1);
    }
}
*/