use iter_num_tools::lin_space;

pub fn diff(f: fn(f64) -> f64, x: f64) -> Result<f64, String>{
    if x.is_infinite() || x.is_nan(){
        return Err(String::from("pyramid backend error: argument must be finite number.(invailed argument detected)"));
    }
    let h = f64::EPSILON;
    let ans = (f(x + h) - f(x - h))/(2.0*h);
    if ans.is_infinite(){
        return Err(String::from("pyramid backend error: function value must be finite"));
    } else if ans.is_nan(){
        return Err(String::from("pyramid backend error: invalid operation was performed.(NAN detected)"));
    } else{
        Ok(ans)
    }
}

//linspace: https://docs.rs/itertools-num/latest/itertools_num/fn.linspace.html
pub fn integrate(f: fn(f64) -> f64, a: f64, b: f64) -> Result<f64, String>{
    if a.is_infinite() || a.is_nan(){
        return Err(String::from("pyramid backend error: argument must be finite number.(invailed argument detected)"));
    }
    if b.is_infinite() || b.is_nan(){
        return Err(String::from("pyramid backend error: argument must be finite number.(invailed argument detected)"));
    }
    if a > b{
        return Err(String::from("pyramid backend error: invalid integration interval"))
    }
    let split_num = search_split_num(1, f, f64::MAX, f64::INFINITY, a, b)?;
    let ans = ((b - a)/(2.*(split_num as f64)))*(2.*lin_space(a..=b, split_num+1).fold(0., |acc: f64, val| acc + f(val)) - f(a) - f(b));
    if ans.is_infinite(){
        return Err(String::from("pyramid backend error: function value must be finite"));
    } else if ans.is_nan(){
        return Err(String::from("pyramid backend error: invalid operation was performed.(NAN detected)"));
    } else{
        Ok(ans)
    }
}

fn search_split_num(itr_num: usize, f: fn(f64) -> f64, last_solution: f64, last_rel_err: f64, a: f64, b: f64) -> Result<usize, String>{
    let split_num = 2_usize.pow(itr_num as u32);
    let solution = ((b - a)/(2.*(split_num as f64)))*(2.*lin_space(a..=b, split_num+1).fold(0., |acc: f64, val| acc + f(val)) - f(a) - f(b));
    if solution.is_infinite(){
        return Err(String::from("pyramid backend error: function value must be finite"));
    } else if solution.is_nan(){
        return Err(String::from("pyramid backend error: invalid operation was performed.(NAN detected)"));
    }
    let rel_err = if solution == 0. {(solution - last_solution).abs()} else {((solution - last_solution)/solution).abs()};
    if rel_err <= last_rel_err && itr_num < 20 {
        println!("rel_err{}", rel_err);
        search_split_num(itr_num+1, f, solution, rel_err, a, b)
    }
    else{
        Ok(2_usize.pow(itr_num as u32 - 1))
    }
}
