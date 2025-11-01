"use strict";
//@ts-check
// muutama määritys jshintia varten
/* globals lisaaRasti */
/* globals lisaaJoukkue */
/* globals muutaJoukkue */
/* globals muutaLeimaus */
// Voit tutkia käsiteltävää xmldataa suoraan osoitteesta
// http://users.jyu.fi/~tjlahton/cgi-bin/tiea2120/2025.cgi/
// Datan voi resetoida käymällä osoitteessa
// http://users.jyu.fi/~tjlahton/cgi-bin/tiea2120/2025.cgi/clear
// resetoinnin yhteydessä data aina hieman muuttuu esim. tunnisteet vaihtuvat. 
// HUOM! Tätä sovellusta voi kunnolla testata vain users.jyu.fi-palvelimella
// Muualta yritettäessä asynkroniset funktiot eivät toimi


// seuraava lataa datan ja luo sen käsittelyyn tarvittavan parserin
// xmldata-muuttuja sisältää kaiken tarvittavan datan
// koodiin on lisätty console.log-kutsuja havainnollistamaan suoritusjärjestystä
// asiat eivät tässä etene synkronisesti
console.log("asetetaan load-tapahtuman käsittelijä");
window.addEventListener("load", function () {
    console.log("load-tapahtuma suoritetaan, kun sivu on latautunut");

    // esitellään haedata-funktio
    let haedata = async function () {
        console.log("haetaan fetchillä tehtävässä tarvittava data");
        const response = await fetch('https://users.jyu.fi/~tjlahton/cgi-bin/tiea2120/2025.cgi/', { "credentials": "include" });
        console.log("saatiin fetchiltä response");
        const data = await response.text();
        console.log("saatiin fetchin response muutettua tekstiksi");
        let parser = new window.DOMParser();
        let xmldata = parser.parseFromString(data, "text/xml");
        // edellä olevaa koodia ei pidä muuttaa paitsi ehkä kommentoida console.logit
        // tästä eteenpäin lisää omaa koodia tämän saman funktion sisään
        // esim. alusta käyttöliittymä ja aseta tapahtumankäsittelijät käyttöliittymään
        console.log("data on käytössä");
        console.log(xmldata.getElementsByTagName("data")[0].children);
        //Tehdään xmldatasta globaali
        window.xmldata = xmldata;
        //Tehdään globaali uusien jäsenten määrä
        window.UudetJasenet = 3;
        let sarjanKestot = haeSarjanNimet();
        //Listataan rastien koodit ja tulokset
        lisaaTuloksetTaulukkoon(sarjanKestot);
        listaaRastienKoodit();
        //Asetaan käsittelijä rastin lisäys lomakkeelle.
        document.getElementById('lisaaRasti').addEventListener('submit', uusiRasti);
        //Lisätään sarjavalikot ja leimausvalikot lomakkeille
        lisaaSarjaValikko("valitseSarja");
        lisaaLeimausValikko("leimaustavat");
        lisaaRastiLeimaukset();
        //Lisätään jäsenten dynaamisen lisäyksen hoitava käsittelijä molempiin lomakkeisiin
        let inputit = document.getElementsByName("jasenLisää");
        inputit[1].addEventListener("input", () => addNew("Lisaus", "Lisää"));
        //Asetetaan dynaaminen lisäys jäsenten lisäykseen
        document.getElementById("lisaaJoukkue").addEventListener('submit', uusiJoukkue);
        document.getElementById("muokkaa").addEventListener('click', muokkaaTietoja);
        document.getElementById("uusiRasti").addEventListener('click', naytaRastinTiedot);
        document.getElementById("tallennaRasti").addEventListener('click', tallennaRasti);
        function lisaaSarjaValikko(luokka) {
            //Muodostetaan fieldset eli kenttä mihin sarjat lisätään
            let kentta = document.getElementById(luokka);
            //Haetaan sarjat ja tehdään niistä JS-taulukko, jotta voidaan järjestellä
            let sarjat = Array.from(xmldata.documentElement.getElementsByTagName("sarja"));
            //Järjestellään, eli haetaan nimi elementin teksti eli itse nimi sarjasta ja vertaillaan
            //Myös lowercase, jotta vertailu toimii caseInsensitive sekä null checking (ei ehkä vaadi, mutta pidetään varmuuden vuoksi) 
            //lisätty myös parempi vertailija, joka osaa myös erikois tilanteissa "14 h" vertailla oikein
            let vertailija = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
            sarjat.sort((eka, toka) => {
                let ekaNimi = eka.getElementsByTagName("nimi")[0]?.textContent.toLowerCase() || "";
                let tokaNimi = toka.getElementsByTagName("nimi")[0]?.textContent.toLowerCase() || "";
                return vertailija.compare(ekaNimi, tokaNimi);
            });
            //Haetaan sarjojen kestot
            let kestot = new Map();
            let sarjaNimet = xmldata.getElementsByTagName("sarja");
            for (let sarjanimi of sarjaNimet) {
                let id = sarjanimi.getAttribute("sarjaid");
                let nimi = sarjanimi.getElementsByTagName("nimi")[0].textContent;
                if (id && nimi) {
                    kestot.set(nimi, id);
                }
            }
            for (let sarja of sarjat) {
                let nimi = sarja.getElementsByTagName("nimi")[0];
                let p = document.createElement("p");
                let label = document.createElement("label");
                let input = document.createElement("input");
                label.textContent = nimi.textContent;
                //Input on itse syöttökenttä. Tärkeimpänä tässä annetaan sen tyyppi sekä se saa muutaman attribuutin 
                input.type = "radio";
                input.name = "sarja";
                input.id = kestot.get(nimi.textContent);
                input.value = kestot.get(nimi.textContent);
                label.appendChild(input);
                p.appendChild(label);
                kentta.appendChild(p);
            }
            document.getElementsByName("sarja")[0].checked = true;
        }



    };

    console.log("kutsutaan asynkronista haedata-funktiota");
    haedata(); // kutsutaan haedata ja käynnistetään sovellus
    console.log("load-tapahtuma loppuu");




});
/**
 * Listaa rastien koodit rastileimauksia varten
 */
