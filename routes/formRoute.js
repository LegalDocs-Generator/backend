const express = require("express");
const { submitForm } = require("../controller/form1Controller");
const checkForAuthenticationCookie = require("../authMiddleware/authMiddleware");
const router = express.Router();

router.post("/submit-form", checkForAuthenticationCookie("token"), submitForm);
module.exports = router;
