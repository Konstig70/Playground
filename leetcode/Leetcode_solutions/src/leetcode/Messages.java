package leetcode;

import java.util.HashMap;
import java.util.Map;

public class Messages {
    public static String largestWordCount(String[] messages, String[] senders) {
        HashMap<String, Integer> table = new HashMap<String, Integer>();
        for(int i = 0; i < senders.length; i++){
            int helper = 0;
            if(table.containsKey(senders[i])){
                helper = table.get(senders[i]);

            }
            int wc = 0;
            for(char c : messages[i].toCharArray()){
                if(c ==' '){
                    wc++;
                }
            }
            table.put(senders[i],wc + helper +1); ///

        }
        ///Finding largest the sender with the larges wordcount
        int max = 0;
        String Sender = "";
        for(Map.Entry<String, Integer> entry : table.entrySet()){
            if(entry.getValue() > max){
                Sender = entry.getKey();
                max = entry.getValue();
            }
        }

        return Sender;
    }
}
