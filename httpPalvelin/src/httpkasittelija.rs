use std::fs;

//Käsittelee http pyynnön ja palauttaa sitä vastaavan viestin, eli virheen tai html tiedoston
//tavuina.
//TODO: RWLock sitten kun tuetaan muita metodeja
pub fn kasittele_pyynto(viesti: &str) -> Vec<u8> {
    let osat: Vec<&str> = viesti.split("\n").collect();
    let pyynto: Vec<&str> = osat[0].split(" ").collect();
    //Tarkistetaan, että pyyntö on tarpeeksi pitkä
    if pyynto.len() < 3 {
        return "HTTP/1.1 400 Bad Request\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 50\r\nConnection: close\r\n\r\n<html><body><h1>400 Bad Request</h1></body></html>".to_string().into_bytes();
    }
    //
    //Tällä hetkellä tuetaan vain GET pyyntöä
    match pyynto[0] {
        "GET" => println!("Method ok!"),
        _ => return "HTTP/1.1 405 Method Not Allowed\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 57\r\nConnection: close\r\n\r\n<html><body><h1>405 Method Not Allowed</h1></body></html>".to_string().into_bytes(),
    }
    //Varmistetaan, että pyydetty resurssi alkaa /-merkillä
    if !pyynto[1].starts_with("/") {
        println!("Pyynnön alku virheellinen!");
        return "HTTP/1.1 400 Bad Request\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 50\r\nConnection: close\r\n\r\n<html><body><h1>400 Bad Request</h1></body></html>".to_string().into_bytes();
    } 
    println!("{}", pyynto[2]);
    //Varmistetaan, että HTTP:n versiota tuetaan
    if !(pyynto[2].trim() == "HTTP/1.1") && !(pyynto[2].trim() == "HTTP/1.0") {
        println!("Versiota ei tueta!");
        return "HTTP/1.1 505 Version Not Supported\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 53\r\nConnection: close\r\n\r\n<html><body><h1>505 Version Not Supported</h1></body></html>".to_string().into_bytes();
    }
    println!("Varmistetaan Host: kenttä");
    //Varmistetaan vielä, että Host-kenttä on olemassa
    if !osat[1].starts_with("Host:") {
        println!("Host-kenttä virhellinen");
        return "HTTP/1.1 400 Bad Request\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 50\r\nConnection: close\r\n\r\n<html><body><h1>400 Bad Request</h1></body></html>".to_string().into_bytes();
    } 
   
    //HTTP ok haetaan polku ja tarkistetaan, että on oikeudet siihen.
    let osa = pyynto[1];
    println!("{osa}");  
    let resurssi = match pyynto[1] {
        polku if polku.ends_with("/") => ".".to_string() + polku + "index.html",
        polku => ".".to_string() + polku, 
    };
    //Seuraavaksi varmistetaan, että on oikeudet hakea resurssi 
    if (!resurssi.ends_with(".html") && !resurssi.ends_with(".xhtml") && !resurssi.ends_with(".js") && !resurssi.ends_with(".css") && !resurssi.ends_with(".jsx")) || resurssi.contains("..") 
    //Monsteri tarkastus, mutta siis tarkastetaan, että pyynnön resurssi osa eli esim /index.html
    //ei ole piilotettu eli alkaa "."-merkillä. Purettuna, esin jaetaan merkkijono "/"-merkillä
    //kerätään se &str vektoriksi, otetaan sieltä viimeinen elementti tai tyhjä merkkijono ja
    //lopuksi tutkitaan alkaako se "."-merkillä
    || resurssi.split("/").collect::<Vec<&str>>().last().unwrap_or_else(|| &"").starts_with(".") {
        println!("Resurssi {} ei ok", resurssi);
        return "HTTP/1.1 403 Forbidden\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 48\r\nConnection: close\r\n\r\n<html><body><h1>403 Forbidden</h1></body></html>".to_string().into_bytes();
    }
    println!("luetaan tiedosto...");
    //Yritetään lukea tiedostoa
    println!("Haettu resurssi: {resurssi}");
    let tavut = fs::read(&resurssi).unwrap_or_else(|_| Vec::with_capacity(0));
    //Jos luku ei onnistu eli luotiin vektori jolla ei ole kapasitettia palautetaan virhe
   if tavut.capacity() == 0 {
        println!("Vektoria ei voitu luoda tiedostosta!");
        return "HTTP/1.1 404 Not Found\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 48\r\nConnection: close\r\n\r\n<html><body><h1>404 Not Found</h1></body></html>".to_string().into_bytes();
    }
    let koko = tavut.len();
    //Varmistetaan vielä minkä tyyppistä dataa lähetetään takaisin
    let tyyppi: &str;
    //Voitaisiin suoraan unwrap, sillä ei "pitäisi" olla mahdollista, että resursissa ei ole tässä
    //vaiheessa .-merkkiä, mutta otetaan cloudflaresta opiksi ja käytetään kuitenkin unwrap_or_else
    let jaettu_polku = resurssi.split_at_checked(resurssi.rfind(".").unwrap_or_else(|| resurssi.len()) + 1);
    //Nyt jos ei löydetty .-merkkiä niin 
    let loppu = match jaettu_polku {
        Some(arvo) => arvo.1,
        None => return "HTTP/1.1 404 Not Found\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 48\r\nConnection: close\r\n\r\n<html><body><h1>404 Not Found</h1></body></html>".to_string().into_bytes(),
    };
    //Valitaan oikea tyyppi lähetettävälle tiedostolle
    match loppu {
        //Tuetaan seuraavia muotoja:
        "js" => tyyppi = "application/javascript",
        "jsx" => tyyppi = "application/javascript",
        "html" => tyyppi = "text/html; charset=UTF-8",
        "htm" => tyyppi = "text/html; charset=UTF-8",
        "xhtml" => tyyppi = "application/xhtml+xml",
        "css" => tyyppi = "text/css",
        "json" => tyyppi = "application/json",
        "txt" => tyyppi = "text/plain; charset=UTF-8",
        "xml" => tyyppi = "application/xml",
        _ => return "HTTP/1.1 415 Unsupported Media Type\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 207\r\nConnection: close\r\n\r\n<html>\n  <head>\n    <title>415 Unsupported Media Type</title>\n  </head>\n  <body>\n    <h1>415 Unsupported Media Type</h1>\n    <p>The requested file type is not supported by this server.</p>\n  </body>\n</html>".to_string().into_bytes(),

    }; 
    let mut paa = format!("HTTP/1.1 200 OK\r\nContent-Type: {tyyppi}\r\nContent-Length: {koko}\r\nConnection: close\r\n\r\n").to_string().into_bytes();
    paa.extend(tavut.into_iter());  
    return paa;
} 
