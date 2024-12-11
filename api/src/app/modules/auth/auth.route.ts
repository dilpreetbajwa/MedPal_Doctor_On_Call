import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthController.Login);
router.post("/social-login", AuthController.socialLogin);
router.post("/social-signup", AuthController.socialSignup);
router.post("/reset-password", AuthController.resetPassword);
router.post("/change-password", AuthController.changePassword);
router.post("/reset-password/confirm", AuthController.PasswordResetConfirm);
// router.get('/user/verify/:userId/:uniqueString', AuthController.VerifyUser);
router.get("/verified", AuthController.Verified);
router.get("/expired/link", AuthController.VerficationExpired);

export const AuthRouter = router;
