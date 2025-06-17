const Form100 = require("../../model/form100model");

const submitForm100 = async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing.",
      });
    }

    const existingForm = await Form100.findOne({ userId });

    if (existingForm) {
      await Form100.updateOne({ userId }, { $set: formData });

      return res.status(200).json({
        success: true,
        message: "Form 100 updated successfully.",
      });
    } else {
      await Form100.create({ userId, ...formData });

      return res.status(200).json({
        success: true,
        message: "Form 100 submitted successfully.",
      });
    }
  } catch (error) {
    console.error("Error in submitForm100:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const getForm100 = async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form100.findOne({ userId });

    if (!form) {
      return res.status(404).json({ success: false, message: "Form 100 not found" });
    }

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    console.error("Error in getForm98:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



module.exports = { submitForm100,getForm100 };
