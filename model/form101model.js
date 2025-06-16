const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema(
  {
    petitionNumber: String,
    deceasedName: String,
    deceasedName1: String,
    deceasedName2: String,
    deceasedName3: String,
    deceasedName4: String,
    deceasedAddress: String,
    deceasedOccupation: String,
    petitionerName: String,
    relationWithDeeceased: String,
    swearingLocation: String,
    swornDay: Number,
    swornMonth: String,
    swornYear: Number,
    advocateFor: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form101Submission", formSubmissionSchema);
