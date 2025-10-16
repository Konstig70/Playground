//Käsittelee http pyynnön ja palauttaa sitä vastaavan viestin, eli virheen tai html tiedoston.
pub fn kasittele_pyynto(viesti: &str) -> &str {
    let osat: Vec<&str> = viesti.split("\n").collect();
    let pyynto: Vec<&str> = osat[0].split(" ").collect();
    if pyynto.len() < 3 {
        return "400 Bad Request";
    }
    match pyynto[0] {

    }
    ""
} 
