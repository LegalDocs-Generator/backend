const { generatePDFfromHTML } = require("../../utils/puppeteerService");

const getForm99HTML = async (data) => {
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

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
  body {
    font-family: "Times New Roman";
    font-size: 12px;
    padding: 0;
    margin: 0;  /* let @page handle margins */
  }

  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }

  hr {
    border: none;
    border-top: 1px solid black;
    margin: 8px 0;
  }

  table {
  width: calc(100% - 60px);  /* leave breathing space on both sides */
  margin-left: 30px;
  margin-right: 30px;
  border-collapse: collapse;
  table-layout: fixed;       /* prevent overflow */
}

td {
  vertical-align: top;
  padding: 3px;
  word-wrap: break-word;     /* wrap long text */
  overflow-wrap: break-word;
}

.amount-cell {
  text-align: right;
  font-weight: bold;
  padding-right: 10px;       /* instead of large padding that may push out */
}


  /* Page setup - consistent across all forms */
  @page {
    size: A4;
    margin-top: 2cm;
    margin-bottom: 2cm;
  }

  @page :left {
    margin-left: 3cm;   /* inner */
    margin-right: 5cm;  /* outer */
  }

  @page :right {
    margin-left: 5cm;   /* inner */
    margin-right: 3cm;  /* outer */
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
};

async function generateForm99PDF(data) {
  const html = await getForm99HTML(data);
  return await generatePDFfromHTML(html);
}

module.exports = { generateForm99PDF, getForm99HTML };
