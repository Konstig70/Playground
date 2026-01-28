use std::fs;

//Kaikki tarvittavat http virheet
const ERR_400: &str = "HTTP/1.1 400 Bad Request\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 50\r\nConnection: close\r\n\r\n<html><body><h1>400 Bad Request</h1></body></html>";
const ERR_403: &str = "HTTP/1.1 403 Forbidden\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 48\r\nConnection: close\r\n\r\n<html><body><h1>403 Forbidden</h1></body></html>";
const ERR_404: &str = "HTTP/1.1 404 Not Found\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 48\r\nConnection: close\r\n\r\n<html><body><h1>404 Not Found</h1></body></html>";
const ERR_405: &str = "HTTP/1.1 405 Method Not Allowed\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 57\r\nConnection: close\r\n\r\n<html><body><h1>405 Method Not Allowed</h1></body></html>";
const ERR_415: &str = "HTTP/1.1 415 Unsupported Media Type\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 207\r\nConnection: close\r\n\r\n<html>\n  <head>\n    <title>415 Unsupported Media Type</title>\n  </head>\n  <body>\n    <h1>415 Unsupported Media Type</h1>\n    <p>The requested file type is not supported by this server.</p>\n  </body>\n</html>";
const ERR_505: &str = "HTTP/1.1 505 Version Not Supported\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: 53\r\nConnection: close\r\n\r\n<html><body><h1>505 Version Not Supported</h1></body></html>";

//Tietue Http virheille, static lifetime, koska errorit on const, joten ne voi olla elossa koko
//ohjelman ajan
#[derive(Debug)]
pub struct HttpError(&'static str);

impl HttpError {
    //Errorin ei tarvitse olla enään olemassa, kun sen viesti ollaan pyydetty
    pub fn message(self) -> &'static str {
        self.0
    }
}

//Tietue yhdelle http pyynnölle
//Elossa niin kauan kun viesti, joten voidaan ottaa elinkaareksi viestin elinaika
#[derive(Debug, Default)]
pub struct HttpPyynto<'a> {
    metodi: String,
    versio: String,
    osat: Vec<&'a str>,
}

