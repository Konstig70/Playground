"use strict";
//@ts-check

/**
  * Lisää rastin XML-rakenteeseen. Lisäyksen onnistuessa
  * kutsuu funktiota uudetRastit ja tuo sille parametrina
  * uuden listauksen rasteista XML-dokumenttina
  * asynkroninen apufunktio tasolle 1
  * Tätä funktiota ei saa muuttaa
  * @param {Element} Lisättävä rasti XML-elementtinä
  */
async function lisaaRasti(rasti) {
  if ( rasti.constructor.name != 'Element') {
      console.error("virheellinen rasti", rasti.constructor.name, rasti);
      if (rasti.constructor.name && rasti.constructor.name.startsWith("HTML") ) {
          console.error("Ethän ole vahingossa luonut rastia HTML-dokumenttiin, vaikka pitäisi luoda XML-dokumenttiin  ", rasti.constructor.name, rasti);
      }
      return;
  }
  try {
    const response = await fetch("https://users.jyu.fi/~tjlahton/cgi-bin/tiea2120/2025.cgi/rasti", 
      {
      /* älä muuta seuraavia fetchin asetuksia */
      "method": "PUT", 
      "mode": "cors",
      "credentials": "include",
      "cache": "no-cache",
      "redirect": "follow",
      "headers": {
        "Content-Type": "text/xml"
      },
      "body": rasti.outerHTML  // muunnetaan elementti merkkijonoksi
    });

    const result = await response.text();
    if ( response.status == 200 ) {
        const parser = new DOMParser();
        console.log("Success: Rastin", rasti.outerHTML,  "lisääminen onnistui", response.status);
        uudetRastit(parser.parseFromString(result, 'application/xml'));
    }
    else {
        console.error("Fail: Rastin", rasti.outerHTML, "lisääminen epäonnistui", response.status, "\n", result);
    }
  } catch (error) {
        console.error("Error: Rastin", rasti, "lisääminen epäonnistui", error);
  }
}

/* TASON 3 apufunktioita */

/**
  * Lisää joukkueen XML-rakenteeseen. 
  * asynkroninen apufunktio tasolle 3
  * Tätä funktiota saa ja pitää muuttaa. Katso mallia lisaaRasti-funktiosta
  * Kirjoita oma versio tästä funktiosta vt2.js-tiedostoosi
  * Palvelin palauttaa lisätyn joukkueen, jos lisääminen onnistuu
  * Palvelimella ei ole tarkistuksia eli voit lisätä rakenteeseen myös täyttä tuubaa
  * @param {Element} Lisättävä joukkue XML-elementtinä
  */
async function lisaaJoukkue(joukkue) {
  try {
    const response = await fetch("https://users.jyu.fi/~tjlahton/cgi-bin/tiea2120/2025.cgi/lisaaJoukkue", 
      {
      "method": "PUT", 
      "mode": "cors",
      "credentials": "include",
      "cache": "no-cache",
      "redirect": "follow",
      "headers": {
        "Content-Type": "text/xml"
      },
      "body": joukkue.outerHTML  // muunnetaan elementti merkkijonoksi
    });

    const result = await response.text();
    if ( response.status == 200 ) {
        const parser = new DOMParser();
        console.log("Success: Joukkueen", joukkue.outerHTML,  "lisääminen onnistui", response.status);
        console.log(parser.parseFromString(result, 'application/xml'));
        return;
    }
    else {
    console.error("Fail: Joukkueen", joukkue.outerHTML, "lisääminen epäonnistui", response.status, "\n", result);
    }
  } catch (error) {
        console.error("Error: Joukkueen", joukkue, "lisääminen epäonnistui", error);
  }
}

/**
  * Muuttaa joukkueen tiedot XML-rakenteeseen. 
  * asynkroninen apufunktio tasolle 3
  * Tätä funktiota saa ja pitää muuttaa. Katso mallia lisaaRasti-funktiosta
  * Kirjoita oma versio tästä funktiosta vt2.js-tiedostoosi
  * Palvelin palauttaa muutetun joukkueen, jos muuttaminen onnistuu. Muutettavaa joukkuetta etsitään jid:n perusteella
  * Palvelimella ei ole tarkistuksia eli voit lisätä rakenteeseen myös täyttä tuubaa
  * @param {Element} Muutettava joukkue XML-elementtinä
  */
async function muutaJoukkue(joukkue) {
  try {
    const response = await fetch("https://users.jyu.fi/~tjlahton/cgi-bin/tiea2120/2025.cgi/muutaJoukkue", 
      {
      "method": "PUT", 
      "mode": "cors",
      "credentials": "include",
      "cache": "no-cache",
      "redirect": "follow",
      "headers": {
        "Content-Type": "text/xml"
      },
      "body": joukkue.outerHTML  // muunnetaan elementti merkkijonoksi
    });

    const result = await response.text();
    if ( response.status == 200 ) {
        const parser = new DOMParser();
        console.log("Success: Joukkueen", joukkue.outerHTML,  "muuttaminen onnistui", response.status);
        console.log("Palaute palvelimelta:",parser.parseFromString(result, 'application/xml'));
        return;
    }
    else {
    console.error("Fail: Joukkueen", joukkue.outerHTML, "muuttaminen epäonnistui", response.status, "\n", result);
    }
  } catch (error) {
        console.error("Error: Joukkueen", joukkue, "muuttaminen epäonnistui", error);
  }
}

/* TASON 5 apufunktioita */

/**
  * Poistaa leimauksia tai lisää leimauksia XML-rakenteeseen. 
  * asynkroninen apufunktio tasolle 5
  * Tätä funktiota saa ja pitää muuttaa. Katso mallia lisaaRasti-funktiosta
  * Kirjoita oma versio tästä funktiosta vt2.js-tiedostoosi
  * Palvelin palauttaa muutetut tai poistetut leimaukset, jos muutos onnistuu.
  * Poistettavaa leimausta etsitään kaikkien leimauksen tietojen (aika, rasti ja joukkue) perusteella
  * Palvelimella ei ole tarkistuksia eli voit lisätä rakenteeseen myös täyttä tuubaa
  * Poistettavat/lisättävät leimaukset annetaan vastaavanlaisena rakenteena kuin valmiissa datassa:
  * <rastileimaukset>
  * <leimaus ... />
  * ....
  * </rastileimaukset>
  * @param {Element} Muutettavat leimaukset XML-elementtinä
  */
async function muutaLeimaus(rastileimaukset) {
  try {
    const response = await fetch("https://users.jyu.fi/~tjlahton/cgi-bin/tiea2120/2025.cgi/muutaLeimaus", 
      {
      "method": "DELETE",  // voi olla PUT, jolloin lisätään tai DELETE, jolloin poistetaan
      "mode": "cors",
      "credentials": "include",
      "cache": "no-cache",
      "redirect": "follow",
      "headers": {
        "Content-Type": "text/xml"
      },
      "body": rastileimaukset.outerHTML  // muunnetaan elementti merkkijonoksi
    });

    const result = await response.text();
    if ( response.status == 200 ) {
        const parser = new DOMParser();
        console.log("Success: Leimausten", rastileimaukset.outerHTML,  "muuttaminen onnistui", response.status);
        return;
    }
    else {
    console.error("Fail: Leimausten", rastileimaukset.outerHTML, "muuttaminen epäonnistui", response.status, "\n", result);
    }
  } catch (error) {
        console.error("Error: Leimausten", rastileimaukset, "muuttaminen epäonnistui", error);
  }
}


