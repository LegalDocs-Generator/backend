const { sendPdfToUser } = require("../../emailService/formMail");
const Form100 = require("../../model/form100model");
const User = require("../../model/userModel");
const { generateForm100PDF } = require("../formTemplate/form100");

const handleGenerateForm100PDF = async (req, res) => {
  try {
    const userId = req.user.id;

    const formData = await Form100.findOne({ userId });
    if (!formData) {
      return res.status(404).json({
        success: false,
        message: "Form 100 data not found for this user",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pdfBuffer = await generateForm100PDF(formData);

    await sendPdfToUser(
      user.fullName,
      user.email,
      pdfBuffer,
      "Form_100.pdf"
    );

    res.status(200).json({
      success: true,
      message: "PDF generated and sent to email successfully.",
    });
  } catch (error) {
    console.error("Error sending Form100 PDF:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  handleGenerateForm100PDF,
};
