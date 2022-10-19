mod evaluater;
mod parser;
#[cfg(test)]
mod test;

use std::net::TcpStream;
use websocket::{
    server::upgrade::{sync::Buffer, WsUpgrade},
    sync::Server,
    OwnedMessage,
};

fn main() {
    let server = Server::bind("127.0.0.1:7878")
        .expect("pyramid backend error: could not established wsserver.");
    // wait for connection request
    for request in server {
        let request = match request {
            Ok(n) => n,
            Err(e) => {
                println!(
                    "pyramid backend exception: wsserver got wrong request. : {:?}",
                    e
                );
                continue;
            }
        };
        // establish connection with thread
        std::thread::spawn(|| communicate(request));
    }
}

/// A function to evaluate code. It calls parser::parse and evaluater::eval internally.
fn eval_text(text: &str) -> Result<String, String> {
    let ast = parser::parse(text)?;
    let res = evaluater::eval(ast)?;
    Ok(res)
}

/// A function to communicate with client. It's called for thread.
fn communicate(request: WsUpgrade<TcpStream, Option<Buffer>>) {
    let client = request
        .use_protocol("rust-websocket")
        .accept()
        .expect("pyramid backend exception: could not accept protocol 'rust-websocket'.");
    let ip = client
        .peer_addr()
        .expect("pyramid backend exception: could not peer address.");
    let (mut receiver, mut sender) = client
        .split()
        .expect("pyramid backend exeption: could not split client to reciever qnd sender.");
    println!("pyramid debug: Connection from {}", ip);
    // communicate with the connected client in thread
    for message in receiver.incoming_messages() {
        let message =
            message.expect("pyramid backend exception: connected client sent wrong message.");
        match message {
            OwnedMessage::Text(text) => {
                println!("pyramid debug: message from {} : {:?}", ip, text);
                let split = text.split('\n').collect::<Vec<&str>>();
                if split.len() != 2 {
                    send_message(&mut sender, format!("pyramid backend exception: code must be <output type>\\n<code> but recieved {:?}", text));
                    continue;
                }
                let res = match eval_text(split[1]) {
                    Ok(n) => n,
                    Err(e) => e,
                };
                if split[0] == "value" {
                    send_message(&mut sender, res);
                } else if split[0] == "html" {
                    send_message(&mut sender, build_html(res));
                } else {
                    send_message(
                        &mut sender,
                        format!(
                            "pyramid backend exception: invalid output type {}",
                            split[0]
                        ),
                    );
                }
            }
            OwnedMessage::Ping(ping) => sender
                .send_message(&OwnedMessage::Pong(ping))
                .expect("pyramid backend exception: failed to send Pong message"),
            OwnedMessage::Close(_) => {
                sender
                    .send_message(&OwnedMessage::Close(None))
                    .expect("pyramid backend exception: failed to send Close message.");
                println!("pyramid debug: client {} disconnected", ip);
                return;
            }
            _ => println!("Unexpected message from {} : {:?}", ip, message),
        }
    }
}

fn send_message(sender: &mut websocket::sender::Writer<std::net::TcpStream>, message: String) {
    println!("pyramid debug: send: {:?}", message);
    let owned_message = OwnedMessage::Text(message);
    sender
        .send_message(&owned_message)
        .expect("pyramid backend error: failed to send message ");
}

fn build_html(result: String) -> String {
    format!("<html><head></head>{}<body></body></html>", result)
}
