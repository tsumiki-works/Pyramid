use iter_num_tools::lin_space;

pub fn diff(f: Box<dyn Fn(f64) -> f64>) -> Box<dyn Fn(f64) -> f64>{
    let h = f64::EPSILON;
    Box::new(move |x| (f(x + h) - f(x - h))/2.0*h)
}

pub fn integrate(f: Box<dyn Fn(f64) -> f64>, a: f64) -> Box<dyn Fn(f64) -> f64>{
    //iterate until the error become small.
    Box::new(move |b| {
        let split_num = search_split_num(1, Box::new(f), f64::INFINITY, f64::INFINITY, a, b);
        ((b - a)/split_num as f64)*(2.*lin_space(a..=b, (split_num+1) as usize).fold(0., |acc: f64, val| acc + f(val)) - f(a) - f(b))
    })
}

fn search_split_num(itr_num: i32, f: Box<dyn Fn(f64) -> f64>, last_solution: f64, last_rel_err: f64, a: f64, b: f64) -> i32{
    let split_num = 2_i32.pow(itr_num as u32);
    let solution = ((b - a)/split_num as f64)*(2.*lin_space(a..=b, (split_num+1) as usize).fold(0., |acc: f64, val| acc + f(val)) - f(a) - f(b));
    let rel_err = ((solution - last_solution)/solution).abs();
    if rel_err <= last_rel_err && itr_num < 23 {
        search_split_num(itr_num+1, f, solution, rel_err, a, b)
    }
    else{
        2_i32.pow(itr_num as u32 - 1)
    }
}
//linspace: https://docs.rs/itertools-num/latest/itertools_num/fn.linspace.html
