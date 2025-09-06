import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import {
  addComment,
  getComments,
  getAllComments,
  updateComment,
  deleteComment,
  moderateComment,
  toggleLike
} from "../controllers/comment.controller.js";

const router = Router();


router.get("/post/:postId", getComments);


router.post("/add", verifyUser, addComment); // Add new comment
router.put("/update/:commentId", verifyUser, updateComment); // Edit comment
router.delete("/delete/:commentId", verifyUser, deleteComment); // Delete comment
router.post("/like/:commentId", verifyUser, toggleLike); // Like/unlike comment

// Admin routes
router.get("/admin/all", verifyUser, getAllComments); // Get all comments for admin
router.patch("/admin/moderate/:commentId", verifyUser, moderateComment); // Approve/reject comment

export default router;