const { sendPdfToUser } = require("../../emailService/formMail");
const Form101 = require("../../model/form101model");
const User = require("../../model/userModel");
const { generateForm101PDF } = require("../formTemplate/form101");

const handleGenerateForm101PDF = async (req, res) => {
  try {
    const userId = req.user.id;

    const formData = await Form101.findOne({ userId });
    if (!formData) {
      return res.status(404).json({
        success: false,
        message: "Form 101 data not found for this user",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pdfBuffer = await generateForm101PDF(formData);

    await sendPdfToUser(
      user.fullName,
      user.email,
      pdfBuffer,
      "Form_101.pdf"
    );

    res.status(200).json({
      success: true,
      message: "PDF generated and sent to email successfully.",
    });
  } catch (error) {
    console.error("Error sending Form101 PDF:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  handleGenerateForm101PDF,
};
