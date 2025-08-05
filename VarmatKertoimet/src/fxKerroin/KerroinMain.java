package fxKerroin;

import javafx.application.Application;
import javafx.stage.Stage;
import javafx.scene.Scene;
import javafx.scene.layout.Pane;
import javafx.fxml.FXMLLoader;


/**
 * @author konst
 * @version 13.6.2025
 */
public class KerroinMain extends Application {
    @Override
    public void start(Stage primaryStage) {
        try {
            FXMLLoader ldr = new FXMLLoader(getClass().getResource("KerroinGUIView.fxml"));
            final Pane root = ldr.load();
            //final KerroinGUIController kerroinCtrl = (KerroinGUIController)ldr.getController();
            Scene scene = new Scene(root);
            scene.getStylesheets().add(getClass().getResource("kerroin.css").toExternalForm());
            primaryStage.setScene(scene);
            primaryStage.setTitle("Kerroin");
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