function lisaaRastiLeimaukset() {
    let rastit = Array.from(xmldata.documentElement.getElementsByTagName("rasti"));
    rastit.sort((eka, toka) => eka.getAttribute("koodi").toLowerCase().trim().localeCompare(toka.getAttribute("koodi").toLowerCase().trim()));
    let valitsin = document.getElementById("valitsin");
    //Joo o ja jostain syystä laitetaan sivulle 93 radio nappia eikä käytetä select-option elementtejä...
    //En tiennytkään, että tehdään vuoden 1994 html-koodia!
    let eka = true;
    for (let rasti of rastit) {
        //Luodaan vaadittavat elementit ja annetaan niille oikeat attribuutit
        let label = document.createElement("label");
        let input = document.createElement("input");
        let p = document.createElement("p");
        input.type = "radio";
        input.name = "rastinKoodi";
        input.checked = eka;
        eka = false;
        input.value = rasti.getAttribute("rid");
        label.textContent = rasti.getAttribute("koodi");
        //Liitetään sivulle
        label.appendChild(input);
        p.appendChild(label);
        valitsin.appendChild(p);
    }
}

/**
 * Lisää uuden rastin joukkueen lomakkeelle
 */
function tallennaRasti() {
    //Luodaan lomake ja otetaan sen tiedot muuttujiin
    let lomake = document.forms.lisaaJoukkue;
    let koodi = lomake.rastinKoodi;
    let pvm = lomake.rastinpvm;
    let kentta = document.getElementById("rastileimaukset");
    let leimaus = xmldata.createElement("leimaus");
    //Asetetaan osa attribuuteista
    leimaus.setAttribute("aika", pvm.value);
    leimaus.setAttribute("joukkue", lomake.jid.value);
    //Ai että, onneksi ei tarvitse käydä läpi kuin jokainen radio nappi ja tarkistaa, mikä on valittu :)
    //Aikavaativuus who?
    for (let nappi of koodi) {
        if (nappi.checked) {
            leimaus.setAttribute("rasti", nappi.value);
            break;
        }
    }
    //Haetaan rastien id:tä vastaava koodi
    let rastit = Array.from(xmldata.getElementsByTagName("rasti"));
    let rastiIdt = new Map();
    rastit.forEach((rasti) => rastiIdt.set(rasti.getAttribute("rid"), rasti.getAttribute("koodi")));
    lisaaLeimaus(leimaus, rastiIdt, kentta);
    //Piilotetaan valikko
    let div = document.getElementsByClassName("uudenRastintiedot")[0];
    div.style.display = "none";

}

/**
 * Näyttää rastin tiedot
 */
function naytaRastinTiedot() {
    let div = document.getElementsByClassName("uudenRastintiedot")[0];
    div.style.display = "block";
}

/**
 * Hakee sarjojen kestot ja id:t
 * @param {Document} xmldata data, jota luetaan
 * @returns Map-tietorakenteen, missä avaimena sarjan id
 */
const haeSarjanNimet = function () {
    let kestot = new Map();
    let sarjat = xmldata.getElementsByTagName("sarja");
    for (let sarja of sarjat) {
        let id = sarja.getAttribute("sarjaid");
        let kesto = sarja.getElementsByTagName("nimi")[0].textContent;
        if (id && kesto) {
            kestot.set(id, kesto);
        }
    }
    return kestot;
};

function addNew(luokka, id) {
    let inputit = document.getElementsByName("jasen" + id);
    let tyhja = false;  // oletuksena ei ole löydetty tyhjää
    // käydään läpi kaikki input-kentät viimeisestä ensimmäiseen
    // järjestys on oltava tämä, koska kenttiä mahdollisesti poistetaan
    // ja poistaminen sotkee dynaamisen nodeList-objektin indeksoinnin
    // ellei poisteta lopusta 
    for (let i = inputit.length - 1; i > -1; i--) { // inputit näkyvät ulommasta funktiosta
        let input = inputit[i];

        // jos on tyhjä ja on jo aiemmin löydetty tyhjä niin poistetaan
        if (input.value.trim() == "" && tyhja) { // ei kelpuuteta pelkkiä välilyöntejä
            inputit[i].parentNode.remove(); // parentNode on label, joka sisältää inputin
        }

        // onko tyhjä?
        if (input.value.trim() == "") {
            tyhja = true;
        }
    }

    // jos ei ollut tyhjiä kenttiä joten lisätään yksi
    if (!tyhja) {
        //Luodaan vaadittavat html elementit
        let kentta = document.getElementById("jasen" + luokka);
        let p = document.createElement("p");
        let label = document.createElement("label");
        let div = document.createElement("div");
        let input = document.createElement("input");
        //Tämä div on poistamis nappi. Annetaan sille oikea luokka tyyliä varten ja lisätään poistamisen hoitava käsittelijä
        div.className = "poistaJasen";
        div.textContent = "x";
        div.addEventListener('click', function () {
            const container = div.closest('p');
            if (container) {
                container.remove();
            }
            jasenNumerointi(id);
        });
        //Label on syöttökentän teksti. Lisätään sille oikea teksti ja luokka
        label.textContent = "Jäsen " + window.UudetJasenet;
        label.className = "jasen" + luokka;
        //Input on itse syöttökenttä. Tärkeimpänä tässä annetaan sen tyyppi sekä se saa muutaman attribuutin 
        input.type = "text";
        input.name = "jasen" + id;
        input.id = "jasen" + id + window.UudetJasenet;
        //Lisätään myös käsittelijä dynaamiselle lisäykselle
        input.addEventListener("input", () => addNew(luokka, id));
        //Kasvatetaan uudet jäsenet muuttujaa pitää yllä monta jäsentä on
        window.UudetJasenet++;
        //Lisätään kaikki sivuun.
        p.appendChild(label);
        label.appendChild(input);
        label.appendChild(div);
        kentta.appendChild(p);
    }
    jasenNumerointi(id);
}

