const { generatePDFfromHTML } = require("../../utils/puppeteerService");


const getForm101HTML = async (data) => {
  const {
    petitionNumber = "",
    deceasedName = "",
    deceasedName1 = "",
    deceasedName2 = "",
    deceasedName3 = "",
    deceasedName4 = "",
    deceasedAddress = "",
    deceasedOccupation = "",
    petitionerName = "",
    relationWithDeeceased = "",
    swearingLocation = "",
    swornDay = "",
    swornMonth = "",
    swornYear = "",
    advocateFor = "",
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
  body {
    font-family: "Times New Roman";
    font-size: 12px;
    padding: 0;
    margin: 0; /* let @page control margins */
  }

  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }

  div {
    line-height: 1.6; /* consistent with Form98–100 */
  }

  table {
    width: 100%;
    margin-top: 15px;
    border-collapse: collapse; /* same formatting as others */
  }

  td {
    vertical-align: top;
    padding: 3px;
  }

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
    <div>Executor’s oath</div>
    <div style="font-size:12px;">(See rules 374)</div>
    <br>
    <div >Form No. 101</div>
    <br>
    <div >IN THE HIGH COURT OF JUDICATURE AT BOMBAY</div>
    <br>
  </div>

  <div class="center">TESTAMENTARY AND INTESTATE JURISDICTION PETITION No. <span class="bold">${petitionNumber || ".................................."}</span> of 2020</div>
  <br>

  <div style="margin-left: 150px; ">
        Petition for probate of a will of <span class="bold">${deceasedName || ".................................."}</span>
        </div>
        <div style="margin-left: 120px; ">
      resident <span class="bold">${deceasedAddress || ".................................."}</span> having occupation of
  <span class="bold">${deceasedOccupation || ".................................."}</span> Deceased
</div>


 <div class="right">
    <span class="bold">${petitionerName || ".................................."}</span> Petitioner
  </div>

  <br>
  <div>
 I, <span class="bold">${deceasedName || ".................................."}, ${relationWithDeeceased || ".................................."}</span>, the Petitioner,  swear in the name of God that I believe and state that the Will referred to in the petition herein and marked Exhibit “B” is the last Will and testament of <span class="bold">${deceasedName1 || ".................................."}</span> alias <span class="bold">${deceasedName2 || ".................................."}</span> alias <span class="bold">${deceasedName3 || ".................................."}</span> alias <span class="bold">${deceasedName4 || ".................................."}</span> deceased, and that I am the executor therein named  and that I will faithfully administer the property and credits of the said deceased and in any way concerning his will by paying his debts and then the legacies therein bequeathed so far as the said assets will extend, and that I will make and exhibit a full and true inventory of the said property and credits in this Hon'ble Court within six months from the date of the grant to be made to me or within such further time as the  said Court may from time to time appoint and also render a true account of my administration to this Hon'ble Court within one year from the same date or within such further time as the said Court may from time to time appoint.
  </div>
  <br>
  <div>Sworn at <span class="bold">${swearingLocation || ".................................."}</span> }</div>
  <div>this <span class="bold">${swornDay || ".........."}</span> Day of <span class="bold">${swornMonth || ".........."} ${swornYear || "..........."}</span>  }</div>
  <br>
  <div class="right">Before Me,</div>
  <br>
  <div class="right">Assistant Master / Associate,</div>
  <div class="right">High Court, Bombay</div>
  <div>Advocate for <span class="bold">${advocateFor || ".................................."}</span></div>
</body>
</html>`;
};

async function generateForm101PDF(data) {
  const html = await getForm101HTML(data);
  return await generatePDFfromHTML(html);
}

module.exports = { generateForm101PDF, getForm101HTML };
