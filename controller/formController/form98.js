const Form98 = require("../../model/form98model");

const submitForm98 = async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;
    const { petitionNumber } = formData;

    if (!petitionNumber) {
      return res.status(400).json({
        success: false,
        message: "Petition number is required.",
      });
    }

    const existingForm = await Form98.findOne({ userId, petitionNumber });

    if (existingForm) {
      await Form98.updateOne(
        { userId, petitionNumber },
        { $set: formData }
      );

      return res.status(200).json({
        success: true,
        message: "Form 98 updated successfully.",
      });
    } else {
      await Form98.create({ userId, ...formData });

      return res.status(201).json({
        success: true,
        message: "Form 98 created successfully.",
      });
    }
  } catch (error) {
    console.error("Error in submitForm98:", error.message);
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
    const { petitionNumber } = req.params;

    if (!petitionNumber) {
      return res.status(400).json({
        success: false,
        message: "Petition number is required.",
      });
    }

    const form = await Form98.findOne({ userId, petitionNumber });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form 98 not found for this petition number",
      });
    }

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    console.error("Error in getForm98:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { submitForm98, getForm98 };