/**
 * Hoitaa Joukkueen lisäys lomakkeen jäsenten lisäyksen jäsen labelien numeroinnin. 
 */
function jasenNumerointi(id) {
    let inputit = document.getElementsByName("jasen" + id);
    for (let i = 0; i < inputit.length; i++) { // inputit näkyy ulommasta funktiosta
        let label = inputit[i].parentNode;
        label.firstChild.nodeValue = "Jäsen " + (i + 1); // päivitetään labelin ekan lapsen eli tekstin sisältö
    }
}

/**
 * lisää tulokset taulukkoon
 * @param {Document} xmldata data, jota luetaan
 * @param {Map} sarjanKestot map tietorakenne kaikkien sarjojen kestoista (id avaimena).
 */
const lisaaTuloksetTaulukkoon = function (sarjanKestot) {
    //Tehdään lisäys sivulle vaiheittain
    //Vaihe 1, haetaan datasta joukkueiden nimet ja sarjat sekä järjestellään 
    let joukkueet = xmldata.documentElement.getElementsByTagName("joukkue");
    let tulokset = [];
    //Alustetaan joukkue data ja tulos taulukko
    for (let joukkue of joukkueet) {
        //Käydään läpi kaikki joukkueet
        let nimi = joukkue.getElementsByTagName("nimi")[0].textContent.trim();
        let sarja = sarjanKestot.get(joukkue.getAttribute("sarja"));
        let jasenet = joukkue.getElementsByTagName("jasenet")[0].getElementsByTagName("jasen");
        let jasenTaulukko = Array.from(jasenet).map((jasen => jasen.textContent));
        //Otetaan joukkueen nimi ja sarja. Sarjan kesto saadaan sen id perusteella.
        //Sarja otetaan numerona, jotta vertailu on helpompaa.
        //Otetaan myös joukkueen jäsenet ja tehdään niistä taulukko käsittelyn helpottamiseksi
        tulokset.push({ nimi, sarja, jasenTaulukko, joukkue });
        //Laitetaan tuloksiin objekti, joka sisältää nimen, sarjan (kesto) ja jäsenet.
    }
    let vertailija = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    tulokset.sort((eka, toka) => {
        if (vertailija.compare(eka.sarja, toka.sarja) == 0) {
            return eka.nimi.toLowerCase().localeCompare(toka.nimi.toLowerCase());
        }
        return vertailija.compare(eka.sarja, toka.sarja);
    });
    //Järjestely, pääsääntöisesti sarjan perusteella, mutta jos sarja sama niin nimen perusteella
    //Vaihe 2: asetetaan joukkueet sivulle DOM-operaatioille
    let tbody = document.getElementById("tulosTaulukko");
    let leimaustavatKaikki = xmldata.documentElement.getElementsByTagName("leimaustavat")[0].getElementsByTagName("leimaustapa");
    //Haetaan xhtml-koodin tbody
    for (let tulos of tulokset) {
        //Käydään kaikki joukkueet ja sarjat läpi
        //Haetaan kaikki joukkueen leimaustavat ja tehdään niistä numeroita
        let leimaustavat = tulos.joukkue.getElementsByTagName("leimaustavat")[0];
        let leimaustapa = Array.from(leimaustavat.getElementsByTagName("leimaustapa"));
        //muutetaan leimaustavat numeroiksi. Tässäkin on null-checking jota ei ehkä vaadi, mutta varmuuden juoksi on siinä.
        let leimaustavatNro = leimaustapa.map(arvo => Number(arvo.textContent) === isNaN ? "" : Number(arvo.textContent));
        //muodostetaan leimaustavoista tulostettava merkkijono. Ensin tehdään taulukko, missä numeroa vastaava leimaus tapa ja sitten yhdistetään
        //taulukko , - merkillä. Huom leimaustavan paikka taulukossa vastaa sen numeroa, GPS tavan numero on 0, mikä vastaa myös sen paikkaa.
        let tavatJonossa = leimaustavatNro.map(arvo => leimaustavatKaikki[arvo].textContent).join(", ");
        //Luodaan näytettävät html-elementit ja annetaan niille oikeat arvot
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.textContent = tulos.sarja;
        let td = document.createElement("td");
        let a = document.createElement("a");
        let p = document.createElement("p");
        p.textContent = tulos.jasenTaulukko.join(", ");
        a.textContent = tulos.nimi + " ( " + tavatJonossa + " )"; //Lopuun lisätään leimaustavat
        a.href = "#joukkueenMuokkaus";
        a.addEventListener('click', function (event) {
            event.preventDefault();
            //Näytetään lomake
            let form = document.getElementById('lisaaJoukkue');
            form.scrollIntoView({ behavior: 'smooth' });
            taytaLomake(tulos);
            let muokkaa = document.getElementById("muokkaa");
            muokkaa.style.display = "block";
            let tallenna = document.getElementById("laheta");
            tallenna.style.display = "none";
            //Yllä oleva funktio täyttää lomakkeen joukkueen tiedoilla 
        });
        td.appendChild(a);
        td.appendChild(p);
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
        //liitetaan muutokset sivulle näkyviin. 
    }
};

/**
 * lisää leimausvalikon joukkueen lisäys/muokkauslomakkeeseen
 * @param {String} luokka minkä nimiseen luokkaan/id:seen lisätää 
 */
function lisaaLeimausValikko(luokka) {
    //Haetaan kenttä
    let kentta = document.getElementById(luokka);
    let leimaustavat = xmldata.documentElement.getElementsByTagName("leimaustavat")[0].getElementsByTagName("leimaustapa");
    let nro = 0;
    //Lisätään leimaustavat
    for (let leimaustapa of leimaustavat) {
        let label = document.createElement("label");
        label.textContent = leimaustapa.textContent;
        let input = document.createElement("input");
        let p = document.createElement("p");
        //Leimaustavan numero vastaa sen paikkaa leimaustavat taulukossa. Esim. GPS tavan numero on 0 ja se on ensimmäinen
        input.value = nro;
        //Kasvatetaan numeroa
        nro++;
        //Annetaan inputille oikeat tyylit
        input.type = "checkbox";
        input.name = "leimaustapa";
        input.id = leimaustapa.textContent;
        label.appendChild(input);
        p.appendChild(label);
        kentta.appendChild(p);
    }
}

