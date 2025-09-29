const mongoose = require("mongoose");

const form102Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    petitionNumber: {
      type: String,
      // unique: true
      required: true,
    },
    deceasedName: String,
    deceasedAddress: String,
    deceasedOccupation: String,
    petitionerName: String,
    witnessName: String,
    witnessAge: Number,
    witnessAddress: String,
    dateOfDeath: Date,
    swearingLocation: String,
    swornDay: String,
    swornMonth: String,
    swornYear: String,
    advocateFor: String,
  },
  { timestamps: true }
);
form102Schema.index({ userId: 1, petitionNumber: 1 }, { unique: true });
const Form102 = mongoose.model("form102", form102Schema);

module.exports = Form102;
