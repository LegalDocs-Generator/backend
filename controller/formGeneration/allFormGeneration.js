const { generateForm97PDF } = require("../formTemplate/form97");
const { generateForm98PDF } = require("../formTemplate/form98");
const { generateForm99PDF } = require("../formTemplate/form99");
const { generateForm100PDF } = require("../formTemplate/form100");
const { generateForm102PDF } = require("../formTemplate/form102");
const { generateForm101PDF } = require("../formTemplate/form101");
const User = require("../../model/userModel");
const { sendPdfToUser } = require("../../emailService/formMail");
const Form97 = require("../../model/form97model");
const Form98 = require("../../model/form98model");
const Form99 = require("../../model/form99model");
const Form100 = require("../../model/form100model");
const Form101 = require("../../model/form101model");
const Form102 = require("../../model/form102model");


const handleSendAllFormsToEmail = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(404).json({ success: false, message: "User or email not found." });
    }

    const forms = [
      { number: 97, model: Form97, generator: generateForm97PDF },
      { number: 98, model: Form98, generator: generateForm98PDF },
      { number: 99, model: Form99, generator: generateForm99PDF },
      { number: 100, model: Form100, generator: generateForm100PDF },
      { number: 101, model: Form101, generator: generateForm101PDF },
      { number: 102, model: Form102, generator: generateForm102PDF },
    ];

    let successCount = 0;
    const formsToDelete = [];

    for (const form of forms) {
      const formData = await form.model.findOne({ userId });
      if (formData) {
        const pdfBuffer = await form.generator(formData);
        const sent = await sendPdfToUser(
          user.fullName,
          user.email,
          pdfBuffer,
          `Form_${form.number}.pdf`
        );

        if (sent) {
          successCount++;
          formsToDelete.push(form.model); 
        }
      }
    }

    if (formsToDelete.length > 0) {
      await Promise.all(
        formsToDelete.map((model) => model.deleteMany({ userId }))
      );
    }

    return res.status(200).json({
      success: true,
      message: `${successCount} form PDF(s) sent to your email and data deleted.`,
    });
  } catch (error) {
    console.error("Error sending and deleting forms:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending forms.",
      error: error.message,
    });
  }
};

module.exports = { handleSendAllFormsToEmail };
