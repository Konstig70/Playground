package leetcode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Names_one_occurance {

    public static void main(String[] args) {
        String[] words = new String[]{"leetcode","is","amazing","as","is"};
        String[] words_more = new String[]{"amazing","leetcode","is"};
        int nmbOfStrings = countWords(words,words_more);
        System.out.println(nmbOfStrings);
    }

    public static int countWords(String[] words1, String[] words2 ) {
        List<String> usedWords = new ArrayList<String>();
        int count = 0;
        List<String> namesWithOneOccurance = new ArrayList<>();
        for(String s : words2){
            if(usedWords.contains(s)){
                namesWithOneOccurance.remove(s);
            } else if (!usedWords.contains(s)) {
                for(String s2 : words1){
                    if (s.equals(s2)){
                        count++;
                    }
                }
                if (count == 1){
                    namesWithOneOccurance.add(s);
                }
                count = 0;
                usedWords.add(s);

            }
        }

        return namesWithOneOccurance.size();
    }
}
