const mongoose = require("mongoose");

const form97Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    petitionNumber: {
      type: String,
      // unique: true,
      required: true,
    },
    petitionYear: Number,
    deceasedFullName: String,
    deceasedNationality: String,
    deceasedAddress: String,
    deceasedReligion: {
      type: String,
      enum: ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain"],
    },
    deceasedSect: String,
    deceasedMaritalStatus: {
      type: String,
      enum: ["Married", "Widowed", "Divorced", "Separated", "Bachelor", "Spinster", "Widower"],
      default: "Married",
    },
    deceasedOccupation: String,
    deceasedResidenceAtTimeOfDeath: String,
    deceasedDeathDate: String,
    deceasedDeathMonth: String,
    deceasedDeathYear: String,
    religionAtBirth: String,
    religionAtWill: String,
    religionAtDeath: String,
    exhibitNumber1: String,
    exhibitNumber2: String,
    placeOfAbode: String,
    petitionerFullName: String,
    petitionerage: Number,
    petitionerNationality: String,
    petitionerDomicile: String,
    petitionerFullAddress: String,
    petitionerOccupation: String,
    executorRole: {
      type: String,
      enum: ["soleExecutor", "oneOfTheExecutor", "soleSurvivingExecutors", "allExecutor"],
      default: "soleExecutor",
    },
    executors: [
      {
        fullName: String,
        age: Number,
        address: String,
        occupation: String,
        isPetitioner: { type: Boolean, default: false },
      },
    ],
    executorExplanation: String,
    executorAnnexure: String,
    deathCertificateAnnexure: String,
    exhibitNumber3: String,
    exhibitNumber4: String,
    placeOfExecutionOfWill: String,
    executionDate: String,
    executionMonth: String,
    executionYear: String,
    willCopyType: {
      type: String,
      enum: ["Original", "Photocopy", "Certified Copy"],
      default: "Original",
    },
    willUnavailabilityReason: String,
    exhibitNumber5: String,
    exhibitNumber6: String,
    exhibitNumber7: String,
    annexures: [String],
    scheduleAmount: Number,
    lawApplicableToTheDeceased: {
      type: String,
      enum: [
        "Indian Succession Act, 1925",
        "Hindu Succession Act, 1956",
        "Muslim Personal Law (Shariat) Application Act, 1937",
      ],
    },
    person: [
      {
        fullName: String,
        address: String,
        age: Number,
        relationshipWithDeceased: String,
      },
    ],
    identityProof: String,
    identityProofUnavailableReason: String,
    annexureForIdentityProof: String,
    swornPlace: String,
    swornDate: String,
    swornMonth: String,
    swornYear: String,
    statedPara: String,
    remainingPara: String,
  },
  { timestamps: true }
);
form97Schema.index({ userId: 1, petitionNumber: 1 }, { unique: true });
const Form97 = mongoose.model("form97", form97Schema);
module.exports = Form97;
