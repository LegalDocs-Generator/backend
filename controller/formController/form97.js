const Form97 = require("../../model/form97model");

const submitForm97 = async (req, res) => {
  try {
    const userId = req.user.id; 
    const formData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing.",
      });
    }

    const existingForm = await Form97.findOne({ userId });

    if (existingForm) {
      await Form97.updateOne({ userId }, { $set: formData });
      return res.status(200).json({
        success: true,
        message: "Form updated successfully.",
      });
    } else {
      await Form97.create({ userId, ...formData });
      return res.status(200).json({
        success: true,
        message: "Form created successfully.",
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


const getForm97 = async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form97.findOne({ userId });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form 97 not found",
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


module.exports = { submitForm97 ,getForm97, };
