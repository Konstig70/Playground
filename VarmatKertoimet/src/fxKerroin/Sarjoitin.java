package fxKerroin;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Sarjoitin {
    private static List<Data.Match> matsit = new ArrayList<>();
    private static Data.Match valittu;
    private static String[] kertoimet;
    private static String[] vedot;
    private static String[] maksut;
    private static double sijoitus;
    private static String[] sivut;
    private static double agg;

    public static List<Data.Match> getMatsit() {
        return matsit;
    }

    public static void sarjaa() {
        Gson gson = new Gson();

        try (BufferedReader scanner = new BufferedReader(new FileReader(System.getProperty("user.dir") + "/Data.json"))) {
            String line;
            Type onkoListaType = new TypeToken<List<Data.Match>>() {}.getType();
            while ((line = scanner.readLine()) != null && !line.isEmpty()) {
                List<Data.Match> parsed = gson.fromJson(line, onkoListaType);
                matsit.addAll(parsed);
                matsit = matsit == null || matsit.isEmpty() ? new ArrayList<>() : matsit;
            }


        } catch (IOException e) {
            System.out.println("Ei löydy tiedostoa Data.json polusta: " + System.getProperty("user.dir") + "/Data.json");
            System.out.println("Yritetään luoda tiedosto");
            File pvm = new File(System.getProperty("user.dir") + "/Data.json");
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

    public static void main(String[] args) {
        sarjaa();
        //tulostaKaikki(matsit);

    }


    public static void tulostaKaikki(List<Data.Match> matsit) {
        for (Data.Match match : matsit) {
            System.out.println("Match: " + match.home_team + " vs " + match.away_team);
            for (Data.Bookmaker bookmaker : match.bookmakers) {
                System.out.println("  Bookmaker: " + bookmaker.title);
                for (Data.Market market : bookmaker.markets) {
                    for (Data.Outcome outcome : market.outcomes) {
                        System.out.println("    Outcome: " + outcome.name + " @ " + outcome.price);
                    }
                }
            }
        }
    }

    public static List<String> getLajit() {
        List<String> list = new ArrayList<>();
        List<String> kaytetyt = new ArrayList<>();
        for (Data.Match m : matsit) {
            String laji = m.sport_key.substring(0, m.sport_key.indexOf("_"));
            if (!kaytetyt.contains(laji)) {
                list.add(laji);
            }
            kaytetyt.add(laji);
        }
        return list;
    }

    public static List<String> getOttelut() {
        List<String> list = new ArrayList<>();
        for (Data.Match m : matsit) {
            list.add(m.home_team + " vs " + m.away_team);
        }
        return list;
    }

    public static String getKoti() {
        try {
            return valittu.home_team;
        } catch (NullPointerException e) {
            return "";
        }
    }

    public static String getVieras() {
        try {
            return valittu.away_team;
        } catch (NullPointerException e) {
            return "";
        }
    }

    public static void valitse(String otsikko) {
        String[] joukkueet = otsikko.split("vs");
        for (Data.Match m : matsit) {
            if (m.home_team.equals(joukkueet[0].trim()) && m.away_team.equals(joukkueet[1].trim())) {
                valittu = m;
            }
        }

    }

    /**
     * Etsii ja laskee kaiken tarvittavan, eli kertoimet sijoitukset ja voitot
     */
    private static void getData() {
        double parasKoti = Integer.MIN_VALUE;
        double parasVier = Integer.MIN_VALUE;
        double parasTas = Integer.MIN_VALUE;
        String koti = valittu.home_team;
        String vier = valittu.away_team;
        String kotiSivu = "";
        String vierSivu = "";
        String tasSivu = "";
        for (Data.Bookmaker b : valittu.bookmakers) {
            for (Data.Market m : b.markets) {
                for (Data.Outcome o : m.outcomes) {
                    if (o.name.equals(koti)) {
                        if (o.price > parasKoti) {
                            parasKoti = o.price;
                            kotiSivu = b.title;
                        }
                    }
                    if (o.name.equals(vier)) {
                        if (o.price > parasVier) {
                            parasVier = o.price;
                            vierSivu = b.title;
                        }
                    }
                    if (o.name.equals("Draw")) {
                        if (o.price > parasTas) {
                            parasTas = o.price;
                            tasSivu = b.title;
                        }
                    }
                }
            }
        }
        double a = 1/parasKoti + 1/parasVier + 1/parasTas;
        agg = a;
        System.out.println(a);
        kertoimet = new String[]{String.valueOf(parasKoti), String.valueOf(parasVier), String.valueOf(parasTas)};
        sivut = new String[]{kotiSivu, vierSivu, tasSivu};
        double kotiSij = (1/parasKoti)/a*sijoitus;
        double vierSij = (1/parasVier)/a*sijoitus;
        double tasuriSij = (1/parasTas)/a*sijoitus;

        double b1 = Math.round(kotiSij * 100.0) / 100.0;
        double b2 = Math.round(vierSij * 100.0) / 100.0;
        double b3 = Math.round(tasuriSij * 100.0) / 100.0;
        vedot = new String[]{b1 + "€", b2 + "€", b3 + "€"};
        System.out.println(koti + " " + b1 + "€");
        System.out.println(vier + " " + b2 + "€");
        System.out.println("Tasuri " + b3 + "€");

        double pKoti = Math.round((b1 * parasKoti) * 100.0) / 100.0;
        double pVier = Math.round((b2 * parasVier)* 100.0) / 100.0;
        double pTasuri = Math.round((b3 * parasTas)* 100.0) / 100.0;
        maksut = new String[]{pKoti + "€", pVier + "€", pTasuri + "€"};
    }

    /**
     * Getterit
     * @return kertoimet
     */
    public static String[] getKertoimet() {
        return kertoimet;
    }

    public static String[] getVedot() {
        return vedot;
    }

    public static String[] getMaksu() {
        return maksut;
    }

    public static String[] getSivu() {
        return sivut;
    }

    public static boolean asetaSijoitus(double sij) {
        sijoitus = sij;
        getData();
        if (agg > 1) {
            return false;
        }
        return true;
    }

    public static void uusiData() {
        Gson gson = new Gson();
        List<Data.League> parsedLiigat = null;
        //Hommataan kaikki liigat
        try (BufferedReader scanner = new BufferedReader(new FileReader(System.getProperty("user.dir") + "/Lajit.json"))) {
            Type onkoLiiga = new TypeToken<List<Data.League>>() {}.getType();
            parsedLiigat = gson.fromJson(scanner, onkoLiiga);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
        //Alustetaan API-avain
        String avain = "";
        try (Scanner sc = new Scanner(new FileInputStream(System.getProperty("user.dir") + "/ApiAvain.txt"))) {
            avain = sc.nextLine();
        } catch (FileNotFoundException e) {
            System.out.println(e.getMessage());
        }
        //Nyt käydään liigat läpi
        if (parsedLiigat != null) {
            try {
                //Luodaan ensin kirjoittaja
                try (PrintStream kirjoittaja = new PrintStream(new FileOutputStream(System.getProperty("user.dir") + "/Data.json"))) {
                    for (Data.League l : parsedLiigat) {
                        String urlJono = String.format("https://api.the-odds-api.com/v4/sports/%s/odds/?apiKey=%s&regions=%s&markets=h2h", l.key, avain, l.region);
                        URI uri = new URI(urlJono);
                        URL url = uri.toURL();
                        HttpURLConnection con = (HttpURLConnection) url.openConnection();
                        con.setRequestMethod("GET");
                        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                        String inputLine;
                        while ((inputLine = in.readLine()) != null) {
                            kirjoittaja.println(inputLine);
                        }
                    }
                }
            } catch (IOException | URISyntaxException e) {
                System.out.println(e.getMessage());
            }
        }
    }

    public static List<String> getTietytOttelut(String laji) {
        List<String> list = new ArrayList<>();
        for (Data.Match m : matsit) {
            String l = m.sport_key.substring(0, m.sport_key.indexOf("_"));
            if (l.equals(laji)) {
                list.add(m.home_team + " vs " + m.away_team);
            }
        }
        return list;
    }
}
