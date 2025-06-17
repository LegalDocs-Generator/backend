const { sendPdfToUser } = require("../../emailService/formMail");
const Form102 = require("../../model/form102model");
const User = require("../../model/userModel");
const { generateForm102PDF } = require("../formTemplate/form102");

const handleGenerateForm102PDF = async (req, res) => {
  try {
    const userId = req.user.id;

    const formData = await Form102.findOne({ userId });
    if (!formData) {
      return res.status(404).json({
        success: false,
        message: "Form 102 data not found for this user",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pdfBuffer = await generateForm102PDF(formData);

    await sendPdfToUser(
      user.fullName,
      user.email,
      pdfBuffer,
      "Form_102.pdf"
    );

    res.status(200).json({
      success: true,
      message: "PDF generated and sent to email successfully.",
    });
  } catch (error) {
    console.error("Error sending Form102 PDF:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  handleGenerateForm102PDF,
};
