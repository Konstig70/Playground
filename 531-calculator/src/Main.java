import java.io.*;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.math.BigDecimal;

//@author: Konsta Lahtinen
//@version: 12.9.2024
//Summary: Ohjelma, joka automatisoi wendler 531 treeni ohjelman laskut.
public class Main {
    private static final File sets = new File("sets.txt");
    private static final File Pr = new File("Pr.txt");
    public static void main(String[] args) {

        while (true) {
            System.out.print("Welcome to konsta's 531 calculator:");
            Console knsl = System.console();
            String vastaus = knsl.readLine();
            switch (vastaus) {
                case "new":
                    newProgram();
                    break;


                case "print":
                    printProgram();
                    break;

                case "cycle":
                    Cycle();
                    break;

                case "exit":
                    System.exit(0);

                default:
                    System.out.println("Try again");
                    break;

            }
        }



    }
    public static void newProgram() {
        File sets = new File("sets.txt");
        boolean isDeleted = sets.delete();
        if (isDeleted) {
           System.out.println("Creating new program...");
        }
        else {
            System.out.println("Creating new program..");
            try {
                sets.createNewFile();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        System.out.println("Give your pr:");
        Console knsl = System.console();
        String pr = knsl.readLine();
        try {
            FileWriter Fw = new FileWriter(Pr);
            Fw.write(pr);
            Fw.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        int n = Integer.parseInt(pr);
        WriteToFile(n);

    }

    public static void printProgram() {
        File sets = new File("sets.txt");
        try {
            Scanner sc = new Scanner(sets);
            while (sc.hasNextLine()) {
                System.out.println(sc.nextLine());
            }
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred, file not found.");
        }
    }

    public static void Cycle() {
        File sets = new File("sets.txt");
        try {
            Scanner sc = new Scanner(sets);
            List<String> list = new ArrayList<>();
            List<String> list2 = new ArrayList<>();
            while (sc.hasNextLine()) {
                list2.add(sc.nextLine());
            }

            //Tää on paskaaaaaa :DDDDD
            String line;
            for (String s : list2) {
                if (s.contains("x")) {

                    String[] split = s.split(" ");
                    split[0] = split[0].replace(',', '.');
                    float n = Float.parseFloat(split[0].trim());
                    n = (float) (n + 2.5);
                    split[0] = String.valueOf(n);
                    line = split[0] + " " + split[1] + " " + split[2];
                    list.add(line);
                } else {
                    list.add(s);
                }

            }
            ChangeFileNumbers(list);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    public static void WriteToFile(float n) {
        try {
            BufferedWriter Fw = new BufferedWriter(new FileWriter(sets, true));
            writeLine(Fw, "Viikko 1:");
            writeFormatted(Fw, (float) (n * 0.65)," x 5");
            writeFormatted(Fw, (float) (n * 0.75)," x 5");
            writeFormatted(Fw, (float) (n * 0.85)," x 5+");

            writeLine(Fw, "Viikko 2:");
            writeFormatted(Fw, (float) (n * 0.70)," x 3");
            writeFormatted(Fw, (float) (n * 0.80)," x 3");
            writeFormatted(Fw, (float) (n * 0.90)," x 3+");
            writeLine(Fw, "Viikko 3:");
            writeFormatted(Fw, (float) (n * 0.75)," x 5");
            writeFormatted(Fw, (float) (n * 0.85)," x 3");
            writeFormatted(Fw, (float) (n * 0.95)," x 1+");
            writeLine(Fw, "Viikko 4:");
            writeFormatted(Fw, (float) (n * 0.40)," x 5");
            writeFormatted(Fw, (float) (n * 0.50)," x 5");
            writeFormatted(Fw, (float) (n * 0.60)," x 5");
            Fw.close();
        } catch (IOException e) {
            System.out.println("An IO error occured");
        }

    }

    private static void writeLine(BufferedWriter Fw, String s) throws IOException {
        Fw.write(s);
        Fw.newLine();
    }

    public static void writeFormatted(BufferedWriter fw, double n, String suffix) throws IOException {
        //joo tääki oli vitun perseestä vitun liukuluvut mut näyttää toimivan rn nii en korjaa :DDDD
        if (n - Math.floor(n) < .3){
            n = Math.floor(n);
        }
        else {n = (Math.round(n * 2) / 2.0);}
        fw.write(String.format("%.1f",n) + suffix);
        fw.newLine();
    }

    public static void  ChangeFileNumbers(List<String> s) {
        System.out.println("Creating new cycle...");
        File sets = new File("sets.txt");
        try {
            sets.createNewFile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
                BufferedWriter bw = new BufferedWriter(new FileWriter(sets));
            for (String string : s) {
                bw.write(string);
                bw.newLine();
            }
                bw.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
    }
}
