mod evaluater;
mod parser;
mod intrinsic_func;
#[cfg(test)]
mod test;

use std::io::prelude::*;

fn main() {
    let listener = std::net::TcpListener::bind("127.0.0.1:7878").unwrap();
    for stream in listener.incoming() {
        let stream = match stream {
            Ok(n) => n,
            Err(e) => {
                println!("pyramid backend exception: invalid incoming : {}", e);
                continue;
            }
        };
        std::thread::spawn(|| handle_connection(stream));
    }
}

/// A function to handle message from client.
fn handle_connection(mut stream: std::net::TcpStream) {
    let mut buffer = [0; 2048];
    stream
        .read(&mut buffer)
        .expect("pyramid backend exception: could not read stream.");
    let message = String::from_utf8_lossy(&buffer[..]);
    let lines = message.lines().collect::<Vec<&str>>();
    let body = lines[lines.len() - 1].trim();
    let eval_res = match eval_text(body) {
        Ok(n) => n,
        Err(e) => e,
    };
    let response = format!(
        "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: http://localhost:8000\r\n\r\n{}",
        eval_res,
    );
    stream
        .write(response.as_bytes())
        .expect("pyramid backend exception: could not write stream.");
    stream
        .flush()
        .expect("pyramid backend exception: could not flush stream.");
}

/// A function to evaluate code. It calls parser::parse and evaluater::eval internally.
fn eval_text(text: &str) -> Result<String, String> {
    let ast = parser::parse(text)?;
    let res = evaluater::eval(ast)?;
    Ok(res)
}
