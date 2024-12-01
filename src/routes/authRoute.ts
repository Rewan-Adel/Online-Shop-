import { Router } from "express";
import  AuthController from "../controllers/AuthController";
import  AuthServiceImpl from "../services/AuthServiceImpl";
import  codeServiceImpl  from "../services/codeServiceImp";

import EmailNotificationImp from "../utils/EmailSender";
import VerificationCodeController from "../controllers/verificationCodeController";
import EncryptionService from "../utils/Encryption";
import TokenService from "../services/TokenService";
const authRoutes = Router();

const encryption       = new EncryptionService();
const notification     = new EmailNotificationImp();
const tokenServiceInstance = new TokenService();
const verificationCodeService    = new codeServiceImpl(encryption, notification);
const verificationCodeController = new VerificationCodeController(verificationCodeService);

const signupService    = new AuthServiceImpl(tokenServiceInstance, encryption, verificationCodeService, notification);
const signupController = new AuthController(signupService);


authRoutes.post("/signup", (req, res) => signupController.signup(req, res));
authRoutes.post("/verify-email", (req, res) => verificationCodeController.codeVerifier(req, res));
authRoutes.post("/signup/resend-code", (req, res) => signupController.resendCodeForSignup(req, res));

authRoutes.post("/login", (req, res) => signupController.login(req, res));

authRoutes.post("/forgot-password", (req, res) => signupController.forgotPassword(req, res));
authRoutes.post("/reset-password/:userID/:resetToken", (req, res) => signupController.resetPassword(req, res));
authRoutes.post("/reset-password/resend-code", (req, res) => signupController.resendCodeForReset(req, res));

export default authRoutes;