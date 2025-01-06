package leetcode;

public class BinSearch {
    public static void main(String[] args) {
        int[] arr = new int[10];
        for(int i = 0; i < arr.length; i++){
            arr[i] = i;
        }
        System.out.println(binSearch(arr, 4));
    }

    public static int binSearch(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        while(low <= high){
            int mid = low + (high - low) / 2;
            if(nums[mid] == target){
                return mid;
            }
            else if(nums[mid] < target){
                low = mid + 1;
            }
            else{
                high = mid - 1;
            }
        }
        return -1;
    }
}