impl<'a> HttpPyynto<'a> {
    pub fn new(viesti: &'a str) -> Result<HttpPyynto<'a>, HttpError> {
        let osat: Vec<&str> = viesti.split("\n").collect();
        let pyynto: Vec<&str> = match osat.get(0) {
            Some(eka_rivi) => eka_rivi.split_whitespace().collect(),
            None => return Err(HttpError(ERR_400)),
        };
        //Tarkistetaan, että pyyntö on tarpeeksi pitkä
        if pyynto.len() < 3 {
            return Err(HttpError(ERR_400));
        }

        //Tällä hetkellä tuetaan vain GET pyyntöä
        let metodi = match pyynto.get(0) {
            Some(m) => m.to_owned(),
            None => return Err(HttpError(ERR_400)),
        };
        println!("Method: {metodi}");
        match metodi {
            "GET" => println!("Method ok!"),
            _ => return Err(HttpError(ERR_405)),
        }

        //Varmistetaan, että pyydetty resurssi alkaa /-merkillä
        if !pyynto[1].starts_with("/") {
            println!("Pyynnön alku virheellinen!");
            return Err(HttpError(ERR_400));
        }

        //Varmistetaan, että HTTP:n versiota tuetaan
        let versio = pyynto[2].trim();
        println!("Versio: {}", versio);
        if !(versio == "HTTP/1.1") && !(versio == "HTTP/1.0") {
            println!("Versiota ei tueta!");
            return Err(HttpError(ERR_505));
        }
        println!("Varmistetaan Host: kenttä");
        //Varmistetaan vielä, että Host-kenttä on olemassa
        match osat.get(1) {
            Some(host) if host.starts_with("Host:") => println!("Host kenttä ok!"),
            _ => {
                println!("Host-kenttä virheellinen tai puuttuu");
                return Err(HttpError(ERR_400));
            }
        };
        Ok(Self {
            metodi: metodi.to_string(),
            versio: versio.to_string(),
            osat: osat,
        })
    }

    //Palauttaa metodin
    pub fn get_method(&self) -> &str {
        return self.metodi.as_str();
    }

    pub fn handle_get(self) -> Result<Vec<u8>, HttpError> {
        //Otetaan ensimmäinen rivi
        let pyynto = match self.osat.get(0) {
            //Jos oli olemassa, niin otetaan toinen riviltä
            //HTTP pyyntö pitää olla esim. GET /index.html HTTP/1.1, joten polku on aina toisessa
            //alkiossa
            Some(polku) => match polku.split_whitespace().nth(1) {
                //Jos oli olemassa polku, niin palautetaan se
                Some(p) => p,
                //Muuten virhe
                None => return Err(HttpError(ERR_400)),
            }
            //Jos ekaa riviä ei ollut, esim osat oli tyhjä niin palautetaan virhe viestiä
            None => return Err(HttpError(ERR_400)),
        };

        //Siistitään resurssi, jotta voidaan lukea kunnolla
        let resurssi = match pyynto {
            polku if polku.ends_with("/") => ".".to_string() + polku + "index.html",
            polku => ".".to_string() + polku,
        };
        //Seuraavaksi varmistetaan, että on oikeudet hakea resurssi
        if (!resurssi.ends_with(".html") && !resurssi.ends_with(".xhtml") && !resurssi.ends_with(".js") && !resurssi.ends_with(".css") && !resurssi.ends_with(".jsx")) || resurssi.contains("..") 
        //Monsteri tarkastus, mutta siis tarkastetaan, että pyynnön resurssi osa eli esim /index.html
        //ei ole piilotettu eli alkaa "."-merkillä. Purettuna, esin jaetaan merkkijono "/"-merkillä
        //kerätään se &str vektoriksi, otetaan sieltä viimeinen elementti tai tyhjä merkkijono ja
        //lopuksi tutkitaan alkaako se "."-merkillä
        || resurssi.split("/").collect::<Vec<&str>>().last().unwrap_or_else(|| &"").starts_with(".")
        {
            println!("Resurssi {} ei ok", resurssi);
            return Err(HttpError(ERR_403));
        }

        println!("luetaan tiedosto...");
        //Yritetään lukea tiedostoa
        println!("Haettu resurssi: {resurssi}");
        //Luetaan tiedosto, jos ei saada luettue niin palautetaan virhe
        let tavut = match fs::read(&resurssi) {
            Ok(data) => data,
            Err(_) => return Err(HttpError(ERR_404)),
        };
        //Koko talteen, tarvitaan myöhemmin
        let koko = tavut.len();

        //Varmistetaan vielä minkä tyyppistä dataa lähetetään takaisin
        let tyyppi: &str;
        //Voitaisiin suoraan unwrap, sillä ei "pitäisi" olla mahdollista, että resursissa ei ole tässä
        //vaiheessa .-merkkiä, mutta otetaan cloudflaresta opiksi ja käytetään kuitenkin unwrap_or_else
        let jaettu_polku =
            resurssi.split_at_checked(resurssi.rfind(".").unwrap_or_else(|| resurssi.len()) + 1);
        //Nyt jos ei löydetty .-merkkiä niin
        let loppu = match jaettu_polku {
            Some(arvo) => arvo.1,
            None => return Err(HttpError(ERR_404)),
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
            _ => return Err(HttpError(ERR_415)),
        };

        let mut paa = format!("HTTP/1.1 200 OK\r\nContent-Type: {tyyppi}\r\nContent-Length: {koko}\r\nConnection: close\r\n\r\n").to_string().into_bytes();
        paa.extend(tavut.into_iter());
        return Ok(paa);
    }

    pub fn handle_unknown(self) -> Vec<u8> {
        ERR_405.to_string().into_bytes()
    }

    //Palauttaa version
    pub fn get_version(&self) -> &str {
        return self.versio.as_str();
    }
}
