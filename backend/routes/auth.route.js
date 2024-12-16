import express from "express"
import {
    login,
    logout,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth
} from "../controllers/auth.controller.js"
import { verifyToken } from "../middleware/verifyToken.middleware.js"


const router = express.Router()

router.get("/check-auth", verifyToken, checkAuth)

router.post("/signup", signup)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/logout", logout)
router.post("/verify-email", verifyEmail);
router.post("/reset-password/:token", resetPassword);
export default router;