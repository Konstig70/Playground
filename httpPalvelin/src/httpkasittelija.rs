//Käsittelee http pyynnön ja palauttaa sitä vastaavan viestin, eli virheen tai html tiedoston.
pub fn kasittele_pyynto(viesti: &str) -> &str {
    let mut i = 1;
    for osa in viesti.split("\n") {
        println!("{i}. osa: {osa}");
        i += i +1;
    }
    ""
} 
