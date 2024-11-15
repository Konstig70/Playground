package leetcode;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Arrays;


///Task was to make a height checker what checks how many heights match expected
public class HeightChecker {
    public static int Check(int[] heights){
        int[] helper = new int[heights.length];
        System.arraycopy(heights, 0, helper, 0, heights.length);
        Arrays.sort(helper);
        int exceptions = 0;
        for(int i = 0; i < helper.length; i++){
            if(helper[i] != heights[i]){
                exceptions++;
            }

        }
        return exceptions;
    }

    ///Alternative solution using lists, 1ms slower but uses less memory
    public static int Check2(int[] heights){
        List<Integer> heightlist = new ArrayList<>();
        for(int height: heights){
            heightlist.add(height);
        }
        Collections.sort(heightlist);
        int exceptions = 0;
        for(int i = 0; i < heightlist.size(); i++){
            if(heightlist.get(i) != heights[i]){
                exceptions++;
            }

        }
        return exceptions;
    }

    public static void main(String[] args) {
        int[] pituus = new int[] {5,1,2,3,4};
        System.out.println(Check(pituus));
    }
}
