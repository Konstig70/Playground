package leetcode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
///This Leetcode exercise was about sorting integers based on how number 1 was in their binary representation
/// {0,1,2,3,4,5,6,7,8} would be sorted as {0,1,2,4,8,3,5,6,7}
public class IntegerSort {
    public static void main(String[] args) {
        int[] arr = new int[] {0,1,2,3,4,5,6,7,8};
        sortByBits(arr);
        for(int i : arr){
            System.out.print(i + " ");
        }
    }
    ///My solution that used hashmaps and a bubble sort, though the speed could be improved with a better sorting algorithm or by utilising
    /// better bounds on the bubble sort.
    public static int[] sortByBits(int[] arr) {
        HashMap<Integer, Integer> numbers = new HashMap<>();
        for(int i = 0; i < arr.length; i++){
            numbers.put(arr[i], Integer.bitCount(arr[i]));
        }
        boolean muutokset;
        int helpr;
        while(true){
            muutokset = false;
            for(int i = 0; i < arr.length; i++){
                if(i+1 < arr.length){
                    int bin = numbers.get(arr[i]);
                    int bin2 = numbers.get(arr[i+1]);
                    if(bin > bin2){
                        helpr = arr[i];
                        arr[i] = arr[i+1];
                        arr[i+1] = helpr;
                        muutokset = true;
                    }
                    if(bin == bin2){
                        if(arr[i] > arr[i+1]){
                            helpr = arr[i];
                            arr[i] = arr[i+1];
                            arr[i+1] = helpr;
                            muutokset = true;
                        }
                    }
                }
            }
            if(!muutokset){break;}
        }

        return arr;
    }
}


