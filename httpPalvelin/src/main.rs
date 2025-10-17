use std::{io::{Read, Write}, net::{Shutdown, TcpListener, TcpStream}};
mod httpkasittelija;

fn main() {
    let kuuntelija = TcpListener::bind("127.0.0.1:7878").unwrap();
    println!("Palvelin käynnissä!");
    for virta in kuuntelija.incoming() {
        match virta {
            Ok(mut socket) => kasittele_yhteys(&mut socket),
            Err(e) => eprint!("Ei saatu yhteyttä: {e:?}"),
        }
    }
    
}

//Funktio joka käsittelee yhteyden
fn kasittele_yhteys(socket: &mut TcpStream) {
    println!("Yhteys luotu!");
    //Viestin koko eli monta tavua luetaan
    const VIESTINKOKO:usize = 10; 
    let mut puskuri = [0u8; VIESTINKOKO];
    let mut vastaanotetut: Vec<u8> = vec![]; 
    //Silmukka, jolla saadaan koko viesti
    println!("Aloitetaan viestin lukeminen...");
    loop {
        //Luetaan soketista
        match socket.read(&mut puskuri) {
            Ok(luetut_tavut) => {
                //Jatketaan vektoria
                vastaanotetut.extend_from_slice(&puskuri[..luetut_tavut]);
                //Jos ei saatu täyteen puskuria lopetetaan. Puskuri jää tyhjäksi jos viestin tavut
                //loppuvat
                if luetut_tavut < VIESTINKOKO {
                    println!("Viesti loppui.");
                    break;
                }
    
            },
            Err(e) => eprint!("dataa ei voitu lukea: {e}"),
        }
    }
    //Muutetaan data tavuista, merkkijono viestiksi
    let viesti = std::str::from_utf8(&vastaanotetut).expect("Ei validia utf-8");
    //Tulostetaan viesti ja suljetaan yhteys
    println!("{viesti}");
    let vastaus = httpkasittelija::kasittele_pyynto(viesti);
    println!("Vastaus {}", str::from_utf8(&vastaus).unwrap_or_default());
    //Muutetaan Vektori taulukoksi
    match socket.write_all(&vastaus) {
        Ok(_) => println!("Data välitetty!"),
        Err(e) => println!("Virhe lähetyksessä {e}"),
    }
    println!("Suljetaan yhteys");
    socket.shutdown(Shutdown::Both).expect("Yhteyttä ei voitu katkaista");
    
}