/**
 * Täyttää lomakkeen joukkueen tiedoilla
 * @param {Object} tiedot joukkueen tiedot
 */
function taytaLomake(tiedot) {
    //Haetaan lomake
    let lomake = document.forms.lisaaJoukkue;
    lomake.reset();
    //Tyhjentää rastileimauskentät
    try {
        let rlm = Array.from(lomake.leimaus);
        rlm.forEach((leimaus) => {
            const container = leimaus.closest('p');
            if (container) {
                container.remove();
            }
        });
    } catch (error) {
        //Heittää erroria jos ei ole kenttiä, mutta silloin ei edes tarvitse poistaa
        //Joten otetaan vaan se virhe kiinni
    }
    
    //Asetetaan nimi
    lomake.nimi.value = tiedot.nimi;
    //Haetaan jäsenet ja jäsen inputit
    let jasenet = tiedot.jasenTaulukko;
    let tila = lomake.jasenLisää;
    //Haetaan sarja ja sarja napit
    let sarja = tiedot.joukkue.getAttribute("sarja");
    let sarjat = lomake.sarja;
    //Lisätään jäsenet  näkyville ja lisätään dynaamisesti lisää paikkoja
    for (let i = 0; i < jasenet.length; i++) {
        tila[i].value = jasenet[i];
        addNew("Lisaus", "Lisää");
    }
    //Valitaa sarjan nappi
    for (let nappi of sarjat) {
        if (nappi.value === sarja) {
            nappi.checked = true;
        }
    }
    //Valitaan leimaustavat. (Jos mielessäsi on nyt "I aint readin allat", niin skippaa seuraava kommentti)
    //Tähän täytyy lisätä, että tiedot Objektissa on myös itse joukkue
    //mukana nimen, jäsenten ja sarjojen lisäksi. En nyt jaksa kirjoittaa koko koodia uusiksi, sillä 
    //Kaiken mitä aikasemmin tein tällä tyylillä voisi muuttaa niin, että käytetään pelkästään tuota joukkuetta
    //Ilman, että erikseen otetaan sieltä nuo tietyt tiedot (oli helpompi ottaa vain joukkueen nimi ylös tuota taso 1 varten,
    //niin en silloin jaksanut pelleillä koko joukkueen tietojen kanssa, vaikka asiat olisi ollut lopuksi helpompi tehdä niin). 
    //Tämän takia osassa käytetään tiedoista suoraan arvoja ja osassa haetaan tarvittu data joukkueesta. 
    // Tästä viisaampana seuraavalla kerralla muistan, että ei kannata lähteä ottamaan oikoteitä :). 
    let leimaustavat = Array.from(tiedot.joukkue.getElementsByTagName("leimaustavat")[0].getElementsByTagName("leimaustapa")).map((tapa) => tapa.textContent);
    //Ylempänä helvetin pitkä lause, mutta avattuna, otetaan joukkueesta ensimmäinen leimaustavat elementti, otetaan sen sisältä kaikki leimaustapa elementiti,
    //tehdään niistä JS-taulukko, josta tehdään uusi taulukko pelkistä leimaustapa elementtien teksti sisällöistä.
    //Näin saadaan joukkueen leimaustavat merkkijono-taulukkoon nätisti
    //Tässä käydään kaikki leimaustapa napit läpi ja laitetaan valituiksi ne mitkä joukkueella on valittuna
    let leimausvalikko = lomake.leimaustapa;
    for (let leimaustapa of leimausvalikko) {
        if (leimaustavat.includes(leimaustapa.value)) {
            leimaustapa.checked = true;
        }
        //Koska nappeja voi olla useampi päällä, niin täytyy muut leimaustavat, jotka eivät ole joukkueella
        //laittaa pois päältä
        else {
            leimaustapa.checked = false;
        }
    }
    //Lopuksi lisätään vielä joukkueen rastileimaukset
    let kentta = document.getElementById("rastileimaukset");
    let leimaukset = Array.from(xmldata.getElementsByTagName("rastileimaukset")[0].getElementsByTagName("leimaus")).filter((leimaus) => leimaus.getAttribute("joukkue") === tiedot.joukkue.getAttribute("jid"));
    //Ylempänä haetaan vain tietyn joukkueen rastileimaukset ja muodostetaan niistä taulukko
    let rastit = Array.from(xmldata.getElementsByTagName("rasti"));
    let rastiIdt = new Map();
    rastit.forEach((rasti) => rastiIdt.set(rasti.getAttribute("rid"), rasti.getAttribute("koodi")));
    //Käydään läpi kaikki joukkueen leimaukset ja laitetaan ne esille.
    for (let leimaus of leimaukset) {
        lisaaLeimaus(leimaus, rastiIdt, kentta);
    }

    //Laitetaan jid lomakkeeseen, mutta piiloon näkyvistä.
    lomake.jid.value = tiedot.joukkue.getAttribute("jid");

}

/**
 * Luo uuden rastileimauksen joukkue lomakkeelle
 * @param {XMLDocument} leimaus 
 * @param {Map} rastiIdt 
 * @param {DOM element} kentta 
 */
