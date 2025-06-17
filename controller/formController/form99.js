const Form99 = require("../../model/form99model");

const submitForm99 = async (req, res) => {
  try {
    const userId = req.user.id;
    const formData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing.",
      });
    }

    const existingForm = await Form99.findOne({ userId });

    if (existingForm) {
      await Form99.updateOne({ userId }, { $set: formData });

      return res.status(200).json({
        success: true,
        message: "Form 99 updated successfully.",
      });
    } else {
      await Form99.create({ userId, ...formData });

      return res.status(200).json({
        success: true,
        message: "Form 99 submitted successfully.",
      });
    }
  } catch (error) {
    console.error("Error in submitForm99:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const getForm99 = async (req, res) => {
  try {
    const userId = req.user.id;
    const form = await Form99.findOne({ userId });

    if (!form) {
      return res.status(404).json({ success: false, message: "Form 99 not found" });
    }

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    console.error("Error in getForm98:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




module.exports = { submitForm99 ,getForm99};
