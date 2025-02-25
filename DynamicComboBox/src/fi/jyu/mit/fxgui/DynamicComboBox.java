package fi.jyu.mit.fxgui;

import javafx.beans.property.BooleanProperty;
import javafx.beans.property.ListProperty;
import javafx.beans.property.SimpleBooleanProperty;
import javafx.beans.property.SimpleListProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonBar;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ComboBox;
import javafx.scene.input.KeyEvent;

import java.util.*;

/**
 * Oma versio ComboBox containerista, sisältää haun ja uuden lisäyksen tulkinnan
 */
public class DynamicComboBox extends ComboBox<java.lang.String> {
    private final ListProperty<String> sisalto = new SimpleListProperty<>(FXCollections.observableArrayList());
    /**
     * Attribuutti items sisältää kaiken comboxin sisällön
     */
    private BooleanProperty suodattaminen = new SimpleBooleanProperty(true);
    private BooleanProperty dynaaminenLisays = new SimpleBooleanProperty(true);


    public DynamicComboBox() {
        super();
        this.getEditor().addEventHandler(KeyEvent.KEY_TYPED, this::haku);
        this.getEditor().setOnAction(_ -> tutkiValinta());
        this.sisalto.addListener((_, _, newValue) ->asetaSisalto(newValue) );
    }
    /**
     * Seuraavat metodit ovat kaikki sisallon lisäämistä/asettamsita varten
     * Huom ylikirjoittaa kaiken mikä on scenebuilderissa laitettu, jos haluat lisätä myöhemmin koodissa
     * asioita käytä lisaaSisaltoa() metodia
     * @param sisalto mikä merkkijono/sisalto kokoelma comboboxiin laitetaan
     */
    public void asetaSisalto(String[] sisalto) {
        this.getItems().setAll(sisalto);
        this.sisalto.setAll(Arrays.asList(sisalto));

    }


    public void asetaSisalto(List<String> sisalto) {
        this.getItems().setAll(sisalto);
        this.sisalto.setAll(sisalto);

    }

    @FXML
    public void asetaSisalto(ObservableList<String> sisalto) {
        this.getItems().setAll(sisalto);
        this.sisalto.set(sisalto);
    }

    @FXML
    public ListProperty<String> sisaltoProperty() {
        return sisalto;
    }

    @FXML
    public ObservableList<String> getSisalto() {
        return sisalto.get();
    }

    @FXML
    public void setDynaaminenLisays(boolean t) {
        this.dynaaminenLisays.set(t);
    }

    @FXML
    public boolean getDynaaminenLisays() {
        return dynaaminenLisays.get();
    }

    @FXML
    public void setSuodattaminen(boolean s) {
        this.suodattaminen.set(s);
    }

    @FXML
    public boolean getSuodattaminen() {
        return suodattaminen.get();
    }



    /**
     * lisää sisältöä comboboxiin
     *
     * @param uusi merkkijono, joka lisätään
     */
    public void lisaaSisaltoa(String uusi) {
       this.getItems().add(uusi);
       this.sisalto.add(uusi);
    }


    /**
     * Vallinan tutkimis metodi Tutkii mitä käyttäjä on sijoittanut ComboBoxiin, jos on uusi valinta,
     * niin kysytään halutaanko se lisätä valintoihin. Instanssi pohjainen lisäys, jos lisäys halutaan
     * lopulliseksi tulee se tehdä itse
     */
    private void tutkiValinta() {
        if(!this.dynaaminenLisays.get()) {
            return;
        }
        java.lang.String valinta = this.getEditor().getText();
        if (valinta == null) {
            return;
        }
        valinta = valinta.trim();
        if (valinta.isEmpty()) {
            return;
        }
        // katsotaan löytyykö valinta
        boolean loytyko = false;
        for (String item : sisalto) {
            if (valinta.equals(item)) {
                loytyko = true;
                break;
            }

        }
        //jos ei löytynyt, niin avataan dialogi ja kysytään halutaanko valinta lisätä
        if (!loytyko) {
            tallennusIkkuna(valinta);
        } else {
            this.getEditor().requestFocus();
        }
    }


    /**
     * Metodi comboboxista etsimistä varten, Algoritmi toimii vertaamalla käyttäjän tekstiä
     * items listan sisältöihin ja lisää ne comboxiin, mitkä vastaavat hakusanaa.
     * Jos haku tyhjä, niin laitetaan kaikki comboboxiin, tulostetaan ja poistutaan.
     * Aikavaativuus kasvaa lineaarisesti, items listan kasvaessa
     */
    private void haku(KeyEvent k) {
        if (!suodattaminen.get()){
            return;
        }
        //estetään hakeminen, jos painettu enter-nappia
        if (k.getCharacter().equals("\r")) {
            tutkiValinta();
            return;
        }
        java.lang.String hakuSana = this.getEditor().getText() + k.getCharacter();
        hakuSana = hakuSana.trim();
        //varmistetaan, että hakusana ei ole tyhjä, jos on niin näytetään kaikki vaihtoehdot
        if (hakuSana.isEmpty()) {
            this.getItems().setAll(sisalto);
            this.show();
            return;
        }
        //käydään läpi jokainen vaihtoehto ja näytetään vain ne jotka ovat yhteensopivia
        List<java.lang.String> naytettavat = new ArrayList<>();
        for (java.lang.String item : sisalto) {
            if (item.toLowerCase().startsWith(hakuSana.toLowerCase())) {
                naytettavat.add(item);
            }
        }
        this.getItems().setAll(naytettavat);
    }


    /**
     * Tallennusikkunan esittävä metodi
     *
     * @param valinta valinta joka tallennetaan
     */
    private void tallennusIkkuna(java.lang.String valinta) {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Valitse");
        alert.setHeaderText(null);
        alert.setContentText("Haluatko tallentaa valinnan " + valinta + "?");

        ButtonType buttonTypeYes = new ButtonType("Kyllä", ButtonBar.ButtonData.OK_DONE);
        ButtonType buttonTypeCancel = new ButtonType("Ei", ButtonBar.ButtonData.CANCEL_CLOSE);

        alert.getButtonTypes().setAll(buttonTypeYes, buttonTypeCancel);

        Optional<ButtonType> result = alert.showAndWait();
        if (result.get() == buttonTypeYes) {
            sisalto.add(valinta);
        }
    }


}




