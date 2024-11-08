package leetcode;

import java.util.HashMap;
import java.util.Map;

public class Messages {
    public static String largestWordCount(String[] messages, String[] senders) {
        HashMap<String, Integer> table = new HashMap<String, Integer>();///String is the sender and Integer is their word count
        for(int i = 0; i < senders.length; i++){
            int helper = 0; ///So that we can add the users other wordcount
            if(table.containsKey(senders[i])){///Checking if the sender is mendtioned a second time
                helper = table.get(senders[i]);

            }
            int wc = 0;///wc = word count
            for(char c : messages[i].toCharArray()){///Checking how many spaces between words
                if(c ==' '){
                    wc++;
                }
            }
            table.put(senders[i],wc + helper +1); ///we add +1 since word count is 1 larger than the spaces between

        }
        ///Finding the sender with the largest wordcount/lexicographically largest name
        int max = 0;
        String Sender = "";
        for(Map.Entry<String, Integer> entry : table.entrySet()){
            if(entry.getValue() > max){
                max = entry.getValue();
            }
        }
        for(Map.Entry<String, Integer> entry : table.entrySet()){
            if(entry.getValue() == max){
                Sender = CompareNames(Sender,entry.getKey());
            }
        }


        return Sender;
    }
    ///Lexicographical comparison of two names
    public static String CompareNames(String name1, String name2) {

        if(name1.compareTo(name2) > 0){
            return name1;
        }
        return name2;

    }

}
