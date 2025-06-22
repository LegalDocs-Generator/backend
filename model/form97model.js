const mongoose = require("mongoose");

const form97Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    petitionNumber: String,
    petitionYear: Number,

    deceasedFullName: String,
    deceasedNationality: String,
    deceasedAddress: String,
    deceasedReligion: String,
    deceasedsect: String,
    deceasedMaritalStatus: {
      type: String,
      enum: ["Married", "Unmarried", "Widowed", "Divorced", "Separated"],
      default: "Married",
    },
    deceasedstatus: {
      type: String,
      enum: ["Bachelor", "Spinster"],
      default: "Bachelor",
      
    },
    deceasedOccupation: String,
    deceasedRescidenceAtTimeOfDeath: String,
    deceasedDeathDate: String,
    deceasedDeathMonth: String,
    deceasedDeathYear: String,

    exhibitNumber1: String,
    exhibitNumber2: String,
    placeOfAbode: String,

    //Petitoner details
    petitionerFullName: String,
    petitionerage: Number,
    petitionerNationality: String,
    petitionerDomicile: String,
    petitionerFullAddress: String,
    petitionerOccupation: String,
    executor: {
      type: String,
      enum: [
        "soleExecutor",
        "oneOfTheExecutor",
        "soleSurvivingExecutors",
        "allExecutor",
      ],
      default: "soleExecutor",
    },

    exhibitNumber3: String,
    exhibitNumber4: String,
    placeOfExecutionOfWill: String,
    ExecutionDate: String,
    ExecutionMonth: String,
    ExecutionYear: String,

    capacity: {
      type: String,
      enum: ["soleExecutor", "oneOfExecutor"],
      default: "soleExecutor",
    },
    exhibitNumber5: String,
    exhibitNumber6: String,
    exhibitNumber7: String,
    schduleAmount: Number,
    lawApplicableToTheDeceased: String,

    person: [
      {
        fullName: String,
        address: String,
        age: Number,
        relationshipWithDeceased: String,
      },
    ],

    swornPlace: String,
    swornDate: String,
    swornMonth: String,
    swornYear: String,
    statedPara: String,
    remainingPara: String,
  },
  { timestamps: true }
);

const Form97 = mongoose.model("form97", form97Schema);
module.exports = Form97;
