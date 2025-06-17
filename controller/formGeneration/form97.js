const { sendPdfToUser } = require("../../emailService/formMail");
const Form97 = require("../../model/form97model");
const User = require("../../model/userModel");
const { generateForm97PDF } = require("../formTemplate/form97");

const handleGenerateForm97PDF = async (req, res) => {
  try {
    const userId = req.user.id;

    const formData = await Form97.findOne({ userId });
    if (!formData) {
      return res.status(404).json({
        success: false,
        message: "Form 97 data not found for this user",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pdfBuffer = await generateForm97PDF(formData);

    await sendPdfToUser(
      user.fullName,
      user.email,
      pdfBuffer,
      "Form_97.pdf"
    );

    res.status(200).json({
      success: true,
      message: "PDF generated and sent to email successfully.",
    });
  } catch (error) {
    console.error("Error sending Form97 PDF:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  handleGenerateForm97PDF,
};
