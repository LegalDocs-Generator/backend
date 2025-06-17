const puppeteer = require("puppeteer");

const generateForm99PDF = async (data) => {
  const {
    petitionNumber = "",
    deceasedName = "",
    deceasedAddress = "",
    deceasedOccupation = "",
    petitionerName = "",
    funeralExpenses = "",
    mortgageEncumbrances = "",
  } = data;
  const totalAmount =
    parseFloat(funeralExpenses) + parseFloat(mortgageEncumbrances);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
    font-family: Arial, sans-serif;
            margin: 1.5cm;
            padding: 0;
            font-size: 13px;  
    }
    .center {
      text-align: center;
    }
    .right {
      text-align: right;
    }
    .bold {
      font-weight: bold;
    }
    hr {
      border: none;
      border-top: 1px solid black;
      margin: 8px 0;
    }
    table {
      width: 100%;
      margin-top: 15px;
    }
    td {
      vertical-align: top;
    }
      div{
       line-height: 1.4;
      }
      .total{
      margin-left:400px;
      }
      .amount-cell {
      text-align: right;
      font-weight: bold;
      margin-right:100px;
    }
     
     
  </style>
</head>
<body>  
  <div class="center">
    <div>Schedule of debts of the deceased etc. </div>
    <div style="font-size:11px;">(Rules 374, 375 and 376)</div>
    <br>
    <div >Form No. 99</div>
    <br>
    <div >IN THE HIGH COURT OF JUDICATURE AT BOMBAY</div>
    <br>
    <div>TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. <span class="bold">${petitionNumber || ".................................."}</span> of 2020</div>
  <br>
  </div>

  
   <div style="margin-left: 150px; ">
        Petition for probate of a will of <span class="bold">${deceasedName || ".................................."}</span>
        </div>
        <div style="margin-left: 120px; ">
      resident <span class="bold">${deceasedAddress ||".................................."}</span> having occupation of
  <span class="bold">${deceasedOccupation || ".................................."}</span> Deceased
</div>

  <div class="right">
    <span class="bold">${petitionerName || ".................................."}</span> Petitioner
  </div>

  <br>
  <div class="center">SCHEDULE No. II</div>
  <div class="center">Schedule of Debts, etc.</div>
  <hr>
  <div style="display: flex; justify-content: flex-end; gap: 60px;">
        <div>Rs.</div>
        <div>P</div>
      </div>
  <hr>
  <br>

  <div>Amount of debts due and owing from the deceased, payable by law out of estate</div>
  <table style="margin-left:30px;">
    <tr>
      <td >Amount of Funeral expenses</td>
      <td class="amount-cell">Rs. ${!isNaN(parseFloat(funeralExpenses)) ? parseFloat(funeralExpenses).toFixed(2) : "0"}</td>
    </tr>
     <tr>
      <td>Amount of mortgage encumbrances</td>
      <td class="amount-cell">Rs. ${!isNaN(parseFloat(mortgageEncumbrances)) ? parseFloat(mortgageEncumbrances).toFixed(2) : "0"}</td>
    </tr>
    <tr>
      <td class="total">Total</td>
      <td class="amount-cell">Rs. ${!isNaN(parseFloat(totalAmount)) ? parseFloat(totalAmount).toFixed(2) : "0"}
</td>
    </tr>
  </table>
  <hr>

  <br>
  <div>Petitioner: <span class="bold">${petitionerName || ".................................."}</span></div>
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


module.exports = { generateForm99PDF };
