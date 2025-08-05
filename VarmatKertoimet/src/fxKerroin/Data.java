package fxKerroin;

import java.util.List;

public class Data {


    /**
     * En jaksa välittää gettereistä RN niin kaikki julkista xd
     */
    public class Match {
        public String id;
        public String sport_key;
        public String sport_title;
        public String commence_time;
        public String home_team;
        public String away_team;
        public List<Bookmaker> bookmakers;
    }

    public class Bookmaker {
        public String key;
        public String title;
        public List<Market> markets;
    }

    public class Matches {
        public List<Match> data;
    }

    public class Market {
        public String key;
        public List<Outcome> outcomes;
    }

    public class Outcome {
        public String name;
        public double price;
    }

    public class League {
        public String key;
        public String group;
        public String region;

    }
}