function lisaaLeimaus(leimaus, rastiIdt, kentta) {
    //Luodaan vaadittavat html-elementit ja asetetaan tarvittavat luokat
    let label = document.createElement("label");
    label.className = "rastileimaus";
    let input = document.createElement("input");
    let input2 = document.createElement("input");
    let p = document.createElement("p");
    //Lisätään labelille tekstiä ja inputeille oikeat attribuutit 
    label.textContent = "Koodi:";
    input.type = "text";
    input.value = rastiIdt.get(leimaus.getAttribute("rasti"));
    input.name = "leimaus";
    //Käytin datetime-local, jotta käyttäjä ei vahingossakaan voi antaa huonoa päivämäärää
    input2.type = "datetime-local";
    //Lomake vähän venyy tuon takia, mutta ööö seo ihan fine :D
    input2.name = "pvm";
    input2.value = leimaus.getAttribute("aika").replace(" ", "T");
    let div = document.createElement("div");
    //Lisäätään vielä poistaminen leimaukselle
    div.className = "poistaLeimaus";
    div.textContent = "x";
    div.addEventListener('click', function () {
        const container = div.closest('p');
        if (container) {
            container.remove();
        }
    });
    //Liitetään elementit
    label.appendChild(input);
    label.appendChild(input2);
    label.appendChild(div);
    p.appendChild(label);
    kentta.appendChild(p);
}

/**
 * tallentaa joukkueen tietoihin tehdyt muunnokset xml-dataan ja palvelimelle
 */
async function muokkaaTietoja(event) {
    //Estetään sivun päivittyminen
    event.preventDefault();
    //Haetaan lomakkeen tiedot
    let lomake = document.forms.lisaaJoukkue;
    let jid = lomake.jid.value;
    //Haetaan rastin koodia vastaava id.
    let rastiIdt = new Map();
    let rastit = Array.from(xmldata.getElementsByTagName("rasti"));
    rastit.forEach((rasti) => rastiIdt.set(rasti.getAttribute("koodi"), rasti.getAttribute("rid")));
    //Samat pakolliset testit tiedoille kuin lisäyksesä (joka ois voinu olla oma funktio, mutta ööö ei oo :)):
    //Tarkastetaan, että nimi ei ole tyhjä
    let jnimi = lomake.nimi.value.trim();
    if (jnimi === "") {
        return;
    }
    //Tarkastetaan, että jäseniä vähintään kaksi ja ei samannimisiä jäseniä  
    let jasenet = lomake.jasenLisää;
    let taytetty = 0;
    let jasenNimet = [];
    for (let jasen of jasenet) {
        if (jasen.value.trim() !== "") {
            taytetty++; //Eli jos on täytetty
        }
        if (jasenNimet.includes(jasen.value.trim())) {
            return;
        }
        jasenNimet.push(jasen.value.trim());
    }
    //Ilmoitetaan, että jäseniä on liian vähän
    if (taytetty < 2) {
        return;
    }
    //Tutkitaan valitut leimaustavat
    let valitutLeimaustavat = lomake.leimaustapa;
    let valitut = [];
    for (let valittuTapa of valitutLeimaustavat) {
        if (valittuTapa.checked) {
            valitut.push(valittuTapa.value);
        }
    }
    //Jos valittuja tapoja ei ole palataan 
    if (valitut.length < 1) {
        return;
    }
    //Testit ok, siirrytään tietojen päivittämiseen.
    //Haetaan piilottun jid tiedon perusteella oikea xml-elementti, jotta muokkaukset tapahtuvat suoraan oikeaan joukkueeseen
    //Eikä tarvii turhaan luoda uutta joukkue elementtiä tietojen muokkaamista varten.
    let joukkueet = xmldata.documentElement.getElementsByTagName("joukkue");
    for (let joukkue of joukkueet) {
        if (joukkue.getAttribute("jid") === jid) {
            //Muutetaan nimi
            joukkue.getElementsByTagName("nimi")[0].textContent = lomake.nimi.value;
            //Lisätään leimaustavat
            let vanhatTavat = joukkue.getElementsByTagName("leimaustavat")[0];
            joukkue.removeChild(vanhatTavat);
            let uudetTavat = xmldata.createElement("leimaustavat");
            valitut.forEach((tapa) => {
                let leimaustapa = xmldata.createElement("leimaustapa");
                leimaustapa.textContent = tapa;
                uudetTavat.appendChild(leimaustapa);
            });
            joukkue.appendChild(uudetTavat);
            //Poistetaan jasenet ja lisätään uudestaan
            let vanhatJasenet = joukkue.getElementsByTagName("jasenet")[0];
            joukkue.removeChild(vanhatJasenet);
            //Uudet jäsenet
            let uudetJasenet = xmldata.createElement("jasenet");
            //Tein tällä array.from tyylillä, jotta pääsee käyttää nuolifunktioita
            //Käydään jokainen jäsen läpi
            jasenNimet.forEach(nimi => {
                if (nimi.trim() !== "") {
                    let jasen = xmldata.createElement("jasen");
                    jasen.textContent = nimi;
                    uudetJasenet.appendChild(jasen);
                }
            });
            joukkue.appendChild(uudetJasenet);
            //Haetaan valittu sarja
            let sarjaNapit = lomake.sarja;
            let valittu = null;
            for (let nappi of sarjaNapit) {
                if (nappi.checked) {
                    valittu = nappi.value;
                    break;
                }
            }
            joukkue.setAttribute("sarja", valittu);
            //Lisätään uudet  rastileimaukset 
            //Haetaan joukkueen vanhat rastileimaukset sekä kaikkien joukkueiden rastileimaukset
            let vanhatLeimaukset = Array.from(xmldata.getElementsByTagName("rastileimaukset")[0].getElementsByTagName("leimaus")).filter((leimaus) => leimaus.getAttribute("joukkue") === joukkue.getAttribute("jid"));
            let kaikkiLeimaukset = xmldata.getElementsByTagName("rastileimaukset")[0];
            let leimaukset = lomake.leimaus;
            //Pakottaan leimauksista taulukko, vaikka olisi vain yksi leimaus, jolloin lomake.leimaus palauttaa vaan html-komponentin
            leimaukset = leimaukset instanceof NodeList || Array.isArray(leimaukset) ? Array.from(leimaukset) : [leimaukset];
            //alustetaan pakolliset pohja tiedot
            let ajat = lomake.pvm;
            let indeksi = 0;
            //Pitää tallessa muuttumattomat leimaukset
            let lomakkeenLeimaukset = [];
            let uudet = xmldata.createElement("rastileimaukset");
            //Käydään kaikki inputit läpi, luodaan niistä xml-elementtejä, tehdään tarkistuksia ja lopuksi lisätään
            //Leimaukset, joko uusiin/muutettuihin tai muuttumattomiin elementti taulukkoihin 
            leimaukset.forEach((leimaus) => {
                if (leimaus.value !== "") {
                    let uusiLeimaus = xmldata.createElement("leimaus");
                    uusiLeimaus.setAttribute("joukkue", jid);
                    uusiLeimaus.setAttribute("rasti", rastiIdt.get(leimaus.value));
                    //Jos on vain yksi rasti niin ajat eivät enään tule taulukkona
                    if (leimaukset.length === 1) {
                        uusiLeimaus.setAttribute("aika", lomake.pvm.value.replace('T', ' '));
                    }
                    else {
                        uusiLeimaus.setAttribute("aika", ajat[indeksi].value.replace('T', ' '));
                    }
                    indeksi++;
                    //Onko uusi/muutettu rasti
                    if (!vanhatLeimaukset.some(leim => leim.getAttribute("rasti") === uusiLeimaus.getAttribute("rasti") && leim.getAttribute("aika") === uusiLeimaus.getAttribute("aika"))) {
                        //Tarkastetaan vielä, ettei ole annettu väärää koodia
                        if (uusiLeimaus.getAttribute("rasti") !== "undefined" && uusiLeimaus.getAttribute("rasti")) {
                            uudet.appendChild(uusiLeimaus);
                            kaikkiLeimaukset.appendChild(uusiLeimaus.cloneNode(true));
                        }
                        
                    }
                    //Jos ei muutoksia tai ei uusi niin laitetaan toiseen taulukkoon
                    else {
                        lomakkeenLeimaukset.push(uusiLeimaus);
                    }
                    //Paljon parempi/nopeampi vaihtoehto olisi vaan poistaa kaikki vanhat leimaukset ja lisätä uudet tilalle.
                    //Mutta ohjeissa käskettiin päivittää vain muuttuneet rastit niin päivitetään sitten vaan muuttuneet.....
                }
            });
            let puuttuvat = xmldata.createElement("rastileimaukset");
            //Etsitään poistetut leimaukset tutkimalla löytyykö jokainen vanha leimaus uusista ei muokatuista
            //Käsittelen muokattuja leimauksia uusina, vaikka niitä ei ehkä tarvitsisi edes poistaa, sillä palvelin osaa vissiin muokata dataa
            vanhatLeimaukset.forEach((leim) => {
                if (!lomakkeenLeimaukset.some(lomake => lomake.getAttribute("rasti") === leim.getAttribute("rasti"))) {
                    puuttuvat.appendChild(leim); 
                }
            });
            //Muutetaan data palvelimella, tyhjennetään lomake ja päivitetään joukkueet 
            await muutaJoukkue(joukkue);
            if (puuttuvat.getElementsByTagName("leimaus").length > 0) {
                await muutaLeimaus(puuttuvat, "DELETE");
            }
            await muutaLeimaus(uudet, "PUT");
            lomake.reset();
            //Tässä poistetaan ylimääräiset rastileimaus inputit
            let rlm = Array.from(lomake.leimaus);
            rlm.forEach((leimaus) => {
                const container = leimaus.closest('p');
                if (container) {
                    container.remove();
                }
            });
            paivitaJoukkueet();
            //Lopuksi vaihdetaan näkyvillä olevat napit
            let muokkaa = document.getElementById("muokkaa");
            muokkaa.style.display = "none";
            let tallenna = document.getElementById("laheta");
            tallenna.style.display = "block";
            break;
        }
    }
}

