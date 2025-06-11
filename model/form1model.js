const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema({
  petitionNumber: String,
  deceasedName: String,
  deceasedAddress: String,
  deceasedOccupation: String,
  petitionerName: String,
  debtAmount: Number,
  funeralExpenses: Number,
  mortgageEncumbrances: Number,
  totalAmount: Number,
  email: String, 
}, { timestamps: true });

module.exports = mongoose.model("FormSubmission", formSubmissionSchema);
