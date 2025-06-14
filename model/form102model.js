const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema(
  {
    petitionNumber: String,
    deceasedName: String,
    deceasedAddress: String,
    deceasedOccupation: String,
    petitionerName: String,
    witnessName: String,
    witnessAge: Number,
    witnessAddress: String,
    dateOfDeath: String,
    swearingLocation: String,
    swornDay: Number,
    swornMonth: String,
    advocateFor: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form102Submission", formSubmissionSchema);
