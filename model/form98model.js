const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema(
  {
    petitionNumber: Number,
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
      total: Number,
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
    securities: [
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
    totalSecuritiesValue: Number,
    // totalMutualFundValue: Number,
    totalRoyaltiesIncome: Number,
    // totalMissedDividend: Number,

    totalAssets: Number,
    deductedLiabilities: Number,
    netAssets: Number,
  },
  { timestamps: true }
);



formSubmissionSchema.pre("save", function (next) {
  // Helper function to calculate sum
  const sumArray = (arr, key) =>
    Array.isArray(arr) ? arr.reduce((acc, item) => acc + (item[key] || 0), 0) : 0;

  this.totalBankValue = sumArray(this.bankAccounts, "value");
  this.totalFixedDepositValue = sumArray(this.fixedDeposits, "value");
  this.totalImmovableValue = sumArray(this.immovableProperty, "value");
  this.totalSecuritiesValue = sumArray(this.securities, "value");
  // this.totalMutualFundValue = sumArray(this.mutualFunds, "currentValue");
  this.totalRoyaltiesIncome = sumArray(this.royalties, "earnedIncome");
  // this.totalMissedDividend = sumArray(this.mutualFundsMissedDividends, "UnclaimedAmount");

  // Optional: Automatically calculate totalAssets and netAssets
  this.totalAssets =
    (this.movableAssets?.total || 0) +
    this.totalBankValue +
    this.totalFixedDepositValue +
    this.totalImmovableValue +
    this.totalSecuritiesValue +
    this.totalMutualFundValue +
    this.totalRoyaltiesIncome;

  this.netAssets = this.totalAssets - (this.deductedLiabilities || 0);

  next();
});


module.exports = mongoose.model("Form98Submission", formSubmissionSchema);
