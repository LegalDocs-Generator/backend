const express = require("express");
const { submitForm98, getForm98 } = require("../../controller/formController/form98");
const { submitForm99, getForm99 } = require("../../controller/formController/form99");
const { submitForm100, getForm100 } = require("../../controller/formController/form100");
const { submitForm101, getForm101 } = require("../../controller/formController/form101");
const { submitForm102, getForm102 } = require("../../controller/formController/form102");
const { submitForm97, getForm97 } = require("../../controller/formController/form97");
const router = express.Router();

router.post("/forms/submit-form98", submitForm98);
router.post("/forms/submit-form99", submitForm99);
router.post("/forms/submit-form100", submitForm100);
router.post("/forms/submit-form101", submitForm101);
router.post("/forms/submit-form102", submitForm102);
router.post("/forms/submit-form97", submitForm97);


router.get("/forms/form97", getForm97);
router.get("/forms/form98", getForm98);
router.get("/forms/form99", getForm99);
router.get("/forms/form100", getForm100);
router.get("/forms/form101", getForm101);
router.get("/forms/form102", getForm102);



module.exports = router;