/**
 * listaa kaikkien rastien koodi
 */
const listaaRastienKoodit = function () {
    let rastiKoodit = haeRastiDatasta("koodi");
    rastiKoodit.sort((eka, toka) => eka.toLowerCase().localeCompare(toka.toLowerCase()));
    //Järjestetään aakkosjärjestykseen caseinsitive
    let ul = document.getElementById("rastikoodit");
    //Alustetaan ul-elementti
    for (let koodi of rastiKoodit) {
        let li = document.createElement("li");
        li.textContent = koodi;
        ul.appendChild(li);
    }
    //Lisätään jokainen rasti koodi sivulle.
};

/**
 * hakee attribuuttia vastaavat arvot rastien xml-datasta
 * @param {string} attribuutti 
 * @returns attribuuttia vastaavat arvot rastien xml-datasta
 */
function haeRastiDatasta(attribuutti) {
    let rastitData = xmldata.documentElement.getElementsByTagName("rasti");
    //Haetaan rastien xml-data
    let rastiData = [];
    //Alustetaan attribuuttien taulukko
    for (let rasti of rastitData) {
        rastiData.push(rasti.getAttribute(attribuutti).trim());
    }
    //Laitetaan taulukkoon jokainen haettu attribuutti rasti datasta
    return rastiData;
}


/**
 * Lisää uuden rastin tietoihin sekä sivulle
 * @param {*} event 
 * @returns 
 */
