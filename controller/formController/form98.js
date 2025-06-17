const Form98 = require("../../model/form98model");

const submitForm98 = async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing.",
      });
    }

    const existingForm = await Form98.findOne({ userId });

    if (existingForm) {
      await Form98.updateOne({ userId }, { $set: formData });

      return res.status(200).json({
        success: true,
        message: "Form updated successfully.",
      });
    } else {
      await Form98.create({ userId, ...formData });

      return res.status(200).json({
        success: true,
        message: "Form submitted and PDF sent successfully.",
      });
    }
  } catch (error) {
    console.error("Error in submitForm:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const getForm98 = async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form98.findOne({ userId });

    if (!form) {
      return res.status(404).json({ success: false, message: "Form 98 not found" });
    }

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    console.error("Error in getForm98:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



module.exports = { submitForm98,getForm98 };
