const express = require("express");
const { submitForm98 } = require("../controller/form98controller");
const { submitForm99 } = require("../controller/form99Controller");
const { submitForm100 } = require("../controller/form100controller");
const { submitForm101 } = require("../controller/form101controller");
const { submitForm102 } = require("../controller/form102Controller");
const { submitNotice } = require("../controller/noticeController");

const checkForAuthenticationCookie = require("../authMiddleware/authMiddleware");
const router = express.Router();

router.post("/submit-form98", checkForAuthenticationCookie("token"), submitForm98);
router.post("/submit-form99", checkForAuthenticationCookie("token"), submitForm99);
router.post("/submit-form100", checkForAuthenticationCookie("token"), submitForm100);
router.post("/submit-form101", checkForAuthenticationCookie("token"), submitForm101);
router.post("/submit-form102", checkForAuthenticationCookie("token"), submitForm102);
router.post("/submit-notice", checkForAuthenticationCookie("token"), submitNotice);


module.exports = router;
