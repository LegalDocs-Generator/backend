const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema({
  petitionNumber: String,
  deceasedName: String,
  deceasedAddress: String,
  deceasedOccupation: String,
  petitionerName: String,
  funeralExpenses: Number,
  mortgageEncumbrances: Number,
}, { timestamps: true });

module.exports = mongoose.model("Form99Submission", formSubmissionSchema);
