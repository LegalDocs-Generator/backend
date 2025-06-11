const express = require("express");
const { signup, login, handleLogout, forgotPassword, handleResetPassword } = require("../controller/userController");
const upload = require("../authMiddleware/cloundinaryUpload");
const router = express.Router();

router.post("/signup",  upload.single("profilePhoto"),signup);
router.post("/login", login);
router.post("/logout", handleLogout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", handleResetPassword);

module.exports = router;  