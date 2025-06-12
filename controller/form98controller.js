const puppeteer = require("puppeteer");
const FormSubmission = require("../model/form98model");
const { sendPdfToUser } = require("../emailService/formMail");

const generateForm98PDF = async (data) => {
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
  securities = [],
  mutualFunds = [],
  mutualFundsMissedDividends = [],
  royalties = [],
  otherAssets = {},
  totalAssets = "..................................",
  deductedLiabilities = "..................................",
  netAssets = "..................................",
} = data;

const {
  cashInHouse = "..................................",
  householdGoods = "..............",
  wearingApparel = "..............",
  books = "..............",
  plates = "..............",
  jewels = "..............",
  furniture = "..............",
  total: movableTotal = "..............",
} = movableAssets;

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
  <tr><td>Cash in house</td><td>${cashInHouse}</td></tr>
  <tr><td>Household Goods</td><td>${householdGoods}</td></tr>
  <tr><td>Wearing apparel</td><td>${wearingApparel}</td></tr>
  <tr><td>Books</td><td>${books}</td></tr>
  <tr><td>Plates</td><td>${plates}</td></tr>
  <tr><td>Jewel</td><td>${jewels}</td></tr>
  <tr><td>Furniture</td><td>${furniture}</td></tr>
  <tr class="bold"><td>Total</td><td>${movableTotal}</td></tr>
</table>

<div class="section-title">Bank Accounts</div>
<table>
  <tr><th>Bank</th><th>Account No</th><th>Current Value</th></tr>
  ${bankAccounts?.map(account => `
    <tr><td>${account.bankName}</td><td>${account.totalBankValue}</td><td>${account.value}</td></tr>
  `).join('')}
  <tr class="bold"><td colspan="2">Total</td><td>${data.bankTotal}</td></tr>
</table>

<div class="section-title">Fixed Deposits</div>
<table>
  <tr><th>Bank</th><th>Receipt/Certificate Details</th><th>Current Value</th></tr>
  ${fixedDeposits?.map(fd => `
    <tr><td>${fd.bankName}</td><td>${fd.receiptDetails}</td><td>${fd.value}</td></tr>
  `).join('')}
  <tr class="bold"><td colspan="2">Total</td><td>${data.totalFixedDepositValue}</td></tr>
</table>

<div class="section-title">Government Securities—</div>
<p>${data.governmentSecurities || "None"}</p>

<div class="section-title">Immovable Property—</div>
<table>
  <tr><th>Description</th><th>Assessed Value</th></tr>
  ${immovableProperty?.map(prop => `
    <tr><td>${prop.description}</td><td>${prop.value}</td></tr>
  `).join('')}
  <tr class="bold"><td>Total</td><td>${data.totalImmovableValue}</td></tr>
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
  <tr><td>${data.description || ""}</td></tr>
  <tr class="bold"><td>Total</td><td>${data.value || ""}</td></tr>
</table>


<div class="section-title">Mutual Funds</div>
<table>
  <tr><th>Folio</th><th>Scheme Name</th><th>Current units</th><th>Current NAV (Rs.)</th><th>Current value (Rs.)</th></tr>
  ${data.mutualFunds?.map(mf => `
    <tr><td>${mf.folio}</td><td>${mf.schemeName}</td><td>${mf.currentUnits}</td><td>${mf.currentNav}</td><td>${mf.currentValue}</td></tr>
  `).join('')}
</table>

<div  class="yellow">Mutual Fund Missed Dividends</div>
<table>
  <tr><th>Folio</th><th>Unclaimed Scheme</th><th>Unclaimed Amount (Rs.)</th></tr>
  ${data.missedDividends?.map(div => `
    <tr><td>${div.folio}</td><td>${div.UnclaimedSchemeName}</td><td>${div.UnclaimedAmount}</td></tr>
  `).join('')}
</table>

<div class="section-title">Royalties / Fees from Sale of Books</div>
<table>
  <tr><th>Sr No</th><th>Book Name</th><th>Earned Income</th></tr>
  ${data.royalties?.map((royalty, index) => `
    <tr><td>${index + 1}</td><td>${royalty.bookName}</td><td>${royalty.earnedIncome}</td></tr>
  `).join('')}
  <tr class="bold"><td>Total</td><td>${data.totalRoyaltiesIncome}</td></tr>
</table>

<div class="section-title">Other Assets:</div>
<ol>
  <li>Adani Electricity Account Number: ${adaniAccountNumber || "............."}</li>
  <li>Security Deposit of ${adaniSecurityDeposit || "............."} or Adani Electricity Account Number  ${adaniAccountNumber || "............."}</li>
  <li>Mahanagar Gas connection bearing BP No. : ${mahanagarGPBearingBPNo || "............."} / CA No.: ${mahanagarBearingCANo || "............."}</li>
  <li>Security Deposit of Rs ${mahanagarSecurityDeposit || "............."}for Mahanagar Gas connection BP No. : ${mahanagarGPBPNo || "............."} / CA No. :  ${mahanagarCANo || "............."} </li>
  <li>SIM Card Number: ${simCardNumber || "............."}</li>
</ol>

<div class="right">Total:-${totalAssets}</span></div>
<div class="right">Deduct Amount shown in Schedule No II., not subject to any Duty:-  <span>${deductedLiabilities}</span></div>
<div class="right">Net Total:- <span>${netAssets}</span></div>


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
