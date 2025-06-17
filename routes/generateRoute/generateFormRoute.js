const express = require("express");
const { handleGenerateForm97PDF } = require("../../controller/formGeneration/form97");
const { handleGenerateForm98PDF } = require("../../controller/formGeneration/form98");
const { handleGenerateForm99PDF } = require("../../controller/formGeneration/form99");
const { handleGenerateForm100PDF } = require("../../controller/formGeneration/form100");
const { handleGenerateForm101PDF } = require("../../controller/formGeneration/form101");
const { handleGenerateForm102PDF } = require("../../controller/formGeneration/form102");
const { handleSendAllFormsToEmail } = require("../../controller/formGeneration/allFormGeneration");
const router = express.Router();

router.post("/forms/send-97", handleGenerateForm97PDF);
router.post("/forms/send-98", handleGenerateForm98PDF);
router.post("/forms/send-99", handleGenerateForm99PDF);
router.post("/forms/send-100", handleGenerateForm100PDF);
router.post("/forms/send-101", handleGenerateForm101PDF);
router.post("/forms/send-102", handleGenerateForm102PDF);
router.post("/forms/send-all", handleSendAllFormsToEmail);

module.exports = router;
