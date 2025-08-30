const mongoose = require("mongoose");

const form100Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  petitionNumber: {
    type: String,
    unique: true
  },
  deceasedName: String,
  deceasedAddress: String,
  deceasedOccupation: String,
  petitionerName: String,
  property: Number,
}, { timestamps: true });


const Form100 = mongoose.model("form100", form100Schema);
module.exports = Form100;