use std::fs;

//Käsittelee http pyynnön ja palauttaa sitä vastaavan viestin, eli virheen tai html tiedoston
//tavuina.
pub fn kasittele_pyynto(viesti: &str) -> Vec<u8> {
    let osat: Vec<&str> = viesti.split("\n").collect();
    let pyynto: Vec<&str> = osat[0].split(" ").collect();
    //Tarkistetaan, että pyyntö on tarpeeksi pitkä
    if pyynto.len() < 3 {
        return "400 Bad Request".to_string().into_bytes();
    }
    //Tällä hetkellä tuetaan vain GET pyyntöä
    match pyynto[0] {
        "GET" => println!("Method ok!"),
        _ => return "405 Method Not Allowed".to_string().into_bytes(),
    }
    //Varmistetaan, että pyydetty resurssi alkaa /-merkillä
    if !pyynto[1].starts_with("/") {
        println!("Pyynnön alku virheellinen!");
        return "400 Bad Request".to_string().into_bytes();
    } 
    println!("{}", pyynto[2]);
    //Varmistetaan, että HTTP:n versiota tuetaan
    if !(pyynto[2].trim() == "HTTP/1.1") && !(pyynto[2].trim() == "HTTP/1.0") {
        println!("Versiota ei tueta!");
        return "505 HTTP Version Not Supported".to_string().into_bytes();
    }
    println!("Varmistetaan Host: kenttä");
    //Varmistetaan vielä, että Host-kenttä on olemassa
    if !osat[1].starts_with("Host:") {
        println!("Host-kenttä virhellinen");
        return "400 Bad Request".to_string().into_bytes();
    } 
   
    //HTTP ok haetaan polku ja tarkistetaan, että on oikeudet siihen.
    let resurssi = match pyynto[1] {
        "/" => "./src/index.html".to_string(),
        polku => "./src/".to_string() + polku, 
    };
    //Seuraavaksi varmistetaan, että on oikeudet hakea resurssi 
    if (!resurssi.ends_with(".html") && !resurssi.ends_with(".xhtml")) || resurssi.contains("..") 
    //Monsteri tarkastus, mutta siis tarkastetaan, että pyynnön resurssi osa eli esim /index.html
    //ei ole piilotettu eli alkaa "."-merkillä. Purettuna, esin jaetaan merkkijono "/"-merkillä
    //kerätään se &str vektoriksi, otetaan sieltä viimeinen elementti tai tyhjä merkkijono ja
    //lopuksi tutkitaan alkaako se "."-merkillä
    || resurssi.split("/").collect::<Vec<&str>>().last().unwrap_or_else(|| &"").starts_with(".") {
        println!("Resurssi {} ei ok", resurssi);
        return "403 Forbidden".to_string().into_bytes();
    }
    println!("luetaan tiedosto...");
    //Yritetään lukea tiedostoa
    let tavut = fs::read(resurssi).unwrap_or_else(|_| Vec::with_capacity(0));
    //Jos luku ei onnistu eli luotiin vektori jolla ei ole kapasitettia palautetaan virhe
    if tavut.capacity() == 0 {
        println!("Vektoria ei voitu luoda tiedostosta!");
        return "404 not found".to_string().into_bytes();
    }
    return tavut;
} 
