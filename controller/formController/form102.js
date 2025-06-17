const Form102 = require("../../model/form102model");

const submitForm102 = async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing.",
      });
    }

    const existingForm = await Form102.findOne({ userId });

    if (existingForm) {
      await Form102.updateOne({ userId }, { $set: formData });

      return res.status(200).json({
        success: true,
        message: "Form 102 updated successfully.",
      });
    } else {
      await Form102.create({ userId, ...formData });

      return res.status(200).json({
        success: true,
        message: "Form 102 submitted successfully.",
      });
    }
  } catch (error) {
    console.error("Error in submitForm102:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const getForm102 = async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form102.findOne({ userId });

    if (!form) {
      return res.status(404).json({ success: false, message: "Form 102 not found" });
    }

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    console.error("Error in getForm98:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



module.exports = { submitForm102,getForm102 };
