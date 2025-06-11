const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controller/userController");
const upload = require("../authMiddleware/cloundinaryUpload");
const checkForAuthenticationCookie = require("../authMiddleware/authMiddleware");
const router = express.Router();

router.get(
  "/profile",
  checkForAuthenticationCookie("token"),
  getUserProfile
);
router.put(
  "/update-profile",
  checkForAuthenticationCookie("token"),
  upload.single("profilePhoto"),
  updateUserProfile
);

module.exports = router;
