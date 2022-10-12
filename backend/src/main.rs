mod evaluater;
mod parser;
#[cfg(test)]
mod test;

use std::thread;
use websocket::sync::Server;
use websocket::OwnedMessage;

fn main() {
    let server = Server::bind("127.0.0.1:7878")
        .expect("pyramid backend error: could not established wsserver.");
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
        // establish connection
        thread::spawn(|| {
            let client = request
                .use_protocol("rust-websocket")
                .accept()
                .expect("pyramid backend exception: could not accept protocol 'rust-websocket'.");
            let ip = client
                .peer_addr()
                .expect("pyramid backend exception: could not peer address.");
            println!("Connection from {}", ip);
            let (mut receiver, mut sender) = client
                .split()
                .expect("pyramid backend exeption: could not split client to reciever qnd sender.");
            // communicate with the connected client in thread
            for message in receiver.incoming_messages() {
                let message = message
                    .expect("pyramid backend exception: connected client sent wrong message.");
                match message {
                    OwnedMessage::Close(_) => {
                        sender.send_message(&OwnedMessage::Close(None)).unwrap();
                        println!("Client {} disconnected", ip);
                        return;
                    }
                    OwnedMessage::Ping(ping) => {
                        let message = OwnedMessage::Pong(ping);
                        sender.send_message(&message).unwrap();
                    }
                    OwnedMessage::Text(text) => {
                        println!("Message from {} : {}", ip, text);
                        let res = match eval_text(text) {
                            Ok(n) => n,
                            Err(e) => e,
                        };
                        println!("pyramid debug: {}", res);
                        sender.send_message(&OwnedMessage::Text(res)).unwrap();
                    }
                    _ => println!("Unexpected message from {} : {:?}", ip, message),
                }
            }
        });
    }
}

fn eval_text(text: String) -> Result<String, String> {
    let ast = parser::parse(text)?;
    let res = evaluater::eval(ast)?;
    Ok(res)
}
