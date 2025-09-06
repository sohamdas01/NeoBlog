// import { Router } from "express";
// import { verifyUser } from "../middleware/auth.middleware.js";
// import { createPost } from "../controllers/post.controller.js";
// import { getAllPosts } from "../controllers/post.controller.js";
// import { upload } from "../middleware/multer.middleware.js";
// import { deletePost } from "../controllers/post.controller.js";
// import { updatePost } from "../controllers/post.controller.js";
// const router = Router();

// router.post("/create-post",upload.single("image"),verifyUser,createPost);
// router.get("/post-list",verifyUser,getAllPosts);
// router.delete("/delete-post/:postId",verifyUser,deletePost);
// router.patch("/update-post/:postId/:userId",verifyUser,upload.single("image"),updatePost);
// export default router;


import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { createPost, getAllPosts, deletePost, updatePost,generateContent } from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { getPostById } from "../controllers/post.controller.js";

const router = Router();

// Create post
router.post("/create-post", upload.single("image"), verifyUser, createPost);

// Get posts 
router.get("/post-list", verifyUser, getAllPosts);
// Public route for getting published posts (no authentication required)
router.get("/public/post-list", getAllPosts);
// Delete post
router.delete("/delete-post/:postId", verifyUser, deletePost);
router.get("/post/:postId", getPostById);

// Update post
router.patch("/update-post/:postId/:userId", verifyUser, upload.single("file"), updatePost);
//generate content
router.post("/generate-content", verifyUser, generateContent);

export default router;