const Form97 = require("../../model/form97model");

const submitForm97 = async (req, res) => {
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

    const existingForm = await Form97.findOne({ userId, petitionNumber });

    if (existingForm) {
      await Form97.updateOne(
        { userId, petitionNumber },
        { $set: formData }
      );
      return res.status(200).json({
        success: true,
        message: "Form updated successfully.",
      });
    } else {
      await Form97.create({ userId, ...formData });
      return res.status(201).json({
        success: true,
        message: "Form created successfully.",
      });
    }
  } catch (error) {
    console.error("Error in submitForm97:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getForm97 = async (req, res) => {
  try {
    const userId = req.user.id;
    const { petitionNumber } = req.params;

    if (!petitionNumber) {
      return res.status(400).json({
        success: false,
        message: "Petition number is required.",
      });
    }

    const form = await Form97.findOne({ userId, petitionNumber });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form 97 not found for this petition number",
      });
    }

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    console.error("Error in getForm97:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { submitForm97, getForm97 };
