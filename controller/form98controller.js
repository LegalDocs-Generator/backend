const puppeteer = require("puppeteer");
const FormSubmission = require("../model/form98model");
const { sendPdfToUser } = require("../emailService/formMail");

const generateForm98PDF = async (data) => {
  function sumArray(arr, key) {
    if (!Array.isArray(arr)) return 0;
    return arr.reduce((sum, item) => {
      const value = parseFloat(item[key]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
  }

  const {
    petitionNumber = "..................................",
    deceasedName = "..................................",
    deceasedAddress = "..................................",
    deceasedOccupation = "..................................",
    petitionerName = "..................................",
    movableAssets = {},
    bankAccounts = [],
    fixedDeposits = [],
    immovableProperty = [],
    debenture = [],
    mutualFunds = [],
    mutualFundsMissedDividends = [],
    royalties = [],
    otherAssets = {},
    deductedLiabilities = "",
  } = data;

  const {
    cashInHouse = 0,
    householdGoods = 0,
    wearingApparel = 0,
    books = 0,
    plates = 0,
    jewels = 0,
    furniture = 0,
  } = movableAssets || {};

  const movableTotal =
    parseFloat(cashInHouse || 0) +
    parseFloat(householdGoods || 0) +
    parseFloat(wearingApparel || 0) +
    parseFloat(books || 0) +
    parseFloat(plates || 0) +
    parseFloat(jewels || 0) +
    parseFloat(furniture || 0);

  const {
    adaniAccountNumber = "..............",
    adaniSecurityDeposit = "..............",
    mahanagarGPBearingBPNo = "..............",
    mahanagarBearingCANo = "..............",
    mahanagarSecurityDeposit = "..............",
    mahanagarGPBPNo = "..............",
    mahanagarCANo = "..............",
    simCardNumber = "..............",
  } = otherAssets;

  data.totalBankValue = sumArray(data.bankAccounts, "value");
  data.totalFixedDepositValue = sumArray(data.fixedDeposits, "value");
  data.totalImmovableValue = sumArray(data.immovableProperty, "value");
  data.totalDebentureValue = sumArray(data.debenture, "value");
  data.totalMutualFundValue = sumArray(data.mutualFunds, "currentValue");
  data.totalMissedDividend = sumArray(
    data.mutualFundsMissedDividends,
    "UnclaimedAmount"
  );
  data.totalRoyaltiesIncome = sumArray(data.royalties, "earnedIncome");

  data.totalAssets =
    data.totalBankValue +
    data.totalFixedDepositValue +
    data.totalImmovableValue +
    data.totalDebentureValue +
    data.totalMutualFundValue +
    data.totalMissedDividend +
    data.totalRoyaltiesIncome;

  // // If you have liabilities
  // const funeral = parseFloat(data.funeralExpenses || 0);
  // const mortgage = parseFloat(data.mortgageEncumbrances || 0);
  // data.deductedLiabilities = funeral + mortgage;

  data.netAssets = data.totalAssets - data.deductedLiabilities;

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 1.5cm;
      font-size: 13px;
      position: relative;
    }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 5px; border: 1px dotted black; }
    td, th { padding: 3px; border: 1px dotted black; vertical-align: top; }
    .section-title { font-weight: bold; margin-top: 20px; }
    .page-break { page-break-before: always; }
    .yellow {
         background: yellow;
        font-size: 14px;
        margin-left: 5px;
       font-weight: bold; 
       margin-top: 20px;
       display: flex;
}

  </style>
</head>
<body>

<!-- Page 1 -->
<div class="center">
  <div>Schedule of property of the deceased</div>
  <div style="font-size:11px;">(see Rule 374, 375 and 376)</div>
  <br>
  <div>No. 98</div>
  <div>IN THE HIGH COURT OF JUDICATURE AT BOMBAY</div>
  <br>
  <div>TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. <span class="bold">${petitionNumber}</span> of 2020</div>
</div>

<br>
<div style="margin-left: 150px;">
  Petition for probate of a will of <span class="bold">${deceasedName}</span> resident <span class="bold">${deceasedAddress}</span> having occupation of <span class="bold">${deceasedOccupation}</span> Deceased
</div>
<br>
<div class="right"><span class="bold">${petitionerName}</span> Petitioner</div>
<br>
<div class="center">SCHEDULE No. I</div>
<div class="center">Schedule of Property</div>
<div>Valuation of the movable and immovable property of the deceased.</div>

<hr>
<div style="display: flex; justify-content: flex-end; gap: 60px;">
  <div>Rs.</div>
  <div>P</div>
</div>
<hr>

<!-- All tables and values stay on Page 1 -->
<div class="section-title">Cash in house, household goods, wearing apparel, books, plate, jewels</div>
<table>
  <tr><td>Cash in house</td><td>Rs. ${
    !isNaN(parseFloat(cashInHouse)) ? parseFloat(cashInHouse).toFixed(2) : "0"
  }</td></tr>

  <tr><td>Household Goods</td><td>Rs. ${
    !isNaN(parseFloat(householdGoods))
      ? parseFloat(householdGoods).toFixed(2)
      : "0"
  }</td></tr>

  <tr><td>Wearing apparel</td><td>Rs. ${
    !isNaN(parseFloat(wearingApparel))
      ? parseFloat(wearingApparel).toFixed(2)
      : "0"
  }</td></tr>

  <tr><td>Books</td><td>Rs. ${
    !isNaN(parseFloat(books)) ? parseFloat(books).toFixed(2) : "0"
  }</td></tr>
  <tr><td>Plates</td><td>Rs. ${
    !isNaN(parseFloat(plates)) ? parseFloat(plates).toFixed(2) : "0"
  }</td></tr>
  <tr><td>Jewel</td><td>Rs. ${
    !isNaN(parseFloat(jewels)) ? parseFloat(jewels).toFixed(2) : "0"
  }</td></tr>
  <tr><td>Furniture</td><td>Rs. ${
    !isNaN(parseFloat(furniture)) ? parseFloat(furniture).toFixed(2) : "0"
  }</td></tr>
  <tr class="bold"><td>Total</td><td>Rs. ${
    !isNaN(parseFloat(movableTotal)) ? parseFloat(movableTotal).toFixed(2) : "0"
  }</td></tr>
</table>

<div class="section-title">Bank Accounts</div>
<table>
  <tr><th>Bank</th><th>Account No</th><th>Current Value</th></tr>
  ${bankAccounts
    ?.map(
      (account) => `
    <tr><td>${account.bankName || " "}</td><td>${
        account.accountNumber || " "
      }</td><td>${parseFloat(account.value || 0).toFixed(2)}</td></tr>
  `
    )
    .join("")}
  <tr class="bold"><td colspan="2">Total</td><td>${parseFloat(
    data.totalBankValue || 0
  ).toFixed(2)}</td></tr>
</table>

<div class="section-title">Fixed Deposits</div>
<table>
  <tr><th>Bank</th><th>Receipt/Certificate Details</th><th>Current Value</th></tr>
  ${fixedDeposits
    ?.map(
      (fd) => `
    <tr><td>${fd.bankName || " "}</td><td>${
        fd.receiptDetails || " "
      }</td><td>${parseFloat(fd.value || 0).toFixed(2)}</td></tr>
  `
    )
    .join("")}
  <tr class="bold"><td colspan="2">Total</td><td>${parseFloat(
    data.totalFixedDepositValue || 0
  ).toFixed(2)}</td></tr>
</table>

<div class="section-title">Government Securities—</div>
<p>${data.governmentSecurities || "None"}</p>

<div class="section-title">Immovable Property—</div>
<table>
  <tr><th>Description</th><th>Assessed Value</th></tr>
  ${immovableProperty
    ?.map(
      (prop) => `
    <tr><td>${prop.description || " "}</td><td>${parseFloat(
        prop.value || 0
      ).toFixed(2)}</td></tr>
  `
    )
    .join("")}
  <tr class="bold"><td>Total</td><td>${parseFloat(
    data.totalImmovableValue || 0
  ).toFixed(2)}</td></tr>
</table>

<div class="section-title">Leasehold Property—</div>
<p>${data.leaseholdProperty || "None"}</p>

<div class="section-title">Shares of Joint Stock Companies—</div>
<p>${data.shareHolding || "Demat Account Details: ________"}</p>

<div>Below details is not required per se can be ignored.</div>
<div class="yellow">Stocks Missed Dividends</div>

<div ><span class="section-title">Policy of Insurance,</span>
upon life, money out on mortgage and other securi­ties, such as bonds, mortgages, bills, notes and other securities for money - (State the amount of the whole; also the interest separately calculating it up to the time of making the application).</div>

<div class="section-title">Debenture/Bond</div>
<table>
  ${debenture
    ?.map(
      (prop) => `
    <tr><td>${prop.description || " "}</td><td>${parseFloat(
        prop.value || 0
      ).toFixed(2)}</td></tr>
  `
    )
    .join("")}
  <tr class="bold"><td>Total</td><td>${parseFloat(
    data.totalDebentureValue || 0
  ).toFixed(2)}</td></tr>
</table>


<div class="section-title">Mutual Funds</div>
<table>
  <tr><th>Folio</th><th>Scheme Name</th><th>Current units</th><th>Current NAV (Rs.)</th><th>Current value (Rs.)</th></tr>
  ${mutualFunds
    ?.map(
      (mf) => `
    <tr><td>${mf.folio}</td><td>${mf.schemeName}</td><td>${
        mf.currentUnits
      }</td><td> ${parseFloat(mf.currentNav || 0).toFixed(
        2
      )}</td><td>${parseFloat(mf.currentValue || 0).toFixed(2)}</td></tr>
  `
    )
    .join("")}
</table>

<div  class="yellow">Mutual Fund Missed Dividends</div>
<table>
  <tr><th>Folio</th><th>Unclaimed Scheme</th><th>Unclaimed Amount (Rs.)</th></tr>
  ${mutualFundsMissedDividends
    ?.map(
      (div) => `
    <tr><td>${div.folio}</td><td>${
        div.UnclaimedSchemeName
      }</td><td>${parseFloat(div.UnclaimedAmount || 0).toFixed(2)}</td></tr>
  `
    )
    .join("")}
</table>

<div class="section-title">Royalties / Fees from Sale of Books</div>
<table>
  <tr><th>Sr No</th><th>Book Name</th><th>Earned Income</th></tr>
  ${royalties
    ?.map(
      (royalty, index) => `
    <tr><td>${index + 1}</td><td>${royalty.bookName}</td><td>${parseFloat(
        royalty.earnedIncome || 0
      ).toFixed(2)}</td></tr>
  `
    )
    .join("")}
  <tr class="bold"><td colspan="2">Total</td><td>${parseFloat(
    data.totalRoyaltiesIncome || 0
  ).toFixed(2)}</td></tr>
</table>

<div class="section-title">Other Assets:</div>
<ol>
  <li>Adani Electricity Account Number: ${
    adaniAccountNumber || "............."
  }</li>
  <li>Security Deposit of ${
    adaniSecurityDeposit || "............."
  } or Adani Electricity Account Number  ${
    adaniAccountNumber || "............."
  }</li>
  <li>Mahanagar Gas connection bearing BP No. : ${
    mahanagarGPBearingBPNo || "............."
  } / CA No.: ${mahanagarBearingCANo || "............."}</li>
  <li>Security Deposit of Rs ${
    mahanagarSecurityDeposit || "............."
  }for Mahanagar Gas connection BP No. : ${
    mahanagarGPBPNo || "............."
  } / CA No. :  ${mahanagarCANo || "............."} </li>
  <li>SIM Card Number: ${simCardNumber || "............."}</li>
</ol>

<div class="right">Total:-${data.totalAssets}</span></div>
<div class="right">Deduct Amount shown in Schedule No II., not subject to any Duty:-  <span>${deductedLiabilities}</span></div>
<div class="right">Net Total:- <span>${data.netAssets}</span></div>


<div style="text-align: left; margin-top: auto; margin-bottom: 0;">
    Petitioner: <span class="bold">${petitionerName}</span>
  </div>

</body>
</html>`;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "40px",
      bottom: "40px",
      left: "50px",
      right: "50px",
    },
  });

  await browser.close();
  return pdfBuffer;
};

const submitForm98 = async (req, res) => {
  try {
    const data = req.body;
    const pdfBuffer = await generateForm98PDF(data);

    await FormSubmission.create(data);

    await sendPdfToUser(
      req.user.fullName,
      req.user.email,
      pdfBuffer,
      "PropertyForm.pdf"
    );

    res.status(200).json({
      success: true,
      message: "Form submitted and PDF sent successfully.",
    });
  } catch (error) {
    console.error("Error in submitForm:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { submitForm98 };
