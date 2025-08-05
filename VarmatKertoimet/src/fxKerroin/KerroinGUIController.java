package fxKerroin;

import fi.jyu.mit.fxgui.DynamicComboBox;
import fi.jyu.mit.graphics.Window;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;

import java.io.*;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.ResourceBundle;
import java.util.Scanner;

/**
 * @author konst
 * @version 13.6.2025
 */
public class KerroinGUIController implements Initializable {
    @FXML private DynamicComboBox lajit;
    @FXML private DynamicComboBox ottelut;

    @FXML private Label koti;
    @FXML private Label vieras;

    @FXML private Label dataPvm;

    @FXML private TextField KotiVeto;
    @FXML private TextField kotiKerroin;
    @FXML private TextField kotiMaksu;

    @FXML private TextField tasaKerroin;
    @FXML private TextField tasaMaksu;
    @FXML private TextField tasaVeto;

    @FXML private TextField vierasKerroin;
    @FXML private TextField vierasMaksu;
    @FXML private TextField vierasVeto;

    @FXML private TextField sijoitus;

    @FXML private TextField kotiSivu;
    @FXML private TextField vierSivu;
    @FXML private TextField tasSivu;

    public void laskeLuvut() {
        try {
            double sij = Double.parseDouble(sijoitus.getText());
            boolean profit =  Sarjoitin.asetaSijoitus(sij);
            String[] kertoimet = Sarjoitin.getKertoimet();
            String[] vedot = Sarjoitin.getVedot();
            String[] maksut = Sarjoitin.getMaksu();
            String[] sivut = Sarjoitin.getSivu();
            KotiVeto.setText(vedot[0]);
            kotiKerroin.setText(kertoimet[0]);
            kotiMaksu.setText(maksut[0]);
            kotiSivu.setText(sivut[0]);
            
            vierasKerroin.setText(kertoimet[1]);
            vierasMaksu.setText(maksut[1]);
            vierasVeto.setText(vedot[1]);
            vierSivu.setText(sivut[1]);
            if (Double.parseDouble(kertoimet[2]) < -10000) {
                tasaKerroin.setText("Tasapeli ei mahd");
            } else {
                tasaKerroin.setText(kertoimet[2]);
            }



            tasaMaksu.setText(maksut[2]);
            tasaVeto.setText(vedot[2]);
            tasSivu.setText(sivut[2]);


        } catch (NumberFormatException e) {
            tasaKerroin.setText("Tasapeli ei mahd");
        }
    }

    public void uusiData() {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Data");
        alert.setHeaderText(null);
        alert.setContentText("Uusitaan dataa...");
        alert.showAndWait();
        DateTimeFormatter formatoija = DateTimeFormatter.ofPattern("HH:mm dd.MM.yyyy");
        String pvm = LocalDateTime.now().format(formatoija);
        dataPvm.setText("Uusittu viimeksi: " + pvm);
        Sarjoitin.uusiData();
        alert.setContentText("Data uusittu!");
        alert.show();
        try (PrintStream kirj = new PrintStream(new FileOutputStream(System.getProperty("user.dir") + "/DataPvm.txt"))) {
            kirj.println(pvm);
        } catch (FileNotFoundException e) {
            System.out.println("Tiedostoa ei saatu luotua tai se on hakemisto!");
        }
    }

    public void lisaaOttelut() {
        ottelut.asetaSisalto(Sarjoitin.getTietytOttelut(lajit.getSelectionModel().getSelectedItem()));
    }

    public void lisaaTeksti() {
        Sarjoitin.valitse(ottelut.getSelectionModel().getSelectedItem());
        koti.setText(Sarjoitin.getKoti());
        vieras.setText(Sarjoitin.getVieras());
        laskeLuvut();

    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        Sarjoitin.sarjaa();
        lajit.asetaSisalto(Sarjoitin.getLajit());
        ottelut.asetaSisalto(Sarjoitin.getOttelut());
        try (Scanner scanner = new Scanner(new FileInputStream(System.getProperty("user.dir") + "/DataPvm.txt"))) {
            if (scanner.hasNext()) {
                dataPvm.setText("Uusittu viimeksi: " + scanner.nextLine());
            }
        } catch (FileNotFoundException e) {
            System.out.println("Päivämäärän sisältävää tiedostoa ei löytynyt. Yritetään luoda...");
            File pvm = new File(System.getProperty("user.dir") + "/DataPvm.txt");
            try {
                if (pvm.createNewFile()) {
                    System.out.println("Tiedosto luotiin!");
                } else {
                    System.out.println("Tiedosto on jo olemassa, mutta siihen ei päästy käsiksi. Tarkista onko sinulla oikeudet käsitellä tiedostoa");
                }
            } catch (IOException ex) {
                System.out.println("Ongelma tiedoston luonnissa.");
            }
        }
    }
}