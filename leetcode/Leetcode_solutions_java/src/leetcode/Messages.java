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
        ///Finding the sender with the largest wordcount/lexicographically the largest name
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

    public static void main(String[] args) {
        String[] messages = new String[] {"b I j","OK N x J jt b iO N Y","Q h y CV UE Q A","Qo Qy w Aw c","oh","OA kC G V GlX","AD Z A YH Tyl","MA","sVD","a BB o g o A hf H","qu","P nAx","d e As Gd oD C RWb","kS tI Lt U eq k M A","cS e R h f gl","AX dn b w nx","nX T P B","F","Gk eGO","l y Ue nC D","o UV W P j p e Ov g","aI Xr Fs NVz","H f l","B AY vs S","rZ Ku S S pQ","f N q cP lX o x","W X X Za t","Vp a xR X J G h A Vo"};
        String[] senders = new String[] {"kXMEHbzSid","LxSLj","HvI","rIffGg","rIffGg","RHiE","HvI","QWsD","v","QWsD","VUCp","vsp","ArRIVvhn","VUCp","RHiE","rIffGg","FzxQzXec","FzxQzXec","VUCp","VUCp","vsp","v","rDkxpR","rKsKmX","rKsKmX","HvI","LxSLj","grfeiaY"};
        String largest =  Messages.largestWordCount(messages, senders);
        System.out.println(largest);

    }

}
