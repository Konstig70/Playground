package leetcode;

///This exercise was about finding a binary trees maximum depth
public class Binarytrees {
    static class TreeNode{
        int val;
      TreeNode left;
      TreeNode right;

      TreeNode(int val) { this.val = val; }
      TreeNode(int val, TreeNode left, TreeNode right) {
          this.val = val;
          this.left = left;
          this.right = right;
      }
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(15);
        root.left = new TreeNode(7);
        root.right = new TreeNode(10);
        root.left.left = new TreeNode(5);
        System.out.println(maxDepth(root));
    }

    ///Recursive call first we check the left binary tree and then the right and so on until we have reached the last one and afterwards we
    /// start adding 1 until we have reached the beginning
    public static int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return Math.max(maxDepth(root.left), maxDepth(root.right)) +1;
    }
}
