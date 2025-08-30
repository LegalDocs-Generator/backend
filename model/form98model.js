const mongoose = require("mongoose");

const form98Schema = new mongoose.Schema(
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
    deceasedAddress: String,
    deceasedOccupation: String,
    petitionerName: String,
    movableAssets: {
      cashInHouse: Number,
      householdGoods: Number,
      wearingApparel: Number,
      books: Number,
      plates: Number,
      jewels: Number,
      furniture: Number,
    },
    bankAccounts: [
      {
        bankName: String,
        accountNumber: String,
        value: Number,
      },
    ],
    fixedDeposits: [
      {
        bankName: String,
        receiptDetails: String,
        value: Number,
      },
    ],
    immovableProperty: [
      {
        description: String,
        value: Number,
      },
    ],
    debenture: [
      {
        description: String,
        value: Number,
      },
    ],
    mutualFunds: [
      {
        folio: String,
        schemeName: String,
        currentUnits: Number,
        currentNav: Number,
        currentValue: Number,
      },
    ],
    mutualFundsMissedDividends: [
      {
        folio: String,
        UnclaimedSchemeName: String,
        UnclaimedAmount: Number,
      },
    ],

    royalties: [
      {
        bookName: String,
        earnedIncome: Number,
      },
    ],
    otherAssets: {
      adaniAccountNumber: String,
      adaniSecurityDeposit: Number,
      mahanagarGPBearingBPNo: String,
      mahanagarBearingCANo: String,
      mahanagarSecurityDeposit: Number,
      mahanagarGPBPNo: String,
      mahanagarCANo: String,
      simCardNumber: String,
    },

    totalBankValue: Number,
    totalFixedDepositValue: Number,
    totalImmovableValue: Number,
    totalDebentureValue: Number,
    totalMutualFundValue: Number,
    totalRoyaltiesIncome: Number,
    totalMissedDividend: Number,

    totalAssets: Number,
    deductedLiabilities: Number,
    netAssets: Number,
  },
  { timestamps: true }
);

const Form98 = mongoose.model("form98", form98Schema);
module.exports = Form98;