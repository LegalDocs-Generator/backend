const mongoose = require("mongoose");

const form99Schema = new mongoose.Schema({
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
  funeralExpenses: Number,
  mortgageEncumbrances: Number,
}, { timestamps: true });

const Form99 = mongoose.model("form99", form99Schema);

module.exports = Form99;
