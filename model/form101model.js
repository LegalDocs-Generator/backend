const mongoose = require("mongoose");

const form101Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    petitionNumber: {
      type: String,
      unique: true
    },
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
    swornDay: String,
    swornMonth: String,
    swornYear: String,
    advocateFor: String,
  },
  { timestamps: true }
);

const Form101 = mongoose.model("form101", form101Schema);

module.exports = Form101;