function uusiRasti(event) {
    event.preventDefault();
    //Estetään sivun päivitys
    let rastiKoodit = haeRastiDatasta("koodi");
    //Haetaan kaikki rastien koodit
    let lomake = document.forms.lisaaRasti;
    let koodi = lomake.koodi.value.trim();
    //Haetaan käyttäjän syöttämä koodi
    if (koodi.trim() === "") {
        return;
    }
    if (rastiKoodit.includes(koodi)) {
        return;
    }
    if (lomake.lat.value.trim() === "" || lomake.lon.value.trim() === "") {

        return;
    }
    //Varmistetaan, että koodi ei ole whitespacea eikä sitä löydy valmiiksi. 
    //Ilmoitetaan käyttäjälle mahdollisista virheistä ja palataan mikäli näitä tapahtuu
    let lat = Number(lomake.lat.value.trim());
    let lon = Number(lomake.lon.value.trim());
    //Haetaan lat ja lon-koordinaatit
    if (isNaN(lat) || isNaN(lon)) {

        return;
    }
    //Tarkistetaan, että nämä ovat numeroita sekä ilmoitetaan virheistä.
    let rastiIdt = haeRastiDatasta("rid");
    rastiIdt.sort((eka, toka) => toka - eka);
    let id = Number(rastiIdt[0]) + 1;
    //Luodaan uusi rid ottamalla suurin rasti id ja lisäämällä siihen 1
    let rasti = xmldata.createElement("rasti");
    rasti.setAttribute("lat", lat.toString());
    rasti.setAttribute("lon", lon.toString());
    rasti.setAttribute("koodi", koodi);
    rasti.setAttribute("rid", id.toString());
    //Luotiin uusi rasti xml-elementti
    let rastit = xmldata.getElementsByTagName("rastit")[0];
    rastit.appendChild(rasti);
    //Lisättiin uusi elementti xmldata muuttujaan, jotta voidaan lisätä se sivulle ilman,
    // että joudumme hakemaan datan uudestaan.
    lisaaRasti(rasti);
    //Lisätään uusi rasti elementti myös dataan.

}

async function uusiJoukkue(event) {
    //Estetään sivun päivitys
    event.preventDefault();
    //Haetaan lomake
    let lomake = document.forms.lisaaJoukkue;
    //Haetaan toisten joukkueiden id:t
    let joukkueet = xmldata.getElementsByTagName("joukkue");
    let jid = [];
    for (let joukkue of joukkueet) {
        jid.push(Number(joukkue.getAttribute("jid")));
    }
    jid.sort((eka, toka) => toka - eka);
    //Jos nimi on tyhjä ilmoitetaan ja poistutaan
    let jnimi = lomake.nimi.value.trim();
    if (jnimi === "") {

        return;
    }

    //Tarkastetaan, että jäseniä vähintään kaski   
    let jasenet = lomake.jasenLisää;
    let taytetty = 0;
    let jasenNimet = [];
    for (let jasen of jasenet) {
        if (jasen.value.trim() !== "") {
            taytetty++; //Eli jos on täytetty
        }
        if (jasenNimet.includes(jasen.value.trim())) {

            return;
        }
        jasenNimet.push(jasen.value.trim());
    }
    //Ilmoitetaan, että jäseniä on liian vähän
    if (taytetty < 2) {
        return;
    }
    //Otetaan valittu sarja
    let sarjaNapit = lomake.sarja;
    let valittu = null;
    for (let nappi of sarjaNapit) {
        if (nappi.checked) {
            valittu = nappi.value;
            break;
        }
    }
    //Tutkitaan valitut leimaustavat
    let valitutLeimaustavat = lomake.leimaustapa;
    let valitut = [];
    for (let valittuTapa of valitutLeimaustavat) {
        if (valittuTapa.checked) {
            valitut.push(valittuTapa.value);
        }
    }
    //Jos valittuja tapoja ei ole palataan 
    if (valitut.length < 1) {
        return;
    }
    //Luodaan joukkue ja lisätään sille attribuutit
    let joukkue = xmldata.createElement("joukkue");
    joukkue.setAttribute("aika", "00:00:00");
    joukkue.setAttribute("matka", "0");
    joukkue.setAttribute("pisteet", "0");
    joukkue.setAttribute("sarja", valittu);
    joukkue.setAttribute("jid", jid[0] + 1);
    //Lisätään leimaustavat ja  leimaustapa elementit
    let leimaustavat = xmldata.createElement("leimaustavat");
    for (valittu of valitut) {
        let leimaustapa = xmldata.createElement("leimaustapa");
        //Leimaustavan piti olla automaattisesti 1
        leimaustapa.textContent = valittu;
        leimaustavat.appendChild(leimaustapa);
    }
    joukkue.appendChild(leimaustavat);
    //Lisätään jäsenet elementti
    let uudetJasenet = xmldata.createElement("jasenet");
    let jasentaulukko = Array.from(jasenet);
    jasentaulukko.forEach(nimi => {
        if (nimi.value.trim() !== "") {
            let jasen = xmldata.createElement("jasen");
            jasen.textContent = nimi.value;
            uudetJasenet.appendChild(jasen);
        }
    });
    joukkue.appendChild(uudetJasenet);
    //Lisätään sarjalle nimi lapsielementti
    let nimi = xmldata.createElement("nimi");
    nimi.textContent = jnimi;
    joukkue.appendChild(nimi);
    //Tässä haetaan kaikki muistissa olevat joukkueet
    let kaikki = xmldata.getElementsByTagName("joukkueet")[0];
    //Lisätään joukkueen rastileimaukset
    //Alustetaan ensin pohjatiedot
    let lokaalit = xmldata.getElementsByTagName("rastileimaukset")[0];
    let ajat = lomake.pvm;
    let rastiIdt = new Map();
    let rastit = Array.from(xmldata.getElementsByTagName("rasti"));
    rastit.forEach((rasti) => rastiIdt.set(rasti.getAttribute("koodi"), rasti.getAttribute("rid")));
    let leimaukset = Array.from(lomake.leimaus);
    let uudet = xmldata.createElement("rastileimaukset");
    let indeksi = 0;
    //yhden leimauksen lisäyksessä ei ole taulukkoja käynnissä, niin tehdään näin
    //Tässä tapa eri, koska eipä tullu heti aateltua, tota taulukoksi pakottamista
    if (leimaukset.length === 0) {
        let leimaus = lomake.leimaus;
        let uusiLeimaus = xmldata.createElement("leimaus");
        uusiLeimaus.setAttribute("joukkue", jid[0] + 1);
        uusiLeimaus.setAttribute("rasti", rastiIdt.get(leimaus.value));
        uusiLeimaus.setAttribute("aika", lomake.pvm.value.replace('T', ' '));
        if (uusiLeimaus.getAttribute("rasti") !== "undefined"  && uusiLeimaus.getAttribute("rasti")) {
            uudet.appendChild(uusiLeimaus);
            lokaalit.appendChild(uusiLeimaus.cloneNode(true));
        }
    }
    //Käydään kaikki leimaukset läpi ja lisätään validit
    leimaukset.forEach((leimaus) => {
        if (leimaus.value !== "") {
            let uusiLeimaus = xmldata.createElement("leimaus");
            uusiLeimaus.setAttribute("joukkue", jid[0] + 1);
            uusiLeimaus.setAttribute("rasti", rastiIdt.get(leimaus.value));
            uusiLeimaus.setAttribute("aika", ajat[indeksi].value.replace('T', ' '));
            indeksi++;
            if (uusiLeimaus.getAttribute("rasti") !== "undefined"  && uusiLeimaus.getAttribute("rasti")) {
                uudet.appendChild(uusiLeimaus);
                lokaalit.appendChild(uusiLeimaus.cloneNode(true));
            }  
        }
    });
    

    //Ja lopuksi tiedot lisätään palvelimelle
    //Muistetaan myös lisätä muistissa olevaan xml-dataan joukkue, jotta sivun tiedot päivittyy
    let palaute = await lisaaJoukkue(joukkue);
    if (palaute instanceof XMLDocument && palaute.getElementsByTagName("joukkue")[0]) {
        kaikki.appendChild(palaute.getElementsByTagName("joukkue")[0]);
    }
    await muutaLeimaus(uudet, "PUT");
    lomake.reset();
    //Tässä poistetaan ylimääräiset rastileimaus inputit
    let rlm = Array.from(lomake.leimaus);
    rlm.forEach((leimaus) => {
        const container = leimaus.closest('p');
        if (container) {
            container.remove();
        }
    });
    paivitaJoukkueet();

}

