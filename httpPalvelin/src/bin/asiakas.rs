use std::io::prelude::*;
use std::net::TcpStream;
//HUOM. ASIAKAS ON TESTAUSTA VARTEN TÄYSIN VIBE KOODATTU, SILLÄ EN JAKSANUT KÄYTTÄÄ AIKAA SEN
//TEKEMISEEN!
fn main() -> std::io::Result<()> {

    // 1. Establish the connection
    let mut stream = TcpStream::connect("127.0.0.1:7878")?;
    println!("Yhteys ok!");

    // 2. Define the body and calculate its length
    let body = "name=konsta&fact=Rakastan Rustia<3";
    let content_length = body.len();

    // 3. Format the raw HTTP request string
    // Note the \r\n (carriage return + line feed) required by the HTTP spec
    let request = format!(
        "POST /post HTTP/1.1\r\n\
        Host: 127.0.0.1:7878\r\n\
        Content-Type: application/x-www-form-urlencoded\r\n\
        Content-Length: {}\r\n\
        Connection: close\r\n\
        \r\n\
        {}",
        content_length, body
    );

    // 4. Send the request
    stream.write_all(request.as_bytes())?;

    // 5. Read the server's response to verify it worked
    let mut response = String::new();
    stream.read_to_string(&mut response)?;
    
    println!("Serverin vastaus:\n{}", response);

    Ok(())
}
