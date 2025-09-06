import { Router } from "express";
 
import { createUser } from "../controllers/auth.controller.js";
import { LoginUser } from "../controllers/auth.controller.js";
import { GoogleLogin } from "../controllers/auth.controller.js";
import { updateProfilePicture } from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyUser } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/signup", createUser);
router.post("/login", LoginUser);
router.post("/google-login", GoogleLogin);
router.post("/update-profile-picture/:userId", verifyUser, upload.single("profilePicture"), updateProfilePicture);

export default router;
