const mongoose = require("mongoose");

const form102Schema = new mongoose.Schema(
  {
    userId: {
  type: mongoose.Schema.Types.ObjectId, 
  required: true,
  unique: true
},

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

const Form102 =  mongoose.model("form102", form102Schema);

module.exports =Form102;
