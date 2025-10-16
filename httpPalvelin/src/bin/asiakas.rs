use std::net::TcpStream;

fn main() {
    let mut yhteys = TcpStream::connect("127.0.0.1:7878");
    match yhteys {
        Ok(_) => println!("yhteys ok!"),
        Err(_) => eprint!("Yhteys ei ok!"),
        
    }

}
