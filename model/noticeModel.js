const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  petitionNumber: String,
  petitionYear: Number,

  //Deceased details
  deceasedFullName: String,
  deceasedNationality: String,
  deceasedAddress: String,
  deceasedsect: String, // if deceased is muslim
  deceasedMaritalStatus: {
  type: String,
  enum: ["Married", "Unmarried", "Widowed", "Divorced", "Separated"],
},
  deceasedOccupation: String,
  deceasedRescidenceAtTimeOfDeath: String,
  isDeceasedBachelor:Boolean,
  isDeceasedspinster:Boolean,
  deceasedDeathDate:Number,
  deceasedDeathMonth:String,
  deceasedDeathYear:Number,


  exhibitNumber1: String,
  exhibitNumber2: String,  
  placeOfAbode:String,


  //Petitoner details
  petitionerFullName: String,
  petitionerage:Number,
  petitionerNationality:String,
  petitionerDomicile:String,
  petitionerFullAddress:String,
  petitionerOccupation:String,
  executor:{
    type:String,
    enum:[
      "soleExecutor", "oneOfTheExecutor","soleSurvivingExecutors","allExecutor"
    ]
  },

  exhibitNumber3: String,
  exhibitNumber4: String,
  placeOfExecutionOfWill:String,
  ExecutionDate:Number,
  ExecutionMonth:String,
  ExecutionYear:Number,

  capacity:{
    type:String,
    enum:["soleExecutor","oneOfExecutor"]
  },
  exhibitNumber5: String,
  exhibitNumber6: String,
  exhibitNumber7: String,
  schduleAmount:Number,
  lawApplicableToTheDeceased:String,

  person:[
    {
      fullName:String,
      address:String,
      age:Number,
      relationshipWithDeceased:String,
    }

  ],

  swornPlace:String,
  swornDate:Number,
  swornMonth:String,
  swornYear:Number,
  statedPara:String,
  remainingPara:String,

}, { timestamps: true });

module.exports = mongoose.model("notice", noticeSchema);
