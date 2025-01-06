package leetcode;

public class DuplicateRemoval {
    public static void main(String[] args) {
        String s = "abbaca";
        System.out.println(removeDuplicates(s));
    }
    public static String removeDuplicates(String s) {
        StringBuilder sb = new StringBuilder();
        for(char c : s.toCharArray()) {
            if(sb.length() > 0 && c == sb.charAt(sb.length() - 1)) {
                sb.deleteCharAt(sb.length() - 1);
            }
            else{
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
