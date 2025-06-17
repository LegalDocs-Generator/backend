const { sendPdfToUser } = require("../../emailService/formMail");
const Form98 = require("../../model/form98model");
const User = require("../../model/userModel");
const { generateForm98PDF } = require("../formTemplate/form98");

const handleGenerateForm98PDF = async (req, res) => {
  try {
    const userId = req.user.id;

    const formData = await Form98.findOne({ userId });
    if (!formData) {
      return res.status(404).json({
        success: false,
        message: "Form 98 data not found for this user",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pdfBuffer = await generateForm98PDF(formData);

    await sendPdfToUser(
      user.fullName,
      user.email,
      pdfBuffer,
      "Form_98.pdf"
    );

    res.status(200).json({
      success: true,
      message: "PDF generated and sent to email successfully.",
    });
  } catch (error) {
    console.error("Error sending Form98 PDF:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  handleGenerateForm98PDF,
};
