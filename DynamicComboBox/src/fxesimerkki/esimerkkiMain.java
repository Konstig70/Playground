package fxesimerkki;

import javafx.application.Application;
import javafx.stage.Stage;
import javafx.scene.Scene;
import javafx.scene.layout.Pane;
import javafx.fxml.FXMLLoader;


/**
 * @author konst
 * @version 20.2.2025
 */
public class esimerkkiMain extends Application {
    @Override
    public void start(Stage primaryStage) {
        try {
            FXMLLoader ldr = new FXMLLoader(getClass().getResource("esimerkkiGUIView.fxml"));
            final Pane root = ldr.load();
            //final esimerkkiGUIController esimerkkiCtrl = (esimerkkiGUIController)ldr.getController();
            Scene scene = new Scene(root);
            scene.getStylesheets().add(getClass().getResource("esimerkki.css").toExternalForm());
            primaryStage.setScene(scene);
            primaryStage.setTitle("esimerkki");
            primaryStage.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * @param args Ei käytössä
     */
    public static void main(String[] args) {
        launch(args);
    }
}