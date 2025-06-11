const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema(
  {
    petitionNumber: String,
    deceasedName: String,
    deceasedAddress: String,
    deceasedOccupation: String,
    willExecutor: String,
    cashInHouse: Number,
    houseGoodsAmount: Number,
    wearingApparelAmount: Number,
    booksAmount: Number,
    platesAmount: Number,
    jewelAmount: Number,
    furnitureAmount: Number,
    totalAssets: Number,
    bank1AccountNo:String,
    bank1AccountNo:String,
    bank1CurrentValue:Number,
    bank2CurrentValue:Number,
    totalBankAmount:Number,
    bank1reciptDetail:String,
    bank2receiptDetail:String,
    bank1FixdepositCurrentValue:Number,
    bank2FixdepositCurrentValue:Number,
    totalFixdepositAmount:Number,



  },
  { timestamps: true }
);

module.exports = mongoose.model("Form98Submission", formSubmissionSchema);
