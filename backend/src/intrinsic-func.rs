

pub fn diff(f: Box<dyn Fn(f64) -> f64>) -> impl Fn(f64) -> f64{
    let h = std::f64::EPSILON;
    (f(x + h) - f(x - h))/2h
}

//error hadling 
//interval rimitation:
//
pub fn integrate(f: Box(dyn Fn(f64) -> f64)) -> impl Fn(f64) -> f64{
    //iterate until the error become small.
    let split_num = search_split_num(2,) ;
    ((b - a)/split_num)*(f(a) + f(b) + 2*linspace::<f64>(a, b, split_num).fold(0, |acc, val| acc + f(val)));
}

//default argument
//split_num = 2 
//prev_solution = minimum

//exit condition: "Relative Error decrease monotonically" or "Relative error to the previous step is less than the standard value" 

//linspace: https://docs.rs/itertools-num/latest/itertools_num/fn.linspace.html
fn search_split_num(split_num: i32, f: Box(dyn Fn(f64) -> f64), last_solution: f64, next_to_last_solution: f64) -> i32{
    let solution = ((b - a)/split_num)*(f(a) + f(b) + 2*linspace::<f64>(a, b, split_num).fold(0, |acc, val| acc + f(val)));
    let rel_err = ((solution - last_solution)/solution).abs();
    let last_rel_err = ((last_solution - next_to_last_solution)/last_solution).abs();
    if rel_err > last_rel_err && rel_err < 100*std::f64::EPSILON{
        search_split_num(split_num*2, f, solution, last_solution);
    }
    else{
        split_num/2
    }
    
}

