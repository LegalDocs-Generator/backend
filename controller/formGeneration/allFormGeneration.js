const Form97 = require("../../model/form97model");
const Form98 = require("../../model/form98model");
const Form99 = require("../../model/form99model");
const Form100 = require("../../model/form100model");
const Form101 = require("../../model/form101model");
const Form102 = require("../../model/form102model");
const User = require("../../model/userModel");
const { generatePDFfromHTML } = require("../../utils/puppeteerService");
const { getForm100HTML } = require("../formTemplate/form100");
const { getForm101HTML } = require("../formTemplate/form101");
const { getForm102HTML } = require("../formTemplate/form102");
const { getForm97HTML } = require("../formTemplate/form97");
const { getForm98HTML } = require("../formTemplate/form98");
const { getForm99HTML } = require("../formTemplate/form99");
const { sendPdfToUser } = require("../../emailService/formMail");

const handleSendAllFormsToEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || !user.email || !user.fullName) {
      return res.status(404).json({ success: false, message: "User or email/fullName not found." });
    }

    const forms = [
      { number: 97, model: Form97, getHtml: getForm97HTML },
      { number: 98, model: Form98, getHtml: getForm98HTML },
      { number: 99, model: Form99, getHtml: getForm99HTML },
      { number: 100, model: Form100, getHtml: getForm100HTML },
      { number: 101, model: Form101, getHtml: getForm101HTML },
      { number: 102, model: Form102, getHtml: getForm102HTML },
    ];

    let combinedHtml = "";
    let includedCount = 0;

    for (let i = 0; i < forms.length; i++) {
      const formData = await forms[i].model.findOne({ userId });
      if (!formData) {
        console.log(`Form ${forms[i].number} not found for user ${userId}, skipping.`);
        continue; // skip missing forms
      }

      includedCount++;
      const html = await forms[i].getHtml(formData);

      if (combinedHtml) combinedHtml += `<div style="page-break-before: always;"></div>`;
      combinedHtml += html;
    }

    if (includedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "No forms submitted yet. Please complete the forms before generating PDFs."
      });
    }

    const pdfBuffer = await generatePDFfromHTML(combinedHtml);
    await sendPdfToUser(user.fullName, user.email, pdfBuffer, `AllForms.pdf`);

    return res.status(200).json({
      success: true,
      message: `${includedCount} form(s) combined PDF sent to email.`,
    });

  } catch (error) {
    console.error("Error sending all forms:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



module.exports = { handleSendAllFormsToEmail };
