const { sendPdfToUser } = require("../../emailService/formMail");
const Form99 = require("../../model/form99model");
const User = require("../../model/userModel");
const { generateForm99PDF } = require("../formTemplate/form99");

const handleGenerateForm99PDF = async (req, res) => {
  try {
    const userId = req.user.id;

    const formData = await Form99.findOne({ userId });
    if (!formData) {
      return res.status(404).json({
        success: false,
        message: "Form 99 data not found for this user",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pdfBuffer = await generateForm99PDF(formData);


    await sendPdfToUser(
      user.fullName,
      user.email,
      pdfBuffer,
      "Form_99.pdf"
    );

    res.status(200).json({
      success: true,
      message: "PDF generated and sent to email successfully.",
    });
  } catch (error) {
    console.error("Error sending Form99 PDF:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  handleGenerateForm99PDF,
};
