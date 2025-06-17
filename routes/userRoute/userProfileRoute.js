const express = require("express");
const upload = require("../../authMiddleware/cloundinaryUpload");
const { getUserProfile, updateUserProfile } = require("../../controller/userController/userController");
const router = express.Router();

router.get(
  "/profile",
  getUserProfile
);
router.put(
  "/update-profile",
  upload.single("profilePhoto"),
  updateUserProfile
);

module.exports = router;
