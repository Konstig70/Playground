use httpPalvelin::http_pyynto::{HttpPyynto};

//Käsittelee http pyynnön ja palauttaa sitä vastaavan viestin, eli virheen tai html tiedoston
//tavuina.
//TODO: RWLock sitten kun tuetaan muita metodeja
pub fn kasittele_pyynto(viesti: &str) -> Vec<u8> {
    let http = match HttpPyynto::new(viesti) {
        Ok(http_pyy) => http_pyy,  
        Err(e) => return e.message().to_string().into_bytes()
    };
    
    let vastaus = match http.get_method() {
        "GET" => http.handle_get(),
        _ => return http.handle_unknown()
    };

    match vastaus {
        Err(e) => return e.message().to_string().into_bytes(),
        Ok(viesti) => return viesti
    };
    
} 