/**
 * päivittää joukkue listauksen
 */
function paivitaJoukkueet() {
    let tbody = document.getElementById("tulosTaulukko");
    tbody.innerHTML = "";
    let sarjanKestot = haeSarjanNimet();
    lisaaTuloksetTaulukkoon(sarjanKestot);

}

// ...
// ...
// ...
// Tasolla 1 lisättävä rasti on luotava DOM-operaatioilla
// lomakkeelle syötetyistä tiedoista ja sen jälkeen lisäyskutsu on esim. muotoa:
// lisaaRasti(rasti); 
// lisaaRasti on valmis apufunktio, jota voit kutsua ihan normaalisti
// Kts. valmiit asynkroniset apufunktiot osoitteessa:
// http://users.jyu.fi/~tjlahton/tiea2120/vt/vt2/vt2-apufunktiot.js
// valmis pohja.xhtml lataa apufunktiot käyttöösi
// Voit näiden pohjalta luoda omia paranneltuja funktioita tasoilla 3 ja 5
// Kirjoita omat parannellut funktiosi tähän tiedostoon

/**
  * Päivittää uuden rastilistauksen sivulle onnistuneen rastin lisäämisen jälkeen
  * Tätä funktiota kutsutaan automaattisesti onnistuneen rastin lisäämisen jälkeen
  * Lisää tähän koodi, joka päivittää sivulle uudet rastit. 
  * Parametrina tuleva objekti sisältää vain uudet lisätyt rastit. Päivitä ne
  * sivulle sekä alkuperäiseen selaimen muistissa olevaan dataan
  * @param {Object} Uusi rastilistaus 
  */
let uudetRastit = function (rastit) {
    // rastit on xml-dokumentti, joka on muotoa:
    // <rastit>
    // <rasti koodi="61" rid="7139162" lon="25.531926" lat="62.147942"/>
    // <rasti rid="6548738" lon="25.714338" koodi="91" lat="62.112172"/>
    // ...
    // </rastit>
    console.dirxml("Uudet rastit : ", rastit, rastit.documentElement);
    // Sivun päivittäminen pitää toteuttaa täällä tasolla 1. 
    // Poista vanha rastilistaus ja luo uusi tilalle
    let ul = document.getElementById("rastikoodit");
    ul.innerHTML = "";
    //Tyhjennetään vanha rasti elementti
    listaaRastienKoodit();
    //Listataan rastit uudestaan.
};

console.log("script-elementin sisältö on suoritettu. Sivu latautuu vielä");

/**
 * muutettu versio apufunktiosta, lisätty mahdollisuus valita, mitä HTTP metodia käytetään
 * Palvelin palautti aina tyhjää rastileimaukset elementtiä, vaikka päivitys onnistui, joten ei voitu
 * Käyttää lokaaleissa päivityksissä tämän palautusta
 * @param {Element} rastileimaukset 
 * @param {String} metodi 
 * @returns 
 */
async function muutaLeimaus(rastileimaukset, metodi) {
    try {
        const response = await fetch("https://users.jyu.fi/~tjlahton/cgi-bin/tiea2120/2025.cgi/muutaLeimaus",
            {
                "method": metodi,  // voi olla PUT, jolloin lisätään tai DELETE, jolloin poistetaan
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
        if (response.status == 200) {
            const parser = new DOMParser();
            console.log("Success: Leimausten", rastileimaukset.outerHTML, "muuttaminen onnistui", response.status);
            return;
        }
        else {
            console.error("Fail: Leimausten", rastileimaukset.outerHTML, "muuttaminen epäonnistui", response.status, "\n", result);
        }
    } catch (error) {
        console.error("Error: Leimausten", rastileimaukset, "muuttaminen epäonnistui", error);
    }
}

/**
 * Muokattu versio apufunktiosta palauttaa palvelimen palautteen eli lisättävän joukkueen
 * @param {Element} joukkue 
 * @returns 
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
        return parser.parseFromString(result, 'application/xml');
    }
    else {
    console.error("Fail: Joukkueen", joukkue.outerHTML, "lisääminen epäonnistui", response.status, "\n", result);
    }
  } catch (error) {
        console.error("Error: Joukkueen", joukkue, "lisääminen epäonnistui", error);
  }
}


