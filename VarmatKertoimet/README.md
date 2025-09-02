## ⚠️ Disclaimer

This application is intended for **educational and informational purposes only**. It does not place bets, promote gambling, or guarantee profits. Users are solely responsible for how they use the software and for complying with the laws and regulations of their jurisdiction. The developer assumes **no liability** for any outcomes resulting from the use of this application.

## API Key Required

To use this application, you must obtain your own API key from [Odds API](https://the-odds-api.com/) and configure it in the app. Sharing or using someone else's API key may violate Odds API’s terms of service.


## VarmatKertoimet
VarmatKertoimet on Javalla luotu sovellus, joka seuraa ja pyrkii esittäämään parhaimmat mahdolliset kertoimet seurattuihin urheilu otteluihin sekä näyttämään parhaimman mahdollisen voiton sijoitukseen perustuen. HUOM varma voitto ei ole aina mahdollista, sovellus pyrkii näyttämään vain parhaimmat kertoimet. Voit lisätä/poistaa seurattuja lajeja muokkaamalla Lajit.json tiedostoa (Muista säilyttää tiedoston rakenne ja formaatti alkuperäisenä, jotta sovellus toimii oikein). Mikäli kiinnostaa niin lähdekoodia voi tutkailla. HUOM tarvitsee oman API-avaimen toimiakseen (kts ohjeet). 

## Ohjeet asennukseen
1. Jos ei ole niin lataa ja asenna Java (vähintään versio 23) [täältä](https://www.java.com/en/download/manual.jsp). Asennuksen jälkeen toimivuuden voi tarkastaa komenolla java -version. 
2. Lataa dist.zip sekä Lajit.json tästä reposta.
3. Suositeltava, mutta ei pakollinen. Luo oma hakemisto lataamillesi tiedostoille ja aseta purettu zip-kansio sekä Lajit.json sinne.
4. Tee itsellesi oma Oddsdata API avain, jota tarvitset sovelluksen toimiakseen. Ohjeet löytyvät [tästä](https://the-odds-api.com/).
5. Kun omaat avaimen laita se tiedostoon **ApiAvain.txt**. Sijoita **ApiAvain.txt** sekä **Lajit.json** purettuun zip-kansion sisälle bin-kansioon. 
6. Nyt sovelluksen tulisi käynnistyä tuplaklikkamalla VarmatKertoimet.bat tiedostoa, joka löytyy puretun zip-kansion sisältä bin kansiosta.
7. Ongelma tilanteissa ilmoita bugista Playground repossa Issues kohdassa. Aloita mainitsemalla ongelman koskevan VarmatKertoimet sovellusta.

## Käytöstä
Voit uusia Datan painamalla **Uusi Data** nappia. Tämän jälkeen sulje ilmoitus ja odota, kunnes sovellus ilmoittaa datan päivityksen onnistuneen. Päivityksen jälkeen käynnistä sovellus uudestaan. Voit Myös suodattaa otteluita kirjoittamalla valinta laatikkoon.
