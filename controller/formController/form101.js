const Form101 = require("../../model/form101model");

const submitForm101 = async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing.",
      });
    }

    const existingForm = await Form101.findOne({ userId });

    if (existingForm) {
      await Form101.updateOne({ userId }, { $set: formData });

      return res.status(200).json({
        success: true,
        message: "Form 101 updated successfully.",
      });
    } else {
      await Form101.create({ userId, ...formData });

      return res.status(200).json({
        success: true,
        message: "Form 101 submitted successfully.",
      });
    }
  } catch (error) {
    console.error("Error in submitForm101:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getForm101 = async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form101.findOne({ userId });

    if (!form) {
      return res.status(404).json({ success: false, message: "Form 101 not found" });
    }

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    console.error("Error in getForm98:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



module.exports = { submitForm101,getForm101 };
