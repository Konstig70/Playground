use std::{env, io::{Read, Write}, net::{Shutdown, TcpListener, TcpStream}, thread};
mod httpkasittelija;

fn main() {
    //Haetaan muuttujista osoite ja portti
    let args:Vec<String> = env::args().collect();
    //Hyväksytään vain kaksi argumenttia käynnistyksen lisäksi
    if args.len() != 3 {
        println!("Virhe käynnistyksessä:");
        println!("Käynnistä palvelin kahdella argumentilla, ensin osoite jonka jälkeen välilyönnillä erotettuna portti");
        std::process::exit(-1);
    }
    let osoite = format!("{}:{}", args[1], args[2]);
    println!("{osoite}");
    let kuuntelija = TcpListener::bind(osoite).unwrap();
    println!("Palvelin käynnissä!");
    for virta in kuuntelija.incoming() {
        match virta {
            //Voitaisiin periaatteessa ottaa omistajuus, mutta sitten tulee warningia, että ei
            //tarvitse olla mutable, vaikka tarvitsee, joten pidetään mutable viittaus
            //<--------TODO-------->: Threadpool, jotta ei lopu säikeet kesken 
            Ok(mut socket) => thread::spawn(move || kasittele_yhteys(&mut socket)),
            Err(e) => thread::spawn(move || eprint!("Ei saatu yhteyttä: {e:?}")),
        };
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
    println!("Vastaanoteettiin seuraava:");
    println!("{viesti}");
    let vastaus = httpkasittelija::kasittele_pyynto(viesti);
    //println!("Vastaus {}", str::from_utf8(&vastaus).unwrap_or_default());
    //Muutetaan Vektori taulukoksi
    match socket.write_all(&vastaus) {
        Ok(_) => println!("Vastaus välitetty!"),
        Err(e) => println!("Virhe lähetyksessä {e}"),
    }
    println!("Suljetaan yhteys");
    
    socket.shutdown(Shutdown::Both).expect("Yhteyttä ei voitu katkaista");
    
}

