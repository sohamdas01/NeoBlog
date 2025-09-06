import { Router } from "express";

import { logoutUser, updateUser } from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { deleteUser } from "../controllers/user.controller.js";
import { getUser } from "../controllers/user.controller.js";
const router = Router();

router.put("/update-profile/:userId", verifyUser, updateUser);
router.delete("/delete-profile/:userId", verifyUser, deleteUser);
router.post("/logout", logoutUser);
router.get("/get-users",verifyUser,  getUser);

export default router;